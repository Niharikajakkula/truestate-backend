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
    // Load CSV data
    const csvPath = path.join(__dirname, '../data/sales_data.csv');
    console.log('Loading data from:', csvPath);
    
    const data = await loadCSVData(csvPath);
    setSalesData(data);
    
    console.log(`Successfully loaded ${data.length} sales records`);
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Visit http://localhost:${PORT} to test`);
      console.log(`API endpoint: http://localhost:${PORT}/api/sales`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
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
