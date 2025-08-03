import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  type: 'user' | 'business';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, type }) => {
  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={type === 'user' ? '/login' : '/business/login'} replace />;
  }

  if (userType !== type) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;