import React from 'react';
import { useUser } from '../context/UserContext';

const CertificatePage = () => {
    const { user } = useUser();

    if (!user || !user.hasPaid) {
        return <div>You have not paid for the certificate yet.</div>;
    }

    return (
        <div style={{ border: '10px solid gold', padding: '50px', textAlign: 'center' }}>
            <h1>Certificate of Completion</h1>
            <p>This is to certify that</p>
            <h2>{user.name}</h2>
            <p>has successfully completed the Shyoski Internship Program.</p>
            <p>Certificate ID: {user.certificateId}</p>
        </div>
    );
};

export default CertificatePage;
