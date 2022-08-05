const cloudinary = require("cloudinary").v2
const multer = require("multer")
const {CloudinaryStorage} = require("multer-storage-cloudinary")

cloudinary.config({
    cloud_name: process.env.CLOUD,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        allow_formats: ["jpg", "png"],
        folder: "OccasionBike"
    }
})

module.exports = multer({storage})