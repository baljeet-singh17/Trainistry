const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Seed demo users
// @route   POST /api/seed
// @access  Public (for development only)
router.post('/demo-users', async (req, res) => {
  try {
    // Delete existing demo users
    await User.deleteMany({ email: { $in: ['trainer@test.com', 'company@test.com', 'admin@test.com'] } });

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test123', salt);

    // Create demo users
    const demoUsers = [
      {
        name: 'Demo Trainer',
        email: 'trainer@test.com',
        password: hashedPassword,
        role: 'trainer',
        isActive: true
      },
      {
        name: 'Demo Company',
        email: 'company@test.com',
        password: hashedPassword,
        role: 'company',
        companyName: 'Test Company',
        isActive: true
      },
      {
        name: 'Demo Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      }
    ];

    const createdUsers = await User.insertMany(demoUsers);

    res.status(201).json({
      message: 'Demo users created successfully',
      users: createdUsers.map(u => ({
        email: u.email,
        password: 'test123',
        role: u.role
      }))
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

