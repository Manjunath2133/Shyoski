import { verifyIdToken } from '../utils/firebase.js';

const checkRole = (roles) => {
    return async (c, next) => {
        const authHeader = c.req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ message: 'Unauthorized' }, 401);
        }

        const idToken = authHeader.split('Bearer ')[1];
        const projectId = c.env.FIREBASE_PROJECT_ID;

        if (!projectId) {
            return c.json({ message: 'Firebase project ID is not configured.' }, 500);
        }

        try {
            const decodedToken = await verifyIdToken(idToken, projectId);
            const userId = decodedToken.uid;

            // Fetch user from Firestore using REST API
            const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}`;
            const response = await fetch(firestoreUrl, {
                headers: {
                    'Authorization': `Bearer ${idToken}` // Using the same token for authorization
                }
            });

            if (!response.ok) {
                 return c.json({ message: 'Error fetching user data.' }, response.status);
            }

            const userDoc = await response.json();
            const userRole = userDoc.fields.role.stringValue;

            if (userDoc && roles.includes(userRole)) {
                c.set('user', { id: userId, uid: userId, role: userRole });
                await next();
            } else {
                return c.json({ message: 'Forbidden' }, 403);
            }
        } catch (error) {
            console.error('Error while verifying token or role', error);
            return c.json({ message: 'Unauthorized' }, 401);
        }
    };
};

export default checkRole;
