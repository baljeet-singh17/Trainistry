// Environment configuration
// This file exports environment variables

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  
  // MongoDB configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/trainistry',
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'trainistry_secret_key_2024',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  
  // Email configuration (for production)
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USERNAME: process.env.EMAIL_USERNAME || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@trainistry.com',
  
  // Frontend URL (for email links)
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};

