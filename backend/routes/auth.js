// Auth routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { onboardingSchema } = require('../validations/onboarding');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/onboarding', validate(onboardingSchema), authController.onboarding);

module.exports = router;