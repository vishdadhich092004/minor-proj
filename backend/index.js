const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());

// // Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, // Limit each IP to 100 requests per windowMs
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });
// app.use(limiter);

// Logging Middleware
app.use(morgan('dev'));

//?Middle wair
app.use(cors({ origin: '*' }))
app.use(bodyParser.json());
//? Static file serving removed - All images are now stored on Cloudinary
//? Old local images can be accessed directly if needed, but new uploads use Cloudinary
// app.use('/image/products', express.static('public/products'));
// app.use('/image/category', express.static('public/category'));
// app.use('/image/poster', express.static('public/posters'));

const URL = process.env.MONGO_URL;

// Improved MongoDB connection with better error handling for serverless environments
const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log('✅ Connected to Database successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
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
app.use('/translate', require('./routes/translate'));
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


