
const isLogIn = (req,res,next) => {
    try {
        if (req.session.admin_id) {
            next();
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.log(error.message);
    }
}
const isLogOut = (req,res,next)=>{
    try{
        if(req.session.admin_id == null){
            next()
        }else{
            res.redirect('/admin/dashboard')
        }
    }catch(error){
        console.log("error on islogout",error)
    }
}

module.exports = {
    isLogIn,
    isLogOut
}