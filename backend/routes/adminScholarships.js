const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const {
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getAllScholarships,
  getScholarshipById
} = require('../controllers/scholarshipController');


router.use(authMiddleware);
router.use(adminOnly);

// GET all scholarships 
router.get('/', getAllScholarships);

// GET single scholarship
router.get('/:id', getScholarshipById);

// POST - Add new scholarship
router.post('/', createScholarship);

// PUT - Update scholarship
router.put('/:id', updateScholarship);

// DELETE - Remove scholarship
router.delete('/:id', deleteScholarship);

module.exports = router;
