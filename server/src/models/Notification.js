const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, required: true }, // Company ID
  message: { type: String, required: true },
  type: { type: String, enum: ['NEW_APPLICATION', 'INTERVIEW_CONFIRMED', 'GENERAL'], default: 'NEW_APPLICATION' },
  isRead: { type: Boolean, default: false },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);