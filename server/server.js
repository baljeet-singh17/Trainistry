const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Database Connection
const connectDB = require('./src/config/db');

// Routes
const companyRoutes = require('./src/routes/companyRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Route Middleware
app.use('/api/company', companyRoutes);
app.use('/api/notifications', notificationRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Trainistry Backend Running');
});

// Port Setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});