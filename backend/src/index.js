const express = require('express');
const cors = require('cors');
const compression = require('compression');
const streamingLoader = require('./utils/streamingDataLoader');
const salesRoutes = require('./routes/salesRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

console.log('🚀 Starting TruEstate Sales API Server...');

// 🌐 OPEN CORS - Allow access from ANY origin (less secure but more accessible)
console.log('⚠️  WARNING: CORS is set to allow ALL origins - less secure for production');

// ✅ CORS middleware - OPEN ACCESS for everyone
app.use(cors({
  origin: true,  // Allow all origins
  credentials: true,  // Enable if using cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// ✅ Preflight OPTIONS requests are automatically handled by the cors() middleware above
// No need for explicit app.options() - it causes PathError with '*' wildcard

// Basic middleware
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'TruEstate Retail Sales Management API',
    timestamp: new Date().toISOString(),
    corsPolicy: 'Open - All origins allowed'
  });
});

// ✅ API routes - CORS is already applied globally above
app.use('/api/sales', salesRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Global error handler:', err.message);
  
  // Handle CORS errors specifically (should not occur with open CORS)
  if (err.message && err.message.includes('CORS policy')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Unexpected CORS error',
      origin: req.headers.origin
    });
  }
  
  // Handle other errors
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: [
      'GET /',
      'GET /api/sales',
      'GET /api/sales/filters'
    ]
  });
});

// Initialize and start server
async function startServer() {
  try {
    console.log('📊 Initializing streaming loader...');
    streamingLoader.initialize();
    console.log('✅ Streaming loader ready');
    
    const server = app.listen(PORT);
    
    server.on('listening', () => {
      console.log('\n🎉 === SERVER READY ===');
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/`);
      console.log(`🔗 API endpoint: http://localhost:${PORT}/api/sales`);
      console.log('🌐 CORS Policy: OPEN - All origins allowed');
      console.log('⚠️  Security Note: API is accessible from any website');
      console.log('🚀 Ready for production deployment\n');
    });
    
    server.on('error', (err) => {
      console.error('❌ Server error:', err.message);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Server initialization failed:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received - shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received - shutting down gracefully');
  process.exit(0);
});

startServer();