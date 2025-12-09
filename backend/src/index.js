const express = require('express');
const cors = require('cors');
const compression = require('compression');
const streamingLoader = require('./utils/streamingDataLoader');
const salesRoutes = require('./routes/salesRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

console.log('🚀 Starting TruEstate Sales API Server...');

// ✅ List all allowed origins - EXACT matches only
const allowedOrigins = [
  'https://truestate-backend-five.vercel.app',  // Production frontend
  'http://localhost:3000',                      // Local dev
  'http://localhost:3001',                      // Local dev (alt port)
  'http://localhost:5173',                      // Vite default
  'http://localhost:5174'                       // Vite alt port
];

// ✅ CORS middleware - MUST be applied BEFORE routes
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.error('❌ CORS blocked:', origin);
      return callback(new Error(msg), false);
    }
    
    console.log('✅ CORS allowed:', origin);
    return callback(null, true);
  },
  credentials: true,  // Enable if using cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// ✅ Preflight support - use cors() middleware, NOT app.options('*', ...)
app.options('*', cors());

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
    allowedOrigins: allowedOrigins
  });
});

// ✅ API routes - CORS is already applied globally above
app.use('/api/sales', salesRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Global error handler:', err.message);
  
  // Handle CORS errors specifically
  if (err.message && err.message.includes('CORS policy')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed by CORS policy',
      origin: req.headers.origin,
      allowedOrigins: allowedOrigins
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
      console.log('✅ Allowed origins:');
      allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
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