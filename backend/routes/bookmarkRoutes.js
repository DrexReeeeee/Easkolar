const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const { authMiddleware } = require('../middleware/authMiddleware'); 

router.post('/', authMiddleware, bookmarkController.addBookmark);
router.get('/', authMiddleware, bookmarkController.getBookmarks);
router.delete('/:scholarshipId', authMiddleware, bookmarkController.removeBookmark);

module.exports = router;
