import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Get stored token
const getStoredToken = () => {
  return localStorage.getItem('token');
};

// Configure axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all users
const getAllUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

// Get user by ID
const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Update user
const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

// Delete user
const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Toggle user status (activate/deactivate)
const toggleUserStatus = async (id) => {
  const response = await api.put(`/users/${id}/status`);
  return response.data;
};

// Get platform statistics
const getPlatformStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

// Get all projects (admin view)
const getAllProjects = async (params = {}) => {
  const response = await api.get('/projects', { params });
  return response.data;
};

// Get all applications (admin view)
const getAllApplications = async (params = {}) => {
  const response = await api.get('/applications', { params });
  return response.data;
};

// Get admin dashboard data
const getDashboard = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const adminService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getPlatformStats,
  getAllProjects,
  getAllApplications,
  getDashboard
};

export default adminService;

