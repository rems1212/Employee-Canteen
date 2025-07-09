import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const SupplierForm = ({ open, onClose, onAddSupplier }) => {
  const [supplierName, setSupplierName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Food',
    'Beverages',
    'Cleaning Supplies',
    'Utensils',
    'Packaging',
    'Other'
  ];

  const handleSubmit = () => {
    if (!supplierName.trim()) {
      alert('Supplier name is required');
      return;
    }
    if (!category) {
      alert('Please select a category');
      return;
    }
    setLoading(true);
    // Simulate API call or validation
    setTimeout(() => {
      onAddSupplier({ name: supplierName.trim(), contact: contact.trim(), category });
      setSupplierName('');
      setContact('');
      setCategory('');
      setLoading(false);
      onClose();
    }, 500);
  };

  const handleClose = () => {
    if (!loading) {
      setSupplierName('');
      setContact('');
      setCategory('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Supplier</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Supplier Name"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Contact Information"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth required>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Adding...' : 'Add Supplier'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplierForm;
