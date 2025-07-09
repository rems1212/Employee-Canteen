import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  styled, 
  Avatar, 
  Button,
  LinearProgress,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  AttachMoney as RevenueIcon,
  Inventory as InventoryIcon,
  AddCircleOutline
} from '@mui/icons-material';
import { AuthContext } from '../components/AuthWrapper';
import SupplierForm from '../components/SupplierForm';

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 6px 20px rgba(69, 101, 173, 0.12)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
  border: '1px solid #E0E7FF',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(69, 101, 173, 0.18)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    backgroundColor: theme.palette.primary.main,
  }
}));

// Ensure StatCard is keyboard accessible and clickable
const ClickableStatCard = (props) => {
  const { onClick, children } = props;
  return (
    <StatCard
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{ outline: 'none' }}
    >
      {children}
    </StatCard>
  );
};

const StatIcon = styled(Avatar)(({ theme, category }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: '#FFF',
  width: theme.spacing(7),
  height: theme.spacing(7),
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(69, 101, 173, 0.3)',
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  }
}));

const InventoryDashboard = () => {
  const { userRole, userId, token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    customers: 0,
    sales: 0,
    inventory: 0,
    revenue: 0,
    inventoryPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [supplierFormOpen, setSupplierFormOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [customersRes, salesRes, inventoryRes] = await Promise.all([
          fetch(`http://localhost:2000/api/customers${userRole === 'manager' ? `?managerId=${userId}` : ''}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`http://localhost:2000/api/sales${userRole === 'manager' ? `?managerId=${userId}` : ''}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`http://localhost:2000/api/inventory${userRole === 'manager' ? `?managerId=${userId}` : ''}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const customersData = customersRes.ok ? await customersRes.json() : [];
        const salesData = salesRes.ok ? await salesRes.json() : [];
        const inventoryData = inventoryRes.ok ? await inventoryRes.json() : [];

        const revenue = salesData.reduce((acc, sale) => acc + (sale.amount || 0), 0);
        const inventoryPercentage = inventoryData.length > 0 ? 
          Math.min(100, Math.round((inventoryData.filter(item => item.quantity > 0).length / inventoryData.length) * 100)) : 0;

        setStats({
          customers: customersData.length,
          sales: salesData.length,
          inventory: inventoryData.length,
          revenue,
          inventoryPercentage
        });
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, userRole, token]);

  const statCards = [
    {
      title: 'Total Inventory',
      value: stats.inventory,
      icon: <InventoryIcon />,
      path: '/inventory-list',
      progress: stats.inventoryPercentage,
      subtitle: `${stats.inventoryPercentage}% in stock`
    },
    {
      title: 'Total Vendors',
      value: stats.customers,
      icon: <PeopleIcon />,
      path: '/supplier-list',
      progress: null
    }
  ];

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      background: 'radial-gradient(circle at top right, #F8FAFF 0%, #FFFFFF 60%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 4
      }}>
        <Typography variant="h4" sx={{ 
          color: theme.palette.primary.dark,
          fontWeight: 700,
          mb: { xs: 2, sm: 0 },
          fontSize: { xs: '1.75rem', md: '2.125rem' }
        }}>
          Inventory Overview
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddCircleOutline />}
            onClick={() => navigate('/add-inventory')}
            sx={{
              borderRadius: '12px',
              padding: '10px 20px',
              boxShadow: '0 4px 12px rgba(69, 101, 173, 0.2)',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              '&:hover': {
                boxShadow: '0 6px 16px rgba(69, 101, 173, 0.3)',
              },
              mr: 2
            }}
          >
            Add Inventory
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid key={index} sx={{ flexBasis: { xs: '100%', sm: '48%', md: '23%' } }}>
            <ClickableStatCard onClick={() => navigate(card.path)}>
              <StatIcon>
                {card.icon}
              </StatIcon>
              <Typography variant="subtitle1" sx={{ 
                color: theme.palette.text.secondary,
                fontWeight: 500,
                mb: 0.5,
                opacity: 0.8
              }}>
                {card.title}
              </Typography>
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                color: theme.palette.primary.dark,
                mb: 0.5
              }}>
                {card.value}
              </Typography>
              {card.subtitle && (
                <Typography variant="caption" sx={{
                  color: theme.palette.success.main,
                  fontWeight: 500
                }}>
                  {card.subtitle}
                </Typography>
              )}
              {card.progress !== null && (
                <ProgressBar 
                  variant="determinate" 
                  value={card.progress} 
                  sx={{ 
                    mt: 2,
                    visibility: card.progress !== null ? 'visible' : 'hidden'
                  }} 
                />
              )}
            </ClickableStatCard>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ 
        mt: 4,
        p: 3,
        borderRadius: '16px',
        background: 'rgba(224, 231, 255, 0.3)',
        border: '1px dashed rgba(69, 101, 173, 0.3)',
        textAlign: 'center'
      }}>
      </Box>
    </Box>
  );
};

export default InventoryDashboard;
