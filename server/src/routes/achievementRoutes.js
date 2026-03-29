 express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  createAchievement, 
  getAchievements, 
  likeAchievement, 
  commentAchievement,
  repostAchievement 
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

// --- Base Routes ---
router.route('/')
  .get(getAchievements)
  .post(protect, upload.single('postImage'), createAchievement);

// --- Interaction Routes ---
router.put('/:id/like', protect, likeAchievement);
router.post('/:id/comment', protect, commentAchievement);
router.post('/:id/repost', protect, repostAchievement);

module.exports = router;