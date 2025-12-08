const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * Load CSV data from file
 * Automatically resolves path relative to project root
 */
const loadCSVData = (relativePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    // Construct absolute path from project root
    // __dirname is backend/src/utils, so go up 2 levels to backend/
    const projectRoot = path.resolve(__dirname, '..', '..');
    const absolutePath = path.join(projectRoot, relativePath);
    
    console.log('=== CSV Loading ===');
    console.log('Project root:', projectRoot);
    console.log('Attempting to read file:', absolutePath);
    
    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      const error = new Error(`CSV file not found at: ${absolutePath}`);
      console.error('❌ File not found!');
      console.error('Please ensure sales_data.csv exists in backend/data/');
      return reject(error);
    }
    
    console.log('✓ File found, starting to read...');
    
    // Create read stream
    const stream = fs.createReadStream(absolutePath);
    
    // Handle stream errors
    stream.on('error', (error) => {
      console.error('❌ Stream error:', error.message);
      reject(new Error(`Failed to read CSV file: ${error.message}`));
    });
    
    // Parse CSV
    stream
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        if (results.length === 0) {
          console.warn('⚠️  Warning: CSV file is empty');
        } else {
          console.log(`✓ Successfully loaded ${results.length} records from CSV`);
        }
        resolve(results);
      })
      .on('error', (error) => {
        console.error('❌ CSV parsing error:', error.message);
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      });
  });
};

module.exports = { loadCSVData };
