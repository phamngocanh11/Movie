const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const createUploadMiddleware = (folder, allowedFormats = ["jpg", "png", "jpeg", "webp"]) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats,
    params: {
      folder,
    },
  });

  return multer({ storage });
};

const uploadAvatarCloud = createUploadMiddleware("movies/avatars");
const uploadMovieCloud = createUploadMiddleware("movies/media");

// Backward-compatible export for existing routes
const uploadCloud = uploadAvatarCloud;

module.exports = {
  uploadCloud,
  uploadAvatarCloud,
  uploadMovieCloud,
};
