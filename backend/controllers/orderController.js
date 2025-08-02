const { Order, OrderItem } = require('../models');

module.exports = {
  createOrder: async (req, res) => {
    try {
      const { branch_id, user_id, table_id, status, type, total } = req.body;
      if (!branch_id || !type) return res.status(400).json({ error: 'branch_id and type required' });
      const order = await Order.create({ branch_id, user_id, table_id, status, type, total });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({ include: [OrderItem] });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, { include: [OrderItem] });
      if (!order) return res.status(404).json({ error: 'Not found' });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Not found' });
      await order.update(req.body);
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Not found' });
      await order.destroy();
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};