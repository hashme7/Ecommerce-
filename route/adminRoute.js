const express = require("express");
const adminRoute = express();
const adminAuth = require("../controller/adminController/adminAuth");
const adminMiddleware = require("../middleware/adminMiddleware/adminMiddleware");
const adminController = require("../controller/adminController/userController");
const productController = require("../controller/adminController/productController");
const productMiddleware = require("../middleware/multerMiddleware");
const orderController = require("../controller/adminController/orderController");
const couponController = require("../controller/adminController/couponController");
const salesController = require("../controller/adminController/salesController");
const bannerController = require("../controller/adminController/bannerController");
const bannerMiddleware = require("../middleware/bannerMulter");
const nocache = require("nocache");

adminRoute.set("view engine", "ejs");
adminRoute.set("views", "./views/admin");
adminRoute.use(nocache());

/** ---------- Admin Auth ---------- */
adminRoute
  .route("/login")
  .get(adminMiddleware.isLogOut, adminAuth.adminLogin)
  .post(adminAuth.adminLoginVerify);

adminRoute
  .route("/adminLogout")
  .get(adminMiddleware.isLogIn, adminAuth.adminLogout);

adminRoute
  .route("/dashboard")
  .get(adminMiddleware.isLogIn, adminAuth.dashBoard);

adminRoute
  .route("/dashboardData")
  .get(adminMiddleware.isLogIn, adminAuth.dashBoardData);

/** ---------- User Management ---------- */
adminRoute
  .route("/userslist")
  .get(adminMiddleware.isLogIn, adminController.userList);

adminRoute
  .route("/blockUser")
  .patch(adminMiddleware.isLogIn, adminController.blockUser);

adminRoute
  .route("/unBlockUser")
  .patch(adminMiddleware.isLogIn, adminController.unBlockUser);

/** ---------- Category Management ---------- */
adminRoute
  .route("/categories")
  .get(adminMiddleware.isLogIn, adminController.categories)
  .post(adminMiddleware.isLogIn, adminController.addCategories)
  .patch(adminMiddleware.isLogIn, adminController.editCategory);

adminRoute
  .route("/findcatId")
  .get(adminMiddleware.isLogIn, adminController.findCatId);

adminRoute
  .route("/findCategories")
  .get(adminMiddleware.isLogIn, adminController.findCategories);

adminRoute
  .route("/blockCategory")
  .post(adminMiddleware.isLogIn, adminController.blockCategory);
adminRoute
  .route("/unBlockCategory")
  .post(adminMiddleware.isLogIn, adminController.unblockCategory);

/** ---------- Product Management ---------- */
adminRoute
  .route("/Products")
  .get(adminMiddleware.isLogIn, productController.loadproduct)
  .patch(
    adminMiddleware.isLogIn,
    productMiddleware.uploadsProduct,
    productController.editProduct
  );

adminRoute
  .route("/addProducts")
  .get(adminMiddleware.isLogIn, productController.loadAddProducts)
  .post(
    adminMiddleware.isLogIn,
    productMiddleware.uploadsProduct,
    productController.addProducts
  );

adminRoute
  .route("/editProduct/:productName")
  .get(adminMiddleware.isLogIn, productController.loadEditProduct);

adminRoute
  .route("/unlistProduct")
  .patch(adminMiddleware.isLogIn, productController.unlistProduct);

adminRoute
  .route("/listProduct")
  .patch(adminMiddleware.isLogIn, productController.listProduct);

/** ---------- Order Management ---------- */
adminRoute
  .route("/Orders")
  .get(adminMiddleware.isLogIn, orderController.loadOrder);

adminRoute
  .route("/orderDetails/:order_id")
  .get(adminMiddleware.isLogIn, orderController.loadOrderDetails);

adminRoute.route("/status").patch(orderController.updateStatus);

adminRoute
  .route("/returnRequestAccept")
  .patch(adminMiddleware.isLogIn, orderController.acceptRequest);

adminRoute
  .route("/returnRequestReject")
  .patch(adminMiddleware.isLogIn, orderController.rejectRequest);

/** ---------- Coupon Management ---------- */
adminRoute
  .route("/coupons")
  .get(adminMiddleware.isLogIn, couponController.loadCoupons);

adminRoute
  .route("/add-coupon")
  .get(adminMiddleware.isLogIn, couponController.loadAddCoupons)
  .post(adminMiddleware.isLogIn, couponController.addCoupons);

adminRoute
  .route("/edit-coupon/:id")
  .get(adminMiddleware.isLogIn, couponController.loadEditCoupon)
  .post(adminMiddleware.isLogIn, couponController.editCoupon);

adminRoute
  .route("/checkCode/:currentCode/:updateCode")
  .get(adminMiddleware.isLogIn, couponController.checkCode);

/** ---------- Sales ---------- */
adminRoute
  .route("/sales")
  .get(adminMiddleware.isLogIn, salesController.loadSales)
  .patch(adminMiddleware.isLogIn, salesController.loadSales);

adminRoute
  .route("/salesreport/:downloadType")
  .get(adminMiddleware.isLogIn, salesController.reportDownload);

/** ---------- Banner ---------- */
adminRoute
  .route("/banners")
  .get(adminMiddleware.isLogIn, bannerController.loadBanners)
  .post(
    adminMiddleware.isLogIn,
    bannerMiddleware.uploadsBanner,
    bannerController.addBanners
  );

adminRoute
  .route("/addBanners")
  .get(adminMiddleware.isLogIn, bannerController.loadAddBanner);

adminRoute
  .route("/editBanner/:id")
  .get(adminMiddleware.isLogIn, bannerController.loadEditBanner)
  .patch(bannerMiddleware.uploadsBanner, bannerController.editBanner);

adminRoute
  .route("/updateBanner/:id")
  .patch(adminMiddleware.isLogIn, bannerController.updateBanner);

module.exports = adminRoute;
