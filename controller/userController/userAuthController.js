const User = require('../../model/userModel')
const util = require('../../utilities/sendEmail')
const OTP = require('../../model/OTPModel')
const products = require('../../model/products.Model')
const banners = require('../../model/BannerModel')
const bcrypt = require('bcryptjs');
const Categories = require('../../model/categoriesModel')

///*************home******** */

const home = async (req, res) => {
    try {
        let userName;
        if (req.session.user_id) {
            userName = req.session.user_name;
        }

        const perPage = 4;
        const currentPage = parseInt(req.query.page) || 1;

        const currentDate = new Date();

        const aggregationPipeline = [
            {
                $match: { isBlocked: false },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $unwind: '$category',
            },
            {
                $match: { 'category.isBlocked': { $ne: true } },
            },
            {
                $skip: (currentPage - 1) * perPage,
            },
            {
                $limit: perPage,
            },
        ];

        const productData = await products.aggregate(aggregationPipeline);

        const isLastPage = productData.length < perPage;

        const totalProducts = await products.countDocuments({ isBlocked: false });
        const totalPages = Math.ceil(totalProducts / perPage);

        const listBanner = await banners.find({
            isListed: true,
            startDate: { $lte: currentDate },
            expiryDate: { $gt: currentDate },
        });
        const listCategory = await Categories.find({ isListed: true });

        res.render('home', {
            userName: userName,
            product: productData,
            listBanner,
            listCategory,
            currentPage,
            totalPages,
            isLastPage,
        });
    } catch (error) {
        console.log('error on home', error);
        res.status(500).send('Internal Server Error');
    }
};

const loadAbout = async(req,res)=>{
    try{
        const userName = req.session.user_name;

        res.render('about',{
            userName
        })
    }catch(error){
        console.log(error)
    }
}
const loadContact = async(req,res)=>{
    try {
        const userName = req.session.user_name;
        res.render('contact',{
            userName
        })
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
            mobile,
            password,
        } = req.body;
        const userCheck = await User.findOne({ email, isVerified: true });
        if (userCheck) {
            return res.render("registerPage", {
                message: "User already there"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            email: email,
            mobile: mobile,
            password: hashedPassword,
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
        res.redirect('/otpsignup');
    } catch (error) {
        console.log("error mailserndein")
        console.log(error)
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
        } = req.query
        console.log("query", req.query)
        const userID = req.session.user_sign;
        console.log(userID)
        const input = `${noOne}${noTwo}${noThree}${noFour}`;
        const findOTP = await OTP.find({ user_id: userID }, { otp: 1, _id: 0 }).sort({ _id: -1 }).limit(1); 
        if (findOTP.length) {
            const verifiedOTP = await bcrypt.compare(input, findOTP[0].otp)
            if (verifiedOTP && findOTP) {
                await User.updateOne({ _id: userID }, { $set: { isVerified: true } }).catch((err) => {
                    console.log(err, "update-error")
                })
                await User.deleteMany({ isVerified: false })
                res.json({ success: true })
            } else {
                res.json({ succes: false })
            }
        }else{
            res.json({ succes: false })
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
        const userData = await User.findOne({ email: email, isVerified: true });
        if (userData) {
            if (!userData.isBlocked) {
                const passwordMatch = await bcrypt.compare(password, userData.password);
                console.log("passwordMatch", passwordMatch)
                if (passwordMatch) {
                    req.session.user_id = userData._id;
                    req.session.user_name = userData.name;
                    res.redirect('/');
                } else {
                    console.log(passwordMatch)
                    res.render('login', { message: "Incorrect username or password", type: "error" });
                }
            } else {
                res.render('login', {
                    message: "You were blocked by Admin"
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
        console.log(req.query)
        let email = req.query.email;
        let validuser = await User.findOne({ email: email })
        if (!validuser) {
            console.log("invalid email")
            res.json({success:false})
        } else {
            req.session.user_email = validuser.email;
            req.session.user_sign = validuser._id;
            await util.mailSender(
                email,
                validuser._id,
                `It seems you reseting the password and trying to verify your Email.
                Here is the verification code.Please enter otp and verify Email`
            );
            res.json({success:true})
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
        } = req.query
        const userID = req.session.user_sign;
        console.log(userID)
        const input = `${noOne}${noTwo}${noThree}${noFour}`;
        console.log("input    ",input)
        const findOTP = await OTP.find({ user_id: userID }, { otp: 1, _id: 0 }).sort({ _id: -1 }).limit(1);
        console.log(findOTP)
        if(!findOTP.length){
            console.log("no data")
            return res.json({success:false})
        }
        const verifiedOTP = await bcrypt.compare(input, findOTP[0].otp)
        console.log(verifiedOTP);
        if (verifiedOTP && findOTP) {
            await User.updateOne({ _id: userID }, { $set: { isVerified: true } }).catch((err) => {
                console.log(err, "update-error")
            })
            res.json({success:true});
        } else {
            res.json({success:false})
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
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateDetails = await User.updateOne({ _id: userID }, { $set: { password: hashedPassword, confirmpassword: newConfirmP } })
        if (updateDetails) {
            res.redirect('/login')
        }
    } catch (error) {
        console.log("Error on the verifyReset password :", error)
    }
}




module.exports = {
    signup,
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
    verifyResetPassword,
    loadAbout,
    loadContact
}