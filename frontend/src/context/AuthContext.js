import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vison_token');
    if (token) {
      api.get('/auth/me')
        .then(r => {
          setAdmin(r.data);
          setUser(r.data);
          setRole(r.data?.role || null);
        })
        .catch(() => {
          localStorage.removeItem('vison_token');
          setAdmin(null);
          setUser(null);
          setRole(null);
        })
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('vison_token', data.token);
    const loggedUser = data.admin || data.user || data.cliente;
    setAdmin(loggedUser);
    setUser(loggedUser);
    setRole(loggedUser?.role || data.role || null);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('vison_token');
    setAdmin(null);
    setUser(null);
    setRole(null);
  };

  return <AuthContext.Provider value={{ admin, user, role, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
