import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress, 
  Button,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import SupplierForm from '../components/SupplierForm';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:2000/api/suppliers');
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = async (newSupplier) => {
    try {
      const response = await fetch('http://localhost:2000/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier),
      });
      if (!response.ok) {
        throw new Error('Failed to add supplier');
      }
      fetchSuppliers();
      setFormOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateSupplier = async (updatedSupplier) => {
    try {
      const response = await fetch(`http://localhost:2000/api/suppliers/${updatedSupplier._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSupplier),
      });
      if (!response.ok) {
        throw new Error('Failed to update supplier');
      }
      fetchSuppliers();
      setFormOpen(false);
      setEditMode(false);
      setSelectedSupplier(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      const response = await fetch(`http://localhost:2000/api/suppliers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete supplier');
      }
      fetchSuppliers();
      setViewOpen(false);
      setSelectedSupplier(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewSupplier = (supplier) => {
    console.log('Viewing supplier:', supplier);
    setSelectedSupplier(supplier);
    setViewOpen(true);
    setEditMode(false);
  };

  const handleEditSupplier = () => {
    setEditMode(true);
    setViewOpen(false);
    setFormOpen(true);
  };

  const getRandomColor = () => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      '#3f51b5',
      '#009688',
      '#ff5722',
      '#607d8b'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 4,
      maxWidth: 1200,
      margin: '0 auto'
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: theme.palette.text.primary,
          fontSize: isMobile ? '1.8rem' : '2.2rem'
        }}>
          Vendor Directory
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            setSelectedSupplier(null);
            setEditMode(false);
            setFormOpen(true);
          }}
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 50,
            px: 3,
            py: 1,
            textTransform: 'none',
            boxShadow: theme.shadows[3],
            '&:hover': {
              boxShadow: theme.shadows[6]
            }
          }}
        >
          New Vendor
        </Button>
      </Box>

      <SupplierForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditMode(false);
          setSelectedSupplier(null);
        }}
        onAddSupplier={editMode ? handleUpdateSupplier : handleAddSupplier}
        initialData={editMode ? selectedSupplier : null}
      />

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh'
        }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : error ? (
        <Paper elevation={3} sx={{ 
          p: 3, 
          backgroundColor: theme.palette.error.light,
          textAlign: 'center'
        }}>
          <Typography color="error" variant="h6">
            Error Loading Vendors
          </Typography>
          <Typography sx={{ mt: 1 }}>{error}</Typography>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={fetchSuppliers}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Paper>
      ) : suppliers.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <BusinessIcon sx={{ fontSize: 80, color: theme.palette.text.disabled }} />
          <Typography variant="h6" sx={{ mt: 2, color: theme.palette.text.secondary }}>
            No Vendors Found
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              setSelectedSupplier(null);
              setEditMode(false);
              setFormOpen(true);
            }}
            startIcon={<AddIcon />}
            sx={{ mt: 3 }}
          >
            Add Vendor
          </Button>
        </Box>
      ) : (
        <Paper elevation={0} sx={{ 
          borderRadius: 4,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`
        }}>
          <List disablePadding>
            {suppliers.map((supplier) => (
              <ListItem 
                key={supplier._id} 
                button
                onClick={() => handleViewSupplier(supplier)}
                sx={{
                  px: isMobile ? 2 : 4,
                  py: 3,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '&:last-child': {
                    borderBottom: 'none'
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    cursor: 'pointer'
                  }
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      edge="end" 
                      aria-label="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSupplier(supplier);
                        setEditMode(true);
                        setFormOpen(true);
                      }}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSupplier(supplier._id);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                }
              >
                <Avatar sx={{ 
                  bgcolor: getRandomColor(),
                  mr: 3,
                  width: 56,
                  height: 56,
                  fontSize: '1.5rem'
                }}>
                  {supplier.name.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {supplier.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 0.5 : 3,
                      mt: 1
                    }}>
                      {supplier.email && (
                        <Chip 
                          icon={<EmailIcon fontSize="small" />}
                          label={supplier.email}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {supplier.phone && (
                        <Chip 
                          icon={<PhoneIcon fontSize="small" />}
                          label={supplier.phone}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {supplier.category && (
                        <Chip 
                          label={supplier.category}
                          size="small"
                          color="secondary"
                        />
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Supplier Profile</DialogTitle>
        <DialogContent dividers>
          {selectedSupplier ? (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedSupplier.name || 'N/A'}</Typography>
              <Typography>Contact: {selectedSupplier.contact || 'N/A'}</Typography>
              <Typography>Category: {selectedSupplier.category || 'N/A'}</Typography>
            </Box>
          ) : (
            <Typography>No supplier selected.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
          <Button 
            onClick={() => {
              setViewOpen(false);
              setEditMode(true);
              setFormOpen(true);
            }} 
            color="primary"
            variant="contained"
          >
            Edit
          </Button>
          <Button 
            onClick={() => {
              if (selectedSupplier) {
                handleDeleteSupplier(selectedSupplier._id);
              }
            }} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupplierManagement;
