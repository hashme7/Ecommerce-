const express = require("express");
const adminRoute = express();
const adminAuth = require("../controller/adminAuth");
const adminMiddleware = require('../middleware/adminMiddleware')
const adminController = require('../controller/adminController')
const productController = require('../controller/productController')
const productMiddleware = require('../middleware/multerMiddleware')
const nocache = require('nocache')

adminRoute.set("view engine", "ejs");
adminRoute.set("views", "./views/admin");

adminRoute.use(nocache())

adminRoute.get('/adminLogin',adminMiddleware.isLogOut,adminAuth.adminLogin)
adminRoute.post('/adminLogin', adminAuth.adminLoginVerify)
adminRoute.get('/adminLogout',adminMiddleware.isLogIn,adminAuth.adminLogout)
adminRoute.get('/adminDashboard',adminMiddleware.isLogIn, adminAuth.dashBoard)
adminRoute.get('/userslist',adminMiddleware.isLogIn, adminController.userList)
adminRoute.patch('/blockUser',adminMiddleware.isLogIn, adminController.blockUser)
adminRoute.patch('/unBlockUser',adminMiddleware.isLogIn, adminController.unBlockUser)
adminRoute.get('/categories',adminMiddleware.isLogIn, adminController.categories)
adminRoute.get('/findcatId',adminMiddleware.isLogIn, adminController.findCatId)
adminRoute.post('/addCategories',adminMiddleware.isLogIn, adminController.addCategories)
adminRoute.patch('/editCategory',adminMiddleware.isLogIn, adminController.editCategory)
adminRoute.get('/findCategories',adminMiddleware.isLogIn, adminController.findCategories)
adminRoute.post('/blockCategory',adminMiddleware.isLogIn, adminController.blockCategory)
adminRoute.post('/unBlockCategory',adminMiddleware.isLogIn, adminController.unblockCategory)
adminRoute.get('/Products',adminMiddleware.isLogIn, productController.loadproduct)
adminRoute.get('/addProducts',adminMiddleware.isLogIn, productController.loadAddProducts)
adminRoute.post('/addProducts',adminMiddleware.isLogIn, productMiddleware.uploadsProduct, productController.addProducts)
adminRoute.patch('/unlistProduct',adminMiddleware.isLogIn, productController.unlistProduct)
adminRoute.patch('/listProduct',adminMiddleware.isLogIn, productController.listProduct)
adminRoute.get('/editProduct/:productName',adminMiddleware.isLogIn,productController.loadEditProduct)


module.exports = adminRoute;