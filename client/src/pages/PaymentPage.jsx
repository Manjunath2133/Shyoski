import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { auth } from '../firebase';

const PaymentPage = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handlePayment = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            const response = await fetch('http://localhost:8000/api/payment/record', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            });
            const data = await response.json();
            
            // Update user context with payment info
            setUser({ ...user, hasPaid: true, certificateId: data.certificateId });
            
            navigate('/certificate');

        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    return (
        <div>
            <h1>Payment for Certificate</h1>
            <p>Please pay ₹199 to receive your certificate.</p>
            <button onClick={handlePayment}>Pay ₹199</button>
        </div>
    );
};

export default PaymentPage;
