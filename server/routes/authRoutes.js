import { Hono } from 'hono';
import * as authController from '../controllers/authController.js';

const app = new Hono();

app.post('/verify-token', authController.verifyTokenAndCreateUser);

export default app;
