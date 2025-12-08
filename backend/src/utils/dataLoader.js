const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const loadCSVData = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    console.log('Attempting to read file:', filePath);
    
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`File not found: ${filePath}`));
    }
    
    const stream = fs.createReadStream(filePath);
    
    stream.on('error', (error) => {
      console.error('Stream error:', error);
      reject(error);
    });
    
    stream
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        console.log(`Loaded ${results.length} records from CSV`);
        resolve(results);
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      });
  });
};

module.exports = { loadCSVData };
