// MenuItem controller
const { MenuItem } = require('../models');
const fs = require('fs');
const csv = require('csv-parser');

module.exports = {
  createMenuItem: async (req, res) => {
    try {
      const { name, price, description, category_id, image_url, is_active } = req.body;
      if (!name || !price || !description || !category_id) return res.status(400).json({ error: 'All fields required' });
      const menuItem = await MenuItem.create({ name, price, description, category_id, image_url, is_active });
      res.json(menuItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getMenuItems: async (req, res) => {
    try {
      const items = await MenuItem.findAll();
      res.json(items);
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
  bulkUpload: async (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          for (const row of results) {
            if (!row.name || !row.price || !row.description || !row.category_id) continue;
            await MenuItem.create({
              name: row.name,
              price: parseFloat(row.price),
              description: row.description,
              category_id: row.category_id,
              image_url: row.image_url || null,
              is_active: row.is_active !== undefined ? row.is_active : true
            });
          }
          res.json({ message: 'Bulk upload complete', count: results.length });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      });
  },
  uploadImage: async (req, res) => {
    try {
      const { id } = req.params;
      const imageUrl = `/uploads/${req.file.filename}`;
      await MenuItem.update({ image_url: imageUrl }, { where: { id } });
      res.json({ image_url: imageUrl });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
