/**
 * CSV Splitter Script
 * Splits large CSV file into smaller chunks for memory-efficient loading
 * Usage: node split-csv.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CHUNK_SIZE = 50000; // Rows per file (smaller chunks for better memory management)
const INPUT_FILE = path.join(__dirname, 'data', 'sales_data.csv');
const OUTPUT_DIR = path.join(__dirname, 'data');

async function splitCSV() {
  console.log('=== CSV Splitter ===\n');
  console.log('Input file:', INPUT_FILE);
  console.log('Chunk size:', CHUNK_SIZE, 'rows per file\n');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error('❌ Input file not found:', INPUT_FILE);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(INPUT_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let header = '';
  let currentChunk = [];
  let currentFile = 1;
  let totalRows = 0;
  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      header = line;
      isFirstLine = false;
      console.log('✓ Header extracted');
      continue;
    }

    currentChunk.push(line);
    totalRows++;

    if (currentChunk.length >= CHUNK_SIZE) {
      await writeChunk(currentFile, header, currentChunk);
      currentFile++;
      currentChunk = [];
    }

    // Progress indicator
    if (totalRows % 100000 === 0) {
      process.stdout.write(`\rProcessed: ${totalRows.toLocaleString()} rows...`);
    }
  }

  // Write remaining rows
  if (currentChunk.length > 0) {
    await writeChunk(currentFile, header, currentChunk);
    currentFile++; // Increment after writing last chunk
  }

  const totalFiles = currentFile - 1; // Adjust for 1-based indexing

  console.log(`\n\n✓ Split complete!`);
  console.log(`  Total rows: ${totalRows.toLocaleString()}`);
  console.log(`  Total files: ${totalFiles}`);
  console.log(`  Output directory: ${OUTPUT_DIR}`);
  console.log(`\nFiles created:`);
  for (let i = 1; i <= totalFiles; i++) {
    const filename = `sales_data_part${i}.csv`;
    const filepath = path.join(OUTPUT_DIR, filename);
    const stats = fs.statSync(filepath);
    console.log(`  - ${filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  }
}

async function writeChunk(fileNumber, header, rows) {
  const filename = `sales_data_part${fileNumber}.csv`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  const content = [header, ...rows].join('\n') + '\n';
  fs.writeFileSync(filepath, content, 'utf8');
  
  console.log(`\n✓ Created: ${filename} (${rows.length.toLocaleString()} rows)`);
}

// Run the splitter
splitCSV().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
