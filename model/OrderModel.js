const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'userdetails',
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            status: {
                type: String,
                enum: ['Placed', 'Shipped', 'Delivered', 'Cancelled', 'Return Rejected', 'Return Requested', 'Out For Delivery','Returned'],
                default: 'Placed',
            },
            reason:{
                type:String,
                defualt:null
            }
        }
    ],
    address:[
        {
            name: { type: String, required: true },
            mobile: { type: String, required: true },
            house: { type: String, required: true },
            pincode:{type:String,required:true},
            city: { type: String, required: true },
            colony:{type:String,required:true},
            state: { type: String, required: true }
        }
    ],
    totalAmount: { 
        type: mongoose.Types.Decimal128 
    },
    orderedDate: { 
        type: Date
    },
    deliveryMethod:{
        type:String,
        enum:[
            'express-delivery',
            'normal-delivery'
        ],
        default:'normal-delivery'
    },
    paymentStatus:{
        type: String,
        required: true,
    },
    couponUsed:{
        type:mongoose.Types.ObjectId,
        ref:'coupons',
        default:null,
    } 
})

module.exports = mongoose.model("order",orderSchema);