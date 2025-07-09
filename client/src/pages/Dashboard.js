import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid,
  Paper,
  Avatar,
  LinearProgress,
  useTheme
} from '@mui/material';
import { 
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  LocalCafe as WaiterIcon,
  CleaningServices as CleaningIcon,
  EventAvailable as AttendanceIcon,
  SupervisorAccount as SupervisorIcon,
  Kitchen as KitchenIcon,
  Engineering as UtilityIcon
} from '@mui/icons-material';
import { AuthContext } from '../components/AuthWrapper';
import { getEmployees } from '../api/employee';

// Custom styled components with modern design
const StatCard = ({ category, count, title, icon, onClick }) => {
  const theme = useTheme();
  const colors = {
    total: theme.palette.primary.main,
    supervisor: '#6a1b9a',
    Manager: '#2e7d32',
    Cook: '#d84315',
    'Assistant Cook': '#ff8f00',
    'Kitchen-Helpers': '#00897b',
    Sweepers: '#5e35b1',
    waiter: '#e65100',
    Utility: '#37474f',
    attendance: '#0277bd'
  };

  return (
    <Paper 
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        background: `linear-gradient(135deg, ${colors[category]} 0%, ${theme.palette.background.paper} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          '&::before': {
            opacity: 0.1
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          transition: 'all 0.5s ease'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle2" sx={{ 
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 500,
            mb: 0.5,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '0.75rem'
          }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ 
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.2
          }}>
            {count}
          </Typography>
        </Box>
        <Avatar sx={{ 
          bgcolor: 'rgba(255,255,255,0.2)',
          width: 48,
          height: 48,
          color: '#fff'
        }}>
          {icon}
        </Avatar>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={100} 
        sx={{ 
          mt: 2,
          height: 4,
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.2)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#fff'
          }
        }}
      />
    </Paper>
  );
};

const Dashboard = () => {
  const { userRole, userId } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    supervisor: 0,
    Manager: 0,
    Cook: 0,
    'Assistant Cook': 0,
    'Kitchen-Helpers': 0,
    Sweepers: 0,
    waiter: 0,
    Utility: 0,
    attendance: 0
  });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employees = await getEmployees(userRole === 'manager' ? userId : null);
        
        const newStats = {
          total: employees.length,
          supervisor: employees.filter(e => e.category === 'supervisor').length,
          Manager: employees.filter(e => e.category === 'Manager').length,
          Cook: employees.filter(e => e.category === 'Cook').length,
          'Assistant Cook': employees.filter(e => e.category === 'Assistant Cook').length,
          'Kitchen-Helpers': employees.filter(e => e.category === 'Kitchen-Helpers').length,
          Sweepers: employees.filter(e => e.category === 'Sweepers').length,
          waiter: employees.filter(e => e.category === 'waiter').length,
          Utility: employees.filter(e => e.category === 'Utility').length,
          attendance: 0
        };

        // Fetch attendance data for today
        const today = new Date().toISOString().split('T')[0];
        const attendanceRes = await fetch(`http://localhost:2000/api/attendance?date=${today}`);
        if (attendanceRes.ok) {
          const attendanceData = await attendanceRes.json();
          newStats.attendance = attendanceData.filter(emp => emp.attendance === 'present').length;
        }

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [userId, userRole]);

  const statCards = [
    { category: 'total', title: 'Total Employees', icon: <PeopleIcon /> },
    { category: 'supervisor', title: 'Supervisors', icon: <SupervisorIcon /> },
    { category: 'Manager', title: 'Managers', icon: <SupervisorIcon /> },
    { category: 'Cook', title: 'Cooks', icon: <RestaurantIcon /> },
    { category: 'Assistant Cook', title: 'Assistant Cooks', icon: <KitchenIcon /> },
    { category: 'Kitchen-Helpers', title: 'Kitchen Helpers', icon: <KitchenIcon /> },
    { category: 'Sweepers', title: 'Sweepers', icon: <CleaningIcon /> },
    { category: 'waiter', title: 'Waiters', icon: <WaiterIcon /> },
    { category: 'Utility', title: 'Utility Staff', icon: <UtilityIcon /> },
    { category: 'attendance', title: 'Present Today', icon: <AttendanceIcon /> }
  ];

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      minHeight: '100vh',
      background: theme.palette.background.default
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 800,
          color: theme.palette.text.primary,
          fontFamily: '"Poppins", sans-serif',
          letterSpacing: '0.5px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          Employee Management Dashboard
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: '#fff',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              transform: 'translateY(-1px)'
            }
          }}
          onClick={() => navigate('/add-employee')}
          startIcon={<PeopleIcon />}
        >
          Add New Employee
        </Button>
      </Box>

      {stats.total === 0 ? (
        <Box sx={{ 
          mt: 10, 
          textAlign: 'center',
          p: 4,
          borderRadius: 4,
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          maxWidth: 600,
          mx: 'auto'
        }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: theme.palette.text.secondary }}>
            Your employee database is currently empty
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/add-employee')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              fontWeight: 600
            }}
          >
            Add Your First Employee
          </Button>
        </Box>
      ) : (
        <>
          {/* Stats Grid */}
          <Grid container spacing={3}>
            {statCards.map((card) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={card.category}>
                <StatCard
                  category={card.category}
                  count={stats[card.category]}
                  title={card.title}
                  icon={card.icon}
                  onClick={() => {
                    if (card.category === 'attendance') {
                      navigate('/attendance-list');
                    } else if (card.category === 'total') {
                      navigate('/employees/all');
                    } else {
                      navigate(`/employees/${card.category}`);
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* Additional Info Section */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            {/* Attendance Overview removed as per request */}
          </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;