const { Menu, MenuItem } = require('../models');

module.exports = {
  createMenu: async (req, res) => {
    try {
      const { name, category, branch_id } = req.body;
      if (!name || !branch_id) return res.status(400).json({ error: 'Name and branch_id required' });
      const menu = await Menu.create({ name, category, branch_id });
      res.json(menu);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getMenus: async (req, res) => {
    try {
      const menus = await Menu.findAll({ include: [MenuItem] });
      res.json(menus);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getMenuById: async (req, res) => {
    try {
      const menu = await Menu.findByPk(req.params.id, { include: [MenuItem] });
      if (!menu) return res.status(404).json({ error: 'Not found' });
      res.json(menu);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateMenu: async (req, res) => {
    try {
      const menu = await Menu.findByPk(req.params.id);
      if (!menu) return res.status(404).json({ error: 'Not found' });
      await menu.update(req.body);
      res.json(menu);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteMenu: async (req, res) => {
    try {
      const menu = await Menu.findByPk(req.params.id);
      if (!menu) return res.status(404).json({ error: 'Not found' });
      await menu.destroy();
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};