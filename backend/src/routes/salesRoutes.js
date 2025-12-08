const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Public routes - no authentication required
router.get('/', (req, res) => salesController.getSales(req, res));
router.get('/filters', (req, res) => salesController.getFilterOptions(req, res));

module.exports = router;
