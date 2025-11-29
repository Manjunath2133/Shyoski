const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const checkRole = require('../middleware/authMiddleware');

router.post('/record', checkRole(['student']), paymentController.recordPayment);

module.exports = router;
