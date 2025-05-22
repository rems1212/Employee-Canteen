import axios from 'axios';

const API_URL = 'http://localhost:2000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getEmployees = async (managerId = null) => {
  try {
    let url = `${API_URL}/employees`;
    if (managerId) {
      url += `?managerId=${managerId}`;
    }
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch employees');
  }
};

export const getEmployeesByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/employees/${category}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch employees');
  }
};

export const getEmployeesByCanteen = async (canteen) => {
  try {
    const response = await axios.get(`${API_URL}/employees/canteen/${canteen}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch employees by canteen');
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${API_URL}/employees`, employeeData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add employee');
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/employees/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete employee');
  }
};
