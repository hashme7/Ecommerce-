const User = require('../model/userSchema')
const util = require('../utilities/sendEmail')
const OTP = require('../model/OTPModel')
const products = require('../model/products.Model')
const bcrypt = require('bcrypt');
//********* homeOfNewUser *******//
const homeNewUser = async (req, res) => {
    try {
        let productData = await products.find({ isBlocked: false, isCategoryBlocked: false })
        res.render('newHome', {
            product: productData
        })
    } catch (err) {
        console.log(err)
    }
}
///*************home******** */

const home = async (req, res) => {
    try {
        let userName = req.session.user_name;
        let productData = await products.find({ isBlocked: false, isCategoryBlocked: false })
        if (userName) {
            res.render('home', {
                userName: userName,
                product: productData
            })
        } else {
            res.render('home', {
                userName: null,
                product: productData
            })
        }
    } catch (error) {

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
        const userCheck = await User.findOne({ email, isVerified: true });
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
        req.session.user_sign = userId;
        req.session.user_name = userData.name;
        req.session.user_email = userData.email;
        await util.mailSender(
            email,
            userId,
            `It seems you logging at CoZA store and trying to verify your Email.
                Here is the verification code.Please enter otp and verify Email`
        );
        res.render('otpPage',
            { message: "Enter Otp",
            user: req.session.user_email
         }
        )
    } catch (error) {
        console.log("error mailserndein")
        console.log(error.message);
    }
}

//******* otp page*****//
const otp = async (req, res) => {
    try {
        console.log("otp page")
        console.log(req.session.user_email)
        res.render('otpPage', {
            user: req.session.user_email, 
            message: "enter OTP" 
        })
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
        const userID = req.session.user_sign;
        console.log(userID)
        const input = `${noOne}${noTwo}${noThree}${noFour}`;
        const findOTP = await OTP.find({ user_id: userID }, { otp: 1, _id: 0 }).sort({ _id: -1 }).limit(1);
        const verifiedOTP = await bcrypt.compare(input, findOTP[0].otp)
        if (verifiedOTP && findOTP) {
            await User.updateOne({ _id: userID }, { $set: { isVerified: true } }).catch((err) => {
                console.log(err, "update-error")
            })
            res.redirect('/login')
        } else {
            res.render("otpPage", { message: "otp is incorrect" })
        }
    } catch (error) {
        console.log("error on post", error)
    }
}
const login = async (req, res) => {
    try {
        res.render('login', { message: "enter email and password" })
    } catch (error) {
        console.log(error, "login error")
    }
}

const verifyLogin = async (req, res) => {
    try {
        const { password, email } = req.body;
        const userData = await User.findOne({ email: email });
        let Hpassword = await bcrypt.hash(password, 10);
        if (userData && userData.isVerified) {
            if (!userData.isBlocked) {
                const passwordMatch = await bcrypt.compare(userData.password, Hpassword);
                if (passwordMatch) {
                    req.session.user_id = userData._id;
                    req.session.user_name = userData.name;
                    res.redirect('/home');
                } else {
                    console.log(passwordMatch)
                    res.render('login', { message: "Incorrect username or password", type: "error" });
                }
            }else{
                res.render('login',{
                    message:"You were blocked by Admin"
                })
            }
        } else {
            res.render('login', { message: "Incorrect username or password" });
        }
    } catch (error) {
        console.log(error, "error");
    }
}

const logout = async (req, res) => {
    try {
        req.session.user_id = null;
        res.redirect('/');
    } catch (error) {
        console.log(error, "error")
    }
}
const loadEmail = async (req, res) => {
    try {
        res.render('Emailverification', { message: "enter email" })
    } catch (error) {
        console.log("loadResetPass:", error)
    }
}
const resetOTPsend = async (req, res) => {
    try {
        console.log("inside resetPassword")
        console.log(req.body)
        let email = req.body.email;
        let validuser = await User.findOne({ email: email })
        console.log(validuser)
        req.session.user_email = validuser.email;
        if (!validuser) {
            // console.log("invalid email")
            res.render('Emailverifcation', { message: "invalid email address" })
        } else {
            req.session.user_sign = validuser._id;
            await util.mailSender(
                email,
                validuser._id,
                `It seems you reseting the password and trying to verify your Email.
                Here is the verification code.Please enter otp and verify Email`
            );
            // console.log("stage last")
            res.redirect('/otpVerification')
        }
    } catch (error) {
        console.log("error on reset password:", error)
    }
}
const loadResetPOTP = async (req, res) => {
    try {
        res.render('otpPagePass', { user: req.session.user_email, message: "enter OTP" })
    } catch (error) {
        console.log("error on load reset password otp page :", error)
    }
}
const resetPassOTP = async (req, res) => {
    try {
        const {
            noOne,
            noTwo,
            noThree,
            noFour
        } = req.body
        const userID = req.session.user_sign;
        console.log(userID)
        const input = `${noOne}${noTwo}${noThree}${noFour}`;
        const findOTP = await OTP.find({ user_id: userID }, { otp: 1, _id: 0 }).sort({ _id: -1 }).limit(1);
        const verifiedOTP = await bcrypt.compare(input, findOTP[0].otp)
        if (verifiedOTP && findOTP) {
            await User.updateOne({ _id: userID }, { $set: { isVerified: true } }).catch((err) => {
                console.log(err, "update-error")
            })
            res.redirect('/resetpassword')
        } else {
            res.render("otpPagePass", { user: req.session.user_email, message: "Entered OTP is Wrong" })
        }
    } catch (error) {
        console.log("error on reset password otp verification", error)
    }
}

const loadResetPassword = (req, res) => {
    try {
        res.render('changePassword')
    } catch (error) {
        console.log("error on Load reset password page :", error)
    }
}
const verifyResetPassword = async (req, res) => {
    try {
        const userID = req.session.user_sign;
        const newPassword = req.body.newPassword;
        const newConfirmP = req.body.confirmPassword;
        const updateDetails = await User.updateOne({ _id: userID }, { $set: { password: newPassword, confirmpassword: newConfirmP } })
        if (updateDetails) {
            res.redirect('/login')
        }
    } catch (error) {
        console.log("Error on the verifyReset password :", error)
    }
}


module.exports = {
    signup,
    homeNewUser,
    verifySignup,
    otp,
    verifyOTP,
    login,
    verifyLogin,
    logout,
    home,
    loadResetPOTP,
    resetPassOTP,
    resetOTPsend,
    loadEmail,
    loadResetPassword,
    verifyResetPassword
}