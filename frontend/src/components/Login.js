import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Make request to backend
      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        config
      );

      // Save user info and token to local storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Check role and redirect
      if (data.role === 'admin') {
          navigate('/admin');
      } else {
          navigate('/dashboard');
      }
      
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Login failed'
      );
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
        
        {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn">
            Sign In
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          New Customer? <a href="/register" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;