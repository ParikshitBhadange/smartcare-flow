import dotenv from 'dotenv';

// =============================================================================
// ENVIRONMENT CONFIGURATION
// =============================================================================

// Load environment variables from .env file
dotenv.config();

// Environment variables with defaults
export const ENV = {
  PORT: process.env.PORT || 5000,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Validate required environment variables
const requiredEnvVars = ['DB_URL'];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.warn(`Warning: ${varName} environment variable is not set`);
  }
});