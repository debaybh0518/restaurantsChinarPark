const express = require('express');
const router = express.Router();
const { Branch } = require('../models');

// GET /api/branches?company_id=5
router.get('/', async (req, res) => {
  try {
    const { company_id } = req.query;
    if (!company_id) return res.status(400).json({ error: 'company_id required' });
    const branches = await Branch.findAll({ where: { company_id } });
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;