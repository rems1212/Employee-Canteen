import React, { useEffect, useState, createContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyToken } from '../api/auth';
import Sidebar from './Sidebar';

export const AuthContext = createContext(null);

const AuthWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          navigate('/');
          return;
        }
        
        const data = await verifyToken(storedToken);
        setUserRole(data.role);
        setUserId(data.userId);
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  // Hide Sidebar on AdminDashboard page to avoid duplicate sidebar
  const hideSidebarPaths = ['/admin/dashboard'];
  const shouldShowSidebar = !hideSidebarPaths.some(path => location.pathname.startsWith(path));
  
  return isAuthenticated ? (
    <AuthContext.Provider value={{ userRole, userId, token }}>
      <div style={{ display: 'flex' }}>
        {shouldShowSidebar && <Sidebar userRole={userRole} />}
        <div style={{ flex: 1, padding: '20px' }}>
          {children}
        </div>
      </div>
    </AuthContext.Provider>
  ) : null;
};

export default AuthWrapper;
