const Orders = require('../../model/OrderModel');

const loadOrder = async(req,res)=>{
    try {
        const orders =await Orders.find({})
        .populate('user')
        .populate('products.product')
        .sort({_id:-1})
        .exec();
        console.log(orders)
        res.render('orders',{orders})
    } catch (error) {
        console.log("error on loadOrder", error)
    }
}

const loadOrderDetails = async (req,res)=>{
    try {
        console.log("loadOrderDetails")
        const {order_id}= req.params;
        const orders = await Orders.findOne({_id:order_id})
        .populate('user')
        .populate('products.product')
        .exec();
        console.log(orders)
        res.render('orderDetails',{
            orders
        })
    } catch (error) {
        console.log(error)
    }
}

const updateStatus = async (req, res) => {
    try {
        const { id, status } = req.query;
        const order = await Orders.findById(id);
        order.status = status;
        await order.save();
        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error' });
    }
}
module.exports = {
    loadOrder,
    loadOrderDetails,
    updateStatus
}