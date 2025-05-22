import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper,
  useTheme,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Stack,
  Button
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  CalendarToday,
  Scale,
  Search,
  FilterList,
  Refresh,
  ArrowUpward
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import dayjs from 'dayjs';

// Removed StyledTimeline and Timeline imports due to incompatibility with MUI v7

const UsageCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[6],
    borderLeft: `4px solid ${theme.palette.primary.main}`
  }
}));

const HighlightCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  boxShadow: `0 4px 20px ${theme.palette.primary.light}`
}));

const UseItem = () => {
  const [usedItems, setUsedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalUsed: 0, recentItems: 0 });
  const theme = useTheme();
  const location = useLocation();
  const usedItemId = location.state?.usedItemId;
  const itemRefs = useRef({});

  const fetchUsedItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:2000/api/inventory/used');
      if (!response.ok) {
        throw new Error('Failed to fetch used items');
      }
      const data = await response.json();
      setUsedItems(data.sort((a, b) => new Date(b.dateUsed) - new Date(a.dateUsed)));
      
      // Calculate stats
      const totalUsed = data.reduce((sum, item) => sum + (item.quantityUsed || 0), 0);
      const recentItems = data.filter(item => 
        dayjs(item.dateUsed).isAfter(dayjs().subtract(7, 'day'))
      ).length;
      
      setStats({ totalUsed, recentItems });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsedItems();
  }, []);

  useEffect(() => {
    if (usedItemId && itemRefs.current[usedItemId]) {
      setTimeout(() => {
        itemRefs.current[usedItemId].scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    }
  }, [usedItemId, usedItems]);

  const handleRefresh = () => {
    fetchUsedItems();
  };

  return (
    <Box sx={{ 
      p: 4, 
      maxWidth: 1200, 
      margin: '0 auto',
      backgroundColor: theme.palette.background.default
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <InventoryIcon fontSize="large" color="primary" />
          Inventory Usage History
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button variant="outlined" startIcon={<FilterList />}>
            Filter
          </Button>
          <Button variant="outlined" startIcon={<Search />}>
            Search
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        <HighlightCard>
          <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
            Total Items Used
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {stats.totalUsed}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <ArrowUpward sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">
              Updated just now
            </Typography>
          </Box>
        </HighlightCard>
        
        <UsageCard>
          <Typography variant="subtitle2" color="textSecondary">
            Recent Usage (7 days)
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {stats.recentItems}
          </Typography>
          <Chip 
            label="View recent" 
            size="small" 
            sx={{ mt: 1 }} 
            color="primary" 
            variant="outlined"
          />
        </UsageCard>
        
        <UsageCard>
          <Typography variant="subtitle2" color="textSecondary">
            Active Categories
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {new Set(usedItems.map(item => item.category)).size}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip label="Food" size="small" />
            <Chip label="Supplies" size="small" />
          </Stack>
        </UsageCard>
      </Box>

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '300px'
        }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Paper sx={{ 
          p: 3, 
          backgroundColor: theme.palette.error.light,
          textAlign: 'center'
        }}>
          <Typography color="error" variant="h6">
            Error Loading Data
          </Typography>
          <Typography sx={{ mt: 1 }}>{error}</Typography>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={fetchUsedItems}
            sx={{ mt: 2 }}
            startIcon={<Refresh />}
          >
            Retry
          </Button>
        </Paper>
      ) : usedItems.length === 0 ? (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: theme.palette.background.paper
        }}>
          <InventoryIcon sx={{ fontSize: 60, opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No usage history found
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Items that are used will appear here
          </Typography>
        </Paper>
      ) : (
        <Box>
          {usedItems.map((item) => (
            <Box
              key={item._id}
              ref={el => itemRefs.current[item._id] = el}
              sx={{
                backgroundColor: item._id === usedItemId ? theme.palette.action.selected : 'transparent',
                borderRadius: '8px',
                py: 1,
                mb: 1,
                boxShadow: theme.shadows[1],
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                transition: 'background-color 0.3s ease'
              }}
            >
              <UsageCard>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {item.itemName || item.name || 'Unnamed Item'}
                    </Typography>
                    {item.category && (
                      <Chip 
                        label={item.category} 
                        size="small" 
                        sx={{ mt: 1, mr: 1 }} 
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                      gap: 1
                    }}>
                      <CalendarToday color="action" fontSize="small" />
                      <Typography variant="body2" color="textSecondary">
                        {dayjs(item.dateUsed).format('MMM D, YYYY h:mm A')}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700,
                      mt: 1,
                      color: theme.palette.primary.main
                    }}>
                      {item.quantityUsed || 0} units
                    </Typography>
                  </Box>
                </Box>
                
                {item.notes && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2">
                      {item.notes}
                    </Typography>
                  </>
                )}
              </UsageCard>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UseItem;