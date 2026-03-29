
const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  applyToProject,
  getAllProjects,
  getProjectById,
  getOpenProjects,
  filterProjects
} = require('../controllers/projectController');


// GET ALL PROJECTS
router.get('/', getAllProjects);

// FILTER PROJECTS
router.get('/filter', filterProjects);

// OPEN PROJECTS
router.get('/open', protect, getOpenProjects);

// GET SINGLE PROJECT
router.get('/:projectId', getProjectById);

// APPLY TO PROJECT
router.post('/:projectId/apply', protect, applyToProject);

module.exports = router;