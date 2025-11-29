const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/projects
// @desc    Create a new project
// @access  Private
router.post('/', authMiddleware(['student', 'evaluator', 'admin']), projectController.createProject);

// @route   GET api/projects
// @desc    Get all projects for a user
// @access  Private
router.get('/', authMiddleware(['student']), projectController.getProjects);

// @route   GET api/projects/user/:id
// @desc    Get all projects for a user
// @access  Public
router.get('/user/:id', projectController.getProjectsByUserId);

// @route   GET api/projects/:id
// @desc    Get a project by ID
// @access  Public
router.get('/:id', projectController.getProjectById);

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', authMiddleware(['student', 'evaluator', 'admin']), projectController.updateProject);

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', authMiddleware(['student', 'evaluator', 'admin']), projectController.deleteProject);

module.exports = router;
