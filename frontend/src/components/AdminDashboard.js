import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Check Admin Status & Fetch Data
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/dashboard'); // Kick non-admins back to user dashboard
    } else {
      fetchAllAccounts(userInfo.token, '');
    }
  }, [navigate]);

  // 2. Fetch Logic with Search
  const fetchAllAccounts = async (token, keyword = '') => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Appends search keyword to query
      const { data } = await axios.get(`/api/bank/all?keyword=${keyword}`, config);
      setAccounts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data', error);
      setLoading(false);
    }
  };

  // 3. Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    fetchAllAccounts(userInfo.token, search);
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Admin Panel: All Records</h2>
          <button 
            className="btn-outline" 
            onClick={() => navigate('/dashboard')}
            style={{ width: 'auto' }}
          >
            Go to My Dashboard
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
          <input 
            type="text" 
            placeholder="Search by User, Bank Name, or IFSC..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn" style={{ width: '150px' }}>Search</button>
        </form>

        {/* Data Table */}
        {loading ? (
          <p>Loading records...</p>
        ) : accounts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No records found.</p>
        ) : (
          <table style={{ fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th>User</th>
                <th>Bank Name</th>
                <th>Branch</th>
                <th>Account No.</th>
                <th>IFSC</th>
                <th>Holder Name</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc._id}>
                  <td style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {acc.user ? acc.user.username : 'Unknown User'}
                    <br/>
                    <small style={{ color: '#95a5a6' }}>{acc.user ? acc.user.email : ''}</small>
                  </td>
                  <td>{acc.bankName}</td>
                  <td>{acc.branchName}</td>
                  <td>{acc.accountNumber}</td>
                  <td>{acc.ifscCode}</td>
                  <td>{acc.accountHolderName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;