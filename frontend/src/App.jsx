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
import AdminPage from './components/AdminPage';
import UserProfile from './components/UserProfile';

export default function App() {
  return (
    <Router> 
      <AuthProvider>
        <CartProvider>
          <Header />
          <main className="container">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/user/:uid" element={<UserProfile />} />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
