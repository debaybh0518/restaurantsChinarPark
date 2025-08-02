// KOT routes
const express = require('express');
const router = express.Router();
const kotController = require('../controllers/kotController');

router.post('/', kotController.createKOT);
router.get('/', kotController.getKOTs);
router.get('/:id', kotController.getKOTById);
router.put('/:id', kotController.updateKOT);
router.patch('/:id/status', kotController.updateOrderStatus);
router.delete('/:id', kotController.deleteOrder);

module.exports = router;