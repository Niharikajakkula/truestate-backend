const express = require('express');
const cors = require('cors');
const compression = require('compression');
const streamingLoader = require('./utils/streamingDataLoader');
const salesRoutes = require('./routes/salesRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

// Basic middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allowed frontend origins - EXACT URLs only
const allowedOrigins = [
  'https://truestate-backend-five.vercel.app',
  'https://truestate-backend-kwqwh0loc-sri-niharikas-projects.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174'
];

// Global CORS middleware - handles ALL requests including OPTIONS
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'TruEstate Retail Sales Management API',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/sales', salesRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error: Origin not allowed',
      origin: req.headers.origin
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Initialize and start server
async function startServer() {
  try {
    console.log('Initializing streaming loader...');
    streamingLoader.initialize();
    console.log('✓ Streaming loader ready');
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log('✓ Allowed origins:', allowedOrigins);
      console.log('✓ Health check: http://localhost:' + PORT + '/');
      console.log('✓ API endpoint: http://localhost:' + PORT + '/api/sales');
    });
  } catch (error) {
    console.error('❌ Server initialization failed:', error.message);
    process.exit(1);
  }
}

startServer();