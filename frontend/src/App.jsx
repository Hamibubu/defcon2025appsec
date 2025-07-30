import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';
import ProductDetail from './components/ProductDetail';
import AccountPage from './components/AccountPage';
import LoginPage from './components/LoginPage';
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import RegisterPage from './components/RegisterPage';

export default function App() {
  const products = [
    { id: 1, name: 'Hoodie DEFCON', price: 59.99 },
    { id: 2, name: 'Sticker Pack', price: 9.99 }
  ];

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <main className="container">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail products={products} />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
