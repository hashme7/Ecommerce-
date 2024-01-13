
require('dotenv').config()

const adminLogin = (req,res)=>{
    try {
        res.render('adminLogin',{message :"Enter your email and password"})
    } catch (error) {
        console.log(error,"error on Admin login")
    }
}

const adminLoginVerify  = (req, res )=>{
    try{
        const {email, password} = req.body;
        if(email === process.env.ADMIN_EMAIL&& password === process.env.ADMIN_PASS){
            req.session.admin_id = "admin1";
            res.render('dashBoard',{message :process.env.ADMIN_NAME})
        }else{
            res.render('adminLogin',{message:"incorrect Password"})
        }
    }catch(error){
        console.log(error,"error on adminloginverify")
    }
}
const dashBoard = (req,res)=>{
    try {
        res.render('dashBoard') 
    } catch (error) {
        console.log("dash-board error",error);
    }
}
const adminLogout = async(req,res)=>{
    try{
        req.session.admin_id = null
        res.redirect('/admin/adminLogin')
    }catch(error){
        console.log(error, " in logout admin")
    }
}

module.exports = {
    adminLogin,
    adminLoginVerify,
    dashBoard,
    adminLogout
}