const admin = require('firebase-admin');
const User = require('../models/user');

const db = admin.firestore();

exports.verifyTokenAndCreateUser = async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            // New user, create a new user document in Firestore
            // Default role is 'student'
            const newUser = new User(uid, email, 'student', name, picture);
            await userRef.set(Object.assign({}, newUser));
            res.status(201).json(newUser);
        } else {
            // Existing user, just return the user data
            res.status(200).json(userDoc.data());
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};
