const streamingLoader = require('../utils/streamingDataLoader');

class SalesController {
  // Get sales data with search, filter, sort, pagination
  async getSales(req, res) {
    try {
      // Validate pagination parameters
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize) || 10));
      
      const filters = {
        customerRegion: req.query.customerRegion ? req.query.customerRegion.split(',').map(s => s.trim()) : undefined,
        gender: req.query.gender ? req.query.gender.split(',').map(s => s.trim()) : undefined,
        ageRange: req.query.ageRange ? req.query.ageRange.split(',').map(s => s.trim()) : undefined,
        productCategory: req.query.productCategory ? req.query.productCategory.split(',').map(s => s.trim()) : undefined,
        tags: req.query.tags ? req.query.tags.split(',').map(s => s.trim()) : undefined,
        paymentMethod: req.query.paymentMethod ? req.query.paymentMethod.split(',').map(s => s.trim()) : undefined,
        orderStatus: req.query.orderStatus ? req.query.orderStatus.split(',').map(s => s.trim()) : undefined,
        storeLocation: req.query.storeLocation ? req.query.storeLocation.split(',').map(s => s.trim()) : undefined,
        dateRange: req.query.dateRange ? req.query.dateRange.split(',').map(s => s.trim()) : undefined,
      };

      const search = req.query.search || '';
      const sortBy = req.query.sortBy || 'date';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await streamingLoader.queryData(filters, search, sortBy, sortOrder, page, pageSize);
      
      // Ensure we always return valid JSON
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid data returned from query');
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error in getSales:', error);
      res.status(500).json({ 
        error: 'Failed to fetch sales data',
        message: error.message,
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      });
    }
  }

  // Get filter options
  async getFilterOptions(req, res) {
    try {
      const options = await streamingLoader.getFilterOptions();
      
      // Ensure we always return valid JSON with expected structure
      if (!options || typeof options !== 'object') {
        throw new Error('Invalid filter options data');
      }
      
      res.json({
        customerRegions: options.customerRegions || [],
        genders: options.genders || [],
        productCategories: options.productCategories || [],
        tags: options.tags || [],
        paymentMethods: options.paymentMethods || [],
        storeLocations: options.storeLocations || []
      });
    } catch (error) {
      console.error('Error in getFilterOptions:', error);
      res.status(500).json({ 
        error: 'Failed to fetch filter options',
        message: error.message,
        customerRegions: [],
        genders: [],
        productCategories: [],
        tags: [],
        paymentMethods: [],
        storeLocations: []
      });
    }
  }
}

module.exports = new SalesController();
