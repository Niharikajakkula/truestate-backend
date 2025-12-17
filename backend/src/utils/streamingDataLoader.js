const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * Stream CSV files and apply filters on-the-fly
 * Memory efficient - doesn't load entire dataset
 */
class StreamingDataLoader {
  constructor() {
    this.dataDir = path.resolve(__dirname, '..', '..', 'data');
    this.csvFiles = [];
    this.filterOptionsCache = null;
  }

  /**
   * Initialize - find all CSV files
   */
  initialize() {
    console.log('=== Streaming Data Loader Initialized ===');
    console.log('Data directory:', this.dataDir);

    // Find all CSV part files
    this.csvFiles = fs.readdirSync(this.dataDir)
      .filter(file => file.match(/^sales_data_part\d+\.csv$/))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
      })
      .map(file => path.join(this.dataDir, file));

    // Fallback to single file
    if (this.csvFiles.length === 0) {
      const singleFile = path.join(this.dataDir, 'sales_data.csv');
      if (fs.existsSync(singleFile)) {
        this.csvFiles = [singleFile];
      }
    }

    console.log(`✓ Found ${this.csvFiles.length} CSV file(s)`);
    console.log(`✓ Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
  }

  /**
   * Stream through CSV files and collect matching records (MEMORY SAFE)
   */
  async queryData(filters = {}, search = '', sortBy = 'date', sortOrder = 'desc', page = 1, pageSize = 10) {
    const results = [];
    const maxResults = pageSize * 10; // ✅ LIMIT: Only keep 100 results max in memory

    // Stream through each CSV file
    for (const csvFile of this.csvFiles) {
      const fileResults = await this.streamFile(csvFile, filters, search, maxResults - results.length);
      results.push(...fileResults);

      // ✅ MEMORY PROTECTION: Stop if we have enough results
      if (results.length >= maxResults) {
        break;
      }
    }

    // Apply sorting
    this.sortData(results, sortBy, sortOrder);

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = results.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: results.length, // ✅ Show actual found items (not total in DB)
        totalPages: Math.ceil(results.length / pageSize),
        hasNext: endIndex < results.length,
        hasPrev: page > 1,
      }
    };
  }

  /**
   * Stream a single CSV file and filter on-the-fly (MEMORY SAFE)
   */
  streamFile(filePath, filters, search, maxResults = 100) {
    return new Promise((resolve, reject) => {
      const results = [];
      
      const stream = fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // Apply filters
          if (this.matchesFilters(row, filters, search)) {
            results.push(row);
            
            // ✅ MEMORY PROTECTION: Stop reading if we have enough results
            if (results.length >= maxResults) {
              stream.destroy(); // Stop reading the file
            }
          }
        })
        .on('end', () => {
          resolve(results);
        })
        .on('close', () => {
          resolve(results); // Handle early termination
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Check if a row matches filters
   */
  matchesFilters(row, filters, search) {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const nameMatch = row['Customer Name'] && row['Customer Name'].toLowerCase().includes(searchLower);
      const phoneMatch = row['Phone Number'] && row['Phone Number'].toString().includes(search);
      if (!nameMatch && !phoneMatch) return false;
    }

    // Customer Region
    if (filters.customerRegion && filters.customerRegion.length > 0) {
      const rowRegion = (row['Customer Region'] || '').trim().toLowerCase();
      const match = filters.customerRegion.some(f => f.toLowerCase() === rowRegion);
      if (!match) return false;
    }

    // Gender
    if (filters.gender && filters.gender.length > 0) {
      const rowGender = (row['Gender'] || '').trim().toLowerCase();
      const match = filters.gender.some(f => f.toLowerCase() === rowGender);
      if (!match) return false;
    }

    // Age Range - now supports multiple selections
    if (filters.ageRange && filters.ageRange.length > 0) {
      const age = parseInt(row['Age']);
      let ageMatches = false;
      
      for (const range of filters.ageRange) {
        switch(range) {
          case 'below18': if (age < 18) ageMatches = true; break;
          case '18-25': if (age >= 18 && age <= 25) ageMatches = true; break;
          case '26-35': if (age >= 26 && age <= 35) ageMatches = true; break;
          case '36-45': if (age >= 36 && age <= 45) ageMatches = true; break;
          case '46-60': if (age >= 46 && age <= 60) ageMatches = true; break;
          case '60+': if (age > 60) ageMatches = true; break;
        }
        if (ageMatches) break;
      }
      
      if (!ageMatches) return false;
    }

    // Product Category
    if (filters.productCategory && filters.productCategory.length > 0) {
      const rowCategory = (row['Product Category'] || '').trim().toLowerCase();
      const match = filters.productCategory.some(f => f.toLowerCase() === rowCategory);
      if (!match) return false;
    }

    // Payment Method
    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
      const rowPayment = (row['Payment Method'] || '').trim().toLowerCase();
      const match = filters.paymentMethod.some(f => f.toLowerCase() === rowPayment);
      if (!match) return false;
    }

    // Order Status
    if (filters.orderStatus && filters.orderStatus.length > 0) {
      const rowStatus = (row['Order Status'] || '').trim().toLowerCase();
      const match = filters.orderStatus.some(f => f.toLowerCase() === rowStatus);
      if (!match) return false;
    }

    // Store Location
    if (filters.storeLocation && filters.storeLocation.length > 0) {
      const rowLocation = (row['Store Location'] || '').trim().toLowerCase();
      const match = filters.storeLocation.some(f => f.toLowerCase() === rowLocation);
      if (!match) return false;
    }

    // Date Range - now supports multiple years
    if (filters.dateRange && filters.dateRange.length > 0) {
      const itemDate = new Date(row['Date']);
      const year = itemDate.getFullYear().toString();
      if (!filters.dateRange.includes(year)) return false;
    }

    return true;
  }

  /**
   * Sort data in place
   */
  sortData(data, sortBy, sortOrder) {
    const multiplier = sortOrder === 'desc' ? -1 : 1;

    data.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          const dateA = new Date(a['Date']).getTime();
          const dateB = new Date(b['Date']).getTime();
          return (dateA - dateB) * multiplier;

        case 'quantity':
          const qtyA = parseInt(a['Quantity']) || 0;
          const qtyB = parseInt(b['Quantity']) || 0;
          return (qtyA - qtyB) * multiplier;

        case 'customerName':
          const nameA = (a['Customer Name'] || '').toLowerCase();
          const nameB = (b['Customer Name'] || '').toLowerCase();
          return nameA.localeCompare(nameB) * multiplier;

        default:
          return 0;
      }
    });
  }

  /**
   * Get filter options (cached)
   */
  async getFilterOptions() {
    if (this.filterOptionsCache) {
      return this.filterOptionsCache;
    }

    console.log('Building filter options cache...');
    
    const regions = new Set();
    const genders = new Set();
    const categories = new Set();
    const tags = new Set();
    const payments = new Set();
    const locations = new Set();

    // Stream through first file only for filter options (faster)
    const firstFile = this.csvFiles[0];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(firstFile)
        .pipe(csv())
        .on('data', (row) => {
          if (row['Customer Region']) regions.add(row['Customer Region'].trim());
          if (row['Gender']) genders.add(row['Gender'].trim());
          if (row['Product Category']) categories.add(row['Product Category'].trim());
          if (row['Tags']) tags.add(row['Tags'].trim());
          if (row['Payment Method']) payments.add(row['Payment Method'].trim());
          if (row['Store Location']) locations.add(row['Store Location'].trim());
        })
        .on('end', resolve)
        .on('error', reject);
    });

    this.filterOptionsCache = {
      customerRegions: Array.from(regions).sort(),
      genders: Array.from(genders).sort(),
      productCategories: Array.from(categories).sort(),
      tags: Array.from(tags).sort(),
      paymentMethods: Array.from(payments).sort(),
      storeLocations: Array.from(locations).sort(),
    };

    console.log('✓ Filter options cached');
    return this.filterOptionsCache;
  }
}

module.exports = new StreamingDataLoader();
