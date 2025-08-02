const { User, Role } = require('../models');
const { hashPassword } = require('../utils/auth');

module.exports = {
  createUser: async (req, res) => {
    try {
      const { name, email, password, role_id, company_id, branch_id } = req.body;
      if (!name || !email || !password || !role_id || !company_id) return res.status(400).json({ error: 'Missing fields' });
      const password_hash = await hashPassword(password);
      const user = await User.create({ name, email, password_hash, role_id, company_id, branch_id });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({ include: [Role] });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, { include: [Role] });
      if (!user) return res.status(404).json({ error: 'Not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: 'Not found' });
      await user.update(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: 'Not found' });
      await user.destroy();
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};