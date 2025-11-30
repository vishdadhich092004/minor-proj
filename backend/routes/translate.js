const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const axios = require('axios');

// Google Translate API endpoint
// Note: You'll need to set GOOGLE_TRANSLATE_API_KEY in your .env file
// Get your API key from: https://console.cloud.google.com/apis/credentials
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || '';
const GOOGLE_TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';

// Language codes mapping
const LANGUAGE_CODES = {
  'en': 'en',
  'hi': 'hi',
  'bn': 'bn'
};

// Translate text using Google Translate API
router.post('/', asyncHandler(async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Text and target language are required.' 
      });
    }

    if (!LANGUAGE_CODES[targetLanguage]) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid target language. Supported: en, hi, bn' 
      });
    }

    // If target language is English, return original text
    if (targetLanguage === 'en') {
      return res.json({ 
        success: true, 
        message: 'Translation successful.', 
        data: { translatedText: text } 
      });
    }

    // If no API key is set, return original text with a warning
    if (!GOOGLE_TRANSLATE_API_KEY) {
      console.warn('Google Translate API key not set. Returning original text.');
      return res.json({ 
        success: true, 
        message: 'Translation API key not configured. Returning original text.', 
        data: { translatedText: text } 
      });
    }

    // Call Google Translate API
    const response = await axios.post(
      `${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        q: text,
        target: targetLanguage,
        format: 'text'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const translatedText = response.data.data.translations[0].translatedText;

    res.json({ 
      success: true, 
      message: 'Translation successful.', 
      data: { translatedText } 
    });
  } catch (error) {
    console.error('Translation error:', error.response?.data || error.message);
    
    // If API call fails, return original text
    res.json({ 
      success: true, 
      message: 'Translation service unavailable. Returning original text.', 
      data: { translatedText: req.body.text } 
    });
  }
}));

// Translate multiple texts at once
router.post('/batch', asyncHandler(async (req, res) => {
  try {
    const { texts, targetLanguage } = req.body;

    if (!texts || !Array.isArray(texts) || !targetLanguage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Texts array and target language are required.' 
      });
    }

    if (!LANGUAGE_CODES[targetLanguage]) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid target language. Supported: en, hi, bn' 
      });
    }

    // If target language is English, return original texts
    if (targetLanguage === 'en') {
      return res.json({ 
        success: true, 
        message: 'Translation successful.', 
        data: { translatedTexts: texts } 
      });
    }

    // If no API key is set, return original texts
    if (!GOOGLE_TRANSLATE_API_KEY) {
      console.warn('Google Translate API key not set. Returning original texts.');
      return res.json({ 
        success: true, 
        message: 'Translation API key not configured. Returning original texts.', 
        data: { translatedTexts: texts } 
      });
    }

    // Call Google Translate API for batch translation
    const response = await axios.post(
      `${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        q: texts,
        target: targetLanguage,
        format: 'text'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const translatedTexts = response.data.data.translations.map(t => t.translatedText);

    res.json({ 
      success: true, 
      message: 'Translation successful.', 
      data: { translatedTexts } 
    });
  } catch (error) {
    console.error('Batch translation error:', error.response?.data || error.message);
    
    // If API call fails, return original texts
    res.json({ 
      success: true, 
      message: 'Translation service unavailable. Returning original texts.', 
      data: { translatedTexts: req.body.texts } 
    });
  }
}));

module.exports = router;

