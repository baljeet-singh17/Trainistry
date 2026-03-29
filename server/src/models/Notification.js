
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
{
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    // Note: We don't use 'ref' here because recipient could be a User, 
    // TrainerProfile, or CompanyProfile depending on your logic.
    required: true
  },

  recipientType: {
    type: String,
    enum: ['company', 'trainer'],
    required: true
  },

  message: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: [
      'new_application',
      'interview_scheduled',
      'application_selected',
      'application_rejected',
      'dispute_raised',    // <--- Added for the Dispute Button
      'warning_posted',    // <--- Added for the Defame/Network Warning
      'payment_deadline',  // <--- Added for 15-day alerts
      'general',
      'payment_resolved'
    ],
    default: 'general'
  },

  isRead: {
    type: Boolean,
    default: false
  },

  relatedApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }

}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);