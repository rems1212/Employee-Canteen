import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import EmployeeList from '../pages/EmployeeList';
import Box from '@mui/material/Box';

const Layout = () => {
  const location = useLocation();
  const [employeeListVisible, setEmployeeListVisible] = useState(true);

  const toggleEmployeeList = () => {
    setEmployeeListVisible(prev => !prev);
  };

  // Hide EmployeeList on inventory and related pages
  const hideEmployeeListPaths = ['/inventory', '/customers', '/sales', '/inventory-list', '/revenue', '/add-inventory'];
  const shouldShowEmployeeList = employeeListVisible && !hideEmployeeListPaths.includes(location.pathname);

  // Hide Sidebar on AdminDashboard page to avoid duplicate sidebar
  const hideSidebarPaths = ['/admin/dashboard'];
  // Also hide sidebar on any nested routes under /admin/dashboard
  const shouldShowSidebar = !hideSidebarPaths.some(path => location.pathname.startsWith(path));

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {shouldShowSidebar && (
        <Box
          sx={{
            flexShrink: 0,
            width: 240,
            position: 'fixed',
            height: '100vh',
            overflowY: 'auto',
            zIndex: 1300,
            bgcolor: 'background.paper',
            boxShadow: 3,
          }}
        >
          <Sidebar toggleEmployeeList={toggleEmployeeList} />
        </Box>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: shouldShowSidebar ? '240px' : 0,
          p: 3,
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        {shouldShowEmployeeList && <EmployeeList />}
        <Outlet />
      </Box>
    </Box>
  );
};




export default Layout;
