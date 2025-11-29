const admin = require('firebase-admin');
const db = admin.firestore();
const Company = require('../models/company');

// Create a new company
exports.createCompany = async (req, res) => {
    try {
        const { name } = req.body;
        const owner = req.user.uid;
        const newCompany = new Company(name, owner);
        
        const companyRef = await db.collection('companies').add({ ...newCompany });
        
        res.status(201).json({ id: companyRef.id, ...newCompany });
    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all companies for a user
exports.getCompanies = async (req, res) => {
    try {
        const userId = req.user.uid;
        const companiesSnapshot = await db.collection('companies').where('members', 'array-contains', userId).get();
        const companies = companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(companies);
    } catch (error) {
        console.error('Error getting companies:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a company by ID
exports.getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const companyDoc = await db.collection('companies').doc(companyId).get();
        if (!companyDoc.exists) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ id: companyDoc.id, ...companyDoc.data() });
    } catch (error) {
        console.error('Error getting company by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a company
exports.updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const userId = req.user.uid;
        
        const companyRef = db.collection('companies').doc(companyId);
        const companyDoc = await companyRef.get();
        
        if (!companyDoc.exists) {
            return res.status(404).json({ message: 'Company not found' });
        }
        
        if (companyDoc.data().owner !== userId) {
            return res.status(403).json({ message: 'User not authorized to update this company' });
        }
        
        await companyRef.update(req.body);
        
        res.json({ id: companyId, ...req.body });
    } catch (error){
        console.error('Error updating company:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a company
exports.deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const userId = req.user.uid;
        
        const companyRef = db.collection('companies').doc(companyId);
        const companyDoc = await companyRef.get();
        
        if (!companyDoc.exists) {
            return res.status(404).json({ message: 'Company not found' });
        }
        
        if (companyDoc.data().owner !== userId) {
            return res.status(403).json({ message: 'User not authorized to delete this company' });
        }
        
        await companyRef.delete();
        
        res.json({ message: 'Company deleted successfully' });
    } catch (error){
        console.error('Error deleting company:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Invite a user to a company
exports.inviteUser = async (req, res) => {
    try {
        const companyId = req.params.id;
        const { email } = req.body;
        const userId = req.user.uid;

        const companyRef = db.collection('companies').doc(companyId);
        const companyDoc = await companyRef.get();

        if (!companyDoc.exists) {
            return res.status(404).json({ message: 'Company not found' });
        }

        if (companyDoc.data().owner !== userId) {
            return res.status(403).json({ message: 'User not authorized to invite users to this company' });
        }

        const userRecord = await admin.auth().getUserByEmail(email);
        const invitedUserId = userRecord.uid;

        const updatedMembers = [...companyDoc.data().members, invitedUserId];
        await companyRef.update({ members: updatedMembers });

        res.json({ message: 'User invited successfully' });
    } catch (error) {
        console.error('Error inviting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
