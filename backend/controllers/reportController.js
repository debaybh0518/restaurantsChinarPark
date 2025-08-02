const { Order, KOT, Inventory, Payment } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  getSalesReport: async (req, res) => {
    try {
      const payments = await Payment.findAll();
      const total = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
      res.json({ total, count: payments.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getKOTReport: async (req, res) => {
    try {
      const kots = await KOT.findAll();
      const byStatus = kots.reduce((acc, k) => {
        acc[k.status] = (acc[k.status] || 0) + 1;
        return acc;
      }, {});
      res.json(byStatus);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getInventoryReport: async (req, res) => {
    try {
      const items = await Inventory.findAll();
      const lowStock = items.filter(i => Number(i.quantity) <= Number(i.low_stock_threshold)).length;
      const available = items.length - lowStock;
      res.json({ available, low: lowStock });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};