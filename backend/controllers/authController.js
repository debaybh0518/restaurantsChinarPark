const { User, Company, Branch, Role } = require('../models');
const { hashPassword, generateJWT, comparePassword } = require('../utils/auth');
const jwt = require('jsonwebtoken');

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password, company: companyName } = req.body;
      if (!name || !email || !password || !companyName) return res.status(400).json({ error: 'All fields required' });
      // Create company
      const company = await Company.create({ name: companyName });
      // Create branch (main branch)
      const branch = await Branch.create({ name: companyName, company_id: company.company_id });
      // Get super_admin role
      const role = await Role.findOne({ where: { name: 'super_admin' } });
      // Create super user
      const password_hash = await hashPassword(password);
      const user = await User.create({ name, email, password_hash, role_id: role.role_id, company_id: company.company_id, branch_id: branch.branch_id });
      // JWT
      const accessToken = generateJWT({ user_id: user.user_id, role: 'super_admin', company_id: company.company_id, branch_id: branch.branch_id });
      res.json({ user, accessToken });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email }, include: [Role] });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const valid = await comparePassword(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
      const accessToken = generateJWT({ user_id: user.user_id, role: user.Role.name, company_id: user.company_id, branch_id: user.branch_id });
      res.json({ user, accessToken });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  logout: async (req, res) => {
    // For JWT, logout is handled client-side (token removal)
    res.json({ message: 'Logged out' });
  },
  onboarding: async (req, res) => {
    try {
      const { company, companyPhone, name, email, password, phone, address, branches } = req.body;
      // Check if company or email already exists
      const exists = await Company.findOne({ where: { name: company } });
      if (exists) return res.status(400).json({ error: 'Company already exists' });
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) return res.status(400).json({ error: 'Email already exists' });
      // Create company with intended number of branches
      const newCompany = await Company.create({ name: company, contact: companyPhone, num_branches: branches });
      // Do NOT create main branch automatically
      // Get super_admin role
      const role = await Role.findOne({ where: { name: 'super_admin' } });
      // Create super admin user
      const password_hash = await hashPassword(password);
      const user = await User.create({ name, email, password_hash, role_id: role.role_id, company_id: newCompany.company_id, branch_id: mainBranch.branch_id, phone });
      // JWT
      const accessToken = generateJWT({ user_id: user.user_id, role: 'super_admin', company_id: newCompany.company_id, branch_id: mainBranch.branch_id });
      res.json({ company: newCompany, user, accessToken, branches });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};