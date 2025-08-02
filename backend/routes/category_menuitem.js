// Only category routes here
const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoryController');

router.post('/', controller.createCategory);
router.get('/', controller.getCategories);
router.put('/:id', controller.updateCategory);
router.delete('/:id', controller.deleteCategory);

module.exports = router;
