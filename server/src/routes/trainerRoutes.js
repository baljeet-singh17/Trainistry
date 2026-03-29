
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Existing middleware name
const uploadResume = require('../middleware/uploadMiddleware');
const { getTrainerNotifications } = require("../controllers/notificationController");

const {
  getTrainerDashboard,
  getMyProfile,
  updateMyProfile,
  getAllProjects,
  getProjectById,
  applyToProject,
  getMyApplications,
  likeDislikeTrainer,
  addFeedback,
  searchTrainers,
  followUnfollowUser,
  getNetworkFeed,
  withdrawApplication,
  raiseDispute,
  markAsDisputed // Added this to the import list
} = require('../controllers/trainerController');

// All routes below this line will require a valid JWT token
router.use(protect);

// ===============================
// DASHBOARD & PROFILE
// ===============================
router.get('/dashboard', getTrainerDashboard);
router.get('/me', getMyProfile);
router.get('/profile/me', getMyProfile); // Alias for 'me'

// Update profile handles both text data and the resume file
router.put('/profile', uploadResume.single('resume'), (req, res, next) => {
  updateMyProfile(req, res, next);
});

// For status toggles (Available/Busy), we don't need the upload middleware
router.put('/toggle-status', updateMyProfile); 

// ===============================
// PROJECTS & SEARCH
// ===============================
router.get('/projects', getAllProjects);
router.get('/projects/:projectId', getProjectById);
router.get('/search', searchTrainers);

// ===============================
// APPLICATIONS
// ===============================

// CRITICAL FIX: Explicitly passing req, res, next to the controller 
router.post('/projects/:projectId/apply', uploadResume.single('resume'), (req, res, next) => {
  applyToProject(req, res, next);
});

router.get('/applications', getMyApplications);
router.delete('/applications/:applicationId', withdrawApplication);

// ===============================
// SOCIAL & NETWORK
// ===============================
router.put('/like-dislike', likeDislikeTrainer);
router.post('/feedback', addFeedback);
router.put('/follow/:id', followUnfollowUser);
router.get('/network-feed', getNetworkFeed);

// ===============================
// NOTIFICATIONS
// ===============================
router.get("/notifications", getTrainerNotifications);

// ===============================
// PAYMENT & DISPUTES
// ===============================

// Route for formal project-level dispute
router.put('/projects/:projectId/dispute', raiseDispute);

// Route for the "Mark Disputed" button on the Applications page
// Fixed: Changed 'authMiddleware' to 'protect' and 'trainerController.markAsDisputed' to 'markAsDisputed'
router.put('/applications/:id/dispute', protect, markAsDisputed);


module.exports = router;