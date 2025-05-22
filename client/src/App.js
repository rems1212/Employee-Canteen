import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import EmployeeProfile from './pages/EmployeeProfile';
import AttendanceList from './pages/AttendanceList';
import InventoryDashboard from './pages/InventoryDashboard';
import InventoryList from './pages/InventoryList';
import AddInventory from './pages/AddInventory';
import AuthWrapper from './components/AuthWrapper';
import AdminWrapper from './components/AdminWrapper';
import SupplierList from './pages/SupplierList';
import SupplierManagement from './pages/SupplierManagement';
import Layout from './components/Layout';
import SupplierForm from './components/SupplierForm';
import UseItem from './pages/UseItem';
import './App.css';
import AddminDashboard from './pages/AddminDashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={<Layout />}>
            <Route path="dashboard" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
            <Route path="employees/:category" element={<AuthWrapper><EmployeeList /></AuthWrapper>} />
            <Route path="add-employee" element={<AuthWrapper><AddEmployee /></AuthWrapper>} />
            <Route path="edit-employee/:id" element={<AuthWrapper><EditEmployee /></AuthWrapper>} />
            <Route path="employee-profile/:id" element={<AuthWrapper><EmployeeProfile /></AuthWrapper>} />
            <Route path="attendance-list" element={<AuthWrapper><AttendanceList /></AuthWrapper>} />
            <Route path="inventory-dashboard" element={<AuthWrapper><InventoryDashboard /></AuthWrapper>} />
            <Route path="supplier-list" element={<AuthWrapper><SupplierManagement /></AuthWrapper>} />
            <Route path="use-item" element={<AuthWrapper><UseItem /></AuthWrapper>} />
            <Route path="inventory-list" element={<AuthWrapper><InventoryList /></AuthWrapper>} />
            <Route path="add-inventory" element={<AuthWrapper><AddInventory /></AuthWrapper>} />
            <Route path="add-vendors" element={<AuthWrapper><SupplierForm /></AuthWrapper>} />
            <Route path="admin/employees/:category" element={<AuthWrapper><AdminWrapper><EmployeeList /></AdminWrapper></AuthWrapper>} />
            <Route path="admin/add-employee" element={<AuthWrapper><AdminWrapper><AddEmployee /></AdminWrapper></AuthWrapper>} />
            <Route path="admin/edit-employee/:id" element={<AuthWrapper><AdminWrapper><EditEmployee /></AdminWrapper></AuthWrapper>} />
            <Route path="admin/employee-profile/:id" element={<AuthWrapper><AdminWrapper><EmployeeProfile /></AdminWrapper></AuthWrapper>} />
            <Route path="admin/attendance-list" element={<AuthWrapper><AdminWrapper><AttendanceList /></AdminWrapper></AuthWrapper>} />
            <Route path="admin/inventory-dashboard" element={<AuthWrapper><AdminWrapper><InventoryDashboard /></AdminWrapper></AuthWrapper>} />
            <Route path="admin/inventory-list" element={<AuthWrapper><AdminWrapper><InventoryList /></AdminWrapper></AuthWrapper>} />
            <Route path="admin/add-inventory" element={<AuthWrapper><AdminWrapper><AddInventory /></AdminWrapper></AuthWrapper>} />
            <Route path="admin/supplier-list" element={<AuthWrapper><AdminWrapper><SupplierManagement /></AdminWrapper></AuthWrapper>} />
          </Route>
          <Route path="/admin/dashboard" element={<AuthWrapper><AdminWrapper><AddminDashboard /></AdminWrapper></AuthWrapper>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
