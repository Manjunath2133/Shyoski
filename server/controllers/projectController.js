const admin = require('firebase-admin');
const db = admin.firestore();
const Project = require('../models/project');

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { title, description, technologies, liveUrl, repoUrl, screenshots } = req.body;
        const author = req.user.uid;
        const newProject = new Project(title, description, technologies, liveUrl, repoUrl, screenshots, author);
        
        const projectRef = await db.collection('projects').add({ ...newProject });
        
        // Add the project to the user's portfolio
        const userRef = db.collection('users').doc(author);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const updatedPortfolio = [...userData.portfolio, projectRef.id];
        await userRef.update({ portfolio: updatedPortfolio });
        
        res.status(201).json({ id: projectRef.id, ...newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all projects for a user
exports.getProjects = async (req, res) => {
    try {
        const author = req.user.uid;
        const projectsSnapshot = await db.collection('projects').where('author', '==', author).get();
        const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(projects);
    } catch (error) {
        console.error('Error getting projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all projects for a user by id
exports.getProjectsByUserId = async (req, res) => {
    try {
        const author = req.params.id;
        const projectsSnapshot = await db.collection('projects').where('author', '==', author).get();
        const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(projects);
    } catch (error) {
        console.error('Error getting projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a project by ID
exports.getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const projectDoc = await db.collection('projects').doc(projectId).get();
        if (!projectDoc.exists) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ id: projectDoc.id, ...projectDoc.data() });
    } catch (error) {
        console.error('Error getting project by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const author = req.user.uid;
        
        const projectRef = db.collection('projects').doc(projectId);
        const projectDoc = await projectRef.get();
        
        if (!projectDoc.exists) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        if (projectDoc.data().author !== author) {
            return res.status(403).json({ message: 'User not authorized to update this project' });
        }
        
        await projectRef.update(req.body);
        
        res.json({ id: projectId, ...req.body });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const author = req.user.uid;
        
        const projectRef = db.collection('projects').doc(projectId);
        const projectDoc = await projectRef.get();
        
        if (!projectDoc.exists) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        if (projectDoc.data().author !== author) {
            return res.status(403).json({ message: 'User not authorized to delete this project' });
        }
        
        await projectRef.delete();
        
        // Remove the project from the user's portfolio
        const userRef = db.collection('users').doc(author);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const updatedPortfolio = userData.portfolio.filter(id => id !== projectId);
        await userRef.update({ portfolio: updatedPortfolio });
        
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
