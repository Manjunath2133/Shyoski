import { fromFirestore } from '../utils/firebase.js';

// IMPORTANT: The functions `getAllUsers` and `updateUserRole` use the Firebase Admin Auth API,
// which is not available in Cloudflare Workers. To maintain this functionality, you should
// move these functions to a separate service, like a Google Cloud Function, and call it from here.

export const getAllUsers = async (c) => {
    return c.json({ message: 'Not Implemented: This function requires the Firebase Admin Auth API, which is not available in Cloudflare Workers.' }, 501);
};

export const updateUserRole = async (c) => {
    return c.json({ message: 'Not Implemented: This function requires the Firebase Admin Auth API, which is not available in Cloudflare Workers.' }, 501);
};

export const getRecentSubmissions = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) {
        return c.json({ message: 'Firebase project ID is not configured.' }, 500);
    }

    try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
        const idToken = c.req.header('Authorization').split('Bearer ')[1];

        // Fetch recent submissions
        const submissionsResponse = await fetch(`${firestoreUrl}:runQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
            body: JSON.stringify({
                structuredQuery: {
                    from: [{ collectionId: 'submissions' }],
                    orderBy: [{ field: { fieldPath: 'submittedAt' }, direction: 'DESCENDING' }],
                    limit: 5
                }
            })
        });
        const submissionsDocs = await submissionsResponse.json();

        // Fetch all users
        const usersResponse = await fetch(`${firestoreUrl}/users`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        const usersDocs = await usersResponse.json();

        const users = {};
        if (usersDocs.documents) {
            usersDocs.documents.forEach(doc => {
                const userData = fromFirestore(doc);
                users[userData.id] = {
                    name: userData.name,
                    email: userData.email,
                };
            });
        }


        const recentSubmissions = [];
        if (submissionsDocs) {
            submissionsDocs.forEach(doc => {
                if(doc.document) {
                    const submission = fromFirestore(doc.document);
                    const user = users[submission.studentId];
                    if (user) {
                        recentSubmissions.push({
                            ...submission,
                            studentName: user.name,
                            studentEmail: user.email,
                        });
                    }
                }
            });
        }


        return c.json(recentSubmissions);
    } catch (error) {
        console.error('Error getting recent submissions:', error);
        return c.json({ message: 'Error getting recent submissions' }, 500);
    }
};