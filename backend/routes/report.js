// Report routes
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/sales', reportController.getSalesReport);
router.get('/kots', reportController.getKOTReport);
router.get('/inventory', reportController.getInventoryReport);

module.exports = router;