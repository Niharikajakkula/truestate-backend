const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * Load a single CSV file
 */
const loadSingleCSV = (absolutePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    if (!fs.existsSync(absolutePath)) {
      return reject(new Error(`CSV file not found at: ${absolutePath}`));
    }
    
    const stream = fs.createReadStream(absolutePath);
    
    stream.on('error', (error) => {
      reject(new Error(`Failed to read CSV file: ${error.message}`));
    });
    
    stream
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      });
  });
};

/**
 * Load CSV data from chunked files (memory-efficient)
 * Loads sales_data_part1.csv, sales_data_part2.csv, etc.
 */
const loadCSVData = async () => {
  console.log('=== CSV Loading (Chunked Mode) ===');
  
  // Construct path to data directory
  const projectRoot = path.resolve(__dirname, '..', '..');
  const dataDir = path.join(projectRoot, 'data');
  
  console.log('Project root:', projectRoot);
  console.log('Data directory:', dataDir);
  
  // Find all CSV part files
  const files = fs.readdirSync(dataDir)
    .filter(file => file.match(/^sales_data_part\d+\.csv$/))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });
  
  if (files.length === 0) {
    // Fallback to single file if no parts found
    console.log('⚠️  No chunked files found, trying single file...');
    const singleFile = path.join(dataDir, 'sales_data.csv');
    if (fs.existsSync(singleFile)) {
      console.log('✓ Loading from single file:', singleFile);
      const data = await loadSingleCSV(singleFile);
      console.log(`✓ Successfully loaded ${data.length.toLocaleString()} records`);
      return data;
    }
    throw new Error('No CSV files found in data directory');
  }
  
  console.log(`✓ Found ${files.length} CSV part files`);
  console.log('');
  
  // Load all parts sequentially
  let allData = [];
  let totalRecords = 0;
  
  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filepath = path.join(dataDir, filename);
    const fileStats = fs.statSync(filepath);
    
    console.log(`[${i + 1}/${files.length}] Loading ${filename} (${(fileStats.size / 1024 / 1024).toFixed(2)} MB)...`);
    
    try {
      const partData = await loadSingleCSV(filepath);
      allData = allData.concat(partData);
      totalRecords += partData.length;
      
      console.log(`    ✓ Loaded ${partData.length.toLocaleString()} records (Total: ${totalRecords.toLocaleString()})`);
      
      // Force garbage collection hint (if available)
      if (global.gc) {
        global.gc();
      }
    } catch (error) {
      console.error(`    ❌ Failed to load ${filename}:`, error.message);
      throw error;
    }
  }
  
  console.log('');
  console.log(`✓ All CSV parts loaded successfully!`);
  console.log(`  Total files: ${files.length}`);
  console.log(`  Total records: ${totalRecords.toLocaleString()}`);
  console.log(`  Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
  
  return allData;
};

module.exports = { loadCSVData };
