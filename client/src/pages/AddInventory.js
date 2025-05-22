import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Avatar, 
  Divider, 
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  AttachMoney,
  Numbers,
  ArrowBack,
  AddCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
  maxWidth: '500px',
  margin: '0 auto',
  background: 'rgba(255, 255, 255, 0.95)',
}));

const FormAvatar = styled(Avatar)(({ theme }) => ({
  width: '72px',
  height: '72px',
  margin: '0 auto 20px',
  backgroundColor: theme.palette.secondary.main,
}));

const AddInventory = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/suppliers');
        if (!response.ok) throw new Error('Failed to fetch suppliers');
        const data = await response.json();
        setSuppliers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:2000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          itemName, 
          quantity: Number(quantity), 
          price: Number(price),
          supplier
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add inventory item');
      }
      
      navigate('/inventory-list', { state: { inventoryAdded: true } });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      p: 4, 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f9ff 0%, #e8f0fa 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <StyledPaper elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate('/inventory-list')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'secondary.main'
          }}>
            <InventoryIcon fontSize="large" />
            New Inventory Item
          </Typography>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'secondary.light' }} />

        <FormAvatar>
          <InventoryIcon fontSize="large" />
        </FormAvatar>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InventoryIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Numbers color="action" />
                    </InputAdornment>
                  ),
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Unit Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color="action" />
                    </InputAdornment>
                  ),
                  inputProps: { 
                    min: 0,
                    step: "0.01"
                  }
                }}
              />
            </Grid>
          </Grid>

          <TextField
            select
            fullWidth
            label="Supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 3 }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="" disabled>Select Supplier</option>
            {suppliers.map((sup) => (
              <option key={sup._id} value={sup.name}>
                {sup.name}
              </option>
            ))}
          </TextField>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            p: 2,
            backgroundColor: 'rgba(63, 81, 181, 0.05)',
            borderRadius: '12px'
          }}>
            <Typography variant="subtitle1" color="text.secondary">
              Total Value:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="secondary.main">
              ₹{(Number(quantity) * Number(price) || 0).toFixed(2)}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            disabled={loading || !itemName || !quantity || !price || !supplier}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddCircle />}
            sx={{
              py: 1.5,
              mt: 3,
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(63, 81, 181, 0.3)',
              }
            }}
          >
            {loading ? 'Adding...' : 'Add Inventory Item'}
          </Button>
        </form>
      </StyledPaper>
    </Box>
  );
};

export default AddInventory;
