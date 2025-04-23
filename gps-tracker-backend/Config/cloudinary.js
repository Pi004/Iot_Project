const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // Load environment variables

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME||"dpzzxl9rh",
    api_key: process.env.CLOUDINARY_API_KEY||673713563296142,
    api_secret: process.env.CLOUDINARY_API_SECRET||"P4o-k6Y07lb5GA-UNc8UOL02o2k"
});

module.exports = cloudinary;
