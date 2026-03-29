

const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    enum: ['Project Completion', 'Certification', 'Workshop', 'Award'],
    default: 'Project Completion'
  },
  companyName: String,
  location: String,
  imageUrl: {
    type: String 
  },
  // Social Interactions
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      name: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  repostCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', AchievementSchema);