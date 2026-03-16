const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getPlatformStats,
  getAllProjects,
  getAllApplications,
  getDashboard
} = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(protect, adminOnly);

// Dashboard and Stats
router.get('/dashboard', getDashboard);
router.get('/stats', getPlatformStats);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/status', toggleUserStatus);

// Project Management (admin view)
router.get('/projects', getAllProjects);

// Application Management (admin view)
router.get('/applications', getAllApplications);

module.exports = router;

