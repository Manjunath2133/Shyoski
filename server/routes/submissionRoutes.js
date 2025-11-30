import { Hono } from 'hono';
import * as submissionController from '../controllers/submissionController.js';
import checkRole from '../middleware/authMiddleware.js';

const app = new Hono();

app.post('/submit', checkRole(['student']), submissionController.submitProject);
app.get('/', checkRole(['student']), submissionController.getStudentSubmissions);

export default app;
