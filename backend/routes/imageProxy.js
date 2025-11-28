const express = require('express');
const router = express.Router();
const axios = require('axios');
const asyncHandler = require('express-async-handler');

// Proxy endpoint for external images to bypass CORS
router.get('/proxy', asyncHandler(async (req, res) => {
  try {
    const imageUrl = req.query.url;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required',
        data: null
      });
    }

    // Validate URL
    try {
      new URL(imageUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL',
        data: null
      });
    }

    // Fetch image from external URL
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Set appropriate headers
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // Pipe the image stream to response
    response.data.pipe(res);

  } catch (error) {
    console.error('Image proxy error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch image',
      data: null
    });
  }
}));

module.exports = router;

