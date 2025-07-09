import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled, keyframes } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LogoutIcon from '@mui/icons-material/Logout';
import { Paper, Box, Button, Collapse, Divider } from '@mui/material';
import { AuthContext } from './AuthWrapper';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(212, 162, 89, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(212, 162, 89, 0); }
  100% { box-shadow: 0 0 0 0 rgba(212, 162, 89, 0); }
`;

const drawerWidth = 280;

const SidebarContainer = styled(Paper)(({ theme }) => ({
  width: drawerWidth,
  background: 'linear-gradient(180deg, #1E1B16 0%, #24201B 100%)',
  color: '#E8E3DE',
  height: '100vh',
  paddingTop: '24px',
  borderRadius: '0',
  boxShadow: '8px 0 24px rgba(0,0,0,0.3)',
  position: 'sticky',
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 10,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '4px',
    height: '100%',
    background: 'linear-gradient(to bottom, #D4A259, #B8863B)',
  }
}));

const BrandLogoStyled = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  marginBottom: '24px',
  '& img': {
    height: '40px',
    animation: `${pulse} 2s infinite`,
  }
});

const CustomListItem = styled(ListItem)({
  padding: '4px 16px',
  animation: `${fadeIn} 0.3s ease-out forwards`,
});

const CustomListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  borderRadius: '8px',
  margin: '4px 12px',
  padding: '12px 16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: selected ? 'linear-gradient(90deg, #3A3630 0%, #2E2A25 100%)' : 'transparent',
  borderLeft: selected ? '3px solid #D4A259' : '3px solid transparent',
  '&:hover': {
    background: selected ? 'linear-gradient(90deg, #3A3630 0%, #2E2A25 100%)' : 'rgba(46, 42, 37, 0.6)',
    transform: selected ? 'none' : 'translateX(4px)',
  },
  '& .MuiListItemIcon-root': {
    minWidth: '36px',
    color: selected ? '#D4A259' : '#A0988E',
    transition: 'all 0.3s ease',
  },
  '& .MuiListItemText-primary': {
    fontWeight: selected ? 600 : 500,
    color: selected ? '#FFFFFF' : '#C8C2BC',
    fontSize: '0.95rem',
    letterSpacing: '0.25px',
  },
}));

const CategoryHeader = styled(Button)({
  width: '100%',
  color: '#E8E3DE',
  justifyContent: 'space-between',
  padding: '12px 20px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  letterSpacing: '0.5px',
  backgroundColor: 'transparent',
  borderRadius: '8px',
  margin: '8px 0',
  '&:hover': {
    backgroundColor: 'rgba(212, 162, 89, 0.1)',
  },
  '& .MuiButton-startIcon': {
    transition: 'transform 0.3s ease',
  }
});

const SubMenuItem = styled(CustomListItemButton)({
  marginLeft: '32px',
  padding: '10px 16px',
  borderLeft: '2px solid rgba(212, 162, 89, 0.3)',
  '& .MuiListItemText-primary': {
    fontSize: '0.9rem',
  },
});

const LogoutButton = styled(Button)({
  margin: '16px',
  padding: '12px',
  borderRadius: '8px',
  background: 'rgba(212, 162, 89, 0.1)',
  color: '#D4A259',
  border: '1px solid rgba(212, 162, 89, 0.3)',
  textTransform: 'none',
  fontWeight: 500,
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(212, 162, 89, 0.2)',
    transform: 'translateY(-2px)',
  }
});

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categoriesVisible, setCategoriesVisible] = useState(true);
  const { userRole } = useContext(AuthContext);

  const toggleCategories = () => {
    setCategoriesVisible(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <SidebarContainer elevation={0}>
      <BrandLogoStyled>
        <img src="/path-to-your-logo.png" alt="Company Logo" />
      </BrandLogoStyled>
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: '0 8px' }}>
        <List>
          {userRole === 'admin' ? (
            <>
              <CustomListItem disablePadding>
                <CustomListItemButton
                  component={Link}
                  to="/admin/dashboard"
                  selected={location.pathname === '/admin/dashboard'}
                >
                  <ListItemIcon><DashboardIcon /></ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </CustomListItemButton>
              </CustomListItem>
              <CustomListItem disablePadding>
                <CustomListItemButton
                  component={Link}
                  to="/admin/inventory-dashboard"
                  selected={location.pathname === '/admin/inventory-dashboard'}
                >
                  <ListItemIcon><RestaurantIcon /></ListItemIcon>
                  <ListItemText primary="Admin Inventory" />
                </CustomListItemButton>
              </CustomListItem>
              <CustomListItem disablePadding>
                <CustomListItemButton
                  component={Link}
                  to="/admin/supplier-list"
                  selected={location.pathname === '/admin/supplier-list'}
                >
                  <ListItemIcon><PeopleIcon /></ListItemIcon>
                  <ListItemText primary="Admin Supplier" />
                </CustomListItemButton>
              </CustomListItem>
            </>
          ) : (
            <>
              <CustomListItem disablePadding>
                <CustomListItemButton
                  component={Link}
                  to="/dashboard"
                  selected={location.pathname === '/dashboard'}
                >
                  <ListItemIcon><DashboardIcon /></ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </CustomListItemButton>
              </CustomListItem>
              <CustomListItem disablePadding>
                <CustomListItemButton
                  component={Link}
                  to="/inventory-dashboard"
                  selected={location.pathname === '/inventory-dashboard'}
                >
                  <ListItemIcon><RestaurantIcon /></ListItemIcon>
                  <ListItemText primary="Inventory" />
                </CustomListItemButton>
              </CustomListItem>
              <CustomListItem disablePadding>
                <CustomListItemButton
                  component={Link}
                  to="/use-item"
                  selected={location.pathname === '/use-item'}
                >
                  <ListItemIcon><RestaurantIcon /></ListItemIcon>
                  <ListItemText primary="Use Item" />
                </CustomListItemButton>
              </CustomListItem>
              <CustomListItem disablePadding>
                <CustomListItemButton
                  component={Link}
                  to="/supplier-list"
                  selected={location.pathname === '/supplier-list'}
                >
                  <ListItemIcon><PeopleIcon /></ListItemIcon>
                  <ListItemText primary="Vandors" />
                </CustomListItemButton>
              </CustomListItem>
            </>
          )}

          <Divider sx={{ borderColor: '#3A3630', margin: '16px 20px' }} />

          <CustomListItem disablePadding>
            <CategoryHeader
              onClick={toggleCategories}
              endIcon={categoriesVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              Employee Categories
            </CategoryHeader>
          </CustomListItem>

          <Collapse in={categoriesVisible} timeout="auto" unmountOnExit>
            <List disablePadding>
              {[ 
                { name: 'Supervisor', icon: <PeopleIcon />, path: '/employees/supervisor' },
                { name: 'Manager', icon: <PeopleIcon />, path: '/employees/Manager' },
                { name: 'Cook', icon: <RestaurantIcon />, path: '/employees/Cook' },
                { name: 'Assistant Cook', icon: <RestaurantIcon />, path: '/employees/Assistant Cook' },
                { name: 'Kitchen-Helpers', icon: <CleaningServicesIcon />, path: '/employees/Kitchen-Helpers' },
                { name: 'Sweepers', icon: <CleaningServicesIcon />, path: '/employees/Sweepers' },
                { name: 'Utility', icon: <PeopleIcon />, path: '/employees/Utility' },
              ].map((category, index) => (
                <CustomListItem key={category.name} disablePadding style={{ animationDelay: `${index * 0.03}s` }}>
                  <CustomListItemButton
                    component={Link}
                    to={category.path}
                    selected={location.pathname.includes(category.path)}
                  >
                    <ListItemIcon>{category.icon}</ListItemIcon>
                    <ListItemText primary={`${category.name} List`} />
                  </CustomListItemButton>
                </CustomListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </Box>

      <Box sx={{ paddingBottom: '16px' }}>
        <LogoutButton
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          fullWidth
        >
          Logout
        </LogoutButton>
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;
