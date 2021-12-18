const multer = require('multer')

const avatarUpload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error("Please select image file"))
        }
        cb(undefined, true)
    }
})

const uploadFile = avatarUpload.single('avatar')

module.exports = uploadFile