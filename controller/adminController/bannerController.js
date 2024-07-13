const banners = require('../../model/BannerModel');

const loadBanners = async (req, res) => {
    try {
        const bannerList = await banners.find({});
        res.render('Banner', { bannerList })
    } catch (error) {
        console.log(error)
    }
}
const loadAddBanner = async (req, res) => {
    try {
        res.render('addBanner');
    } catch (error) {
        console.log(error, "error on loadAddBanner")
    }
}
const editBanner = async (req, res) => {
    try {
        const { name, targetType, targetId, startDate, endDate, description } = req.body;
        const { id } = req.params;
        console.log("dsfasdfasdf--------------------------------------", req.file)

        const existedC = await banners.find({ _id: { $ne: id, name: name } });

        if (!existedC) {
            const updateData = await banners.findOne({_id:id});
            userData.name= name,
            userData.targetId= targetId,
            userData.startDate = startDate,
            userData.targetType =  targetType,
            userData.expiryDate =  endDate,
            userData.description =  description,
            userData.bannerImage =  req.file.filename
           await updateData.save();
           console.log("succesfully done")
           res.json({ success: true });
        }else{
            res.json({success:false})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
const addBanners = async (req, res) => {
    try {
        const { name, targetType, targetId, startDate, endDate, description } = req.body;
        console.log(req.body)
        console.log("dsfasdfasdf", req.file)
        const posted = new banners({
            name: name,
            targetId: targetId,
            startDate: startDate,
            targetType: targetType,
            expiryDate: endDate,
            description: description,
            bannerImage: req.file.filename,
        })
        if (posted) {
            await posted.save()
            res.json({ success: true });
        }
    } catch (error) {
        console.log(error)
    }
}



const updateBanner = async (req, res) => {
    try {
        const existingBanner = await banners.findById(req.params.id);
        if (!existingBanner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }
        const updatedIsListed = !existingBanner.isListed;
        const updatedBanner = await banners.findByIdAndUpdate(
            req.params.id,
            { $set: { isListed: updatedIsListed } },
            { new: true }
        );
        res.json({ success: true, banner: updatedBanner });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const loadEditBanner = async (req, res) => {
    try {
        const bannerList = await banners.findOne({ _id: req.params.id });
        res.render('editBanner', { bannerList });
    } catch (error) {
        console.log("error on editBanner", error)
    }
}

module.exports = {
    loadBanners,
    addBanners,
    loadAddBanner,
    updateBanner,
    loadEditBanner,
    editBanner
}