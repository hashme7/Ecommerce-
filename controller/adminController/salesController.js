const orders = require('../../model/OrderModel')
const puppeteer = require('puppeteer')
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
        let orderList = await orders.find({ status: { $ne: "Pending" } }).populate('products.product').populate('user').exec();
        if (Object.keys(req.query).length) {
            orderList = orderList.filter((elem, i) => {
                if (req.query.customDate) {
                    return dateCheck(elem, req.query.customDate)
                }
                return dateCheck(elem, req.query.filter)
            })
        }
        if(!orderList.length){
           return res.json({failed:true})
        }
        if (req.params.downloadType == 'PDF') {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            const ejsTemplate = fs.readFileSync('views/admin/salesReport.ejs', 'utf-8');
            const htmlContent = ejs.render(ejsTemplate, { orderList })
            await page.setContent(htmlContent)
            let randomNumber = Math.floor(Math.random() * 100);
            await page.pdf({ path: `public/salesReport/report${randomNumber}.pdf`, format: 'A4' });
            await browser.close();
            const downloadUrl = `/salesReport/report${randomNumber}.pdf`;
            setTimeout(() => {
                fs.unlink(`public/salesReport/report${randomNumber}.pdf`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }, 10000)
            res.json({ url: downloadUrl });
        } else {
            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet("salesReport");

            worksheet.columns = [
                { header: "product name", key: "Pname", width: 15 },
                { header: "quantity", key: "quantity", width: 10 },
                { header: "price", key: "price", width: 10 },
                { header: "Total Price", key: "Tprice", width: 10 },
                { header: "Date", key: 'date', width: 25 },
                { header: "customer", key: "customer", width: 15 },
                { header: "payment", key: "payment", width: 15 }
            ];
            orderList.forEach((order, orderIndex) => {
                const products = order.products || [];
                let count = 1;
                products.forEach((product, productIndex) => {
                    const rowData = {
                        Pname: product.product.productName,
                        quantity: product.quantity,
                        price: product.product.price,
                        Tprice: parseInt(product.quantity) * parseInt(product.product.price),
                        date: order.orderedDate.toISOString(),
                        customer: order.user.name,
                        payment: order.paymentStatus,
                    };
                    worksheet.addRow(rowData);
                });
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

            // Stream the Excel workbook to the response
            await workbook.xlsx.write(res);
            res.end();
        }
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    loadSales,
    reportDownload
}