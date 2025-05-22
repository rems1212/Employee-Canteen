import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  styled
} from '@mui/material';
import axios from 'axios';
import { getEmployeesByCategory, addEmployee, getEmployees } from '../api/employee';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: 'auto',
  marginTop: theme.spacing(5),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
}));

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    salary: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employees = await getEmployees();
        const emp = employees.find(e => e._id === id);
        if (emp) {
          setEmployee({
            name: emp.name,
            email: emp.email,
            phone: emp.phone,
            address: emp.address,
            category: emp.category,
            salary: emp.salary
          });
        } else {
          setError('Employee not found');
        }
      } catch (err) {
        setError('Failed to fetch employee data');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:2000/api/employees/${id}`, employee);
      navigate('/employees/all');
    } catch (err) {
      setError('Failed to update employee');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <FormContainer>
      <Typography variant="h5" gutterBottom>Edit Employee</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={employee.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={employee.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Phone"
          name="phone"
          value={employee.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          value={employee.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Category"
          name="category"
          value={employee.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          SelectProps={{
            native: true,
          }}
          helperText="Select a category"
        >
          <option value="" />
          <option value="supervisor">Supervisor</option>
          <option value="Manager">Manager</option>
          <option value="Cook">Cook</option>
          <option value="Assistant Cook">Assistant Cook</option>
          <option value="Kitchen-Helpers">Kitchen-Helpers</option>
          <option value="Sweepers">Sweepers</option>
          <option value="Utility">Utility</option>
        </TextField>
        <TextField
          label="Salary"
          name="salary"
          type="number"
          value={employee.salary}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Update Employee
          </Button>
          <Button onClick={() => navigate('/employees/all')} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
};

export default EditEmployee;
