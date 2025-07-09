import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Avatar,
  LinearProgress,
  Chip
} from '@mui/material';
import { 
  AddCircleOutline, 
  RemoveCircleOutline, 
  Inventory as InventoryIcon,
  CheckCircle,
  Warning 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../components/AuthWrapper';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  overflow: 'hidden',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'medium',
  borderBottom: 'none',
}));

const QuantityInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    width: '120px',
  },
});

const InventoryList = () => {
  const { userRole, userId, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [usageQuantities, setUsageQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [stockLevels, setStockLevels] = useState({});

  const fetchInventory = async () => {
    try {
      const url = `http://localhost:2000/api/inventory${userRole === 'manager' ? `?managerId=${userId}` : ''}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      const data = await response.json();
      setInventory(data);
      
      // Calculate stock levels for visual indicators
      const levels = {};
      data.forEach(item => {
        levels[item._id] = (item.quantity / item.maxQuantity) * 100 || 0;
      });
      setStockLevels(levels);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [userId, userRole, token]);

  const handleUsageChange = (itemId, value) => {
    if (value === '' || (/^\d+$/.test(value) && Number(value) >= 0)) {
      setUsageQuantities(prev => ({ ...prev, [itemId]: value }));
    }
  };

  const incrementQuantity = (itemId) => {
    const current = Number(usageQuantities[itemId] || 0);
    const item = inventory.find(i => i._id === itemId);
    if (!item) return;
    
    if (current < item.quantity) {
      setUsageQuantities(prev => ({ ...prev, [itemId]: current + 1 }));
    }
  };

  const decrementQuantity = (itemId) => {
    const current = Number(usageQuantities[itemId] || 0);
    if (current > 0) {
      setUsageQuantities(prev => ({ ...prev, [itemId]: current - 1 }));
    }
  };

  const handleUseInventory = async (itemId) => {
    const quantityUsed = Number(usageQuantities[itemId]);
    if (!quantityUsed || quantityUsed <= 0) {
      alert('Please enter a valid usage quantity greater than zero.');
      return;
    }
    
    const item = inventory.find(i => i._id === itemId);
    if (!item) {
      alert('Inventory item not found.');
      return;
    }
    
    if (quantityUsed > item.quantity) {
      alert('Usage quantity exceeds available stock.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:2000/api/inventory/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantityUsed }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update inventory');
      }
      
      await fetchInventory();
      setUsageQuantities(prev => ({ ...prev, [itemId]: '' }));
      // Navigate to UseItem page with used item id in state
      navigate('/use-item', { state: { usedItemId: itemId } });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity, maxQuantity) => {
    const percentage = (quantity / maxQuantity) * 100;
    if (percentage < 20) return 'low';
    if (percentage < 50) return 'medium';
    return 'high';
  };

  return (
    <Box sx={{ 
      p: 4, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <InventoryIcon fontSize="large" />
          Inventory Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchInventory}
          startIcon={<CheckCircle />}
        >
          Refresh Inventory
        </Button>
      </Box>

      {inventory.length === 0 ? (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center', 
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <Typography variant="h6" color="textSecondary">
            No inventory items found. Add some items to get started.
          </Typography>
        </Paper>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: 'primary.main',
                '& th': { 
                  color: 'common.white', 
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }
              }}>
                <StyledTableCell>Item</StyledTableCell>
                <StyledTableCell align="center">Price</StyledTableCell>
                <StyledTableCell align="center">Use Quantity</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => {
                const stockStatus = getStockStatus(item.quantity, item.maxQuantity || item.quantity * 2);
                
                return (
                  <StyledTableRow key={item._id}>
                    <StyledTableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: stockStatus === 'low' ? 'error.light' : 
                                   stockStatus === 'medium' ? 'warning.light' : 'success.light'
                        }}>
                          {item.itemName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="medium">{item.itemName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantity} in stock
                          </Typography>
                        </Box>
                      </Box>
                    </StyledTableCell>
                    
                    <StyledTableCell align="center">
                      <Chip 
                        label={`₹${item.price.toFixed(2)}`} 
                        color="primary" 
                        variant="outlined"
                      />
                    </StyledTableCell>
                    
                    <StyledTableCell align="center">
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 1
                      }}>
                        <Tooltip title="Decrease">
                          <IconButton 
                            onClick={() => decrementQuantity(item._id)}
                            disabled={!usageQuantities[item._id] || Number(usageQuantities[item._id]) <= 0}
                            color="primary"
                          >
                            <RemoveCircleOutline />
                          </IconButton>
                        </Tooltip>
                        
                        <QuantityInput
                          type="number"
                          inputProps={{ 
                            min: 0, 
                            max: item.quantity,
                            style: { textAlign: 'center' }
                          }}
                          value={usageQuantities[item._id] || ''}
                          onChange={(e) => handleUsageChange(item._id, e.target.value)}
                          disabled={loading}
                          size="small"
                        />
                        
                        <Tooltip title="Increase">
                          <IconButton 
                            onClick={() => incrementQuantity(item._id)}
                            disabled={Number(usageQuantities[item._id] || 0) >= item.quantity}
                            color="primary"
                          >
                            <AddCircleOutline />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </StyledTableCell>
                    
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUseInventory(item._id)}
                        disabled={loading || !usageQuantities[item._id]}
                        startIcon={loading ? <CircularProgress size={20} /> : <InventoryIcon />}
                        sx={{
                          borderRadius: '20px',
                          px: 3,
                          textTransform: 'none',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          '&:hover': {
                            boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
                          }
                        }}
                      >
                        {loading ? 'Processing...' : 'Use Item'}
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}
    </Box>
  );
};

export default InventoryList;
