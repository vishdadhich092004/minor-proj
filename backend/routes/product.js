const express = require('express');
const router = express.Router();
const { uploadProduct } = require('../uploadFile');
const multer = require('multer'); // Needed for error handling in the route wrapper
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Helper wrapper for multer error handling
const handleMulterUpload = (req, res, next) => {
    uploadProduct.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
        { name: 'image5', maxCount: 1 }
    ])(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                err.message = 'File size is too large. Maximum filesize is 5MB per image.';
            }
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            return res.status(500).json({ success: false, message: err.message || 'File upload failed' });
        }
        next();
    });
};

// Get all products
router.get('/', getAllProducts);

// Get a product by ID
router.get('/:id', getProductById);

// Create new product
router.post('/', handleMulterUpload, createProduct);

// Update a product
router.put('/:id', handleMulterUpload, updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);

module.exports = router;
