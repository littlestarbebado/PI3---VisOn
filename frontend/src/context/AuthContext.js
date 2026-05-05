import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vison_token');
    if (token) {
      api.get('/auth/me').then(r => setAdmin(r.data)).catch(() => localStorage.removeItem('vison_token')).finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('vison_token', data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => { localStorage.removeItem('vison_token'); setAdmin(null); };

  return <AuthContext.Provider value={{ admin, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
