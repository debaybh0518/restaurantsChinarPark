// Category controller
const { Category } = require('../models');

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
