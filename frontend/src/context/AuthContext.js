import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import socket, { refreshSocketAuth } from '../services/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vison_token'));
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem('vison_token');
    localStorage.removeItem('vison_user');
    localStorage.removeItem('vison_admin');
    setToken(null);
    setUser(null);
    socket.disconnect();
  };

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('vison_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
        setToken(savedToken);
        localStorage.setItem('vison_user', JSON.stringify(response.data.user));
        refreshSocketAuth();
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });

    const { token: newToken, user: authenticatedUser } = response.data;

    localStorage.setItem('vison_token', newToken);
    localStorage.setItem('vison_user', JSON.stringify(authenticatedUser));

    setToken(newToken);
    setUser(authenticatedUser);
    refreshSocketAuth();

    return authenticatedUser;

  } catch (err) {
    console.error('ERRO LOGIN:', err);
    console.error('RESPONSE:', err.response);
    throw err;
  }
};

  const logout = () => clearSession();

  return (
    <AuthContext.Provider value={{
      user,
      admin: user?.role === 'Admin' ? user : null,
      role: user?.role || null,
      token,
      login,
      logout,
      loading,
      isAuthenticated: Boolean(user && token)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
