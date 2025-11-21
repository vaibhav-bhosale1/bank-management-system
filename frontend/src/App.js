import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
// Placeholder components for now

const AdminDashboard = () => <div className="container"><h2>Admin Dashboard (Coming Soon)</h2></div>;

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo');

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <span className="nav-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>BankSystem</span>
        <div className="nav-links">
          {userInfo ? (
             // If logged in, show Logout
             <span onClick={logoutHandler} style={{ cursor: 'pointer', marginLeft: '1.5rem', color: '#bdc3c7' }}>
               Logout
             </span>
          ) : (
             // If not logged in, show Login/Register
             <>
               <a href="/login">Login</a>
               <a href="/register">Register</a>
             </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Wrapper to allow useNavigate in Navbar
const AppContent = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;