    const mongoose = require('mongoose')

    const categories = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        discription: {
            type: String,
            required: true
        },
        isBlocked:{
            type:Boolean,
            default:false
        }
    })

    module.exports = mongoose.model("categories", categories)