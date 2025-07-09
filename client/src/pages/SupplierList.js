import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
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

    fetchSuppliers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vendors List
      </Typography>
      {suppliers.length === 0 ? (
        <Typography>No vendors found.</Typography>
      ) : (
        <List>
          {suppliers.map((supplier) => (
            <ListItem key={supplier._id} divider>
              <ListItemText
                primary={supplier.name}
                secondary={`Email: ${supplier.email || 'N/A'} | Phone: ${supplier.phone || 'N/A'}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SupplierList;
