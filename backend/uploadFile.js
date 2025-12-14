const multer = require('multer');
const path = require('path');
const cloudinary = require('./config/cloudinary');

// Use memory storage for multer (we'll upload to Cloudinary)
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: only .jpeg, .jpg, .png, .gif, .webp files are allowed!'));
  }
};

// Multer configuration for all uploads
const multerConfig = {
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10 // limit filesize to 10MB (Cloudinary supports larger files)
  },
  fileFilter: fileFilter
};

// Create multer instances
const uploadCategory = multer(multerConfig);
const uploadProduct = multer(multerConfig);
const uploadPosters = multer(multerConfig);

// Helper function to upload file to Cloudinary
const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    // Convert buffer to base64 data URI
    const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    cloudinary.uploader.upload(
      base64Data,
      {
        folder: folder,
        resource_type: 'auto', // Automatically detect image/video
        transformation: [
          { quality: 'auto' }, // Auto optimize quality
          { fetch_format: 'auto' } // Auto format (webp when supported)
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

module.exports = {
  uploadCategory,
  uploadProduct,
  uploadPosters,
  uploadToCloudinary
};
