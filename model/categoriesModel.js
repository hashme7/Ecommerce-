    const mongoose = require('mongoose')

    const categories = new mongoose.Schema({
        CatName: {
            type: String,
            required: true
        },
        discription: {
            type: String,
            required: true
        },
        isBlocked:{
            type:Boolean,
            required:false
        }
    })

    module.exports = mongoose.model("categories", categories)