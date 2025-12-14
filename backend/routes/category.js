const express = require('express');
const router = express.Router();
const Category = require('../model/category');
const SubCategory = require('../model/subCategory');
const Product = require('../model/product');
const { uploadCategory, uploadToCloudinary } = require('../uploadFile');
const multer = require('multer');
const asyncHandler = require('express-async-handler');
const { ensureConnection } = require('../utils/dbHelper');

// Get all categories
router.get('/', asyncHandler(async (req, res) => {
    try {
        // Ensure database connection
        await ensureConnection();
        
        // Set a timeout for the query (5 seconds)
        const queryPromise = Category.find().lean().maxTimeMS(5000);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Query timeout')), 5000)
        );
        
        const categories = await Promise.race([queryPromise, timeoutPromise]);
        
        res.json({ success: true, message: "Categories retrieved successfully.", data: categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        if (error.name === 'MongoServerSelectionError' || error.name === 'MongooseServerSelectionError') {
            return res.status(503).json({ 
                success: false, 
                message: "Database connection failed. Please check MongoDB Atlas IP whitelist settings and try again." 
            });
        }
        if (error.message === 'Query timeout') {
            return res.status(504).json({ 
                success: false, 
                message: "Request timeout. The query took too long to execute." 
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get a category by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const categoryID = req.params.id;
        const category = await Category.findById(categoryID);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }
        res.json({ success: true, message: "Category retrieved successfully.", data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Create a new category with image upload
router.post('/', asyncHandler(async (req, res) => {
    try {
        uploadCategory.single('img')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                let errorMessage = 'File upload error occurred.';
                if (err.code === 'LIMIT_FILE_SIZE') {
                    errorMessage = 'File size is too large. Maximum filesize is 5MB.';
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    errorMessage = 'Unexpected file field. Please use "img" as the field name.';
                } else {
                    errorMessage = err.message || `Multer error: ${err.code}`;
                }
                console.log(`Add category MulterError: ${errorMessage}`);
                return res.status(400).json({ success: false, message: errorMessage });
            } else if (err) {
                // Handle file upload errors
                let errorMessage = 'File upload failed.';
                if (err.message) {
                    errorMessage = err.message;
                } else if (typeof err === 'string') {
                    errorMessage = err;
                }
                console.log(`Add category error: ${errorMessage}`, err);
                return res.status(500).json({ success: false, message: errorMessage });
            }
            
            const { name } = req.body;
            let imageUrl = 'no_url';
            
            if (req.file) {
                try {
                    // Upload to Cloudinary
                    const cloudinaryResult = await uploadToCloudinary(req.file, 'categories');
                    imageUrl = cloudinaryResult.secure_url;
                    console.log('Image uploaded to Cloudinary:', imageUrl);
                } catch (cloudinaryError) {
                    console.error('Cloudinary upload error:', cloudinaryError);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Failed to upload image to cloud storage. Please try again.' 
                    });
                }
            }

            if (!name) {
                return res.status(400).json({ success: false, message: "Name is required." });
            }

            try {
                const newCategory = new Category({
                    name: name,
                    image: imageUrl
                });
                await newCategory.save();
                res.json({ success: true, message: "Category created successfully.", data: null });
            } catch (error) {
                console.error("Error creating category:", error);
                res.status(500).json({ success: false, message: error.message });
            }

        });

    } catch (err) {
        console.log(`Error creating category: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
}));

// Update a category
router.put('/:id', asyncHandler(async (req, res) => {
    try {
        const categoryID = req.params.id;
        uploadCategory.single('img')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                let errorMessage = 'File upload error occurred.';
                if (err.code === 'LIMIT_FILE_SIZE') {
                    errorMessage = 'File size is too large. Maximum filesize is 5MB.';
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    errorMessage = 'Unexpected file field. Please use "img" as the field name.';
                } else {
                    errorMessage = err.message || `Multer error: ${err.code}`;
                }
                console.log(`Update category MulterError: ${errorMessage}`);
                return res.status(400).json({ success: false, message: errorMessage });
            } else if (err) {
                // Handle file upload errors
                let errorMessage = 'File upload failed.';
                if (err.message) {
                    errorMessage = err.message;
                } else if (typeof err === 'string') {
                    errorMessage = err;
                }
                console.log(`Update category error: ${errorMessage}`, err);
                return res.status(500).json({ success: false, message: errorMessage });
            }

            const { name } = req.body;
            let image = req.body.image;

            if (req.file) {
                try {
                    // Upload to Cloudinary
                    const cloudinaryResult = await uploadToCloudinary(req.file, 'categories');
                    image = cloudinaryResult.secure_url;
                    console.log('Image uploaded to Cloudinary:', image);
                } catch (cloudinaryError) {
                    console.error('Cloudinary upload error:', cloudinaryError);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Failed to upload image to cloud storage. Please try again.' 
                    });
                }
            }

            if (!name || !image) {
                return res.status(400).json({ success: false, message: "Name and image are required." });
            }

            try {
                const updatedCategory = await Category.findByIdAndUpdate(categoryID, { name: name, image: image }, { new: true });
                if (!updatedCategory) {
                    return res.status(404).json({ success: false, message: "Category not found." });
                }
                res.json({ success: true, message: "Category updated successfully.", data: null });
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }

        });

    } catch (err) {
        console.log(`Error updating category: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
}));

// Delete a category
router.delete('/:id', asyncHandler(async (req, res) => {
    try {
        const categoryID = req.params.id;

        // Check if any subcategories reference this category
        const subcategories = await SubCategory.find({ categoryId: categoryID });
        if (subcategories.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete category. Subcategories are referencing it." });
        }

        // Check if any products reference this category
        const products = await Product.find({ proCategoryId: categoryID });
        if (products.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete category. Products are referencing it." });
        }

        // If no subcategories or products are referencing the category, proceed with deletion
        const category = await Category.findByIdAndDelete(categoryID);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }
        res.json({ success: true, message: "Category deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));






module.exports = router;
