const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const checkRole = require('../middleware/authMiddleware');

router.post('/submit', checkRole(['student']), submissionController.submitProject);
router.get('/', checkRole(['student']), submissionController.getStudentSubmissions);

module.exports = router;
