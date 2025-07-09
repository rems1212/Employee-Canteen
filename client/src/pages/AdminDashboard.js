import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid,
  Paper,
  styled,
  Avatar
} from '@mui/material';
import { getEmployees } from '../api/employee';
import {
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  LocalCafe as WaiterIcon,
  CleaningServices as SweeperIcon,
  CleaningServices as CleaningServicesIcon
} from '@mui/icons-material';
import { AuthContext } from '../components/AuthWrapper';

// Custom styled components with a modern blue-themed palette
const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  transition: 'all 0.4s ease',
  cursor: 'pointer',
  backgroundColor: '#E3F2FD', // Light blue background
  border: '2px solid #90CAF9', // Blue border
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 12px 36px rgba(0,0,0,0.2)'
  }
}));

const StatIcon = styled(Avatar)(({ theme, category }) => ({
  backgroundColor: getCategoryColor(category).bg,
  color: getCategoryColor(category).text,
  width: theme.spacing(7),
  height: theme.spacing(7),
  marginBottom: theme.spacing(3),
  boxShadow: '0 3px 12px rgba(0,0,0,0.15)'
}));

// Color mapping based on category with blue accents
const getCategoryColor = (category) => {
  switch(category) {
    case 'total':
      return { bg: '#1976D2', text: '#FFF' }; // Blue
    case 'supervisor':
      return { bg: '#1565C0', text: '#FFF' }; // Darker Blue
    case 'Manager':
      return { bg: '#0D47A1', text: '#FFF' }; // Navy Blue
    case 'Cook':
      return { bg: '#64B5F6', text: '#0D47A1' }; // Light Blue
    case 'Assistant Cook':
      return { bg: '#90CAF9', text: '#0D47A1' }; // Sky Blue
    case 'Kitchen-Helpers':
      return { bg: '#42A5F5', text: '#0D47A1' }; // Medium Blue
    case 'Sweepers':
      return { bg: '#81D4FA', text: '#01579B' }; // Pale Blue
    case 'waiter':
      return { bg: '#4FC3F7', text: '#01579B' }; // Bright Blue
    case 'Utility':
      return { bg: '#29B6F6', text: '#01579B' }; // Vivid Blue
    default:
      return { bg: '#1976D2', text: '#FFF' };
  }
};

const AdminDashboard = () => {
  const { userId } = useContext(AuthContext);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [cooksCount, setCooksCount] = useState(0);
  const [waitersCount, setWaitersCount] = useState(0);
  const [sweepersCount, setSweepersCount] = useState(0);
  const [supervisorsCount, setSupervisorsCount] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employees = await getEmployees(null); // Admin sees all employees
        setTotalEmployees(employees.length);
        setCooksCount(employees.filter(e => e.category === 'cook').length);
        setWaitersCount(employees.filter(e => e.category === 'waiter').length);
        setSweepersCount(employees.filter(e => e.category === 'sweeper').length);
        setSupervisorsCount(employees.filter(e => e.category === 'supervisor').length);

        // Fetch attendance data for today
        const today = new Date().toISOString().split('T')[0];
        const attendanceRes = await fetch(`http://localhost:2000/api/attendance?date=${today}`);
        if (!attendanceRes.ok) throw new Error('Failed to fetch attendance');
        const attendanceData = await attendanceRes.json();
        const presentCount = attendanceData.filter(emp => emp.attendance === 'present').length;
        setTotalAttendance(presentCount);
      } catch (error) {
        console.error('Error fetching employees or attendance:', error);
      }
    };
    
    fetchData();
  }, [userId]);

  return (
    <Box sx={{ 
      p: 5,
      backgroundColor: '#E3F2FD', // Light blue background
      minHeight: '100vh'
    }}>
      <Typography variant="h3" sx={{ 
        mb: 6,
        color: '#0D47A1',
        fontWeight: 700,
        fontFamily: '"Roboto", sans-serif',
        letterSpacing: '1px',
        textAlign: 'center'
      }}>
        Admin Dashboard
      </Typography>

      {totalEmployees === 0 ? (
        <Box sx={{ mt: 12, textAlign: 'center', color: '#1976D2' }}>
          <Typography variant="h5" gutterBottom>
            No employees added yet.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/add-employee')}
            sx={{ mt: 3, backgroundColor: '#1976D2' }}
          >
            Add Your First Employee
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard onClick={() => navigate('/employees/all')}>
              <StatIcon category="total">
                <PeopleIcon />
              </StatIcon>
              <Typography variant="subtitle1" sx={{ 
                color: '#1976D2',
                fontWeight: 600,
                mb: 2,
                letterSpacing: '0.4px'
              }}>
                Total Employees
              </Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 800,
                color: '#0D47A1',
                fontFamily: '"Roboto", sans-serif'
              }}>
                {totalEmployees}
              </Typography>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard onClick={() => navigate('/employees/supervisor')}>
              <StatIcon category="supervisor">
                <PeopleIcon />
              </StatIcon>
              <Typography variant="subtitle1" sx={{ 
                color: '#1565C0',
                fontWeight: 600,
                mb: 2,
                letterSpacing: '0.4px'
              }}>
                Supervisors
              </Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 800,
                color: '#0D47A1',
                fontFamily: '"Roboto", sans-serif'
              }}>
                {supervisorsCount}
              </Typography>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard onClick={() => navigate('/employees/Manager')}>
              <StatIcon category="Manager">
                <PeopleIcon />
              </StatIcon>
              <Typography variant="subtitle1" sx={{ 
                color: '#0D47A1',
                fontWeight: 600,
                mb: 2,
                letterSpacing: '0.4px'
              }}>
                Managers
              </Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 800,
                color: '#0D47A1',
                fontFamily: '"Roboto", sans-serif'
              }}>
                0
              </Typography>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard onClick={() => navigate('/employees/Cook')}>
              <StatIcon category="Cook">
                <RestaurantIcon />
              </StatIcon>
              <Typography variant="subtitle1" sx={{ 
                color: '#64B5F6',
                fontWeight: 600,
                mb: 2,
                letterSpacing: '0.4px'
              }}>
                Cooks
              </Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 800,
                color: '#0D47A1',
                fontFamily: '"Roboto", sans-serif'
              }}>
                {cooksCount}
              </Typography>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard onClick={() => navigate('/employees/Assistant Cook')}>
              <StatIcon category="Assistant Cook">
                <RestaurantIcon />
              </StatIcon>
              <Typography variant="subtitle1" sx={{ 
                color: '#90CAF9',
                fontWeight: 600,
                mb: 2,
                letterSpacing: '0.4px'
              }}>
                Assistant Cooks
              </Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 800,
                color: '#0D47A1',
                fontFamily: '"Roboto", sans-serif'
              }}>
                0
              </Typography>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard onClick={() => navigate('/employees/Kitchen-Helpers')}>
              <StatIcon category="Kitchen-Helpers">
                <CleaningServicesIcon />
              </StatIcon>
              <Typography variant="subtitle1" sx={{ 
                color: '#42A5F5',
                fontWeight: 600,
                mb: 2,
                letterSpacing: '0.4px'
              }}>
                Kitchen Helpers
              </Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 800,
                color: '#0D47A1',
                fontFamily: '"Roboto", sans-serif'
              }}>
                0
              </Typography>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard onClick={() => navigate('/employees/Sweepers')}>
              <StatIcon category="Sweepers">
                <CleaningServicesIcon />
              </StatIcon>
              <Typography variant="subtitle1" sx={{ 
                color: '#81D4FA',
                fontWeight: 600,
                mb: 2,
                letterSpacing: '0.4px'
              }}>
                Sweepers
              </Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 800,
                color: '#0D47A1',
                fontFamily: '"Roboto", sans-serif'
              }}>
                {sweepersCount}
              </Typography>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard onClick={() => navigate('/employees/Utility')}>
              <StatIcon category="Utility">
                <PeopleIcon />
              </StatIcon>
              <Typography variant="subtitle1" sx={{ 
                color: '#29B6F6',
                fontWeight: 600,
                mb: 2,
                letterSpacing: '0.4px'
              }}>
                Utility
              </Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 800,
                color: '#0D47A1',
                fontFamily: '"Roboto", sans-serif'
              }}>
                0
              </Typography>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              onClick={() => navigate('/attendance-list')}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') navigate('/attendance-list'); }}
            >
              <StatIcon category="total">
                <PeopleIcon />
              </StatIcon>
              <Typography variant="subtitle1" sx={{ 
                color: '#1976D2',
                fontWeight: 600,
                mb: 2,
                letterSpacing: '0.4px'
              }}>
                Total Attendance
              </Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 800,
                color: '#0D47A1',
                fontFamily: '"Roboto", sans-serif'
              }}>
                {totalAttendance}
              </Typography>
            </StatCard>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AdminDashboard;
