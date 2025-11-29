const admin = require('firebase-admin');
const db = admin.firestore();

exports.getAllUsers = async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers();
        const users = listUsersResult.users.map(userRecord => {
            return userRecord.toJSON();
        });
        
        const usersFromDb = await db.collection('users').get();
        const usersWithRoles = users.map(user => {
            const userFromDb = usersFromDb.docs.find(doc => doc.id === user.uid);
            return {
                ...user,
                role: userFromDb ? userFromDb.data().role : 'student'
            }
        });

        res.status(200).json(usersWithRoles);
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ message: 'Error listing users' });
    }
};

exports.updateUserRole = async (req, res) => {
    const { uid, role } = req.body;

    try {
        // Set custom claim in Firebase Auth
        await admin.auth().setCustomUserClaims(uid, { role });

        // Update role in Firestore
        const userRef = db.collection('users').doc(uid);
        await userRef.update({ role });

        res.status(200).json({ message: `User role updated successfully for ${uid}` });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error updating user role' });
    }
};

exports.getRecentSubmissions = async (req, res) => {
    try {
        const submissionsSnapshot = await db.collection('submissions').orderBy('submittedAt', 'desc').limit(5).get();
        const usersSnapshot = await db.collection('users').get();

        const users = {};
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            users[doc.id] = {
                name: userData.displayName,
                email: userData.email,
            };
        });

        const recentSubmissions = [];
        submissionsSnapshot.forEach(doc => {
            const submission = doc.data();
            const user = users[submission.studentId];
            if (user) {
                recentSubmissions.push({
                    ...submission,
                    studentName: user.name,
                    studentEmail: user.email,
                });
            }
        });

        res.status(200).json(recentSubmissions);
    } catch (error) {
        console.error('Error getting recent submissions:', error);
        res.status(500).json({ message: 'Error getting recent submissions' });
    }
};
