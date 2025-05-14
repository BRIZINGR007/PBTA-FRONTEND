// src/pages/Signup.tsx
import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/constants';
import axios from 'axios';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/signup/`, {
                name,
                email,
                password,
            });

            console.log('Signup successful:', response.data);
            navigate('/login');
        } catch (err: any) {
            console.error('Error signing up:', err);
            setError(err.response?.data?.detail || 'Signup failed');
        }
    };

    return (
        <div className="signup-container">
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Signup</button>
            </form>
            <button type="button" onClick={() => navigate('/login')}>
                Go to Login
            </button>
        </div>
    );
};

export default Signup;
