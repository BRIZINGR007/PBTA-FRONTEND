import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/constants';
import axios from 'axios';

const AuthGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const validateSession = async () => {
            try {
                await axios.get(`${API_BASE_URL}/api/users/validate-session/`, {
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    withCredentials: true
                });
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error validating session:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        validateSession();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default AuthGuard;