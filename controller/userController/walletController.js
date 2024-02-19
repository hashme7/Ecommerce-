const User = require('../../model/userModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');




const { RAZORPAY_ID_KEY, RAZORPAY_ID_SCRET_KEY } = process.env;


const razorpay = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_ID_SCRET_KEY
});



const createOrder = async (req, res) => {
    let { amount } = req.body;
    console.log(typeof(amount))
    try {
        const options = {
            amount: amount * 100 ,
            currency: 'INR',
            receipt: 'wallet-receipt'
        };
        const order = await razorpay.orders.create(options)
        console.log(order)
        res.json({
            orderId: order.id,
            amount: amount,
            currency: order.currency,
            receipt: order.receipt,
            keyId: RAZORPAY_ID_KEY
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Internal Server Error');
    }
}

const verifyPaymentOrder = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const { amount, type } = req.params;
        const userId = req.session.user_id;
        const text = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto.createHmac('sha256', RAZORPAY_ID_SCRET_KEY).update(text).digest('hex');
        console.log('Text:', text);
        console.log('Expected Signature:', expectedSignature);
        console.log('Received Signature:', razorpay_signature);
        if (expectedSignature === razorpay_signature) {
            const updated = await addMoneyToWallet(userId, parseInt(amount), type);
            if (updated) {
                res.json({ status: 'success' });
            }
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        console.log(error)
    }
}
const addMoneyToWallet = async (userId, amount, type) => {
    try {
        const userData = await User.findOne({ _id: userId });
        userData.wallet.balance += amount;
        userData.wallet.transactionHistory.push({ type, amount: amount });
        await userData.save();
        return true;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    createOrder,
    verifyPaymentOrder
}