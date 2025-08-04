import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function UserProfile() {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/user.php?id=${uid}`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.error);
        setUser(data.user);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [uid]);

  if (loading) return <p style={{ color: '#0f0' }}>Loading user profile...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!user) return <p style={{ color: '#0f0' }}>User not found.</p>;

  return (
    <div style={styles.container}>
    <h1 style={styles.title}>
        {user.username}
        {user.verified === 1 && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/1200px-Twitter_Verified_Badge.svg.png" alt="Verified Badge" style={{ width: '20px', height: '20px', marginLeft: '8px', verticalAlign: 'middle' }}/>}
    </h1>      
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Role:</strong> {user.role}</p>
    <p><strong>Verified:</strong> {user.verified ? 'Yes' : 'No'}</p>
    <p><strong>Bio:</strong> {user.bio || 'No bio provided.'}</p>

      <Link to="/" style={styles.backLink}>← Back to Home</Link>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '3rem auto',
    padding: '2rem',
    backgroundColor: '#111',
    color: '#0f0',
    borderRadius: '8px',
    fontFamily: 'monospace',
    boxShadow: '0 0 20px #0f0a',
  },
  title: {
    marginBottom: '1rem',
    fontSize: '2rem',
  },
  backLink: {
    marginTop: '2rem',
    display: 'inline-block',
    color: '#0f0',
    textDecoration: 'underline',
    cursor: 'pointer',
  }
};
