// src/pages/Login/Login.tsx
import { useNavigate } from 'react-router-dom';
import './Login.css';
import React, { useState } from 'react';
import { API_BASE_URL } from '../../constants/constants';
import axios from 'axios';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/login/`, {
                email,
                password,
            }, {
                withCredentials: true
            });

            console.log('Login successful:', response.data);
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Error logging in:', err);
            // Axios error handling - check for response data
            setError(
                err.response?.data?.detail ||
                err.message ||
                'Login failed'
            );
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <button type="button" onClick={() => navigate('/signup')}>
                Go to SignUp
            </button>
        </div>
    );
};

export default Login;