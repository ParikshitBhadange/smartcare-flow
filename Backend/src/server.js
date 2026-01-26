import express from 'express';
import { ENV } from './lib/env.js';
import path from 'path';
import { connectDB } from './lib/db.js';

const app = express();
// Add middleware for parsing JSON
app.use(express.json());



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
    res.status(200).json( {msg: "success from api health check"} );
});

app.get('/books', (req, res) => {
    res.status(200).json( {msg: "success from api books check "} );
})


// make app ready for deployment to help serve frontend
if(ENV.NODE_ENV === 'production'){
    app.use( express.static( path.join(__dirname, '../Frontend/dist') ) );
    app.get('/{*any}', (req, res) => {
        res.sendFile( path.join(__dirname, "../Frontend", "dist", "index.html"));
    });
}


// starting the server with DB connection alongwith error handling
const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT,() => {
        console.log(`Server is running on port: ${ENV.PORT} `);
        });

    } catch (error) {
        console.log("error starting server:", error.message);
    }

};

startServer();
