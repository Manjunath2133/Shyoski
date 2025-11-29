import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const DashboardRedirect = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            switch (user.role) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'evaluator':
                    navigate('/evaluator-dashboard');
                    break;
                case 'student':
                    navigate('/student-dashboard');
                    break;
                default:
                    navigate('/profile');
                    break;
            }
        } else {
            // If for some reason user is not available, redirect to login
            navigate('/login');
        }
    }, [user, navigate]);

    return <div>Loading...</div>;
};

export default DashboardRedirect;
