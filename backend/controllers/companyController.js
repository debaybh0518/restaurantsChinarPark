const { Company, Branch } = require('../models');

function logApiCall(req, label) {
  console.log(`[API] ${label} - ${req.method} ${req.originalUrl} - body:`, req.body, 'query:', req.query, 'params:', req.params);
}

module.exports = {
  createBranch: async (req, res) => {
    logApiCall(req, 'createBranch');
    try {
      const { name, company_id } = req.body;
      if (!name || !company_id) return res.status(400).json({ error: 'Name and company_id required' });
      const branch = await Branch.create({ name, company_id });
      res.json(branch);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getCompanies: async (req, res) => {
    logApiCall(req, 'getCompanies');
    try {
      const companies = await Company.findAll();
      res.json(companies);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getCompanyById: async (req, res) => {
    logApiCall(req, 'getCompanyById');
    try {
      const company = await Company.findByPk(req.params.id);
      if (!company) return res.status(404).json({ error: 'Not found' });
      res.json(company);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateCompany: async (req, res) => {
    logApiCall(req, 'updateCompany');
    try {
      const company = await Company.findByPk(req.params.id);
      if (!company) return res.status(404).json({ error: 'Not found' });
      await company.update(req.body);
      res.json(company);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteCompany: async (req, res) => {
    logApiCall(req, 'deleteCompany');
    try {
      const company = await Company.findByPk(req.params.id);
      if (!company) return res.status(404).json({ error: 'Not found' });
      await company.destroy();
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  bulkCreateBranches: async (req, res) => {
    logApiCall(req, 'bulkCreateBranches');
    try {
      const { branches } = req.body;
      // Get company_id from authenticated user (super admin)
      const user = req.userDetails;
      if (!user || user.Role.name !== 'super_admin') return res.status(403).json({ error: 'Only super admin can add branches' });
      if (!branches || !Array.isArray(branches) || branches.length < 1) return res.status(400).json({ error: 'Invalid branches' });
      // Check company exists
      const company = await Company.findByPk(user.company_id);
      if (!company) return res.status(400).json({ error: 'Company not found' });
      // Create branches
      const created = await Promise.all(branches.map(b => Branch.create({ name: b.name, company_id: company.company_id }))); 
      res.json({ branches: created });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getBranchesByCompany: async (req, res) => {
    logApiCall(req, 'getBranchesByCompany');
    try {
      const company = await Company.findByPk(req.params.company_id);
      if (!company) return res.status(404).json({ error: 'Company not found' });
      // Fetch branches for this company
      const branches = await Branch.findAll({ where: { company_id: req.params.company_id } });
      // Ensure num_branches is always returned as integer
      console.log('[API] getBranchesByCompany response:', { branches, num_branches: Number(company.num_branches) });
      res.json({ branches, num_branches: Number(company.num_branches) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};