import { toFirestoreUpdate } from '../utils/firebase.js';

export const recordPayment = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) { return c.json({ message: 'Firebase project ID is not configured.' }, 500); }

    const studentId = c.get('user').id;

    try {
        const certificateId = `SHYOSKI-CERT-${studentId.substring(0, 5)}-${Date.now()}`;
        
        const updateData = {
            hasPaid: true,
            certificateId: certificateId
        };

        const { fields, updateMask } = toFirestoreUpdate(updateData);
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${studentId}?${updateMask}`;

        const idToken = c.req.header('Authorization').split('Bearer ')[1];

        const response = await fetch(firestoreUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fields })
        });

        if (response.ok) {
            return c.json({ message: 'Payment recorded successfully', certificateId });
        } else {
            const error = await response.json();
            console.error('Error recording payment:', error);
            return c.json({ message: 'Error recording payment' }, 500);
        }
    } catch (error) {
        console.error('Error recording payment:', error);
        return c.json({ message: 'Error recording payment' }, 500);
    }
};