const express = require('express');
const router = express.Router();
const { askScholarshipBot } = require('../controllers/chatBotController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, askScholarshipBot);

module.exports = router;