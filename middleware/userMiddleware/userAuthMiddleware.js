const User = require('../../model/userModel')

const isBlocked = async (req, res, next) => {
    try {
        const userData = await User.findOne({ _id: req.session.user_id })
        if (!userData) {
            next();
        } else {
            console.log(userData.isBlocked)
            if (userData.isBlocked) {
                res.redirect('/login')
            } else {
                next();
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}
const isLogIn = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            next();
        } else {
            res.redirect('/')
        }
    } catch (error) {
        console.log("error on isLogin middleware",error)
    }
    
}
const isLogOut = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            const userData = await User.findById(req.session.user_id)
            if (userData.isBlocked || !userData.isVerified) {
                next();
            }
            res.redirect('/home')
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogIn,
    isLogOut,
    isBlocked
}