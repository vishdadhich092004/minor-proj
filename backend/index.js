const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
//?Middle wair
app.use(cors({ origin: '*' }))
app.use(bodyParser.json());
//? setting static folder path
app.use('/image/products', express.static('public/products'));
app.use('/image/category', express.static('public/category'));
app.use('/image/poster', express.static('public/posters'));

const URL = process.env.MONGO_URL;

// Improved MongoDB connection with better error handling for serverless environments
const connectDB = async () => {
  try {
    const mongooseOptions = {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 1,
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      retryWrites: true,
      w: 'majority',
    };

    await mongoose.connect(URL, mongooseOptions);
    console.log('✅ Connected to Database successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    // Don't exit process in serverless - let it retry on next request
    if (process.env.NODE_ENV !== 'production') {
      // Only exit in development
      // process.exit(1);
    }
  }
};

const db = mongoose.connection;

// Connection event handlers
db.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

db.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

db.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

db.once('open', () => {
  console.log('✅ Database connection opened');
});

// Handle connection
connectDB();

// Routes
app.use('/categories', require('./routes/category'));
app.use('/subCategories', require('./routes/subCategory'));
app.use('/brands', require('./routes/brand'));
app.use('/variantTypes', require('./routes/variantType'));
app.use('/variants', require('./routes/variant'));
app.use('/products', require('./routes/product'));
app.use('/couponCodes', require('./routes/couponCode'));
app.use('/posters', require('./routes/poster'));
app.use('/users', require('./routes/user'));
app.use('/orders', require('./routes/order'));
app.use('/payment', require('./routes/payment'));
app.use('/notification', require('./routes/notification'));
app.use('/api/image-proxy', require('./routes/imageProxy'));


// Example route using asyncHandler directly in app.js
app.get('/', asyncHandler(async (req, res) => {
    res.json({ success: true, message: 'API working successfully', data: null });
}));

// Global error handler

app.use((error, req, res, next) => {
    res.status(500).json({ success: false, message: error.message, data: null });
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});


