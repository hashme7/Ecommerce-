const product = require('../model/products.Model')
const categories = require('../model/categoriesModel')


const loadproduct = async (req, res) => {
    try {
        const products = await product.find({})
        res.render('products', { products })
    } catch (error) {
        console.log(error);
    }
}


const loadAddProducts = async (req, res) => {
    try {
        const category = await categories.find({})
        res.render('addProducts', { category, message: false })
    } catch (error) {
        console.log("error on loadAddproducts :", error)
    }
}

const addProducts = async (req, res) => {
    try {
        const details = req.body;
        const files = req.files;
        const regexName = new RegExp(`^${details.productName}$`,'i');
        console.log(regexName)
        const haveName = await product.findOne({ productName: regexName , category:req.body.category})
        console.log(haveName)
        if (haveName) {
            console.log("haveName",haveName)
          return res.status(400).json( { message: "product name already there" })
        }
        const images = [
            files[0].filename,
            files[1].filename,
            files[2].filename,
            files[3].filename
        ]
        const products = new product({ 
            productName: details.productName,
            price: details.price,
            category: details.category,
            quantity: details.quantity,
            description:details.description,
            offer: details.offer,
            images:images,
        })
        let savedProducts = await products.save();
        if (savedProducts) {
            res.redirect('/admin/Products');
        }
    } catch (error) {
        console.log("error on addProducts :", error)
    }
}
const unlistProduct = async (req, res) => {
    try {
        const{ productName} = req.query;
        console.log(productName)
        let updated =  await product.updateOne({ productName:productName}, { $set: { isBlocked: true } })
        if(updated){
            res.json({message:"product unlist succesfully"})
        }else{
            res.json({message:"something went wrong,please try again"})
        }
    } catch (error) {
        console.log("error on unlist product",error)
        res.json({message:"something went wrong ,try again later"})
    }

}

const listProduct = async (req,res)=>{
    try {
        const {productName} = req.query ; 
        let updated = await product.updateOne({productName :productName},{$set:{isBlocked:false}})
        if(updated){
            res.json({message:"product list succesfully"})
        }else{
            res.json({message:"something went wrong ,please try again later"})
        }
    } catch (error) {
       res.json({message:"something went wrong ,please try again later"}) 
    }   
}
const loadEditProduct = async (req,res)=>{
    try {
        const {productName} = req.params;
        let products = await  product.findOne({productName:productName})
        let category = await categories.find({});
        res.render('editProducts',{
            products:products
            ,message: false
            ,category
        });
    } catch (error) {
        console.log("error on editProduct",error)
    }
}



module.exports = {
    loadproduct,
    loadAddProducts,
    addProducts,
    unlistProduct,
    listProduct,
    loadEditProduct
}