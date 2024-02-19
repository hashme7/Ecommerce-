const mongoose = require('mongoose')

const productsSchema =new mongoose.Schema({
    productName :{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:'categories',
        required:true
    },
    images:[{type:String,
        required:true
    }]
    ,
    offer:{
        type:String,
        required:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    quantity:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("products",productsSchema)
