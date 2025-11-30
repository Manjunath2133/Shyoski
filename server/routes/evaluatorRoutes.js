import { Hono } from 'hono';
import * as evaluatorController from '../controllers/evaluatorController.js';
import checkRole from '../middleware/authMiddleware.js';

const app = new Hono();

app.put('/submission', checkRole(['admin', 'evaluator']), evaluatorController.updateSubmissionStatus);
app.post('/submission/feedback', checkRole(['admin', 'evaluator']), evaluatorController.addFeedback);
app.get('/submissions/:studentId', checkRole(['admin', 'evaluator']), evaluatorController.getStudentSubmissions);
app.get('/all-submissions', checkRole(['admin', 'evaluator']), evaluatorController.getAllSubmissions);
app.get('/student-projects', checkRole(['admin', 'evaluator']), evaluatorController.getStudentProjects);

export default app;
