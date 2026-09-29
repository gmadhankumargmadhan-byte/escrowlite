import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/escrowApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('escrow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('escrow_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ usernameOrEmail, password });
      if (res.data && res.data.success) {
        const userData = {
          userId: res.data.userId,
          username: res.data.username,
          email: res.data.email,
          name: res.data.name,
          role: res.data.role,
        };
        const tokenVal = res.data.token;

        setUser(userData);
        setToken(tokenVal);
        localStorage.setItem('escrow_user', JSON.stringify(userData));
        localStorage.setItem('escrow_token', tokenVal);
        return { success: true, user: userData };
      } else {
        throw new Error(res.data?.message || 'Login failed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('escrow_user');
    localStorage.removeItem('escrow_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
