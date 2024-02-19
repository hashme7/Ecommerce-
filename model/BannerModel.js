const mongoose = require('mongoose')
const bannerSchmea = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    targetId:{
        type:String,
        required: true,
    },
    startDate:{
        type: Date,
        required: true,
    },
    expiryDate:{
        type: Date,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    bannerImage:{
        type:String,
        required:true,
    },
    isListed:{
        type:Boolean,
        default:false,
    }

},
{timestamps:true}
)


module.exports = mongoose.model('Banner',bannerSchmea);;