const streamingLoader = require('../utils/streamingDataLoader');

class SalesController {
  // Get sales data with search, filter, sort, pagination
  async getSales(req, res) {
    try {
      const filters = {
        customerRegion: req.query.customerRegion ? req.query.customerRegion.split(',') : undefined,
        gender: req.query.gender ? req.query.gender.split(',') : undefined,
        ageRange: req.query.ageRange,
        productCategory: req.query.productCategory ? req.query.productCategory.split(',') : undefined,
        tags: req.query.tags ? req.query.tags.split(',') : undefined,
        paymentMethod: req.query.paymentMethod ? req.query.paymentMethod.split(',') : undefined,
        orderStatus: req.query.orderStatus ? req.query.orderStatus.split(',') : undefined,
        storeLocation: req.query.storeLocation ? req.query.storeLocation.split(',') : undefined,
        dateRange: req.query.dateRange,
      };

      const search = req.query.search || '';
      const sortBy = req.query.sortBy || 'date';
      const sortOrder = req.query.sortOrder || 'desc';
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const result = await streamingLoader.queryData(filters, search, sortBy, sortOrder, page, pageSize);
      res.json(result);
    } catch (error) {
      console.error('Error in getSales:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get filter options
  async getFilterOptions(req, res) {
    try {
      const options = await streamingLoader.getFilterOptions();
      res.json(options);
    } catch (error) {
      console.error('Error in getFilterOptions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new SalesController();
