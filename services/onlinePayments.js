const Razorpay = require('razorpay');
const crypto = require('crypto')

const {RAZORPAY_ID_KEY,RAZORPAY_ID_SCRET_KEY} = process.env;

let instance = new Razorpay({
    key_id:RAZORPAY_ID_KEY,
    key_secret:RAZORPAY_ID_SCRET_KEY
})

const onlinePayment = async(amount,orderId)=>{
    console.log("online payment-------" , amount,orderId)
    let options = {
        amount : amount*100,
        currency:"INR",
        receipt:orderId.toString()
    };
    return instance.orders.create(options);
}

const verifyOnlinePayment = async(details)=>{
    try{
        const { payment, order_id } = details;
        const text = `${order_id}|${payment.razorpay_payment_id}`;
        const hmac = crypto.createHmac('sha256', RAZORPAY_ID_SCRET_KEY);
        hmac.update(text);
        const calculatedSignature = hmac.digest('hex');
        if(calculatedSignature == details.payment.razorpay_signature){
            console.log("checked and approved")
            return true;
        }
        return false;
    }catch(error){
        console.log(error)
    }
}
module.exports ={
    onlinePayment,
    verifyOnlinePayment
}