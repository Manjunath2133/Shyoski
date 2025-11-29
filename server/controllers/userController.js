const admin = require('firebase-admin');
const db = admin.firestore();

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ id: userDoc.id, ...userDoc.data() });
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.uid;
        const userRef = db.collection('users').doc(userId);
        await userRef.update(req.body);
        const updatedUserDoc = await userRef.get();
        res.json({ id: updatedUserDoc.id, ...updatedUserDoc.data() });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
