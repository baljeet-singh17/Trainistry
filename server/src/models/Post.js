
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // The person/account creating the post
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // To keep it flexible for Trainers OR Company Employees
  authorRole: {
    type: String,
    enum: ['trainer', 'company', 'admin'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  // UPDATED: 'warning' matches the Trust Score logic
  postType: {
    type: String,
    enum: ['standard', 'warning', 'achievement'], 
    default: 'standard'
  },
  // Link to the company if it's a "Defame/Warning" post
  relatedCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile'
  },
  location: {
    type: String,
    default: ''
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);