import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Placeholder components (We will create these next)
const Login = () => <div className="container"><h2>Login Page</h2></div>;
const Register = () => <div className="container"><h2>Register Page</h2></div>;
const Dashboard = () => <div className="container"><h2>User Dashboard</h2></div>;
const AdminDashboard = () => <div className="container"><h2>Admin Dashboard</h2></div>;
const Navbar = () => (
  <nav className="navbar">
    <div className="container">
      <span className="nav-logo">BankSystem</span>
      <div className="nav-links">
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </div>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;