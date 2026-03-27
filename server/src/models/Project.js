const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: true
  },
  technology: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  durationDays: { type: Number, required: true },
  perDayPayment: { type: Number, required: true },
  tfaProvided: { type: Boolean, default: false }, // Training Facilitation Allowance
  tocProvided: { type: Boolean, default: false }, // Table of Contents/Curriculum
  paymentTerms: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In-Progress', 'Completed'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);