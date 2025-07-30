import React from 'react';
import { useCart } from './CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    alert('Thank you for your purchase!');
    clearCart();
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem', color: '#0f0', fontFamily: 'monospace' }}>
        <h2>Your Cart is Empty</h2>
        <p>Go back and <Link to="/" style={{ color: '#0f0', textDecoration: 'underline' }}>add some hacker merch</Link>!</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      color: '#0f0',
      fontFamily: 'monospace'
    }}>
      <h2 style={{ marginBottom: '2rem' }}>Your Cart</h2>

      {cart.map(item => (
        <div
          key={item.product.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#111',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            boxShadow: '0 0 10px #0f0a'
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.product.name}</h3>
            <p style={{ margin: 0 }}>${item.product.price} × {item.quantity} = <strong>${item.product.price * item.quantity}</strong></p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              style={btnStyle}
            >-</button>
            <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              style={btnStyle}
            >+</button>
            <button
              onClick={() => removeFromCart(item.product.id)}
              style={{
                ...btnStyle,
                background: 'transparent',
                color: '#f00',
                border: '1px solid #f00'
              }}
            >Remove</button>
          </div>
        </div>
      ))}

      <h3 style={{
        textAlign: 'right',
        marginTop: '2rem',
        fontSize: '1.5rem'
      }}>
        Total: ${total}
      </h3>

      <div style={{ textAlign: 'right', marginTop: '2rem' }}>
        <button onClick={handleCheckout} style={checkoutBtnStyle}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  background: '#0f0',
  color: '#000',
  border: 'none',
  borderRadius: '4px',
  padding: '0.3rem 0.75rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 0 5px #0f0a',
  transition: 'all 0.2s',
};

const checkoutBtnStyle = {
  background: '#0f0',
  color: '#000',
  border: 'none',
  borderRadius: '6px',
  padding: '0.75rem 1.5rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem',
  boxShadow: '0 0 10px #0f0a',
  transition: 'all 0.2s',
};
