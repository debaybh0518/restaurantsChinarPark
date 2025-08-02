// Notification routes
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/email', notificationController.sendEmail);
router.post('/sms', notificationController.sendSMS);
router.get('/', notificationController.getNotifications);

module.exports = router;