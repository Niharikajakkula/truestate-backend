/**
 * CSV Verification Script
 * Run this to verify CSV file location before deployment
 * Usage: node verify-csv.js
 */

const fs = require('fs');
const path = require('path');

console.log('=== CSV File Verification ===\n');

// Get project root (where this script is located)
const projectRoot = __dirname;
console.log('Project root:', projectRoot);

// Expected CSV path
const csvPath = path.join(projectRoot, 'data', 'sales_data.csv');
console.log('Expected CSV path:', csvPath);

// Check if file exists
if (fs.existsSync(csvPath)) {
  const stats = fs.statSync(csvPath);
  console.log('\n✓ CSV file found!');
  console.log('  File size:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
  console.log('  Last modified:', stats.mtime);
  
  // Try to read first few lines
  try {
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split('\n').slice(0, 3);
    console.log('\n✓ File is readable');
    console.log('  First 3 lines:');
    lines.forEach((line, i) => {
      console.log(`    ${i + 1}: ${line.substring(0, 80)}${line.length > 80 ? '...' : ''}`);
    });
  } catch (error) {
    console.error('\n❌ Error reading file:', error.message);
  }
} else {
  console.error('\n❌ CSV file NOT found!');
  console.error('\nPlease ensure:');
  console.error('1. File exists at: backend/data/sales_data.csv');
  console.error('2. File name is exactly: sales_data.csv (case-sensitive)');
  console.error('3. File is not empty');
  
  // List what's in the data directory
  const dataDir = path.join(projectRoot, 'data');
  if (fs.existsSync(dataDir)) {
    console.error('\nFiles in data/ directory:');
    const files = fs.readdirSync(dataDir);
    files.forEach(file => console.error(`  - ${file}`));
  } else {
    console.error('\n❌ data/ directory does not exist!');
  }
}

console.log('\n=== Verification Complete ===');
