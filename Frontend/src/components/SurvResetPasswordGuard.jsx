import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import api from '../api/axios';
import LoadingPulse from './LoadingPulse';

const SurvResetPasswordGuard = ({ children }) => {
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
        const res = await api.post('/surveillants/verify-reset-token', { token });
        if (res.data.valid) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (err) {
        setIsValid(false);
      }
    };

    verifyToken();
  }, [location]);

  if (isValid === null) return <LoadingPulse />;
  return isValid ? children : <Navigate to="/loginsurv" replace />;
};

export default SurvResetPasswordGuard;
