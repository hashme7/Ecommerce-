const express = require("express");
const userRoute = express();
const userAuth = require("../controller/userAuth");
const auth = require('../middleware/userAuthMiddleware');
const userController = require('../controller/userController')

userRoute.set("view engine", "ejs");
userRoute.set("views", "./views/user");

userRoute.get("/", auth.isLogOut, userAuth.homeNewUser);
userRoute.get('/home',auth.isLogIn,auth.isLogIn, userAuth.home)
userRoute.get("/signup", auth.isLogOut, userAuth.signup);
userRoute.post("/signup", userAuth.verifySignup)
userRoute.get("/otpsignup", auth.isLogOut, userAuth.otp)
userRoute.post('/otpsignup', userAuth.verifyOTP)
userRoute.get('/otpVerification', userAuth.loadResetPOTP)
userRoute.post('/otpVerification', userAuth.resetPassOTP)
userRoute.get('/resetPassword', userAuth.loadResetPassword)
userRoute.post('/resetPassword', userAuth.verifyResetPassword)
userRoute.get('/login', auth.isLogOut, userAuth.login)
userRoute.post('/login', userAuth.verifyLogin)
userRoute.get('/emailVerify', userAuth.loadEmail)
userRoute.post('/emailVerify', userAuth.resetOTPsend)
userRoute.get('/shop',auth.isBlocked, userController.loadShop)
userRoute.get('/productlist',auth.isBlocked,userController.singleProductList)
userRoute.get('/logout', userAuth.logout)
userRoute.get('/profile', auth.isLogIn, userController.profile)

module.exports = userRoute;
