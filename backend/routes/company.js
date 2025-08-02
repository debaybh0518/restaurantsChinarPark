// Company routes
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');
const { branchesBulkSchema } = require('../validations/onboarding');

router.post('/', companyController.createBranch);
router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompanyById);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);
router.post('/branches/bulk', (req, res, next) => {
  if (req.query.onboarding === 'true') {
    // Skip auth and roles middleware during onboarding
    return next();
  }
  // Require auth and super_admin role otherwise
  return auth(req, res, () => roles(['super_admin'])(req, res, next));
}, validate(branchesBulkSchema), companyController.bulkCreateBranches);
router.get('/:company_id/branches', companyController.getBranchesByCompany);

module.exports = router;