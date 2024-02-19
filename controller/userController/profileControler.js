const User = require('../../model/userModel');
const bcrypt = require('bcrypt')
const Order = require('../../model/OrderModel')
const {ObjectId} = require('mongodb')


const profile = async (req, res) => {
    try {
        let userData = await User.findOne({ _id: req.session.user_id })
        let orders = await Order.find({user:req.session.user_id}).sort({_id:-1});
        let adresses = null;
        if (userData) {
            res.render('profile', {
                userName: req.session.user_name,
                userData: userData,
                Adresses: adresses,
                orders
            })
        }
    } catch (error) {
        console.log("error on profile page", error)
    }
}
const loadEditProfile = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await User.findOne({ _id: userId });
        res.render('editProfile', {
            userName: req.session.user_name,
            user
        })
    } catch (error) {
        console.log("error on ")
    }
}
const editProfile = async (req, res) => {
    try {
        const { name, mobile, currentPassword, newPassword } = req.body;
        const user = await User.findById({ _id: req.session.user_id })
        if (currentPassword.trim() !== '') {
            const valid = await bcrypt.compare(currentPassword, user.password)
            if (valid) {
                let hashpswd = await bcrypt.hash(newPassword, 10)
                user.password = hashpswd;
            } else {
                return res.send({ status: "Entered password is incorrect" })
            }
        }
        user.name = name;
        user.mobile = mobile;
        user.save();
        res.send({ status: "your profile is updated" })
    } catch (error) {
        console.log("error on editProfile ", error)
    }
}

const addAddress = async (req, res) => {
    try {
        const { name, mobile, colony, state, city, pincode, house } = req.body;
        console.log(name, mobile, colony, state, city, pincode, house)
        const newAddress = await User.updateOne({ _id: req.session.user_id }, {
            $push: {
                address: {
                    name, mobile, colony, state, city, pincode, house
                }
            }
        })
        if (newAddress) {
            res.json({ status: 'success' })
        }
    } catch (error) {
        console.log("error on addAddress", error)
    }
}
const deleteAddress = async (req, res) => {
    try {
        const { address } = req.params;
        const userData = await User.updateOne({ _id: req.session.user_id }, {
            $pull: {
                address: {
                    _id: address
                }
            }
        })
        if (userData) {
            res.json({ status: "success" })
        }
    } catch (error) {
        console.log("error on deleteAddress", error)
    }
}

const loadeditAddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const { id } = req.query;
        const userData = await User.aggregate([{ $match: { _id: new ObjectId(userId) } }, { $unwind: "$address" }, { $match: { "address._id": new ObjectId(id) } }, { $project: { address: 1 } }])
        console.log("data:", userData)
        res.render('editAddres', {
            message: null,
            userName: req.session.user_name,
            address: userData
        })
    } catch (error) {
        console.log("error on editAddress", error)
    }
}
const editAddres = async (req, res) => {
    try {
        console.log("editAddress: 1");
        const {addressId} = req.params;
        const { name, colony, mobile, state, city, pincode, house } = req.body;
        console.log(pincode)
        console.log(new ObjectId(addressId),"asdfghjkl");
        const filter = { _id: req.session.user_id, "address._id": addressId };
        const update = {
          $set: {
            "address.$.name": name,
            "address.$.colony": colony,
            "address.$.mobile": mobile,
            "address.$.state": state,
            "address.$.city": city,
            "address.$.pincode": pincode,
            "address.$.house": house,
          },
        };
        const options = { new: true };
        const updatedAddress = await User.findOneAndUpdate(filter, update, options);
        res.json({ message: "success" });
    } catch (error) {
        console.log("Error on editAddress", error);
        res.json({ message: "Error on editAddress" });
    }
};
const addWallet = (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}
module.exports = {
    profile,
    loadEditProfile,
    editProfile,
    addAddress,
    deleteAddress,
    loadeditAddress,
    editAddres,
    addWallet 
}