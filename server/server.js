
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const connectDB = require('./src/config/db');

// --- Added for Sir's Requirement ---
const sendEmail = require('./src/utils/emailService'); 

// Routes
const authRoutes = require('./src/routes/authRoutes');
const companyRoutes = require('./src/routes/companyRoutes');
const trainerRoutes = require('./src/routes/trainerRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const achievementRoutes = require('./src/routes/achievementRoutes');
const postRoutes = require('./src/routes/postRoutes');

const app = express();

// ===================
// Database Connection
// ===================
connectDB();

// ===================
// Middleware
// ===================
app.use(cors());
app.use(express.json()); 

/**
 * DIRECTORY SETUP
 * Ensures 'src/uploads' and its subdirectories exist.
 * This prevents Multer "ENOENT" errors.
 */
const dirs = [
  path.join(__dirname, 'src/uploads'),
  path.join(__dirname, 'src/uploads/resumes'),
  path.join(__dirname, 'src/uploads/profiles')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

/**
 * STATIC FILES MIDDLEWARE
 * This allows the frontend to access files via http://localhost:5000/uploads/...
 */
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// =====================================
// NEW: EMAIL TEST ROUTE (Sir's Requirement)
// =====================================
app.get('/api/test-email', async (req, res) => {
  try {
    await sendEmail({
      email: process.env.EMAIL_USER, 
      subject: "Trainistry System Check",
      html: "<h1>Test Successful!</h1><p>The Trainistry backend is now connected to your email service.</p>"
    });
    res.status(200).json({ success: true, message: "Test email sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===================
// API Routes
// ===================
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/posts', postRoutes);

// ===================
// Base Route
// ===================
app.get('/', (req, res) => {
  res.send('Trainistry Backend Running');
});

// ===================
// 404 Handler
// ===================
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// ===================
// Global Error Handler
// ===================
app.use((err, req, res, next) => {
  console.error("GLOBAL_ERROR_STAKE:", err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Server Error'
  });
});

// ===================
// Start Server
// ===================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email Service: ${process.env.EMAIL_USER ? 'Configured' : 'NOT CONFIGURED'}`);
});