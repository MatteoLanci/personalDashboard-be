const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Personal Dashboard/users | mLanci",
    format: async (req, file) => {
      const originalExt = file.originalname.split(".").pop();
      return originalExt;
    },
    public_id: (req, file) => file.name,
  },
});

const cloudinaryUpload = multer({ storage: cloudinaryStorage });

module.exports = cloudinaryUpload;
