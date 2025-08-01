import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext'; // <-- importamos auth

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, logout } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [sendingReview, setSendingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/v1/product.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setProduct(data);
          try {
            let revs = JSON.parse(data.reviews);
            if (!Array.isArray(revs)) revs = [];
            revs = revs.filter(r => r && r.id !== null && r.review && r.reviewer && r.uid && r.verified);
            setReviews(revs);
          } catch {
            setReviews([]);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);  

  if (loading) return <p style={{ color: '#0f0' }}>Loading...</p>;
  if (!product) return (
    <div style={{ color: '#0f0' }}>
      Product not found. <Link to="/">Go back</Link>
    </div>
  );

  let images = [];
  try {
    images = JSON.parse(product.image_location);
    if (!Array.isArray(images)) {
      images = [product.image_location];
    }
  } catch {
    images = [product.image_location];
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert('Product added to cart.');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    setSendingReview(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/comment.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: product.id,
          review: newReview,
          user_id: user.id
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setReviews((prev) => [...prev, {
          id: data.review_id || Date.now(),
          review: newReview,
          reviewer: user.username
        }]);
        setNewReview('');
      } else {
        alert(data.error || 'Failed to add review');
      }
    } catch (err) {
      alert('Error submitting review');
      console.error(err);
    } finally {
      setSendingReview(false);
    }
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
              <div key={r.id || Math.random()} style={styles.review}>
                <p style={styles.reviewText}>"{r.review}"</p>
                <p style={styles.reviewAuthor}>
              – <Link to={`/user/${r.uid}`} style={{ color: '#8f8', textDecoration: 'underline' }}>
                  {r.reviewer}
                  {r.verified === 1 && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/1200px-Twitter_Verified_Badge.svg.png" alt="Verified Badge" style={{ width: '20px', height: '20px', marginLeft: '8px', verticalAlign: 'middle' }}/>}
                </Link>
            </p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}

          {user ? (
            <form onSubmit={handleReviewSubmit} style={{ marginTop: '1rem' }}>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review..."
                rows={3}
                style={{
                  width: '100%',
                  background: '#000',
                  color: '#0f0',
                  border: '1px solid #0f0',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }}
                required
                disabled={sendingReview}
              />
              <button
                type="submit"
                disabled={sendingReview}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: '#0f0',
                  color: '#000',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: sendingReview ? 'not-allowed' : 'pointer'
                }}
              >
                {sendingReview ? 'Sending...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <p style={{ marginTop: '1rem', color: '#aaa' }}>
              <Link to="/login" style={{ color: '#0f0', textDecoration: 'underline' }}>
                Log in
              </Link> to write a review.
            </p>
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
