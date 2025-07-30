import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useCart } from './CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();

  // Obtener producto desde location.state
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  if (!product) {
    return (
      <div style={styles.notFound}>
        Product not found or no product data passed.
        <p><Link to="/" style={styles.link}>Back to products</Link></p>
      </div>
    );
  }

  // Usamos image_location como única imagen
  const images = [product.image_location];

  // Parsear reviews JSON, con fallback
  let reviews = [];
  try {
    reviews = JSON.parse(product.reviews);
  } catch {
    reviews = [];
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert('Product added to cart.');
  };

  return (
    <div style={styles.container}>
      {/* Images + Thumbnails */}
      <div>
        <img
          src={images[currentImage]}
          alt={product.name}
          style={styles.mainImage}
        />
        <div style={styles.thumbnails}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Thumbnail ${idx}`}
              onClick={() => setCurrentImage(idx)}
              style={{
                ...styles.thumbnail,
                border: idx === currentImage ? '2px solid #0f0' : '1px solid #555'
              }}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div>
        <h2 style={styles.name}>{product.name}</h2>
        <p style={styles.price}>${product.price}</p>
        <p style={styles.description}>
          {product.description}
        </p>

        {/* Specifications */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Specifications</h4>
          <ul style={styles.specs}>
            {product.specifications
              ? product.specifications.split(',').map((spec, i) => (
                  <li key={i}>{spec.trim()}</li>
                ))
              : <li>No specifications available.</li>
            }
          </ul>
        </div>

        {/* Quantity Controls */}
        <div style={styles.qtyContainer}>
          <span>Quantity:</span>
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            style={styles.qtyBtn}
          >-</button>
          <span>{quantity}</span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            style={styles.qtyBtn}
          >+</button>
        </div>

        {/* Add to Cart */}
        <button onClick={handleAddToCart} style={styles.addBtn}>
          Add to Cart
        </button>

        {/* Reviews */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Reviews</h4>
          {reviews.length > 0 ? (
            reviews.map(r => (
              <div key={r.id} style={styles.review}>
                <p style={styles.reviewText}>"{r.review}"</p>
                <p style={styles.reviewAuthor}>– {r.reviewer}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

        <p style={styles.backLink}>
          <Link to="/" style={styles.link}>Back to products</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '2rem auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    fontFamily: 'monospace',
    color: '#0f0'
  },
  notFound: {
    textAlign: 'center',
    marginTop: '4rem',
    color: '#0f0',
    fontFamily: 'monospace'
  },
  mainImage: {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
    borderRadius: '8px',
    boxShadow: '0 0 20px #0f0a'
  },
  thumbnails: {
    marginTop: '1rem',
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center'
  },
  thumbnail: {
    width: '80px',
    height: '50px',
    objectFit: 'cover',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  name: { marginTop: 0 },
  price: {
    fontSize: '1.5rem',
    margin: '1rem 0',
    fontWeight: 'bold'
  },
  description: {
    marginBottom: '1.5rem',
    lineHeight: '1.6'
  },
  section: {
    marginTop: '2rem'
  },
  sectionTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem'
  },
  specs: {
    listStyle: 'none',
    paddingLeft: 0
  },
  qtyContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  qtyBtn: {
    background: '#0f0',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    padding: '0.3rem 0.75rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 0 5px #0f0a',
    transition: 'all 0.2s'
  },
  addBtn: {
    display: 'inline-block',
    background: '#0f0',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    padding: '0.75rem 1.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    boxShadow: '0 0 10px #0f0a',
    marginTop: '1rem'
  },
  review: {
    background: '#111',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    boxShadow: '0 0 10px #0f0a'
  },
  reviewText: {
    margin: 0
  },
  reviewAuthor: {
    margin: '0.5rem 0 0 0',
    fontSize: '0.9rem',
    color: '#8f8'
  },
  backLink: {
    marginTop: '2rem'
  },
  link: {
    color: '#0f0',
    textDecoration: 'underline'
  }
};
