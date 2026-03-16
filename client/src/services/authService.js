import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Get stored token
const getStoredToken = () => {
  return localStorage.getItem('token');
};

// Configure axios defaults
axios.defaults.headers.common['Authorization'] = `Bearer ${getStoredToken()}`;

// Update axios headers with new token
const updateAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    updateAuthHeader(response.data.token);
  }
  
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    updateAuthHeader(response.data.token);
  }
  
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateAuthHeader(null);
};

// Get current user
const getCurrentUser = async () => {
  const token = getStoredToken();
  
  if (!token) {
    return null;
  }
  
  updateAuthHeader(token);
  
  try {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    logout();
    return null;
  }
};

// Update user profile
const updateProfile = async (userData) => {
  const token = getStoredToken();
  updateAuthHeader(token);
  
  const response = await axios.put(`${API_URL}/profile`, userData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    updateAuthHeader(response.data.token);
  }
  
  return response.data;
};

// Change password
const changePassword = async (passwordData) => {
  const token = getStoredToken();
  updateAuthHeader(token);
  
  const response = await axios.put(`${API_URL}/password`, passwordData);
  return response.data;
};

// Forgot password
const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgotpassword`, { email });
  return response.data;
};

// Reset password
const resetPassword = async (resetToken, password) => {
  const response = await axios.put(`${API_URL}/resetpassword/${resetToken}`, { password });
  return response.data;
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get user role
const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.role : null;
};

// Get user from localStorage
const getUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  isAuthenticated,
  getUserRole,
  getUser
};

export default authService;

