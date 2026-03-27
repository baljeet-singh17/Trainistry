const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainerProfile', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyProfile', required: true },
  resumeUrl: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'], 
    default: 'Applied' 
  },
  interviewDate: { type: Date },
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);