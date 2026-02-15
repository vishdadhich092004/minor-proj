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

// Debugging: Check if URL is loaded (Masked for security)
if (!URL) {
  console.error('❌ FATAL ERROR: MONGO_URL is not defined in environment variables.');
} else {
  console.log('✅ MONGO_URL loaded:', URL.substring(0, 15) + '...');
}

// Improved MongoDB connection for serverless with Retry Logic
const connectDB = async (retries = 5) => {
  while (retries > 0) {
    try {
      // Check if we are already connected
      if (mongoose.connection.readyState === 1) {
        console.log('✅ Already connected to Database');
        return;
      }

      await mongoose.connect(URL, {
        serverSelectionTimeoutMS: 5000, // Fail faster if no server found
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      });
      console.log('✅ Connected to Database successfully');
      return; // Success
    } catch (error) {
      console.error(`❌ Database connection error (Attempts left: ${retries - 1}):`, error.message);
      retries -= 1;
      if (retries === 0) {
        console.error('❌ Could not connect to Database after multiple attempts. Exiting...');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before retrying
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


// Start Server only after DB Connection
const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();


