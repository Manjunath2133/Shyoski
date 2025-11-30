import { toFirestoreUpdate, fromFirestore } from '../utils/firebase.js';
import { getGcpAccessToken } from '../utils/gcp-auth.js';

// Get user by ID
export const getUserById = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) {
        return c.json({ message: 'Firebase project ID is not configured.' }, 500);
    }

    try {
        const userId = c.req.param('id');
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}`;

        const accessToken = await getGcpAccessToken(c.env);
        const response = await fetch(firestoreUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            const userDoc = await response.json();
            return c.json(fromFirestore(userDoc));
        } else if (response.status === 404) {
            return c.json({ message: 'User not found' }, 404);
        } else {
            const error = await response.json();
            console.error('Error getting user by ID:', error);
            return c.json({ message: 'Server error' }, 500);
        }
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return c.json({ message: 'Server error' }, 500);
    }
};

// Update user
export const updateUser = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) {
        return c.json({ message: 'Firebase project ID is not configured.' }, 500);
    }

    try {
        const userId = c.get('user').uid;
        const body = await c.req.json();
        const { fields, updateMask } = toFirestoreUpdate(body);
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}?${updateMask}`;

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
            const updatedUserDoc = await response.json();
            return c.json(fromFirestore(updatedUserDoc));
        } else {
            const error = await response.json();
            console.error('Error updating user:', error);
            return c.json({ message: 'Server error' }, 500);
        }
    } catch (error) {
        console.error('Error updating user:', error);
        return c.json({ message: 'Server error' }, 500);
    }
};