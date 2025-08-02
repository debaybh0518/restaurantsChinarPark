// Payment routes
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/initiate', paymentController.initiatePayment);
router.post('/confirm', paymentController.confirmPayment);
router.get('/', paymentController.getPayments);

module.exports = router;