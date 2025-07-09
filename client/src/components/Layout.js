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

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: '240px',
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
