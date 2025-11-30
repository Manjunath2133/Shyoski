import { Hono } from 'hono';
import * as adminController from '../controllers/adminController.js';
import checkRole from '../middleware/authMiddleware.js';

const app = new Hono();

app.get('/users', checkRole(['admin', 'evaluator']), adminController.getAllUsers);
app.put('/user-role', checkRole(['admin']), adminController.updateUserRole);
app.get('/recent-submissions', checkRole(['admin']), adminController.getRecentSubmissions);

export default app;
