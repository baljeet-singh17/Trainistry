const express = require('express');
const router = express.Router();
const {
  createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany,
  postProject, getCompanyProjects, getProjectApplications, updateApplicationStatus
} = require('../controllers/companyController');

// Profile Routes
router.post('/', createCompany);
router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

// Project Management
router.post('/:companyId/projects', postProject);
router.get('/:companyId/projects', getCompanyProjects);

// Application Management
router.get('/projects/:projectId/applications', getProjectApplications);
router.put('/applications/:applicationId/status', updateApplicationStatus);

module.exports = router;