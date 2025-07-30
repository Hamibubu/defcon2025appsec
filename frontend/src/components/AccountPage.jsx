import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

export default function AccountPage() {
  const { user, logout, loading, setUser } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [newPassword2, setNewPassword2] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
        body: JSON.stringify({ id: user.id, bio }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update bio');

      setMessage(data.message || 'Bio updated');
      if (data.user) setUser(data.user);
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
      <p><strong>Bio:</strong> {user.bio || 'No bio set'}</p>

      {message && <p style={{ color: 'lightgreen' }}>{message}</p>}
      {error && <p style={{ color: 'tomato' }}>{error}</p>}

      <form onSubmit={handleBioUpdate} style={{ marginTop: '2rem' }}>
        <h3>Update Bio</h3>
        <label>
          Bio:
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            style={inputStyle}
          />
        </label>
        <button type="submit" disabled={updating} style={buttonStyle}>
          {updating ? 'Updating...' : 'Update Bio'}
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
