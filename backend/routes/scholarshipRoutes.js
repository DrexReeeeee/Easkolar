const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// Matching eligibility routes
router.get('/match/user', authMiddleware, scholarshipController.matchScholarships);
router.get('/:id/eligibility', authMiddleware, scholarshipController.checkEligibility);

// CRUD routes
router.get('/', scholarshipController.getAllScholarships);
router.get('/:id', scholarshipController.getScholarshipById);
router.post('/', authMiddleware, adminOnly, scholarshipController.createScholarship);
router.put('/:id', authMiddleware, adminOnly, scholarshipController.updateScholarship);
router.delete('/:id', authMiddleware, adminOnly, scholarshipController.deleteScholarship);

module.exports = router;
