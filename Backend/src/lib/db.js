import mongoose from 'mongoose';

import { ENV } from './env.js';

// =============================================================================
// DATABASE CONNECTION
// =============================================================================

/**
 * Connects to MongoDB using the connection string from environment variables
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log('MongoDB connected ✅:', conn.connection.host);
  } catch (error) {
    console.error('MongoDB connection failed ❌:', error.message);
    process.exit(1); // Exit with failure code
  }
};

/**
 * Gracefully disconnects from MongoDB
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};