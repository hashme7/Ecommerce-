require('dotenv').config()
const Categories = require('../../model/categoriesModel');
const products = require('../../model/products.Model')
const orders = require('../../model/OrderModel')
const { Decimal128 } = require('mongodb');

const adminLogin = (req, res) => {
  try {
    res.render('adminLogin', { message: "Enter your email and password" })
  } catch (error) {
    console.log(error, "error on Admin login")
  }
}

const adminLoginVerify = (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
      req.session.admin_id = "admin1";
      res.redirect('/admin/adminDashboard')
    } else {
      res.render('adminLogin', { message: "incorrect Password" })
    }
  } catch (error) {
    console.log(error, "error on adminloginverify")
  }
}
const dashBoard = async (req, res) => {
  try {
    let totalRevenue = 0;
    let admin = req.session.admin_id ? req.session.admin_id : null;
    res.render('dashBoard', { userName: admin ? admin : null, })
  } catch (error) {
    console.log("dash-board error", error);
  }
}
const dashBoardData = async (req, res) => {
  try {
    const orderList = await orders.find().populate('products.product').exec();
    const result = await orders.aggregate([
      {
        $match: {
          orderedDate: { $exists: true, $type: "date" },
          status: "Delivered"
        }
      },
      {
        $group: {
          _id: {

            year: { $year: "$orderedDate" },
            month: { $month: "$orderedDate" }
          },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          total: 1,
          count: 1
        }
      },
      {
        $sort: {
          year: 1,
          month: 1
        }
      }
    ]);
    const bestSellingProductsPipeline = [
      { $unwind: "$products" },
      { $lookup: { from: 'products', localField: "products.product", foreignField: '_id', as: "products.product" } },
      { $group: { _id: "$products.product.productName", product: { $first: "$products.product.productName" }, sum: { $sum: '$products.quantity' } } },
      { $unwind: '$product' },
      { $sort: { sum: -1 } }
    ]
    const bestSellingCategoryPipeline = [{$unwind:"$products"},
      {$lookup:{from:'products',localField:"products.product",foreignField:'_id',as:"products.product"}},
      {$lookup:{from:'categories',foreignField:'_id',localField:'products.product.category',as:'products.product.category'}},
      {$group:{_id:"$products.product.category.name",category:{$sum:1}}},
      {$unwind:'$_id'},
      {$sort:{category:-1}},
      {$limit:10}
    ]
    const bestSellingProducts = await orders.aggregate(bestSellingProductsPipeline);
    const bestSellingCategory = await orders.aggregate(bestSellingCategoryPipeline)

    const monthlySales = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total: 0,
      count: 0
    }));

    const yearlySales = {};

    result.forEach(entry => {
      const { month, year, total, count } = entry;
      const totalAsNumber = total instanceof Decimal128 ? parseFloat(total.toString()) : 0;
      monthlySales[month - 1] = { month, total: totalAsNumber, count };
      if (!yearlySales[year]) {
        yearlySales[year] = { year, total: 0, count: 0 };
      }
      yearlySales[year].total += totalAsNumber;
      yearlySales[year].count += count;
    });

    const yearlySalesArray = Object.values(yearlySales).sort((a, b) => a.year - b.year);

    let totalIncome = 0;
    let productsCount = await products.find().count();
    yearlySalesArray.forEach((elem) => {
      totalIncome = totalIncome + parseInt(elem.total)
    })
    res.json({ monthlySales, yearlySales: yearlySalesArray, orderList, totalIncome, productsCount, bestSellingProducts,bestSellingCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const adminLogout = async (req, res) => {
  try {
    req.session.admin_id = null
    res.redirect('/admin/adminLogin')
  } catch (error) {
    console.log(error, " in logout admin")
  }
}

module.exports = {
  adminLogin,
  adminLoginVerify,
  dashBoard,
  adminLogout,
  dashBoardData
}