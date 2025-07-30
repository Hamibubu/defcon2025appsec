import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

export default function Header() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: '#111',
      color: '#0f0',
      fontFamily: 'monospace',
      boxShadow: '0 0 10px #0f0a'
    }}>
      <Link to="/" style={{ color: '#0f0', textDecoration: 'none' }}>
        <h1>DEFCON STORE</h1>
      </Link>
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/">Products</Link>
        <Link to="/cart">Cart ({cart.reduce((acc, i) => acc + i.quantity, 0)})</Link>
        {user ? (
          <>
            <Link to="/account">{user.username}</Link>
            <button
              onClick={logout}
              style={{
                background: 'transparent',
                color: '#0f0',
                border: '1px solid #0f0',
                borderRadius: '4px',
                padding: '0.25rem 0.75rem',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
