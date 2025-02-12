 const multer = require('multer')

const upload = multer.diskStorage({
    destination:'./public/multerimages',
    filename:(req,file,cb)=>{
        console.log("entered in multer middleware")
        const filename = file.originalname;
        cb(null,filename)
    }
})
const product = multer({storage:upload})
const uploadsProduct = product.array('cropedImages', 4)
module.exports = {
    uploadsProduct
}