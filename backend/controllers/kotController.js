const { KOT, Order } = require('../models');
const { MenuItem, OrderMenuItem } = require('../models');

module.exports = {
  createKOT: async (req, res) => {
    try {
      const { order_id, status } = req.body;
      if (!order_id) return res.status(400).json({ error: 'order_id required' });
      const kot = await KOT.create({ order_id, status: status || 'pending' });
      res.json(kot);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getKOTs: async (req, res) => {
    try {
      const kots = await KOT.findAll({ include: [Order] });
      res.json(kots);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getKOTById: async (req, res) => {
    try {
      const kot = await KOT.findByPk(req.params.id, { include: [Order] });
      if (!kot) return res.status(404).json({ error: 'Not found' });
      res.json(kot);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateKOT: async (req, res) => {
    try {
      const kot = await KOT.findByPk(req.params.id);
      if (!kot) return res.status(404).json({ error: 'Not found' });
      await kot.update(req.body);
      res.json(kot);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // KOT (Order) controller
  createOrder: async (req, res) => {
    try {
      const { items } = req.body; // items: [{menu_item_id, quantity}]
      if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });
      let total = 0;
      for (const i of items) {
        const menuItem = await MenuItem.findByPk(i.menu_item_id);
        if (!menuItem) return res.status(400).json({ error: 'Invalid menu item' });
        total += menuItem.price * i.quantity;
      }
      const order = await Order.create({ total_price: total, status: 'Pending' });
      for (const i of items) {
        await OrderMenuItem.create({ order_id: order.id, menu_item_id: i.menu_item_id, quantity: i.quantity });
      }
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [{ model: MenuItem, through: { attributes: ['quantity'] } }],
        order: [['created_at', 'DESC']]
      });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Not found' });
      order.status = req.body.status;
      await order.save();
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