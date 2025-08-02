// MenuItem routes
const express = require('express');
const router = express.Router();
const controller = require('../controllers/menuItemController');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

router.post('/', controller.createMenuItem);
router.get('/', controller.getMenuItems);
router.put('/:id', controller.updateMenuItem);
router.delete('/:id', controller.deleteMenuItem);
router.post('/bulk-upload', upload.single('file'), controller.bulkUpload);
router.post('/:id/image', upload.single('image'), controller.uploadImage);

module.exports = router;
