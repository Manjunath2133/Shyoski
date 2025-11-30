import { fromFirestore } from '../utils/firebase.js';
import Project from '../models/project.js';
import { getGcpAccessToken } from '../utils/gcp-auth.js';

export const createProject = async (c) => {
    return c.json({ message: 'Not Implemented. This operation requires a transaction and is best handled by a Cloud Function.' }, 501);
};

export const getProjects = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) { return c.json({ message: 'Firebase project ID is not configured.' }, 500); }

    const author = c.get('user').uid;

    try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
        const accessToken = await getGcpAccessToken(c.env);

        const response = await fetch(firestoreUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                structuredQuery: {
                    from: [{ collectionId: 'projects' }],
                    where: { fieldFilter: { field: { fieldPath: 'author' }, op: 'EQUAL', value: { stringValue: author } } }
                }
            })
        });

        if (response.ok) {
            const docs = await response.json();
            const projects = docs.map(doc => fromFirestore(doc.document));
            return c.json(projects);
        } else {
            const error = await response.json();
            console.error('Error getting projects:', error);
            return c.json({ message: 'Server error' }, 500);
        }
    } catch (error) {
        console.error('Error getting projects:', error);
        return c.json({ message: 'Server error' }, 500);
    }
};

export const getProjectsByUserId = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) { return c.json({ message: 'Firebase project ID is not configured.' }, 500); }

    const author = c.req.param('id');

    try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
        
        const response = await fetch(firestoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // This is a public route, no auth needed
            body: JSON.stringify({
                structuredQuery: {
                    from: [{ collectionId: 'projects' }],
                    where: { fieldFilter: { field: { fieldPath: 'author' }, op: 'EQUAL', value: { stringValue: author } } }
                }
            })
        });

        if (response.ok) {
            const docs = await response.json();
            const projects = docs.map(doc => fromFirestore(doc.document));
            return c.json(projects);
        } else {
            const error = await response.json();
            console.error('Error getting projects:', error);
            return c.json({ message: 'Server error' }, 500);
        }
    } catch (error) {
        console.error('Error getting projects:', error);
        return c.json({ message: 'Server error' }, 500);
    }
};

export const getProjectById = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) { return c.json({ message: 'Firebase project ID is not configured.' }, 500); }

    try {
        const projId = c.req.param('id');
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/projects/${projId}`;
        
        const response = await fetch(firestoreUrl);

        if (response.ok) {
            const projectDoc = await response.json();
            return c.json(fromFirestore(projectDoc));
        } else if (response.status === 404) {
            return c.json({ message: 'Project not found' }, 404);
        } else {
            const error = await response.json();
            console.error('Error getting project:', error);
            return c.json({ message: 'Server error' }, 500);
        }
    } catch (error) {
        console.error('Error getting project by ID:', error);
        return c.json({ message: 'Server error' }, 500);
    }
};

export const updateProject = async (c) => {
    return c.json({ message: 'Not Implemented. This operation requires an ownership check and is best handled by a Cloud Function.' }, 501);
};

export const deleteProject = async (c) => {
    return c.json({ message: 'Not Implemented. This operation requires a transaction and is best handled by a Cloud Function.' }, 501);
};