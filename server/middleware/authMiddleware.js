const admin = require('firebase-admin');

const db = admin.firestore();

const checkRole = (roles) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const idToken = authorization.split('Bearer ')[1];

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const userRef = db.collection('users').doc(decodedToken.uid);
            const userDoc = await userRef.get();

            if (userDoc.exists && roles.includes(userDoc.data().role)) {
                req.user = { id: userDoc.id, uid: userDoc.id, ...userDoc.data() };
                return next();
            } else {
                return res.status(403).json({ message: 'Forbidden' });
            }
        } catch (error) {
            console.error('Error while verifying token or role', error);
            return res.status(401).json({ message: 'Unauthorized' });
        }
    };
};

module.exports = checkRole;
