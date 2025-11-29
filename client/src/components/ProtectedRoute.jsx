import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useUser();

    if (!user) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;
