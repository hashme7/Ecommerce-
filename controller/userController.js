const User = require('../model/userSchema');
const bcrypt = require('bcrypt')
const products = require('../model/products.Model')



const loadShop = async (req, res) => {
    try {
        let productArray = await products.find({ isCategoryBlocked: false, isBlocked: false })
        console.log(productArray)
        res.render('shop', { products: productArray })
    } catch (error) {
        console.log("error on shop load", error)
    }
}
const profile = async (req, res) => {
    try {
        let userData = await User.findOne({ _id: req.session.user_id })
        let adresses = null;
        if (userData) {
            res.render('profile', {
                userData: userData,
                Adresses: adresses
            })
        }
    } catch (error) {
        console.log("error on profile page", error)
    }
}
const singleProductList = async (req, res) => {
    try {
        let profile;
        const productId = req.query.productId;
        const productData = await products.findOne({ _id: productId });
        const userData = await User.findOne({email:req.session.user_email})
        if(userData){
            profile =  userData
        }else{
            profile = null;
        }
        if (productData) {
            res.render('singleProduct',{product:productData,user:profile})
        }
    } catch (error) {
        console.log("single product listing error :", error)
    }
}

module.exports = {
    loadShop,
    profile,
    singleProductList
}