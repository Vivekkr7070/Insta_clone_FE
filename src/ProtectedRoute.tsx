import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { token } = useContext(AuthContext);

  // Check if the user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return element;
};

export default ProtectedRoute;