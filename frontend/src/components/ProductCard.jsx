import React from 'react';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  let images = [];

  try {
    images = JSON.parse(product.image_location);
    if (!Array.isArray(images)) {
      images = [product.image_location];
    }
  } catch {
    images = [product.image_location];
  }

  return (
    <div style={{
      border: '1px solid #0f0',
      padding: '1rem',
      background: '#111',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <Link to={`/product/${product.id}`} state={{ product }} style={{ color: '#0f0' }}>
        <img src={images[0]} alt={product.name} style={{ width: '100%', marginBottom: '1rem' }} />
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </Link>
      <button
        onClick={() => addToCart(product)}
        style={{
          backgroundColor: '#0f0',
          color: '#000',
          border: 'none',
          marginTop: '1rem',
          padding: '0.5rem'
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
