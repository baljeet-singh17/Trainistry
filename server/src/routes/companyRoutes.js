
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

const {
  getCompanyDashboardStats,
  getMyCompany,
  createCompany,
  updateCompanyProfile,
  getCompanies,
  getCompanyById,
  postProject,
  getCompanyProjects,
  getProjectApplications,
  updateApplicationStatus,
  updateProjectStatus,
  resolveDispute,
  searchCompanies,
  followCompany,
  scheduleInterview
} = require('../controllers/companyController');

// Profile & Stats (Protected)
router.get('/stats', protect, authorize('company'), getCompanyDashboardStats);
router.get('/me', protect, authorize('company'), getMyCompany);
router.post('/', protect, authorize('company'), createCompany);

router.put('/profile', protect, authorize('company'), updateCompanyProfile);

// Public Company Info
router.get('/search', searchCompanies);
router.get('/', getCompanies);
router.get('/:id', getCompanyById);

// Projects Management (Protected)
router.post('/:companyId/projects', protect, authorize('company'), postProject);
router.get('/:companyId/projects', protect, authorize('company'), getCompanyProjects);

// Update project status (Triggers 15-day deadline)
router.put('/projects/:projectId/status', protect, authorize('company'), updateProjectStatus);

// Application Management (Protected)
router.get('/:companyId/projects/:projectId/applications', protect, authorize('company'), getProjectApplications);

// Update application status (Triggers Selection/Rejection Email)
router.put('/applications/:applicationId/status', protect, authorize('company'), updateApplicationStatus);

// Interview Scheduling
router.post('/applications/:applicationId/schedule', protect, authorize('company'), scheduleInterview);

router.put('/applications/:applicationId/resolve', protect, resolveDispute);
router.put('/follow/:targetId', protect, followCompany);

module.exports = router;