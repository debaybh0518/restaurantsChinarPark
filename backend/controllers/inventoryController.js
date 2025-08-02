const { Inventory } = require('../models');

module.exports = {
  createInventory: async (req, res) => {
    try {
      const { name, quantity, unit, branch_id, low_stock_threshold } = req.body;
      if (!name || !quantity || !branch_id) return res.status(400).json({ error: 'Missing fields' });
      const item = await Inventory.create({ name, quantity, unit, branch_id, low_stock_threshold });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getInventory: async (req, res) => {
    try {
      const items = await Inventory.findAll();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getInventoryById: async (req, res) => {
    try {
      const item = await Inventory.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateInventory: async (req, res) => {
    try {
      const item = await Inventory.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      await item.update(req.body);
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteInventory: async (req, res) => {
    try {
      const item = await Inventory.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      await item.destroy();
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};