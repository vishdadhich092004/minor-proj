const express = require('express');
const router = express.Router();
const Poster = require('../model/poster');
const { uploadPosters, uploadToCloudinary } = require('../uploadFile');
const multer = require('multer');
const asyncHandler = require('express-async-handler');

// Get all posters
router.get('/', asyncHandler(async (req, res) => {
    try {
        const posters = await Poster.find({});
        res.json({ success: true, message: "Posters retrieved successfully.", data: posters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get a poster by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const posterID = req.params.id;
        const poster = await Poster.findById(posterID);
        if (!poster) {
            return res.status(404).json({ success: false, message: "Poster not found." });
        }
        res.json({ success: true, message: "Poster retrieved successfully.", data: poster });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Create a new poster
router.post('/', asyncHandler(async (req, res) => {
    try {
        uploadPosters.single('img')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                let errorMessage = 'File upload error occurred.';
                if (err.code === 'LIMIT_FILE_SIZE') {
                    errorMessage = 'File size is too large. Maximum filesize is 10MB.';
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    errorMessage = 'Unexpected file field. Please use "img" as the field name.';
                } else {
                    errorMessage = err.message || `Multer error: ${err.code}`;
                }
                console.log(`Add poster MulterError: ${errorMessage}`);
                return res.status(400).json({ success: false, message: errorMessage });
            } else if (err) {
                let errorMessage = 'File upload failed.';
                if (err.message) {
                    errorMessage = err.message;
                } else if (typeof err === 'string') {
                    errorMessage = err;
                }
                console.log(`Add poster error: ${errorMessage}`, err);
                return res.status(500).json({ success: false, message: errorMessage });
            }
            
            const { posterName } = req.body;
            let imageUrl = 'no_url';
            
            if (req.file) {
                try {
                    // Upload to Cloudinary
                    const cloudinaryResult = await uploadToCloudinary(req.file, 'posters');
                    imageUrl = cloudinaryResult.secure_url;
                    console.log('Poster image uploaded to Cloudinary:', imageUrl);
                } catch (cloudinaryError) {
                    console.error('Cloudinary upload error:', cloudinaryError);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Failed to upload image to cloud storage. Please try again.' 
                    });
                }
            }

            if (!posterName) {
                return res.status(400).json({ success: false, message: "Name is required." });
            }

            try {
                const newPoster = new Poster({
                    posterName: posterName,
                    imageUrl: imageUrl
                });
                await newPoster.save();
                res.json({ success: true, message: "Poster created successfully.", data: null });
            } catch (error) {
                console.error("Error creating Poster:", error);
                res.status(500).json({ success: false, message: error.message });
            }

        });

    } catch (err) {
        console.log(`Error creating Poster: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
}));

// Update a poster
router.put('/:id', asyncHandler(async (req, res) => {
    try {
        const categoryID = req.params.id;
        uploadPosters.single('img')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                let errorMessage = 'File upload error occurred.';
                if (err.code === 'LIMIT_FILE_SIZE') {
                    errorMessage = 'File size is too large. Maximum filesize is 10MB.';
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    errorMessage = 'Unexpected file field. Please use "img" as the field name.';
                } else {
                    errorMessage = err.message || `Multer error: ${err.code}`;
                }
                console.log(`Update poster MulterError: ${errorMessage}`);
                return res.status(400).json({ success: false, message: errorMessage });
            } else if (err) {
                let errorMessage = 'File upload failed.';
                if (err.message) {
                    errorMessage = err.message;
                } else if (typeof err === 'string') {
                    errorMessage = err;
                }
                console.log(`Update poster error: ${errorMessage}`, err);
                return res.status(500).json({ success: false, message: errorMessage });
            }

            const { posterName } = req.body;
            let image = req.body.image;

            if (req.file) {
                try {
                    // Upload to Cloudinary
                    const cloudinaryResult = await uploadToCloudinary(req.file, 'posters');
                    image = cloudinaryResult.secure_url;
                    console.log('Poster image uploaded to Cloudinary:', image);
                } catch (cloudinaryError) {
                    console.error('Cloudinary upload error:', cloudinaryError);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Failed to upload image to cloud storage. Please try again.' 
                    });
                }
            }

            if (!posterName || !image) {
                return res.status(400).json({ success: false, message: "Name and image are required." });
            }

            try {
                const updatedPoster = await Poster.findByIdAndUpdate(categoryID, { posterName: posterName, imageUrl: image }, { new: true });
                if (!updatedPoster) {
                    return res.status(404).json({ success: false, message: "Poster not found." });
                }
                res.json({ success: true, message: "Poster updated successfully.", data: null });
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }

        });

    } catch (err) {
        console.log(`Error updating poster: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
}));

// Delete a poster
router.delete('/:id', asyncHandler(async (req, res) => {
    const posterID = req.params.id;
    try {
        const deletedPoster = await Poster.findByIdAndDelete(posterID);
        if (!deletedPoster) {
            return res.status(404).json({ success: false, message: "Poster not found." });
        }
        res.json({ success: true, message: "Poster deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

module.exports = router;
