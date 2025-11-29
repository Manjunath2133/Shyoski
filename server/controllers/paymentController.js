const admin = require('firebase-admin');
const db = admin.firestore();

exports.recordPayment = async (req, res) => {
    const studentId = req.user.id;

    try {
        const userRef = db.collection('users').doc(studentId);
        // In a real application, you would verify the payment here with a payment provider.
        // For now, we just simulate a successful payment.
        
        const certificateId = `SHYOSKI-CERT-${studentId.substring(0, 5)}-${Date.now()}`;
        
        await userRef.update({ 
            hasPaid: true,
            certificateId: certificateId
        });

        res.status(200).json({ message: 'Payment recorded successfully', certificateId });
    } catch (error) {
        console.error('Error recording payment:', error);
        res.status(500).json({ message: 'Error recording payment' });
    }
};
