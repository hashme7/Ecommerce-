const mongoose = require('mongoose');


const OTPschema  = new mongoose.Schema({
    user_id :{
        type :String,
        required :true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: 60 * 1,
    },
   
})


module.exports = mongoose.model("OTP",OTPschema);