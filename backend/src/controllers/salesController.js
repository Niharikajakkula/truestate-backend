const salesService = require('../services/salesService');

class SalesController {
  // Get sales data with search, filter, sort, pagination
  getSales(req, res) {
    try {
      const params = {
        search: req.query.search,
        customerRegion: req.query.customerRegion ? req.query.customerRegion.split(',') : undefined,
        gender: req.query.gender ? req.query.gender.split(',') : undefined,
        ageRange: req.query.ageRange,
        productCategory: req.query.productCategory ? req.query.productCategory.split(',') : undefined,
        tags: req.query.tags ? req.query.tags.split(',') : undefined,
        paymentMethod: req.query.paymentMethod ? req.query.paymentMethod.split(',') : undefined,
        orderStatus: req.query.orderStatus ? req.query.orderStatus.split(',') : undefined,
        storeLocation: req.query.storeLocation ? req.query.storeLocation.split(',') : undefined,
        dateRange: req.query.dateRange,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder || 'asc',
        page: req.query.page,
        pageSize: req.query.pageSize,
      };

      const result = salesService.query(params);
      res.json(result);
    } catch (error) {
      console.error('Error in getSales:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get filter options
  getFilterOptions(req, res) {
    try {
      const options = salesService.getFilterOptions();
      res.json(options);
    } catch (error) {
      console.error('Error in getFilterOptions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new SalesController();
