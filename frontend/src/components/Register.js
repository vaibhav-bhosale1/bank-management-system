import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // New States for Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [secretKey, setSecretKey] = useState('');

  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Send secretKey along with other data
      const { data } = await axios.post(
        '/api/users',
        { username, email, password, secretKey }, 
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Redirect based on the role we just got back
      if(data.role === 'admin'){
          navigate('/admin');
      } else {
          navigate('/dashboard');
      }
      
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Registration failed'
      );
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Register</h2>

        {message && <div style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>{message}</div>}
        {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Admin Toggle Section */}
          <div className="form-group" style={{ marginTop: '1rem', padding: '10px', background: '#f1f2f6', borderRadius: '5px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={isAdmin} 
                onChange={(e) => setIsAdmin(e.target.checked)}
                style={{ width: 'auto', marginRight: '10px' }} 
              />
              Register as Admin?
            </label>

            {isAdmin && (
              <div style={{ marginTop: '10px' }}>
                 <input 
                  type="text" 
                  placeholder="Enter Admin Secret Key" 
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
                <small style={{ color: '#7f8c8d' }}>Secret Key: taskplanet-admin</small>
              </div>
            )}
          </div>

          <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
            Register
          </button>
        </form>
        
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Have an account? <a href="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;