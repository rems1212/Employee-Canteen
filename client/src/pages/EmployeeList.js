import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Skeleton,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Event as DateIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { getEmployeesByCategory, deleteEmployee } from '../api/employee';
import { format } from 'date-fns';

const EmployeeList = () => {
  const { category } = useParams();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        let data;
        if (category === 'all') {
          const response = await fetch('http://localhost:2000/api/employees', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (!response.ok) throw new Error('Failed to fetch employees');
          data = await response.json();
        } else if (category.startsWith('canteen-')) {
          // Fetch employees by canteen
          data = await getEmployeesByCanteen(category);
        } else {
          data = await getEmployeesByCategory(category);
        }
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, [category]);

  const getCategoryTitle = () => {
    const titles = {
      'supervisor': 'Supervisors',
      'Manager': 'Managers',
      'Cook': 'Kitchen Staff',
      'Assistant Cook': 'Assistant Cooks',
      'Kitchen-Helpers': 'Kitchen Helpers',
      'Sweepers': 'Sanitation Team',
      'Utility': 'Utility Staff',
      'waiter': 'Service Team',
      'all': 'All Employees'
    };
    return titles[category] || 'Employees';
  };

  const getCategoryColor = () => {
    const colors = {
      'supervisor': '#6D4C41', // Deep brown
      'Manager': '#2E7D32', // Green
      'Cook': '#EF6C00', // Orange
      'Assistant Cook': '#F57C00', // Light orange
      'Kitchen-Helpers': '#FFA000', // Amber
      'Sweepers': '#5D4037', // Brown
      'Utility': '#455A64', // Blue grey
      'waiter': '#0288D1', // Blue
      'all': '#5D4037' // Default
    };
    return colors[category] || '#5D4037';
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phone.includes(searchTerm)
  );

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = category === 'all' 
        ? await (await fetch('http://localhost:2000/api/employees', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })).json()
        : await getEmployeesByCategory(category);
      setEmployees(data);
    } catch (error) {
      console.error('Error refreshing employees:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      backgroundColor: '#f9f9f9',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <Card sx={{ 
        mb: 4,
        borderRadius: 3,
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        background: `linear-gradient(135deg, ${getCategoryColor()} 0%, #ffffff 100%)`,
        backgroundSize: 'cover'
      }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                color: '#fff',
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                mb: 1
              }}>
                {getCategoryTitle()}
              </Typography>
              <Chip 
                label={`${employees.length} team members`}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 500
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/add-employee')}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  backgroundColor: '#fff',
                  color: getCategoryColor(),
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Add New
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: '#fff',
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Search and Filter Bar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <TextField
          placeholder="Search employees..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              backgroundColor: '#fff',
              width: { xs: '100%', sm: 300 }
            }
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{
              borderRadius: 3,
              px: 3,
              textTransform: 'none'
            }}
          >
            Filters
          </Button>
        </Box>
      </Box>

      {/* Employee Table */}
      <Paper sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ 
              backgroundColor: getCategoryColor(),
              '& th': {
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
                borderBottom: 'none'
              }
            }}>
              <TableRow>
                <TableCell sx={{ width: '30%' }}>Employee</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array(5).fill().map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell align="right"><Skeleton variant="circular" width={40} height={40} /></TableCell>
                  </TableRow>
                ))
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow 
                    key={employee._id}
                    hover
                    sx={{ 
                      '&:last-child td': { borderBottom: 'none' },
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: getCategoryColor(),
                          width: 40, 
                          height: 40 
                        }}>
                          {employee.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600,
                              cursor: 'pointer',
                              '&:hover': { 
                                color: getCategoryColor(),
                                textDecoration: 'underline' 
                              }
                            }}
                            onClick={() => navigate(`/employee-profile/${employee._id}`)}
                          >
                            {employee.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {employee.category}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon color="action" fontSize="small" />
                          <Typography variant="body2">{employee.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon color="action" fontSize="small" />
                          <Typography variant="body2">{employee.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`₹${employee.salary.toLocaleString()}`}
                        size="small"
                        icon={<MoneyIcon fontSize="small" />}
                        sx={{ 
                          backgroundColor: 'rgba(46, 125, 50, 0.1)',
                          color: '#2E7D32',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={format(new Date(employee.joiningDate), 'dd MMM yyyy')}
                        size="small"
                        icon={<DateIcon fontSize="small" />}
                        sx={{ 
                          backgroundColor: 'rgba(93, 64, 55, 0.1)',
                          color: '#5D4037',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton
                          onClick={() => navigate(`/edit-employee/${employee._id}`)}
                          sx={{ 
                            backgroundColor: 'rgba(109, 76, 65, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(109, 76, 65, 0.2)'
                            }
                          }}
                        >
                          <EditIcon fontSize="small" sx={{ color: getCategoryColor() }} />
                        </IconButton>
                        <IconButton
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
                              try {
                                await deleteEmployee(employee._id);
                                setEmployees(prev => prev.filter(e => e._id !== employee._id));
                              } catch (error) {
                                console.error('Failed to delete employee:', error);
                              }
                            }
                          }}
                          sx={{ 
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(244, 67, 54, 0.2)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" sx={{ color: '#F44336' }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 6, textAlign: 'center' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <PersonIcon sx={{ fontSize: 60, color: 'text.disabled', opacity: 0.5 }} />
                      <Typography variant="h6" color="text.secondary">
                        No employees found
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {searchTerm ? 'Try a different search term' : 'Add new employees to get started'}
                      </Typography>
                      {!searchTerm && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => navigate('/add-employee')}
                          sx={{
                            mt: 2,
                            backgroundColor: getCategoryColor()
                          }}
                        >
                          Add Employee
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Mobile Cards View (hidden on desktop) */}
      <Box sx={{ 
        display: { xs: 'block', md: 'none' },
        mt: 3,
        '& > *:not(:last-child)': { mb: 2 }
      }}>
        {loading ? (
          Array(3).fill().map((_, index) => (
            <Card key={index} sx={{ mb: 2, borderRadius: 3 }}>
              <CardContent>
                <Skeleton variant="rectangular" width="100%" height={120} />
              </CardContent>
            </Card>
          ))
        ) : filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <Card 
              key={employee._id} 
              sx={{ 
                mb: 2,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: getCategoryColor(),
                      width: 48, 
                      height: 48 
                    }}>
                      {employee.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {employee.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {employee.category}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`₹${employee.salary.toLocaleString()}`}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(46, 125, 50, 0.1)',
                      color: '#2E7D32',
                      fontWeight: 500,
                      height: 'fit-content'
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="action" fontSize="small" />
                    <Typography variant="body2">{employee.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Typography variant="body2">{employee.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon color="action" fontSize="small" />
                    <Typography variant="body2" sx={{ 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {employee.address}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      Joined {format(new Date(employee.joiningDate), 'dd MMM yyyy')}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton
                    onClick={() => navigate(`/edit-employee/${employee._id}`)}
                    sx={{ 
                      backgroundColor: 'rgba(109, 76, 65, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(109, 76, 65, 0.2)'
                      }
                    }}
                  >
                    <EditIcon fontSize="small" sx={{ color: getCategoryColor() }} />
                  </IconButton>
                  <IconButton
                    onClick={async () => {
                      if (window.confirm(`Delete ${employee.name}?`)) {
                        try {
                          await deleteEmployee(employee._id);
                          setEmployees(prev => prev.filter(e => e._id !== employee._id));
                        } catch (error) {
                          console.error('Failed to delete employee:', error);
                        }
                      }
                    }}
                    sx={{ 
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.2)'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" sx={{ color: '#F44336' }} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card sx={{ 
            p: 4,
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            boxShadow: 'none',
            border: '1px dashed #e0e0e0'
          }}>
            <PersonIcon sx={{ fontSize: 60, color: 'text.disabled', opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              No employees found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {searchTerm ? 'Try a different search term' : 'Add new employees to get started'}
            </Typography>
            {!searchTerm && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/add-employee')}
                sx={{
                  mt: 3,
                  backgroundColor: getCategoryColor()
                }}
              >
                Add Employee
              </Button>
            )}
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default EmployeeList;