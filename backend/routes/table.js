// Table routes
const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.post('/', tableController.createTable);
router.get('/', tableController.getTables);
router.get('/:id', tableController.getTableById);
router.put('/:id', tableController.updateTable);
router.delete('/:id', tableController.deleteTable);

module.exports = router;