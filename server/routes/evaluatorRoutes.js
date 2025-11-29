const express = require('express');
const router = express.Router();
const evaluatorController = require('../controllers/evaluatorController');
const checkRole = require('../middleware/authMiddleware');

router.put('/submission', checkRole(['admin', 'evaluator']), evaluatorController.updateSubmissionStatus);
router.post('/submission/feedback', checkRole(['admin', 'evaluator']), evaluatorController.addFeedback);
router.get('/submissions/:studentId', checkRole(['admin', 'evaluator']), evaluatorController.getStudentSubmissions);
router.get('/all-submissions', checkRole(['admin', 'evaluator']), evaluatorController.getAllSubmissions);
router.get('/student-projects', checkRole(['admin', 'evaluator']), evaluatorController.getStudentProjects);

module.exports = router;
