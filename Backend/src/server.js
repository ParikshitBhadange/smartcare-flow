// =============================================================================
// IMPORTS
// =============================================================================

// External dependencies
import express from 'express';
import cors from 'cors';
import path from 'path';

// Internal modules
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';

// Routes
import drugBatchRoutes from './routes/drugBatchRoutes.js';

// =============================================================================
// APP INITIALIZATION
// =============================================================================

const app = express();
const __dirname = path.resolve();

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Enable CORS for cross-origin requests
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// =============================================================================
// HEALTH CHECK ROUTES
// =============================================================================

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'API is healthy', status: 'ok' });
});

// =============================================================================
// API ROUTES
// =============================================================================

app.use('/api/drug-batches', drugBatchRoutes);

// =============================================================================
// PRODUCTION STATIC FILE SERVING
// =============================================================================

if (ENV.NODE_ENV === 'production') {
  // Serve static files from Frontend build
  app.use(express.static(path.join(__dirname, '../Frontend/dist')));

  // Handle client-side routing - serve index.html for all other routes
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'dist', 'index.html'));
  });
}

// =============================================================================
// SERVER STARTUP
// =============================================================================

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening for requests
    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server is running on port: ${ENV.PORT}`);
      console.log(`📍 Environment: ${ENV.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error.message);
    process.exit(1);
  }
};

startServer();