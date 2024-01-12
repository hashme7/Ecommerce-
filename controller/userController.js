const User = require('../model/userSchema')
const util = require('../utilities/sendEmail')
const OTP = require('../model/OTPModel')
const bcrypt = require('bcrypt');
//********* homeOfNewUser *******//
const homeNewUser = async (req, res) => {
    try {
        res.render('home')
    } catch (err) {
        console.log(err)
    }
}
//******** signup ********//
const signup = async (req, res) => {
    try {
        res.render('registerPage', { message: "enter signup details" })
    } catch (err) {
        console.log(err)
    }
}
//******* verify signup*****//
const verifySignup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            confirmpassword
        } = req.body;
        const userCheck = await User.findOne({ email, isverified: true });
        if (userCheck) {
            return res.render("registerPage", {
                message: "User already there"
            });
        }
        const newUser = new User({
            name: name,
            email: email,
            password: password,
            confirmpassword: confirmpassword
        })
        const userData = await newUser.save();
        const userId = userData._id
        await util.mailSender(
            email,
            userId
        );
        res.render('otpPage')
    } catch (error) {
        console.log("error mailserndein")
        console.log(error.message);
    }
}

//******* otp page*****//
const otp = async (req, res) => {
    try {
        res.render('otpPage')
    } catch (err) {
        console.log(err)
    }
}
//********verify Otp */
const verifyOTP = async (req, res) => {
    try {
        const {
            noOne,
            noTwo,
            noThree,
            noFour
        } = req.body
        const userID =  req.session.user_id;
        console.log(userID)
        const input = `${noOne}${noTwo}${noThree}${noFour}` ;
        console.log(input)
        const hashedinput = await bcrypt.hash(input, 10);
        console.log(hashedinput);
        const verifiedOTP = await OTP.findOne({user_id:userID})
        
        if (verifiedOTP) {
          res.redirect('home')
        } else {
            res.render("otpPage", { message: "incorrect pass" })
        }
    } catch (error) {
        console.log("error", error)
    }
}

module.exports = {
    signup,
    homeNewUser,
    verifySignup,
    otp,
    verifyOTP
}