const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storageEvent = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Events',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
  }
});

const uploadCartel = multer({ storage: storageEvent });

module.exports = uploadCartel;
