const { getSalesData } = require('../models/salesData');

class SalesService {
  constructor() {
    this.filterOptionsCache = null;
    this.queryCache = new Map();
    this.maxCacheSize = 50;
  }

  getCacheKey(params) {
    return JSON.stringify({
      search: params.search,
      customerRegion: params.customerRegion,
      gender: params.gender,
      ageRange: params.ageRange,
      productCategory: params.productCategory,
      tags: params.tags,
      paymentMethod: params.paymentMethod,
      orderStatus: params.orderStatus,
      dateRange: params.dateRange,
      storeLocation: params.storeLocation,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      page: params.page,
      pageSize: params.pageSize,
    });
  }
  // Search functionality - optimized
  search(data, searchTerm) {
    if (!searchTerm) return data;
    
    const term = searchTerm.toLowerCase();
    const results = [];
    
    // Early exit optimization - stop after finding enough results
    for (let i = 0; i < data.length && results.length < 10000; i++) {
      const item = data[i];
      if ((item['Customer Name'] && item['Customer Name'].toLowerCase().includes(term)) ||
          (item['Phone Number'] && item['Phone Number'].toString().includes(term))) {
        results.push(item);
      }
    }
    
    return results;
  }

  // Filter functionality - optimized with single pass
  filter(data, filters) {
    // Check if any filters are active
    const hasFilters = 
      (filters.customerRegion && filters.customerRegion.length > 0) ||
      (filters.gender && filters.gender.length > 0) ||
      filters.ageRange ||
      (filters.productCategory && filters.productCategory.length > 0) ||
      (filters.tags && filters.tags.length > 0) ||
      (filters.paymentMethod && filters.paymentMethod.length > 0) ||
      (filters.orderStatus && filters.orderStatus.length > 0) ||
      (filters.storeLocation && filters.storeLocation.length > 0) ||
      filters.dateRange;

    if (!hasFilters) return data;

    // Convert arrays to Sets for faster lookup
    const regionSet = filters.customerRegion ? new Set(filters.customerRegion) : null;
    const genderSet = filters.gender ? new Set(filters.gender) : null;
    const categorySet = filters.productCategory ? new Set(filters.productCategory) : null;
    const tagsSet = filters.tags ? new Set(filters.tags) : null;
    const paymentSet = filters.paymentMethod ? new Set(filters.paymentMethod) : null;
    const orderStatusSet = filters.orderStatus ? new Set(filters.orderStatus) : null;
    const locationSet = filters.storeLocation ? new Set(filters.storeLocation) : null;

    const filtered = [];
    
    // Single pass filter with early exit
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let include = true;

      // Customer Region filter - case insensitive comparison
      if (regionSet) {
        const itemRegion = item['Customer Region'] ? item['Customer Region'].trim() : '';
        let found = false;
        for (const filterRegion of regionSet) {
          if (itemRegion.toLowerCase() === filterRegion.toLowerCase()) {
            found = true;
            break;
          }
        }
        if (!found) continue;
      }

      // Gender filter - case insensitive comparison
      if (genderSet) {
        const itemGender = item['Gender'] ? item['Gender'].trim() : '';
        let found = false;
        for (const filterGender of genderSet) {
          if (itemGender.toLowerCase() === filterGender.toLowerCase()) {
            found = true;
            break;
          }
        }
        if (!found) continue;
      }

      // Age Range filter
      if (filters.ageRange) {
        const age = parseInt(item['Age']);
        switch(filters.ageRange) {
          case 'below18': if (age >= 18) continue; break;
          case '18-25': if (age < 18 || age > 25) continue; break;
          case '26-35': if (age < 26 || age > 35) continue; break;
          case '36-45': if (age < 36 || age > 45) continue; break;
          case '46-60': if (age < 46 || age > 60) continue; break;
          case '60+': if (age < 60) continue; break;
        }
      }

      // Product Category filter - case insensitive comparison
      if (categorySet) {
        const itemCategory = item['Product Category'] ? item['Product Category'].trim() : '';
        let found = false;
        for (const filterCategory of categorySet) {
          if (itemCategory.toLowerCase() === filterCategory.toLowerCase()) {
            found = true;
            break;
          }
        }
        if (!found) continue;
      }

      // Tags filter - case insensitive comparison
      if (tagsSet) {
        const itemTags = item['Tags'] ? item['Tags'].trim() : '';
        let found = false;
        for (const filterTag of tagsSet) {
          if (itemTags.toLowerCase() === filterTag.toLowerCase()) {
            found = true;
            break;
          }
        }
        if (!found) continue;
      }

      // Payment Method filter - case insensitive comparison
      if (paymentSet) {
        const itemPayment = item['Payment Method'] ? item['Payment Method'].trim() : '';
        let found = false;
        for (const filterPayment of paymentSet) {
          if (itemPayment.toLowerCase() === filterPayment.toLowerCase()) {
            found = true;
            break;
          }
        }
        if (!found) continue;
      }

      // Order Status filter - case insensitive comparison
      if (orderStatusSet) {
        const itemStatus = item['Order Status'] ? item['Order Status'].trim() : '';
        let found = false;
        for (const filterStatus of orderStatusSet) {
          if (itemStatus.toLowerCase() === filterStatus.toLowerCase()) {
            found = true;
            break;
          }
        }
        if (!found) continue;
      }

      // Store Location filter - case insensitive comparison
      if (locationSet) {
        const itemLocation = item['Store Location'] ? item['Store Location'].trim() : '';
        let found = false;
        for (const filterLocation of locationSet) {
          if (itemLocation.toLowerCase() === filterLocation.toLowerCase()) {
            found = true;
            break;
          }
        }
        if (!found) continue;
      }

      // Date Range filter (by year)
      if (filters.dateRange) {
        const itemDate = new Date(item['Date']);
        const year = itemDate.getFullYear().toString();
        if (year !== filters.dateRange) {
          continue;
        }
      }

      filtered.push(item);
    }

    return filtered;
  }

  // Sort functionality - optimized
  sort(data, sortBy, sortOrder = 'asc') {
    // Don't copy array, sort in place for better performance
    const multiplier = sortOrder === 'desc' ? -1 : 1;

    switch (sortBy) {
      case 'date':
        data.sort((a, b) => {
          const dateA = new Date(a['Date']).getTime();
          const dateB = new Date(b['Date']).getTime();
          return (dateA - dateB) * multiplier;
        });
        break;

      case 'quantity':
        data.sort((a, b) => {
          const qtyA = parseInt(a['Quantity']) || 0;
          const qtyB = parseInt(b['Quantity']) || 0;
          return (qtyA - qtyB) * multiplier;
        });
        break;

      case 'customerName':
        data.sort((a, b) => {
          const nameA = (a['Customer Name'] || '').toLowerCase();
          const nameB = (b['Customer Name'] || '').toLowerCase();
          return nameA.localeCompare(nameB) * multiplier;
        });
        break;

      default:
        break;
    }

    return data;
  }

  // Pagination
  paginate(data, page = 1, pageSize = 10) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: data.slice(startIndex, endIndex),
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: data.length,
        totalPages: Math.ceil(data.length / pageSize),
        hasNext: endIndex < data.length,
        hasPrev: page > 1,
      },
    };
  }

  // Main query method - highly optimized with caching
  query(params) {
    const startTime = Date.now();
    
    // Check cache first
    const cacheKey = this.getCacheKey(params);
    if (this.queryCache.has(cacheKey)) {
      const cached = this.queryCache.get(cacheKey);
      console.log(`Query completed in ${Date.now() - startTime}ms - From cache`);
      return cached;
    }
    
    let data = getSalesData();

    // Apply search
    if (params.search) {
      data = this.search(data, params.search);
    }

    // Apply filters
    const filters = {
      customerRegion: params.customerRegion,
      gender: params.gender,
      ageRange: params.ageRange,
      productCategory: params.productCategory,
      tags: params.tags,
      paymentMethod: params.paymentMethod,
      orderStatus: params.orderStatus,
      storeLocation: params.storeLocation,
      dateRange: params.dateRange,
    };
    
    data = this.filter(data, filters);

    const page = parseInt(params.page) || 1;
    const pageSize = parseInt(params.pageSize) || 10;
    
    // For large datasets, use partial sort (only sort what we need)
    if (params.sortBy && data.length > 1000) {
      const result = this.partialSort(data, params.sortBy, params.sortOrder, page, pageSize);
      
      // Cache the result
      if (this.queryCache.size >= this.maxCacheSize) {
        const firstKey = this.queryCache.keys().next().value;
        this.queryCache.delete(firstKey);
      }
      this.queryCache.set(cacheKey, result);
      
      const endTime = Date.now();
      console.log(`Query completed in ${endTime - startTime}ms - Filtered: ${data.length} records (partial sort)`);
      return result;
    }

    // For smaller datasets, use full sort
    if (params.sortBy) {
      data = this.sort(data, params.sortBy, params.sortOrder);
    }
    
    const result = this.paginate(data, page, pageSize);
    
    // Cache the result
    if (this.queryCache.size >= this.maxCacheSize) {
      const firstKey = this.queryCache.keys().next().value;
      this.queryCache.delete(firstKey);
    }
    this.queryCache.set(cacheKey, result);
    
    const endTime = Date.now();
    console.log(`Query completed in ${endTime - startTime}ms - Filtered: ${data.length} records`);
    
    return result;
  }

  // Partial sort - only get the items we need using selection algorithm
  partialSort(data, sortBy, sortOrder, page, pageSize) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    const k = endIndex; // We need top k items
    
    // For first few pages, use quickselect which is O(n) average case
    if (startIndex < 100) {
      const multiplier = sortOrder === 'desc' ? -1 : 1;
      const compareFn = this.getCompareFnDirect(sortBy, multiplier);
      
      // Create a copy for the top k items
      const topK = this.quickSelect(data, k, compareFn);
      
      // Sort only the top k items
      topK.sort(compareFn);
      
      // Extract the page
      const pageData = topK.slice(startIndex, endIndex);
      
      return {
        data: pageData,
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalItems: data.length,
          totalPages: Math.ceil(data.length / pageSize),
          hasNext: endIndex < data.length,
          hasPrev: page > 1,
        },
      };
    }
    
    // For later pages, fall back to full sort (but cache it)
    const sorted = [...data].sort(this.getCompareFnDirect(sortBy, sortOrder === 'desc' ? -1 : 1));
    const pageData = sorted.slice(startIndex, endIndex);
    
    return {
      data: pageData,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: data.length,
        totalPages: Math.ceil(data.length / pageSize),
        hasNext: endIndex < data.length,
        hasPrev: page > 1,
      },
    };
  }

  // QuickSelect algorithm to find top k elements in O(n) average time
  quickSelect(data, k, compareFn) {
    // Sample-based approach for large datasets
    if (data.length > 100000) {
      // Take a sample, sort it, and use it to partition
      const sampleSize = Math.min(10000, Math.floor(data.length * 0.01));
      const sample = [];
      const step = Math.floor(data.length / sampleSize);
      
      for (let i = 0; i < data.length; i += step) {
        sample.push(data[i]);
      }
      
      sample.sort(compareFn);
      const pivotValue = sample[Math.min(k, sample.length - 1)];
      
      // Partition based on pivot
      const result = [];
      for (let i = 0; i < data.length && result.length < k; i++) {
        if (compareFn(data[i], pivotValue) <= 0) {
          result.push(data[i]);
        }
      }
      
      // If we don't have enough, add more
      if (result.length < k) {
        for (let i = 0; i < data.length && result.length < k; i++) {
          if (compareFn(data[i], pivotValue) > 0) {
            result.push(data[i]);
          }
        }
      }
      
      return result.slice(0, k);
    }
    
    // For smaller datasets, use standard approach
    const arr = [...data];
    this.quickSelectHelper(arr, 0, arr.length - 1, k, compareFn);
    return arr.slice(0, k);
  }

  quickSelectHelper(arr, left, right, k, compareFn) {
    if (left >= right) return;
    
    const pivotIndex = this.partition(arr, left, right, compareFn);
    
    if (pivotIndex === k - 1) return;
    else if (pivotIndex < k - 1) {
      this.quickSelectHelper(arr, pivotIndex + 1, right, k, compareFn);
    } else {
      this.quickSelectHelper(arr, left, pivotIndex - 1, k, compareFn);
    }
  }

  // Get comparison function that works directly on data objects
  getCompareFnDirect(sortBy, multiplier) {
    switch (sortBy) {
      case 'date':
        return (a, b) => {
          const dateA = new Date(a['Date']).getTime();
          const dateB = new Date(b['Date']).getTime();
          return (dateA - dateB) * multiplier;
        };
      case 'quantity':
        return (a, b) => {
          const qtyA = parseInt(a['Quantity']) || 0;
          const qtyB = parseInt(b['Quantity']) || 0;
          return (qtyA - qtyB) * multiplier;
        };
      case 'customerName':
        return (a, b) => {
          const nameA = (a['Customer Name'] || '').toLowerCase();
          const nameB = (b['Customer Name'] || '').toLowerCase();
          return nameA.localeCompare(nameB) * multiplier;
        };
      default:
        return (a, b) => 0;
    }
  }

  partition(arr, left, right, compareFn) {
    const pivot = arr[right];
    let i = left - 1;
    
    for (let j = left; j < right; j++) {
      if (compareFn(arr[j], pivot) <= 0) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    return i + 1;
  }

  // Get unique filter values - cached with normalized values
  getFilterOptions() {
    if (this.filterOptionsCache) {
      return this.filterOptionsCache;
    }

    const data = getSalesData();
    
    // Use Maps to track normalized values and their original forms
    const regionsMap = new Map();
    const gendersMap = new Map();
    const categoriesMap = new Map();
    const tagsMap = new Map();
    const paymentsMap = new Map();
    const locationsMap = new Map();
    
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      
      // Normalize and store unique values
      if (item['Customer Region']) {
        const normalized = item['Customer Region'].trim();
        const key = normalized.toLowerCase();
        if (!regionsMap.has(key)) regionsMap.set(key, normalized);
      }
      if (item['Gender']) {
        const normalized = item['Gender'].trim();
        const key = normalized.toLowerCase();
        if (!gendersMap.has(key)) gendersMap.set(key, normalized);
      }
      if (item['Product Category']) {
        const normalized = item['Product Category'].trim();
        const key = normalized.toLowerCase();
        if (!categoriesMap.has(key)) categoriesMap.set(key, normalized);
      }
      if (item['Tags']) {
        const normalized = item['Tags'].trim();
        const key = normalized.toLowerCase();
        if (!tagsMap.has(key)) tagsMap.set(key, normalized);
      }
      if (item['Payment Method']) {
        const normalized = item['Payment Method'].trim();
        const key = normalized.toLowerCase();
        if (!paymentsMap.has(key)) paymentsMap.set(key, normalized);
      }
      if (item['Store Location']) {
        const normalized = item['Store Location'].trim();
        const key = normalized.toLowerCase();
        if (!locationsMap.has(key)) locationsMap.set(key, normalized);
      }
    }
    
    this.filterOptionsCache = {
      customerRegions: Array.from(regionsMap.values()).sort(),
      genders: Array.from(gendersMap.values()).sort(),
      productCategories: Array.from(categoriesMap.values()).sort(),
      tags: Array.from(tagsMap.values()).sort(),
      paymentMethods: Array.from(paymentsMap.values()).sort(),
      storeLocations: Array.from(locationsMap.values()).sort(),
    };
    
    return this.filterOptionsCache;
  }
}

module.exports = new SalesService();
