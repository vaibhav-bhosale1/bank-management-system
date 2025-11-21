import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    bankName: '',
    branchName: '',
    ifscCode: '',
    accountNumber: '',
    accountHolderName: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Load User & Fetch Data on Mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
      navigate('/login');
    } else {
      setUserInfo(user);
      fetchAccounts(user.token);
    }
  }, [navigate]);

  // 2. Fetch Accounts API
  const fetchAccounts = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/bank', config);
      setAccounts(data);
    } catch (err) {
      setError('Failed to fetch accounts');
    }
  };

  // 3. Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Submit Form (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      if (isEdit) {
        // Update Logic
        await axios.put(`/api/bank/${editId}`, formData, config);
        setSuccess('Account updated successfully!');
      } else {
        // Add Logic
        await axios.post('/api/bank', formData, config);
        setSuccess('Account added successfully!');
      }

      // Reset and Refresh
      setShowForm(false);
      setFormData({ bankName: '', branchName: '', ifscCode: '', accountNumber: '', accountHolderName: '' });
      fetchAccounts(userInfo.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  // 5. Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/bank/${id}`, config);
        setSuccess('Account deleted');
        fetchAccounts(userInfo.token);
      } catch (err) {
        setError('Delete failed');
      }
    }
  };

  // 6. Setup Edit Form
  const handleEditClick = (account) => {
    setFormData({
      bankName: account.bankName,
      branchName: account.branchName,
      ifscCode: account.ifscCode,
      accountNumber: account.accountNumber,
      accountHolderName: account.accountHolderName
    });
    setEditId(account._id);
    setIsEdit(true);
    setShowForm(true);
    setSuccess(''); 
  };

  // 7. Toggle Form Visibility
  const toggleForm = () => {
    setShowForm(!showForm);
    setIsEdit(false);
    setFormData({ bankName: '', branchName: '', ifscCode: '', accountNumber: '', accountHolderName: '' });
    setSuccess('');
    setError('');
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Bank Accounts</h2>
        <button className="btn" style={{ width: 'auto' }} onClick={toggleForm}>
          {showForm ? 'Close Form' : '+ Add Account'}
        </button>
      </div>

      {/* Notification Area */}
      {error && <div style={{ padding: '1rem', background: '#fadbd8', color: '#c0392b', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ padding: '1rem', background: '#d4efdf', color: '#27ae60', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card">
          <h3>{isEdit ? 'Edit Account' : 'Add New Account'}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Bank Name</label>
                <input name="bankName" value={formData.bankName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Branch Name</label>
                <input name="branchName" value={formData.branchName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>IFSC Code</label>
                <input name="ifscCode" value={formData.ifscCode} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Account Holder Name</label>
                <input name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
              {isEdit ? 'Update Account' : 'Save Account'}
            </button>
          </form>
        </div>
      )}

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#7f8c8d' }}>
          No bank accounts added yet.
        </div>
      ) : (
        <div className="card" style={{ padding: '1rem' }}>
          <table>
            <thead>
              <tr>
                <th>Bank Name</th>
                <th>Account Holder</th>
                <th>Account No.</th>
                <th>IFSC</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc._id}>
                  <td>{acc.bankName}<br/><small style={{color: '#7f8c8d'}}>{acc.branchName}</small></td>
                  <td>{acc.accountHolderName}</td>
                  <td>{acc.accountNumber}</td>
                  <td>{acc.ifscCode}</td>
                  <td>
                    <button 
                      onClick={() => handleEditClick(acc)}
                      className="btn-outline" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginRight: '0.5rem' }}>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(acc._id)}
                      className="btn-danger" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;