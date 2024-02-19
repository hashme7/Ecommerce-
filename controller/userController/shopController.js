const User = require('../../model/userModel');
const products = require('../../model/products.Model')
const order = require('../../model/OrderModel')
const categories = require('../../model/categoriesModel')

const loadShop = async (req, res) => {
    try {
        const userName = req.session.user_id ? req.session.user_name : null;
        const category = req.query.category ? req.query.category : null;
        const categoryId = category?await categories.findOne({ name: category }, { _id: 1 }):null;
        const categoriesList = await categories.find({ isBlocked: false });
        const sort = req.query.price ? req.query.price : null;
        const search = req.query.search ? req.query.search : null;
        let page = req.query.page ? parseInt(req.query.page) : 0;
        page = (page > 0) ? page - 1 : 0;
        let aggregationPipeline = [
            { $match: { isBlocked: false } },
        ]
        if (Object.keys(req.query).length == 0 || !req.body.fetching) {
            if (req.query) {
                if (category && category != 'all') {
                    aggregationPipeline.push({ $match: { category: categoryId._id } })
                }
                if (sort == '1') {
                    aggregationPipeline.push({ $sort: { price: 1 } })
                } else if (sort == '-1') {
                    aggregationPipeline.push({ $sort: { price: -1 } })
                }
                if (page) {
                    aggregationPipeline.push({ $skip: page * 4 })
                }
            }
            aggregationPipeline.push({ $limit: 4 })
            aggregationPipeline.push({
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            })
            let data = await products.aggregate(aggregationPipeline)
            if (search) {
                let searchRegex = new RegExp(search, "i");
                data = data.filter((product) => {
                    return searchRegex.test(product.productName);
                });
            }
            res.render('shop', { userName: userName, products: data, category: categoriesList })
        } else {
            if(category && category != 'all'){
                aggregationPipeline.push({$match:{category:categoryId._id}})
            }
            if (sort == '1') {
                aggregationPipeline.push({ $sort: { price: 1 } })
            } else if (sort == '-1') {
                aggregationPipeline.push({ $sort: { price: -1 } })
            }
            if (page) {
                aggregationPipeline.push({ $skip: page * 4 })
            }
            aggregationPipeline.push({ $limit: 4 })
            aggregationPipeline.push({
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            })
            let data = await products.aggregate(aggregationPipeline)
            console.log("filtered data with out search :",data)
            if (search) {
                let searchRegex = new RegExp(search, "i");
                data = data.filter((product) => {
                    return searchRegex.test(product.productName);
                });
            }
            res.json(Array.isArray(data) ? data : [data]);
        }
    } catch (error) {
        console.error("Error on shop load:", error);
        res.status(500).send('Internal Server Error');
    }
}

const singleProductList = async (req, res) => {
    try {
        const productId = req.query.productId;
        const productData = await products.findOne({ _id: productId });
        if (req.session.user_id) {
            res.render('singleProduct', { product: productData, userName: req.session.user_name })
        } else {
            res.render('singleProduct', { product: productData, userName: null })
        }
    } catch (error) {
        console.log("single product listing error :", error)
    }
}

module.exports = {
    loadShop,
    singleProductList
}