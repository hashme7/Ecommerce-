const User = require('../../model/userModel');
const products = require('../../model/products.Model');
const Orders = require('../../model/OrderModel')
const coupons = require('../../model/couponModel')
const { onlinePayment, verifyOnlinePayment } = require('../../services/onlinePayments');
const puppeteer = require('puppeteer');
const fs = require('fs')
const ejs = require('ejs')
const loadCheckOut = async (req, res) => {
    try {
        let totalAmount = 0;
        const userId = req.session.user_id;
        const userData = await User.findOne({
            _id: userId
        }).populate('cart.product')
        for (let i = 0; i < userData.cart.length; i++) {
            totalAmount += userData.cart[i].product.price * userData.cart[i].quantity;
        }
        console.log(totalAmount)
        let couponData = await coupons.find({});
        couponData = couponData.filter((data) => {
            if (data.eligibleAmount < totalAmount && data.quantity > 0) {
                return data
            }
        })
        res.render('checkout', {
            userName: req.session.user_name,
            userData,
            couponData
        });
    } catch (error) {
        console.log("error on loadCheckout", error)
    }
}

const placeOrder = async (req, res) => {
    try {
        const userId = req.session.user_id;
        let totalAmount = 0;
        const { couponId, address, payment, shippingMethods } = req.body;
        console.log("Delivery Charge;::::::", shippingMethods)
        let deliveryCharge = shippingMethods == 'express' ? 300 : 100;
        let couponAmount = couponId ? await coupons.findOne({ couponCode: couponId }, { maximumDiscountAmount: 1, quantity: 1 }) : null;
        let userData = await User.findOne({ _id: userId }).populate('cart.product').exec();
        const cartProducts = userData?.cart;
        for (let i = 0; i < userData.cart.length; i++) {
            const cartItem = userData.cart[i];
            if (cartItem.product.quantity < cartItem.quantity) {
                return res.json({ status: 'failed', message: 'OUTOFSTOCK' });
            }
            totalAmount += cartItem.product.price * cartItem.quantity;
            await products.findOneAndUpdate(
                { _id: cartItem.product._id, quantity: { $gte: cartItem.quantity } },
                { $inc: { quantity: -cartItem.quantity } },
                { new: true }
            );
        }
        totalAmount += deliveryCharge;
        couponAmount ? totalAmount -= couponAmount.maximumDiscountAmount : totalAmount;
        const order = new Orders({
            user: userId,
            products: cartProducts,
            orderedDate: new Date(),
            address: userData?.address[address],
            totalAmount: totalAmount,
            status: 'Pending',
            paymentStatus: payment,
            deliveryMethod: deliveryCharge == 300 ? 'express-delivery' : 'normal-delivery',
        });
        let couponUsed = coupons.findOne({ couponCode: couponId }, { _id: 1 });
        console.log("couponId", couponUsed)
        couponAmount ? order.couponUsed = couponUsed._id : null;
        if (payment == "COD") {
            if (totalAmount > 1000) {
                return res.json({ status: 'failed', message: '!COD' })
            }
            if (couponAmount) {
                couponAmount.quantity = couponAmount.quantity - 1;
                await couponAmount.save()
            }
            order.status = "Placed"
            await order.save();
            userData.cart = [];
            userData.save();
            return res.json({ status: 'success', paymentStatus: 'COD' })
        }
        if (payment == 'WALLET') {
            if (userData.wallet.balance < totalAmount) {
                return res.json({ status: 'failed', message: 'INSUFFICIENTMONEY' })
            } else {
                console.log("money on total amount :", typeof (totalAmount))
                userData.wallet.balance -= totalAmount;
                userData.cart = [];
                userData.wallet.transactionHistory.push({ type: 'Paid', amount: totalAmount, date: new Date() })
                await userData.save();
                order.status = "Placed"
                await order.save();
                return res.json({ status: 'success', paymentStatus: 'WALLET-PAYMENT' })
            }
        }
        const placed = await order.save();
        console.log("kfjdfjdjf", placed)
        if (placed) {
            if (couponAmount) {
                couponAmount.quantity = couponAmount.quantity - 1;
                await couponAmount.save()
            }
            let razorOrder = await onlinePayment(order.totalAmount, placed._id)
            console.log("new Order:", razorOrder)
            res.json({ status: 'success', paymentStatus: 'ONLINE-PAYMENT', newOrder: razorOrder });
        }
    } catch (error) {
        console.log('Error on placeOrder', error, error.message);
    }
};

const verifyPayment = async (req, res) => {
    try {
        console.log("req.body", req.body)
        if (verifyOnlinePayment(req.body)) {
            const order = req.body.order;
            const userId = req.session.user_id;
            await Orders.findOneAndUpdate({ _id: order.receipt }, { $set: { status: 'Placed' } })
            const userData = await User.findOne({ _id: userId }).populate('cart.product').exec();
            userData.cart = [];
            await userData.save();
            res.json({ status: 'success', paymentStatus: 'ONLINE-PAYMENT-SUCCESS' })
        } else {
            res.json({ status: 'failed' })
        }
    } catch (error) {
        console.log(error)
    }
}


const succesOrder = async (req, res) => {
    try {
        const updateOrders = await Orders.find({ status: 'Pending' }).populate('products.product');
        for (const order of updateOrders) {
            for (const productOrder of order.products) {
                const productId = productOrder.product._id;
                const quantityInOrder = productOrder.quantity;
                await products.updateOne({ _id: productId }, { $inc: { quantity: quantityInOrder } });
            }
        }
        await Orders.deleteMany({ status: "Pending" }).populate('products.product')
        const userName = req.session.user_name;
        res.render('success', {
            userName
        })
    } catch (error) {
        console.log('error on success order', error)
    }
}

const orderDetails = async (req, res) => {
    try {
        console.log(req.query)
        const { _id } = req.query;
        const userName = req.session.user_name;
        const order = await Orders.findById({
            _id
        }).populate('products.product')
        res.render('orderDetails', {
            order,
            userName
        })
    } catch (error) {
        console.log("error on orderDetails :", error)
    }
}

const cancellOrder = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const { order_id } = req.query;
        const order = await Orders.findOne({ user: req.session.user_id, _id: order_id })
            .populate('products.product')
            .exec();
        const userData = await User.findOne({ _id: userId });
        console.log("___________---------------__________", order)
        if (!order) {
            return res.json({ status: 'failed', message: 'Order not found' });
        }
        if (order.status === 'Cancelled') {
            return res.json({ status: 'failed', message: 'Order is already cancelled' });
        }
        for (const item of order.products) {
            const productId = item.product._id;
            const quantityToRestore = item.quantity;
            await products.findOneAndUpdate(
                { _id: productId },
                { $inc: { quantity: quantityToRestore } },
                { new: true }
            );
        }
        await coupons.findOneAndUpdate({
            couponCode: order.couponUsed
        }, {
            $set: {
                $inc: { quantity: 1 }
            }
        })
        if (order.paymentStatus) {
            userData.wallet.balance = userData.wallet.balance + parseInt(order.totalAmount);
            userData.wallet.transactionHistory.push({ type: 'Refund', amount: order.totalAmount, date: new Date() })
        }
        await userData.save()
        order.status = 'Cancelled';
        await order.save();
        res.json({ status: 'success', message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.json({ status: 'failed', message: 'An error occurred while cancelling the order' });
    }
}
const downloadInvoice = async (req, res) => {
    try {
        const orderDetail = await Orders.findOne({ _id: req.params.orderId }).populate('products.product').populate('couponUsed');

        if (!orderDetail) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const ejsTemplate = fs.readFileSync('views/user/receipt.ejs', 'utf-8');
        console.log("orderDetails::::::", orderDetail)
        const htmlContent = ejs.render(ejsTemplate, { orderDetail });
        await page.setContent(htmlContent);
        await page.pdf({ path: `public/invoices/invoice${req.params.orderId}.pdf`, format: 'A4' });
        await browser.close();

        res.download(`public/invoices/invoice${req.params.orderId}.pdf`, (err) => {
            if (err) {
                console.error(err);
            } else {
                setTimeout(() => {
                    fs.unlink(`public/invoices/invoice${req.params.orderId}.pdf`, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error(unlinkErr);
                        } else {
                            console.log('File deleted successfully!');
                        }
                    });
                }, 10000)
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const returnProduct = async (req, res) => {
    try {
        const { orderId, productId } = req.params;
        const reason = req.body.reason;
        console.log("************************************::::::::::::", orderId, "fjkalsdjfkasdjkfIIII,",)
        const order = await Orders.findOneAndUpdate(
            {
                _id: orderId,
                'products.product': productId,
                'products.status': { $nin: ['Return Requested', 'Returned'] }
            },
            {
                $set: {
                    'products.$.status': 'Return Requested',
                    'products.$.reason': reason,
                }
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ update: false, message: 'Product not eligible for return' });
        }
        res.json({ update: true });
    } catch (error) {
        console.error("Error in return order Controller", error);
        res.status(500).json({ update: false, message: 'Internal Server Error' });
    }
};



module.exports = {
    loadCheckOut,
    placeOrder,
    succesOrder,
    orderDetails,
    cancellOrder,
    verifyPayment,
    downloadInvoice,
    returnProduct,
}