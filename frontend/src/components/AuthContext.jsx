import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/account.php', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Not authenticated');

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const register = async (username, password, description, address, phone, email) => {
    const response = await fetch('http://127.0.0.1:8000/api/v1/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, description, address, phone, email }),
    });
  
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Registration failed');
    }
  
    const data = await response.json();
    return data;
  };
  

  const login = async (username, password) => {
    const res = await fetch('http://127.0.0.1:8000/api/v1/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }

    const data = await res.json();

    setUser(data.user);

    return data;
  };

  const updateProfile = async ({ bio, currentPassword, newPassword }) => {
    const res = await fetch('http://127.0.0.1:8000/api/v1/update_profile.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ bio, currentPassword, newPassword }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Update failed');
    }

    const data = await res.json();

    return data;
  };

  const logout = async () => {
    await fetch('http://127.0.0.1:8000/api/v1/logout.php', {
      credentials: 'include',
    });
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}