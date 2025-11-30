import { Hono } from 'hono';
import * as projectController from '../controllers/projectController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const app = new Hono();

// @route   POST api/projects
// @desc    Create a new project
// @access  Private
app.post('/', authMiddleware(['student', 'evaluator', 'admin']), projectController.createProject);

// @route   GET api/projects
// @desc    Get all projects for a user
// @access  Private
app.get('/', authMiddleware(['student']), projectController.getProjects);

// @route   GET api/projects/user/:id
// @desc    Get all projects for a user
// @access  Public
app.get('/user/:id', projectController.getProjectsByUserId);

// @route   GET api/projects/:id
// @desc    Get a project by ID
// @access  Public
app.get('/:id', projectController.getProjectById);

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
app.put('/:id', authMiddleware(['student', 'evaluator', 'admin']), projectController.updateProject);

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
app.delete('/:id', authMiddleware(['student', 'evaluator', 'admin']), projectController.deleteProject);

export default app;
