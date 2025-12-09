/**
 * TruEstate Retail Sales Management API
 * Production-ready Express.js server with comprehensive CORS configuration
 * 
 * Features:
 * - Robust CORS handling for production and development
 * - Global error handling and logging
 * - Health check endpoints
 * - Memory-efficient data streaming
 * - Graceful shutdown handling
 */

const express = require('express');
const cors = require('cors');
const compression = require('compression');

// Import application modules
const streamingLoader = require('./utils/streamingDataLoader');
const salesRoutes = require('./routes/salesRoutes');

// =============================================================================
// SERVER CONFIGURATION
// =============================================================================

const app = express();
const PORT = process.env.PORT || 5002;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('🚀 Starting TruEstate Sales API Server...');
console.log(`📍 Environment: ${NODE_ENV}`);
console.log(`🔌 Port: ${PORT}`);

// =============================================================================
// CORS CONFIGURATION - Production Ready
// =============================================================================

// Define allowed origins for CORS
const allowedOrigins = [
  // Production frontend on Vercel
  'https://truestate-backend-five.vercel.app',
  
  // Vercel preview deployments (any subdomain)
  /^https:\/\/.*\.vercel\.app$/,
  
  // Local development environments
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://localhost:5173',  // Vite default
  'http://localhost:5174',  // Vite alternative
  'http://localhost:4173',  // Vite preview
];

// CORS configuration function
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      console.log(`✅ CORS allowed: ${origin}`);
      return callback(null, true);
    }

    // Log blocked origins but don't crash the server
    console.warn(`❌ CORS blocked: ${origin}`);
    const error = new Error(`CORS policy: Origin ${origin} is not allowed`);
    error.status = 403;
    callback(error);
  },
  
  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  
  // Allowed headers
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-HTTP-Method-Override',
    'Access-Control-Allow-Headers',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  
  // Allow credentials (cookies, authorization headers)
  credentials: true,
  
  // Handle preflight requests
  preflightContinue: false,
  optionsSuccessStatus: 204, // Some legacy browsers choke on 204
};

// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

// Enable compression for better performance
app.use(compression({ 
  level: 6, 
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse JSON bodies (limit to prevent DoS attacks)
app.use(express.json({ 
  limit: '1mb',
  strict: true
}));

// Parse URL-encoded bodies
app.use(express.urlencoded({ 
  extended: true, 
  limit: '1mb' 
}));

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// =============================================================================
// HEALTH CHECK ROUTES
// =============================================================================

// Basic health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'TruEstate Retail Sales Management API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    endpoints: {
      health: '/health',
      sales: '/api/sales',
      filters: '/api/sales/filters'
    }
  });
});

// Detailed health check for monitoring services
app.get('/health', (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024)
    },
    environment: NODE_ENV,
    nodeVersion: process.version,
    platform: process.platform
  };

  res.status(200).json(healthData);
});

// =============================================================================
// API ROUTES
// =============================================================================

// Mount sales API routes
app.use('/api/sales', salesRoutes);

// =============================================================================
// ERROR HANDLING MIDDLEWARE
// =============================================================================

// 404 handler - must be after all routes
app.use((req, res) => {
  const error = {
    status: 404,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /',
      'GET /health', 
      'GET /api/sales',
      'GET /api/sales/filters'
    ]
  };
  
  console.warn(`❌ 404 - ${req.method} ${req.path}`);
  res.status(404).json(error);
});

// Global error handler - must be last middleware
app.use((err, req, res, next) => {
  // Log the error
  console.error('🚨 Global Error Handler:', {
    message: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });

  // Handle CORS errors specifically
  if (err.message && err.message.includes('CORS policy')) {
    return res.status(403).json({
      status: 403,
      error: 'CORS Policy Violation',
      message: 'Origin not allowed by CORS policy',
      origin: req.headers.origin,
      timestamp: new Date().toISOString()
    });
  }

  // Handle other errors
  const status = err.status || err.statusCode || 500;
  const response = {
    status,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  };

  // Include stack trace in development
  if (NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
});

// =============================================================================
// SERVER INITIALIZATION
// =============================================================================

async function initializeServer() {
  try {
    console.log('\n=== Server Initialization ===');
    
    // Initialize data streaming loader
    console.log('📊 Initializing data streaming loader...');
    streamingLoader.initialize();
    console.log('✅ Streaming loader ready - data will be loaded on-demand');
    
    // Display memory usage
    const memUsage = process.memoryUsage();
    console.log(`💾 Memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`);
    
    // Start the server
    const server = app.listen(PORT);
    
    // Handle server startup errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.error('💡 Try stopping other processes or use a different port');
      } else {
        console.error('❌ Server startup error:', err.message);
      }
      process.exit(1);
    });
    
    // Server started successfully
    server.on('listening', () => {
      console.log('\n🎉 === SERVER READY ===');
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/`);
      console.log(`🔗 API endpoint: http://localhost:${PORT}/api/sales`);
      console.log(`📈 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
      console.log('🚀 Ready for production deployment');
      console.log('💡 Data is loaded on-demand per request (memory efficient)\n');
    });

    return server;
    
  } catch (error) {
    console.error('\n❌ === SERVER INITIALIZATION FAILED ===');
    console.error('Error:', error.message);
    console.error('\n🔍 Possible causes:');
    console.error('1. CSV files not found in backend/data/');
    console.error('2. CSV files are corrupted or have invalid format');
    console.error('3. Insufficient permissions to read files');
    console.error('4. Missing required dependencies');
    console.error('\n💡 Please fix the issue and restart the server.\n');
    process.exit(1);
  }
}

// =============================================================================
// GRACEFUL SHUTDOWN HANDLING
// =============================================================================

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  console.error('🔄 Server will restart...');
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  console.error('🔄 Server will restart...');
  process.exit(1);
});

// Handle graceful shutdown signals
const gracefulShutdown = (signal) => {
  console.log(`\n📴 ${signal} received - initiating graceful shutdown...`);
  
  // Give ongoing requests time to complete
  setTimeout(() => {
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  }, 5000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// =============================================================================
// START THE SERVER
// =============================================================================

initializeServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});