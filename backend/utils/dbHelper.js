const mongoose = require('mongoose');

/**
 * Ensure MongoDB connection is ready before executing database operations
 * Useful for serverless environments where connections might be lost
 */
async function ensureConnection() {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return true; // Already connected
    }

    // Check if connection is in progress
    if (mongoose.connection.readyState === 2) {
      // Wait for connection to complete
      return new Promise((resolve, reject) => {
        mongoose.connection.once('connected', () => resolve(true));
        mongoose.connection.once('error', (err) => reject(err));
        setTimeout(() => reject(new Error('Connection timeout')), 10000);
      });
    }

    // If disconnected, try to reconnect
    if (mongoose.connection.readyState === 0) {
      const URL = process.env.MONGO_URL;
      if (!URL) {
        throw new Error('MONGO_URL environment variable is not set');
      }

      await mongoose.connect(URL, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1,
        retryWrites: true,
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error ensuring database connection:', error.message);
    throw error;
  }
}

module.exports = { ensureConnection };

