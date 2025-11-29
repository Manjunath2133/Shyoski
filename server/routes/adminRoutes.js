const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const checkRole = require('../middleware/authMiddleware');

router.get('/users', checkRole(['admin', 'evaluator']), adminController.getAllUsers);
router.put('/user-role', checkRole(['admin']), adminController.updateUserRole);
router.get('/recent-submissions', checkRole(['admin']), adminController.getRecentSubmissions);

module.exports = router;
