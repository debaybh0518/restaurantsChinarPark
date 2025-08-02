// Category controller
const { Category, MenuItem } = require('../models');

module.exports = {
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: 'Name required' });
      const category = await Category.create({ name });
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Not found' });
      await category.update(req.body);
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Not found' });
      await category.destroy();
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
// MenuItem controller
module.exports = {
  createMenuItem: async (req, res) => {
    try {
      const { name, price, description, category_id } = req.body;
      if (!name || !price || !description || !category_id) return res.status(400).json({ error: 'All fields required' });
      if (price <= 0) return res.status(400).json({ error: 'Price must be > 0' });
      const menuItem = await MenuItem.create({ name, price, description, category_id });
      res.json(menuItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getMenuItems: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', category = '' } = req.query;
      const where = {};
      if (search) where.name = { $like: `%${search}%` };
      if (category) where.category_id = category;
      const { count, rows } = await MenuItem.findAndCountAll({
        where,
        include: [{ model: Category }],
        offset: (page - 1) * limit,
        limit: parseInt(limit),
      });
      res.json({ total: count, items: rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateMenuItem: async (req, res) => {
    try {
      const menuItem = await MenuItem.findByPk(req.params.id);
      if (!menuItem) return res.status(404).json({ error: 'Not found' });
      await menuItem.update(req.body);
      res.json(menuItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteMenuItem: async (req, res) => {
    try {
      const menuItem = await MenuItem.findByPk(req.params.id);
      if (!menuItem) return res.status(404).json({ error: 'Not found' });
      await menuItem.destroy();
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
