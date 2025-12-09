const express = require('express');
const cors = require('cors');
const compression = require('compression');
const streamingLoader = require('./utils/streamingDataLoader');
const salesRoutes = require('./routes/salesRoutes');

console.log('Starting server...');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(compression({ level: 6, threshold: 1024 }));

// CORS configuration - Production ready
const allowedOrigins = [
  'https://truestate-backend-five.vercel.app', // Your Vercel frontend
  'https://truestate-backend-kwqwh0loc-sri-niharikas-projects.vercel.app', // Vercel preview URLs
  'http://localhost:3000', // Local development
  'http://localhost:3001', // Local development (alternative port)
  'http://localhost:5173', // Vite default port
  'http://localhost:5174', // Alternative local port
];

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow any vercel.app subdomain for preview deployments
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    console.log('❌ CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-HTTP-Method-Override'
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests - the CORS middleware already handles this
// No need for explicit OPTIONS handler as cors() middleware handles preflight

app.use(express.json({ limit: '1mb' }));

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'TruEstate Retail Sales Management API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      sales: '/api/sales',
      filters: '/api/sales/filters'
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check for monitoring services
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/sales', salesRoutes);

// Global error handler - must be after all routes
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'CORS policy violation',
      message: 'Origin not allowed',
      origin: req.headers.origin
    });
  }
  
  // Default error
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Initialize data and start server
const initializeServer = async () => {
  try {
    console.log('=== Server Initialization ===');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Port:', PORT);
    console.log('Node version:', process.version);
    console.log('Memory limit:', `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log('Allowed origins:', allowedOrigins);
    console.log('');
    
    // Initialize streaming loader (no data loaded into memory)
    streamingLoader.initialize();
    console.log('✓ Streaming loader ready - data will be loaded on-demand');
    console.log(`✓ Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log('');
    
    // Start server
    console.log('=== Starting Server ===');
    
    const server = app.listen(PORT);
    
    // Handle server errors BEFORE listening callback
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use`);
        console.error('Please stop the other process or use a different port');
      } else {
        console.error('❌ Server error:', err.message);
      }
      process.exit(1);
    });
    
    // Success callback only fires if no error
    server.on('listening', () => {
      console.log('✅ Server successfully started!');
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/`);
      console.log(`✅ API endpoint: http://localhost:${PORT}/api/sales`);
      console.log(`✅ Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
      console.log('');
      console.log('=== Server Ready ===');
      console.log('🚀 Ready for production deployment');
      console.log('💡 Data is loaded on-demand per request (memory efficient)');
    });
  } catch (error) {
    console.error('');
    console.error('=== Server Initialization Failed ===');
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Possible causes:');
    console.error('1. CSV files not found in backend/data/');
    console.error('2. CSV files are corrupted or have invalid format');
    console.error('3. Insufficient permissions to read files');
    console.error('');
    console.error('Please fix the issue and restart the server.');
    process.exit(1);
  }
};

// Handle uncaught errors gracefully
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
});

initializeServer();