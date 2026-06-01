import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getHomeForRole(role) {
  if (role === 'Admin') return '/admin';
  if (role === 'Gestor') return '/gestor';
  if (role === 'Cliente') return '/cliente';
  return '/login';
}

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, admin, role, loading } = useAuth();
  const location = useLocation();
  const currentUser = user || admin;
  const currentRole = role || currentUser?.role;

  if (loading) {
    return <div className="p-4 fw-bold">A verificar permissões...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to={getHomeForRole(currentRole)} replace />;
  }

  return children || <Outlet />;
}
