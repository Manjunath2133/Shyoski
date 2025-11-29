import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const AdminRoute = ({ children }) => {
    const { user } = useUser();

    if (!user) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }

    if (user.role !== 'admin') {
        // user is not an admin
        return <Navigate to="/profile" />;
    }

    return children;
};

export default AdminRoute;
