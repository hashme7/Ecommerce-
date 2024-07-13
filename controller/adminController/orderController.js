const Orders = require('../../model/OrderModel');
const Users = require('../../model/userModel');
const Coupons = require('../../model/couponModel')
const Products = require('../../model/products.Model')

const loadOrder = async (req, res) => {
    try {
        const orders = await Orders.find({})
            .sort({ orderedDate: -1 })
            .populate('user')
            .populate('products.product');

        res.render('orders', { orders });

    } catch (error) {
        console.error("Error on loadOrder:", error);
        res.status(500).send('Internal Server Error'); // Send a generic error response
    }
}

const loadOrderDetails = async (req, res) => {
    try {
        console.log("loadOrderDetails")
        const { order_id } = req.params;
        const orders = await Orders.findOne({ _id: order_id })
            .populate('user')
            .populate('products.product')
            .exec();
        res.render('orderDetails', {
            orders
        })
    } catch (error) {
        console.log(error)
    }
}

const updateStatus = async (req, res) => {
    try {
        const { status, id, productId } = req.query;
        const order = await Orders.findById(id);
        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }

        order.products.forEach((product) => {
            console.log("product id:::::::::::::::::::::::::::::::", product.product.toString(), productId)
            if (product.product.toString() === productId) {
                console.log("statuss:::::::::::::::::::::::::::::::", product.status)
                product.status = status;
            }
        });
        await order.save();
        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error' });
    }
};

const rejectRequest = async (req, res) => {
    try {
        const { orderId, productId } = req.query;
        const order = await Orders.findOne({ _id: orderId }).populate('products.product');
        const productIndex = order.products.findIndex((p) => p.product._id.toString() === productId);

        if (productIndex !== -1) {
            const product = order.products[productIndex];
            product.status = "Return Rejected";
            await order.save();

            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Product not found in order' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const acceptRequest = async (req, res) => {
    try {
        const { orderId, productId } = req.query;
        const order = await Orders.findOne({ _id: orderId }).populate('products.product');
        const productIndex = order.products.findIndex((p) => p.product._id.toString() === productId);
        let productTotal = 0;
        if (productIndex !== -1) {
            const product = order.products[productIndex];
            console.log(product);
            // Check if a coupon is used for the product
            console.log("couponUsed", order.couponUsed)
            if (order.couponUsed) {
                const coupon = await Coupons.findOne({ _id: order.couponUsed });
                if (coupon) {
                    const discountPercentage = coupon.discountPercentage;
                    const discountedAmount = (Number(discountPercentage) / 100) * Number(product.product.price);
                    console.log(discountedAmount, "jekfj((((((((((((((((((((((((((((((((((((((", product.price)
                    console.log(typeof (discountedAmount))
                    // Handle potential NaN values
                    if (!isNaN(discountedAmount)) {
                        productTotal += discountedAmount;
                        order.totalAmount -= discountedAmount;
                        console.log("hasnled error")
                    }

                }
            } else {
                console.log(product.product.price, "prodict price", product.quantity)
                productTotal = Number(product.product.price) * Number(product.quantity);
            }
            console.log("proeductToatalll", productTotal)
            product.status = "Returned";
            const user = await Users.findOne({ _id: order.user });
            console.log(productTotal, "jfklhasjdhfjasdfhjkashjdfasdhlkjfahsjdhf")
            if (productTotal) {
                user.wallet.balance += Number(productTotal);
                user.wallet.transactionHistory.push({ type: 'Refund', amount: productTotal });
            }

            // Increase the quantity of the returned product
            let returnProduct = await Products.findOne({ _id: productId })
            returnProduct.quantity += Number(product.quantity)

            await order.save();
            await user.save();

            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Product not found in order' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

module.exports = {
    loadOrder,
    loadOrderDetails,
    updateStatus,
    acceptRequest,
    rejectRequest
}