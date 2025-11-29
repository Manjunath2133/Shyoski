import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const EvaluatorRoute = ({ children }) => {
    const { user } = useUser();

    if (!user) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }

    if (!['evaluator', 'admin'].includes(user.role)) {
        // user is not an evaluator or admin
        return <Navigate to="/profile" />;
    }

    return children;
};

export default EvaluatorRoute;
