import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Avatar,
  Grid,
  Divider,
  InputAdornment,
  Fade
} from '@mui/material';
import { addEmployee } from '../api/employee';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    category: 'supervisor',
    salary: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addEmployee(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      py: 4,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Fade in={true} timeout={800}>
        <Paper elevation={6} sx={{
          width: '100%',
          maxWidth: 800,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{
            background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
            color: 'white',
            py: 3,
            px: 4,
            textAlign: 'center'
          }}>
            <Avatar sx={{
              bgcolor: 'white',
              color: '#3f51b5',
              width: 60,
              height: 60,
              mx: 'auto',
              mb: 2
            }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" component="h1" fontWeight="medium">
              Add New Employee
            </Typography>
            <Typography variant="subtitle1">
              Fill in the details below to register a new team member
            </Typography>
          </Box>

          {error && (
            <Box sx={{
              backgroundColor: 'error.light',
              color: 'error.contrastText',
              p: 2,
              textAlign: 'center'
            }}>
              <Typography>{error}</Typography>
            </Box>
          )}

          <Box sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Job Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      label="Job Category"
                      startAdornment={
                        <InputAdornment position="start">
                          <WorkIcon color="action" />
                        </InputAdornment>
                      }
                      sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      <MenuItem value="supervisor">Supervisor</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                      <MenuItem value="Cook">Cook</MenuItem>
                      <MenuItem value="Assistant Cook">Assistant Cook</MenuItem>
                      <MenuItem value="Kitchen-Helpers">Kitchen Helpers</MenuItem>
                      <MenuItem value="Sweepers">Sweepers</MenuItem>
                      <MenuItem value="Utility">Utility</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="action" sx={{ mt: -4 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Salary"
                    variant="outlined"
                    fullWidth
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon color="action" />
                        </InputAdornment>
                      ),
                      inputProps: {
                        min: 0
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2
              }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  {isSubmitting ? 'Adding...' : 'Add Employee'}
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default AddEmployee;