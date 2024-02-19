const coupons = require('../../model/couponModel');

const loadCoupons = async (req, res) => {
    try {
        const couponsdata = await coupons.find({});
        res.render('coupon', { coupons: couponsdata, message: null })
    } catch (error) {
        console.log("error on load Coupons", error.message)
    }
}
const loadAddCoupons = async (req, res) => {
    try {
        res.render('addCoupon',{message:null});
    } catch (error) {
        console.log(error, "addCoupon error")
    }
}

const addCoupons = async (req, res) => {
    try {
        const {
            couponCode,
            discountPercentage,
            description,
            eligiblePrice,
            maximumDiscountAmount,
            quantity,
            expiresOn
        } = req.body;
        const stored = await coupons.findOne({ couponCode: couponCode });
        if (stored) {
            return res.render('addCoupon', { message: 'coupon already there' })
        }
        let coupon = new coupons({
            couponCode,
            discountPercentage,
            eligibleAmount:eligiblePrice,
            description,
            maximumDiscountAmount,
            quantity,
            expiresOn
        })
        await coupon.save();
        res.redirect('/admin/coupons')
    } catch (error) {
        console.log("error on coupons adding",error, error.message)
    }
}
const loadEditCoupon = async(req,res)=>{
    try {
        const couponId = req.params.id;
        const couponDetails = await coupons.findById(couponId)
        res.render('editCoupon',{coupon:couponDetails})
    } catch (error) {
        console.log(error,"********   ******************",error.message)
    }
}
const editCoupon = async(req,res)=>{
    try{    
        const {currentCode,eligiblePrice,couponCode,discountPercentage,expiresOn,description,
            maximumDiscountAmount,quantity} = req.body;
        const {id}= req.params;
        const isExisted = await coupons.findOne({couponCode:couponCode})
        const couponData = await coupons.updateOne({_id:id},{
            $set:{
                couponCode:couponCode,
                discountPercentage:discountPercentage,
                description:description,
                eligibleAmount:eligiblePrice,
                expiresOn:expiresOn,
                maximumDiscountAmount:maximumDiscountAmount,
                quantity:quantity
            }
        })
        console.log(couponData);
        res.redirect('/admin/coupons')
    }catch(error){
        console.log(error)
    }
}

const checkCode = async(req,res)=>{
    try{
        const {currentCode,updateCode}= req.params;
        const findedData = await coupons.findOne({couponCode:updateCode});
        if(!findedData){
            return res.json({status:false})
        }else{
            if(findedData.couponCode == currentCode){
                return res.json({status:false})
            }else{
                return res.json({status:true})
            }
        }
    }catch(error){
        console.log(error,"error on checkcoupon")
    }
}

module.exports = {
    loadAddCoupons,
    addCoupons,
    loadCoupons,
    loadEditCoupon,
    checkCode,
    editCoupon
}