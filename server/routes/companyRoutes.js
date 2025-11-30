import { Hono } from 'hono';
import * as companyController from '../controllers/companyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const app = new Hono();

const standardAuth = authMiddleware(['student', 'evaluator', 'admin']);

// @route   POST api/companies
// @desc    Create a new company
// @access  Private
app.post('/', standardAuth, companyController.createCompany);

// @route   GET api/companies
// @desc    Get all companies for a user
// @access  Private
app.get('/', standardAuth, companyController.getCompanies);

// @route   GET api/companies/:id
// @desc    Get a company by ID
// @access  Private
app.get('/:id', standardAuth, companyController.getCompanyById);

// @route   PUT api/companies/:id
// @desc    Update a company
// @access  Private
app.put('/:id', standardAuth, companyController.updateCompany);

// @route   DELETE api/companies/:id
// @desc    Delete a company
// @access  Private
app.delete('/:id', standardAuth, companyController.deleteCompany);

// @route   POST api/companies/:id/invite
// @desc    Invite a user to a company
// @access  Private
app.post('/:id/invite', standardAuth, companyController.inviteUser);

export default app;
