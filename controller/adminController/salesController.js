const orders = require('../../model/OrderModel')
const { chromium } = require("playwright"); 
const exceljs = require('exceljs')
const ejs = require('ejs')
const fs = require('fs')
const { dateCheck } = require('../../services/dateFilter')

const loadSales = async (req, res) => {
    try {
        let orderList = await orders.find({ status: 'Delivered'  }).populate('products.product').populate('user').exec();
        console.log(orderList,"kldfjk;alsjkdf")
        let filter = req.query?.filter;
        let customDate = req.query?.customDate;
        if (Object.keys(req.body).length) {
            if (filter !== 'ALL') {
                if (filter == 'Custom Date') {
                    orderList = orderList.filter((elem,i)=>{
                        return dateCheck(elem,customDate)
                    })
                } else {
                    orderList = orderList.filter((elem, i) => {
                        return dateCheck(elem, filter)
                    })
                }

            }
            res.json({ orderList })
        } else {
            if (Object.keys(req.query).length) {
                orderList = orderList.filter((elem, i) => {
                    return dateCheck(elem, filter)
                })
            }
            res.render('sales', { orderList });
        }
    } catch (error) {
        console.log(error, "error on loadSales");
    }
};
const reportDownload = async (req, res) => {
  try {
    let orderList = await orders
      .find({ status: { $ne: "Pending" } })
      .populate("products.product")
      .populate("user")
      .exec();
    if (Object.keys(req.query).length) {
      orderList = orderList.filter((elem) => {
        return req.query.customDate
          ? dateCheck(elem, req.query.customDate)
          : dateCheck(elem, req.query.filter);
      });
    }
    if (!orderList.length) {
      return res.json({ failed: true });
    }

    if (req.params.downloadType == "PDF") {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      const ejsTemplate = fs.readFileSync(
        "views/admin/salesReport.ejs",
        "utf-8"
      );
      const htmlContent = ejs.render(ejsTemplate, { orderList });

      await page.setContent(htmlContent, { waitUntil: "load" });

      let randomNumber = Math.floor(Math.random() * 100);
      const pdfPath = `public/salesReport/report${randomNumber}.pdf`;

      await page.pdf({ path: pdfPath, format: "A4" });

      await browser.close();

      setTimeout(() => {
        fs.unlink(pdfPath, (err) => {
          if (err) console.log(err);
        });
      }, 10000);

      res.json({ url: `/salesReport/report${randomNumber}.pdf` });
    } else {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("salesReport");

      worksheet.columns = [
        { header: "product name", key: "Pname", width: 15 },
        { header: "quantity", key: "quantity", width: 10 },
        { header: "price", key: "price", width: 10 },
        { header: "Total Price", key: "Tprice", width: 10 },
        { header: "Date", key: "date", width: 25 },
        { header: "customer", key: "customer", width: 15 },
        { header: "payment", key: "payment", width: 15 },
      ];
      orderList.forEach((order) => {
        order.products.forEach((product) => {
          worksheet.addRow({
            Pname: product.product.productName,
            quantity: product.quantity,
            price: product.product.price,
            Tprice:
              parseInt(product.quantity) * parseInt(product.product.price),
            date: order.orderedDate.toISOString(),
            customer: order.user.name,
            payment: order.paymentStatus,
          });
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
      await workbook.xlsx.write(res);
      res.end();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
    loadSales,
    reportDownload
}