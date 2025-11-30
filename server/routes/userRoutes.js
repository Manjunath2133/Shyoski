import { Hono } from 'hono';
import * as userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const app = new Hono();

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
app.get('/:id', userController.getUserById);

// @route   PUT api/users
// @desc    Update user
// @access  Private
// The authMiddleware should be called with roles
app.put('/', authMiddleware(['student', 'admin', 'evaluator']), userController.updateUser);

export default app;
