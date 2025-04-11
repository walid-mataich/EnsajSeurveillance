import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/loginadmin" replace />;
  }

  return <Outlet />; // Rend les sous-routes si authentifié
};

export default ProtectedRoute;
