import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import api from '../api/axios';
import LoadingPulse from './LoadingPulse';

const AdminResetPasswordGuard = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      setIsValid(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const { data } = await api.post('/Admin/verify-reset-token', { token });
        setIsValid(data.valid === true);
      } catch (err) {
        console.error('Erreur lors de la vérification du token :', err);
        setIsValid(false);
      }
    };

    verifyToken();
  }, [location]);

  if (isValid === null) return <LoadingPulse />;
  return isValid ? children : <Navigate to="/loginadmin" replace />;
};

export default AdminResetPasswordGuard;
