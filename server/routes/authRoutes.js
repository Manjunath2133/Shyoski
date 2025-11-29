const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/verify-token', authController.verifyTokenAndCreateUser);

module.exports = router;
