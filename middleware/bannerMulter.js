const multer = require('multer');

const upload = multer.diskStorage({
    destination: './public/bannerImages',
    filename: (req, file, cb) => {
        const filename = file.originalname;
        console.log("MULTER MIDIWARE")
        cb(null, filename)

    }
})

const banner = multer({ storage: upload })
const uploadsBanner = banner.single('bannerImages');

module.exports = {
    uploadsBanner
}