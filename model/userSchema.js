const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default :false
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
}); 

module.exports = mongoose.model("userdetails",userSchema);