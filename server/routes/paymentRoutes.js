import { Hono } from 'hono';
import * as paymentController from '../controllers/paymentController.js';
import checkRole from '../middleware/authMiddleware.js';

const app = new Hono();

app.post('/record', checkRole(['student']), paymentController.recordPayment);

export default app;
