import { verifyIdToken, userToFirestore, fromFirestore } from '../utils/firebase.js';
import User from '../models/user.js';


export const verifyTokenAndCreateUser = async (c) => {
    const { idToken } = await c.req.json();
    const projectId = c.env.FIREBASE_PROJECT_ID;

    if (!projectId) {
        return c.json({ message: 'Firebase project ID is not configured.' }, 500);
    }

    try {
        const decodedToken = await verifyIdToken(idToken, projectId);
        const { uid, email, name, picture } = decodedToken;

        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`;

        // Check if user exists
        const response = await fetch(firestoreUrl, {
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        });

        if (response.ok) {
            // User exists
            const userDoc = await response.json();
            return c.json(fromFirestore(userDoc));
        } else if (response.status === 404) {
            // User does not exist, create new user
            const newUser = new User(uid, email, 'student', name, picture);
            const firestoreUser = userToFirestore(newUser);

            const createResponse = await fetch(firestoreUrl, {
                method: 'PATCH', // Using PATCH with no path creates a document
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(firestoreUser)
            });

            if (createResponse.ok) {
                return c.json(newUser, 201);
            } else {
                const error = await createResponse.json();
                console.error('Error creating user in Firestore:', error);
                return c.json({ message: 'Failed to create user.' }, 500);
            }
        } else {
            // Another error occurred
             const error = await response.json();
             console.error('Error fetching user:', error);
             return c.json({ message: 'Error fetching user data.' }, response.status);
        }
    } catch (error) {
        console.error('Error verifying token or creating user:', error);
        return c.json({ message: 'Unauthorized' }, 401);
    }
};