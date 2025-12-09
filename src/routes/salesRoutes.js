const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Async error wrapper to catch errors in async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Public routes - no authentication required
router.get('/', asyncHandler(salesController.getSales.bind(salesController)));
router.get('/filters', asyncHandler(salesController.getFilterOptions.bind(salesController)));

module.exports = router;
