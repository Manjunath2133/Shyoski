const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/companies
// @desc    Create a new company
// @access  Private
router.post('/', authMiddleware, companyController.createCompany);

// @route   GET api/companies
// @desc    Get all companies for a user
// @access  Private
router.get('/', authMiddleware, companyController.getCompanies);

// @route   GET api/companies/:id
// @desc    Get a company by ID
// @access  Private
router.get('/:id', authMiddleware, companyController.getCompanyById);

// @route   PUT api/companies/:id
// @desc    Update a company
// @access  Private
router.put('/:id', authMiddleware, companyController.updateCompany);

// @route   DELETE api/companies/:id
// @desc    Delete a company
// @access  Private
router.delete('/:id', authMiddleware, companyController.deleteCompany);

// @route   POST api/companies/:id/invite
// @desc    Invite a user to a company
// @access  Private
router.post('/:id/invite', authMiddleware, companyController.inviteUser);

module.exports = router;
