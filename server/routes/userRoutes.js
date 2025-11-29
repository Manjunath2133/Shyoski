const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', userController.getUserById);

// @route   PUT api/users
// @desc    Update user
// @access  Private
router.put('/', authMiddleware, userController.updateUser);

module.exports = router;
