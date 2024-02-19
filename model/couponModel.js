const mongoose = require('mongoose');


const couponSchema = mongoose.Schema({
    couponCode:{
        type:String,
        required:true
    },
    discountPercentage:{
        type:Number,
        required:true,
        min:1,
        max:100,
    },
    eligibleAmount:{
        type:Number,
        required:true,
        min:1
    },
    description:{
        type:String,
        required:true,
    },
    expiresOn:{
        type:Date,
        required:true
    },
    isListed:{
        type:String,
        default:true
    },
    maximumDiscountAmount:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("coupons",couponSchema);