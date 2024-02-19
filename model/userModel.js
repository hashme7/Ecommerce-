const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: [
        {
            name: { type: String, required: true },
            mobile: { type: String, required: true },
            house: { type: String, required: true },
            pincode: { type: String, required: true },
            city: { type: String, required: true },
            colony: { type: String, required: true },
            state: { type: String, required: true }
        }
    ],
    cart: [
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
            }
            
        }
    ],
    wallet: {
        balance: { 
            type: Number,
             default: 0 
            },
        transactionHistory: [
            {
                type: {
                    type: String,
                    enum: ['Deposit', 'Refund', 'Paid'],
                },
                amount: Number,
                date: { type: Date, default: Date.now },
            },
        ],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("userdetails", userSchema);