import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    try {
      await register(username.trim(), password.trim(), description);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '3rem auto',
      padding: '2rem',
      background: '#111',
      borderRadius: '8px',
      boxShadow: '0 0 20px #0f0a',
      color: '#0f0',
      fontFamily: 'monospace'
    }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={inputStyle}
        />
        <button
          type="submit"
          style={btnStyle}
        >Register</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login" style={{ color: '#0f0' }}>Login</Link>
      </p>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '4px',
  border: '1px solid #0f0',
  background: '#000',
  color: '#0f0',
  fontSize: '1rem'
};

const btnStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.75rem',
  background: '#0f0',
  color: '#000',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem',
  boxShadow: '0 0 10px #0f0a'
};
