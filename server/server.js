const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Database Connection
const connectDB = require('./src/config/db');

// Routes
<<<<<<< HEAD
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const companyRoutes = require('./src/routes/companyRoutes');
const trainerRoutes = require('./src/routes/trainerRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const seedRoutes = require('./src/routes/seedRoutes');
=======
const companyRoutes = require('./src/routes/companyRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Route Middleware
<<<<<<< HEAD
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/seed', seedRoutes);
=======
app.use('/api/company', companyRoutes);
app.use('/api/notifications', notificationRoutes);
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429

// Test Route
app.get('/', (req, res) => {
  res.send('Trainistry Backend Running');
});

<<<<<<< HEAD
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

=======
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
// Port Setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
<<<<<<< HEAD
});

=======
});
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
