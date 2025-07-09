import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthWrapper, { AuthContext } from './AuthWrapper';

const AdminWrapper = ({ children }) => {
  return (
    <AuthWrapper>
      <AdminContentWrapper>{children}</AdminContentWrapper>
    </AuthWrapper>
  );
};

const AdminContentWrapper = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // AuthContext not available yet, render null or loading
    return null;
  }

  if (authContext.userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminWrapper;
