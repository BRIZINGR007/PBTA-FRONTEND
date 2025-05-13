// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';

const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <Link to="/signup">Signup</Link> | <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>Welcome! Go to <Link to="/signup">Signup</Link> or <Link to="/login">Login</Link></div>} />
      </Routes>
    </Router>
  );
};

export default App;
