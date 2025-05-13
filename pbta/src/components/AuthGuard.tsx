import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants/constants';

const AuthGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const validateSession = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/validate-session/`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error validating session:', error);
                setIsAuthenticated(false);
            }
        };

        validateSession();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // or a spinner
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default AuthGuard;
