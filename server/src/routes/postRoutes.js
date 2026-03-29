const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Post = require('../models/Post');

// @route   POST /api/posts
// @desc    Create a new post (Warning, Achievement, or Standard)
router.post('/', protect, async (req, res) => {
  try {
    const { content, description, postType, relatedCompany, title } = req.body;

    const postTitle = title || (postType === 'warning' ? "⚠️ Industrial Payment Alert" : "Network Update");

    const newPost = await Post.create({
      user: req.user._id,
      authorRole: req.user.role, 
      title: postTitle,
      description: description || content, // FIX: Maps either field name to the required model field
      postType: postType || 'standard',
      relatedCompany: relatedCompany || null,
      location: req.body.location || ''
    });

    res.status(201).json({
      success: true,
      data: newPost
    });
  } catch (error) {
    console.error("Post Creation Error:", error);
    res.status(400).json({ 
      success: false, 
      message: error.message || "Failed to create post. Check required fields." 
    });
  }
});

// @route   GET /api/posts
// @desc    Get all posts for the Industrial Network feed
router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name role')
      .populate('relatedCompany') 
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: posts.length,
      data: posts 
    });
  } catch (error) {
    console.error("Fetch Posts Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;