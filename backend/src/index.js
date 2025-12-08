const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const { loadCSVData } = require('./utils/dataLoader');
const { setSalesData } = require('./models/salesData');
const salesRoutes = require('./routes/salesRoutes');

console.log('Starting server...');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(compression({ level: 6, threshold: 1024 })); // Faster compression
app.use(cors({ maxAge: 86400 })); // Cache CORS preflight for 24h
app.use(express.json({ limit: '1mb' }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'TruEstate Retail Sales Management API',
    endpoints: {
      sales: '/api/sales',
      filters: '/api/sales/filters'
    }
  });
});

app.use('/api/sales', salesRoutes);

// Initialize data and start server
const initializeServer = async () => {
  try {
    console.log('=== Server Initialization ===');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Port:', PORT);
    
    // Load CSV data (automatically detects chunked or single file)
    console.log('Node version:', process.version);
    console.log('Memory limit:', `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log('\n=== Loading CSV Data ===');
    
    const startTime = Date.now();
    const data = await loadCSVData();
    const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    // Validate data
    if (!data || data.length === 0) {
      throw new Error('No data loaded from CSV file');
    }
    
    setSalesData(data);
    console.log(`\n✓ Data loaded in ${loadTime}s`);
    console.log(`✓ Total records in memory: ${data.length.toLocaleString()}`);
    
    // Start server only after data is loaded
    console.log('\n=== Starting Server ===');
    
    const server = app.listen(PORT);
    
    // Handle server errors BEFORE listening callback
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use`);
        console.error('Please stop the other process or use a different port');
        console.error('\nTo find and kill the process:');
        console.error('Windows: netstat -ano | findstr :5002');
        console.error('Then: taskkill /PID <PID> /F');
      } else {
        console.error('❌ Server error:', err.message);
      }
      process.exit(1);
    });
    
    // Success callback only fires if no error
    server.on('listening', () => {
      console.log('✓ Server successfully started!');
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ API endpoint: http://localhost:${PORT}/api/sales`);
      console.log(`✓ Health check: http://localhost:${PORT}/`);
      console.log(`✓ Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
      console.log('\n=== Server Ready ===');
    });
  } catch (error) {
    console.error('\n=== Server Initialization Failed ===');
    console.error('❌ Error:', error.message);
    console.error('\nPossible causes:');
    console.error('1. CSV file not found in backend/data/sales_data.csv');
    console.error('2. CSV file is corrupted or has invalid format');
    console.error('3. Insufficient permissions to read the file');
    console.error('\nPlease fix the issue and restart the server.');
    process.exit(1);
  }
};

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

initializeServer();
