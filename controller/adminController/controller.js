const Users = require('../../model/userModel')
const Categories = require('../../model/categoriesModel');
const products = require('../../model/products.Model')


const userList = async (req, res) => {
    try {
        const userlist = await Users.find({isVerified:true}).sort({ _id: -1 })
        console.log(userlist)
        res.render('userlist',
            { userlist: userlist }
        )
    } catch (error) {
        console.log(error, "error on userList");
    }
}
const blockUser = async (req, res) => {
    try {
        let email = req.query.email;
        console.log("blockuser")
        await Users.findOneAndUpdate({ email: email }, { $set: { isBlocked: true } })
        res.json({ message: "blocked succesfully...." })
    } catch (error) {
        res.json({ message: "something went wrong try again" })
    }
}
const unBlockUser = async (req, res) => {
    try {
        console.log("unblockuser")
        let email = req.query.email;
        await Users.findOneAndUpdate({ email: email }, { $set: { isBlocked: false } })
        res.json({ message: "unblocked succesfully......" })
    } catch (error) {
        res.json({ message: "something went wrong try again" })
    }
}
const categories = async (req, res) => {
    try {
        let category = await Categories.find({}).sort({ _id: 1 })
        console.log(category)
        res.render('categories', { categories: category })
    } catch (error) {
        console.log("error on categories page", error);
    }
}
const findCategories = async (req, res) => {
    try {
        const name = req.query.name;
        const CatIdregex = new RegExp(`^${name}$`, 'i')
        let category = await Categories.findOne({ name: CatIdregex })
        console.log(category)
        if (category) {
            res.json({ message: category })
        } else {
            res.json({ message: null })
        }
    } catch (error) {
        console.log(`error on findCategories :${error}`)
        res.status(404).res.json({ message: "something went wrong" })
    }
}

const findCatId = async (req, res) => {
    try {
        const CatId = req.query._id;
        console.log(CatId);
        let category = await Categories.findOne({ _id: CatId })
        console.log(category, "categories")
        if (category) {
            res.json({ message: category })
        } else {
            res.json({ message: null })
        }
    } catch (error) {
        console.log("error catid finding", error)
    }
}

const addCategories = async (req, res) => {
    try {
        const { name, discription } = req.body;
        const regexPattern = new RegExp(`^${name}$`, 'i');
        const alreadyThere = await Categories.find({ name: regexPattern })
        if (alreadyThere.length > 0) {
            return res.json({ message: 'useralready there' })
        }
        const newCategorie = new Categories({
            name: name,
            discription: discription
        })
        const saved = await newCategorie.save();
        if (saved) {
            console.log("message")
            res.json({ message: "added succesfully...." })
        }else{
            res.json({message:null})
        }
    } catch (error) {
        console.log("error on category adding", error)
    }
}
const blockCategory = async (req, res) => {
    try {
        const { name } = req.query;
        const result = await Categories.findOneAndUpdate({ name: name }, { $set: { isBlocked: true } })
        console.log(result)
        if (result) {
            await res.json({ messge: "bloked succesfully" })
        }
    } catch (error) {
        console.log(error, "error on BlockCategory")
    }
}

const unblockCategory = async (req, res) => {
    try {
        const { name } = req.query;
        const result = await Categories.findOneAndUpdate({ name: name }, { $set: { isBlocked: false } })
        console.log(result)
        if (result) {
            await res.json({ messge: "Unblocked succesfully" })
        } else {
            await res.json({ messge: "something went wrong try again later" })
        }
    } catch (error) {
        console.log(error, "error on unblockCategory")
    }
}
const editCategory = async (req, res) => {
    try {
        const { name, discription, findCatId } = req.query;
        const result = await Categories.updateOne({ _id: findCatId }, { $set: { name: name, discription: discription } })
        console.log(editCategory)
        if (result) {
            res.send({ message: result })
        }
    } catch (error) {
        console.log("error on editCategory", error)
        res.json({ message: "something went please try again later" })
    }
}


module.exports = {
    editCategory,
    userList,
    blockUser,
    unBlockUser,
    categories,
    blockCategory,
    unblockCategory,
    findCategories,
    addCategories,
    findCatId
}