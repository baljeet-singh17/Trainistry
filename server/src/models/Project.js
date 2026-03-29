const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyProfile',
      required: true
    },
    title: { type: String, required: true },
    technology: { type: String, required: true },
    description: { type: String, default: '' },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    durationDays: { type: Number, required: true },
    perDayPayment: { type: Number, required: true },
    paymentTerms: { type: String, required: true },
    tfaProvided: { type: Boolean, default: false },
    tocProvided: { type: Boolean, default: false },
    
    status: {
      type: String,
      enum: ['open', 'assigned', 'completed', 'cancelled'],
      default: 'open',
      lowercase: true
    },

    // --- PAYMENT & ESCALATION FIELDS ---
    paymentStatus: {
      type: String,
      enum: ['pending', 'cleared'],
      default: 'pending'
    },
    paymentDeadline: {
      type: Date
    },
    
    // Dispute Tracking
    isDisputed: { 
      type: Boolean, 
      default: false 
    },
    disputeReason: { 
      type: String, 
      default: '' 
    },
    disputeDate: { 
      type: Date 
    },

    // Escalation Flag
    isBlacklisted: { 
      type: Boolean, 
      default: false 
    },
    // ----------------------------------

    applicationCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);