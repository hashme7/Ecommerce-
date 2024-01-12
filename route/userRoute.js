const express = require("express");
const userRoute = express();
const userController = require("../controller/userController");

userRoute.set("view engine", "ejs");
userRoute.set("views", "./views/user");

userRoute.get("/", userController.homeNewUser);
userRoute.get("/signup", userController.signup);
userRoute.post("/signup",userController.verifySignup)
userRoute.get("/otpsignup",userController.otp)
userRoute.post('/otpsignup',userController.verifyOTP)

module.exports = userRoute;
