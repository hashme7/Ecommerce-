const User = require('../../model/userModel');
const products = require('../../model/products.Model');

//*************loadCart *************//
const loadCart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        if (userId) {
            const userData = await User.findOne({ _id: userId })
                .populate('cart.product')
            console.log("user data", userData)
            res.render('cart', {
                userName: req.session.user_name,
                userData
            });
        }else{
            res.redirect('/login');
        }

    } catch (error) {
        console.log("error on loadCart", error)
    }
}

//****************addToCart *****************//
const addToCart = async (req, res) => {
    try {
        const { product_id } = req.params;
        console.log("object id : ", product_id)
        const userId = req.session.user_id;
        const cartData = await User.findOne(
            { _id: userId, 'cart.product': product_id },
        ).populate('cart.product').exec();
        console.log("cartData", cartData)
        if (cartData) {
            for (let i = 0; i < cartData.cart.length; i++) {
                if (cartData.cart[i].product._id == product_id) {
                    if (cartData.cart[i].quantity >= cartData.cart[i].product.quantity) {
                        return res.json({ status: 'failed' })
                    }
                    cartData.cart[i].quantity = cartData.cart[i].quantity + 1;
                }
            }
            cartData.save();
            return res.json({
                status: 'success'
            })
        } else {
            const productData = await products.findOne({ _id: product_id })
            if (productData.quantity < 1) {
                return res.json({
                    status: 'failed'
                })
            }
            const newData = await User.findOneAndUpdate({ _id: userId }, {
                $push: {
                    cart: {
                        product: product_id
                    }
                }
            })
            console.log(newData);
            res.json({
                status: 'success'
            })
        }

    } catch (error) {
        console.log("error on addToCart", error)
    }
}

const removeFrmCart = async (req, res) => {
    try {
        console.log("remove from cart")
        let finded = false
        const { product_id } = req.params;
        const userId = req.session.user_id;
        console.log(product_id)
        const cartData = await User.findOne(
            { _id: userId, 'cart.product': product_id },
        ).exec();
        cartData.cart.forEach((item) => {
            if (item.product == product_id) {
                finded = true
                if (item.quantity >= 2) {
                    finded = false;
                    item.quantity = item.quantity - 1;
                    console.log(item)
                    cartData.save();
                    return res.json({
                        status: 'success'
                    })
                }
            }
        })
        if (finded) {
            const newData = await User.findOneAndUpdate({ _id: userId }, {
                $pull: {
                    cart: {
                        product: product_id
                    }
                }
            }, { new: true })
            console.log(newData);
            res.json({
                status: 'success'
            })
        }
    } catch (error) {
        console.log("error on removeFrmCart", error)
    }
}
const deletFromCart = async (req, res) => {
    try {
        const { product_id } = req.params;
        const userId = req.session.user_id;
        const newData = await User.findOneAndUpdate({ _id: userId }, {
            $pull: {
                cart: {
                    product: product_id
                }
            }
        }, { new: true })
        console.log(newData)
        res.json({
            status: 'success'
        })
    } catch (error) {
        console.log("error on delteFrmCart", error)
    }
}


module.exports = {
    loadCart,
    addToCart,
    removeFrmCart,
    deletFromCart,
}