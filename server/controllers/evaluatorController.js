import { toFirestoreUpdate, fromFirestore } from '../utils/firebase.js';
import { getGcpAccessToken } from '../utils/gcp-auth.js';

export const updateSubmissionStatus = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) { return c.json({ message: 'Firebase project ID is not configured.' }, 500); }

    const evaluatorId = c.get('user').uid;
    const { studentId, week, status } = await c.req.json();

    try {
        const docId = `${studentId}_week${week}`;
        const updateData = { status, evaluatorId };
        const { fields, updateMask } = toFirestoreUpdate(updateData);
        
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/submissions/${docId}?${updateMask}`;
        const accessToken = await getGcpAccessToken(c.env);

        const response = await fetch(firestoreUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fields })
        });

        if (response.ok) {
            return c.json({ message: `Submission for week ${week} updated to ${status}` });
        } else {
            const error = await response.json();
            console.error('Error updating submission status:', error);
            return c.json({ message: 'Error updating submission status' }, 500);
        }
    } catch (error) {
        console.error('Error updating submission status:', error);
        return c.json({ message: 'Error updating submission status' }, 500);
    }
};

export const addFeedback = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) { return c.json({ message: 'Firebase project ID is not configured.' }, 500); }
    
    const { studentId, week, feedback } = await c.req.json();

    try {
        const docId = `${studentId}_week${week}`;
        const updateData = { feedback };
        const { fields, updateMask } = toFirestoreUpdate(updateData);

        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/submissions/${docId}?${updateMask}`;
        const accessToken = await getGcpAccessToken(c.env);

        const response = await fetch(firestoreUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fields })
        });

        if (response.ok) {
            return c.json({ message: `Feedback for week ${week} added` });
        } else {
            const error = await response.json();
            console.error('Error adding feedback:', error);
            return c.json({ message: 'Error adding feedback' }, 500);
        }
    } catch (error) {
        console.error('Error adding feedback:', error);
        return c.json({ message: 'Error adding feedback' }, 500);
    }
};

export const getStudentSubmissions = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) { return c.json({ message: 'Firebase project ID is not configured.' }, 500); }

    const { studentId } = c.req.param();

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
                    from: [{ collectionId: 'submissions' }],
                    where: { fieldFilter: { field: { fieldPath: 'studentId' }, op: 'EQUAL', value: { stringValue: studentId } } }
                }
            })
        });

        if (response.ok) {
            const docs = await response.json();
            const submissions = docs.map(doc => fromFirestore(doc.document));
            return c.json(submissions);
        } else {
            const error = await response.json();
            console.error('Error getting submissions:', error);
            return c.json({ message: 'Error getting submissions' }, 500);
        }
    } catch (error) {
        console.error('Error getting submissions:', error);
        return c.json({ message: 'Error getting submissions' }, 500);
    }
};

export const getAllSubmissions = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) { return c.json({ message: 'Firebase project ID is not configured.' }, 500); }

    try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
        const accessToken = await getGcpAccessToken(c.env);

        const [submissionsRes, usersRes] = await Promise.all([
            fetch(`${firestoreUrl}:runQuery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'submissions' }] } })
            }),
            fetch(`${firestoreUrl}:runQuery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'users' }] } })
            })
        ]);

        const submissionsDocs = await submissionsRes.json();
        const usersDocs = await usersRes.json();
        
        const users = {};
        if (usersDocs && Array.isArray(usersDocs)) {
            usersDocs.forEach(doc => {
                const userData = fromFirestore(doc);
                users[userData.id] = { name: userData.name, email: userData.email };
            });
        }

        const allSubmissions = [];
        if(submissionsDocs) {
            submissionsDocs.forEach(doc => {
                if(doc.document) {
                    const submission = fromFirestore(doc.document);
                    const user = users[submission.studentId];
                    if (user) {
                        allSubmissions.push({ ...submission, studentName: user.name, studentEmail: user.email });
                    }
                }
            });
        }
        
        return c.json(allSubmissions);
    } catch (error) {
        console.error('Error getting all submissions:', error);
        return c.json({ message: 'Error getting all submissions' }, 500);
    }
};

export const getStudentProjects = async (c) => {
     return c.json({ message: 'Not Implemented. This query is complex and best handled by a dedicated endpoint or Cloud Function.' }, 501);
};