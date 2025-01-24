const express = require("express");
const userRoute = express();
const userAuthController = require("../controller/userController/userAuthController.js");
const auth = require('../middleware/userMiddleware/userAuthMiddleware');
const cartController = require('../controller/userController/cartController.js')
const orderController = require('../controller/userController/orderController.js')
const profileController = require('../controller/userController/profileControler.js')
const shopController = require('../controller/userController/shopController.js')
const walletController = require('../controller/userController/walletController.js')
userRoute.set("view engine", "ejs");
userRoute.set("views", "./views/user");
// -------------------Authentication of User ------------\\
userRoute.get("/", userAuthController.home);
userRoute.get('/home', userAuthController.home)
userRoute.get('/aboutUs',userAuthController.loadAbout)
userRoute.get('/contactUS',userAuthController.loadContact)
userRoute.get("/signup", auth.isLogOut, userAuthController.signup);
userRoute.post("/signup", userAuthController.verifySignup)
userRoute.get("/otpsignup", auth.isLogOut, userAuthController.otp)
userRoute.post('/otpsignup', userAuthController.verifyOTP)
userRoute.get('/login', auth.isLogOut, userAuthController.login)
userRoute.post('/login', userAuthController.verifyLogin)
                // ---------------------\\
userRoute.get('/emailVerify', userAuthController.loadEmail)
userRoute.post('/emailVerify', userAuthController.resetOTPsend)
userRoute.get('/otpVerification', userAuthController.loadResetPOTP)
userRoute.post('/otpVerification', userAuthController.resetPassOTP)
userRoute.get('/resetPassword', userAuthController.loadResetPassword)
userRoute.post('/resetPassword', userAuthController.verifyResetPassword)
userRoute.get('/logout', userAuthController.logout)
// -------------------------Shop Routes ------------------\\
userRoute.get('/shop', auth.isBlocked, shopController.loadShop)
userRoute.post('/shop', auth.isBlocked, shopController.loadShop)
userRoute.get('/productlist', auth.isBlocked, shopController.singleProductList)
// ---------------------------Profile Routes ---------------\\
userRoute.get('/profile', auth.isBlocked, auth.isLogIn, profileController.profile)
userRoute.get('/editProfile', auth.isBlocked, auth.isLogIn, profileController.loadEditProfile)
userRoute.patch('/editProfile', auth.isLogIn, profileController.editProfile)
userRoute.patch('/addAddress', auth.isLogIn, profileController.addAddress)
userRoute.patch('/deleteAddress/:address', auth.isLogIn, profileController.deleteAddress)
userRoute.get('/editAddress', auth.isLogIn, profileController.loadeditAddress)
userRoute.patch('/editAddress/:addressId', auth.isLogIn, profileController.editAddres)
// --------------------------- Order Routes ---------------------\\
userRoute.get('/cart', auth.isBlocked, auth.isLogIn, cartController.loadCart)
userRoute.post('/addToCart/:product_id', cartController.addToCart)
userRoute.patch('/removeFrmCart/:product_id', cartController.removeFrmCart)
userRoute.delete('/deleteFrmCart/:product_id', cartController.deletFromCart)
userRoute.get('/checkout', auth.isBlocked, auth.isLogIn, orderController.loadCheckOut)
userRoute.post('/checkout', auth.isLogIn, orderController.placeOrder)
userRoute.get('/success', auth.isBlocked, auth.isLogIn, orderController.succesOrder)
userRoute.get('/orderDetails', auth.isBlocked, auth.isLogIn, orderController.orderDetails)
userRoute.get('/downloadInvo/:orderId', auth.isBlocked, auth.isLogIn, orderController.downloadInvoice)
userRoute.patch('/cancelOrder', auth.isLogIn, orderController.cancellOrder)
userRoute.post('/verifyPayment', auth.isLogIn, orderController.verifyPayment)
userRoute.post('/createOrder', auth.isLogIn, walletController.createOrder)
userRoute.post('/verifyWalletPayment/:amount/:type', auth.isLogIn, walletController.verifyPaymentOrder)
userRoute.patch('/returnproduct/:orderId/:productId', auth.isLogIn, orderController.returnProduct);

// --------

  
module.exports = userRoute;