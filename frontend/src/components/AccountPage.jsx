import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

export default function AccountPage() {
  const { user, logout, loading, setUser } = useAuth();

  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [newPassword2, setNewPassword2] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Sincroniza los inputs cuando el user cambia
  useEffect(() => {
    setBio(user?.bio || '');
    setAddress(user?.address || '');
    setPhone(user?.phone || '');
    setEmail(user?.email || '');
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  const handleBioUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setUpdating(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/update_bio.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          id: user.id, 
          bio, 
          address, 
          phone, 
          email 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update info');

      setMessage(data.message || 'Info updated');
      if (data.user) setUser(data.user); // Actualiza user global
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setUpdating(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/change_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: user.id,
          newPassword,
          newPassword2,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');

      setMessage(data.message || 'Password changed');
      setNewPassword('');
      setNewPassword2('');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const inputStyle = {
    width: '100%',
    marginTop: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    background: '#000',
    color: '#0f0',
    border: '1px solid #0f0',
    padding: '0.5rem',
  };

  const buttonStyle = {
    background: '#0f0',
    color: '#000',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0 0 10px #0f0a',
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '3rem auto',
      padding: '2rem',
      background: '#111',
      borderRadius: '8px',
      boxShadow: '0 0 20px #0f0a',
      color: '#0f0',
      fontFamily: 'monospace'
    }}>
      <h2>Account</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Role:</strong> {user.role || 'user'}</p>
      <strong>Bio:</strong>
      <br />
      <br />
      
      <div dangerouslySetInnerHTML={{ __html: bio }} />
      <p><strong>Address:</strong> {user.address || 'No address set'}</p>
      <p><strong>Phone:</strong> {user.phone || 'No phone set'}</p>
      <p><strong>Email:</strong> {user.email || 'No email set'}</p>

      {message && <p style={{ color: 'lightgreen' }}>{message}</p>}
      {error && <p style={{ color: 'tomato' }}>{error}</p>}

      <form onSubmit={handleBioUpdate} style={{ marginTop: '2rem' }}>
        <h3>Update Info</h3>
        <label>
          Bio:
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            style={inputStyle}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
        </label>
        <button type="submit" disabled={updating} style={buttonStyle}>
          {updating ? 'Updating...' : 'Update Info'}
        </button>
      </form>

      <form onSubmit={handlePasswordUpdate} style={{ marginTop: '2rem' }}>
        <h3>Change Password</h3>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            value={newPassword2}
            onChange={e => setNewPassword2(e.target.value)}
            style={inputStyle}
          />
        </label>
        <button type="submit" disabled={updating} style={buttonStyle}>
          {updating ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
