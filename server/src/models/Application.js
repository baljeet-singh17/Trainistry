
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainerProfile',
      required: true
    },
    resumeUrl: {
      type: String,
      required: true
    },
    proposalMessage: {
      type: String,
      default: ''
    },
    expectedRate: {
      type: Number
    },
    status: {
      type: String,
      enum: [
        'applied', 
        'shortlisted', 
        'interview', 
        'interview_scheduled', 
        'selected', 
        'rejected', 
        'completed'
      ],
      default: 'applied'
    },
    // ======= ADDED FOR REPUTATION SYSTEM =======
    isDisputed: { 
      type: Boolean, 
      default: false 
    },
    // ===========================================
    interviewDate: { type: Date },
    interviewTime: { type: String },
    meetingLink: { type: String },
    feedback: { type: String, default: '' },
    projectStartDate: { type: Date },
    projectEndDate: { type: Date },
    paymentDeadline: { type: Date },
    transactionId: { type: String },
    paymentStatus: {
      type: String,
      enum: ['pending', 'cleared'],
      default: 'pending'
    }
  }, { timestamps: true });

applicationSchema.pre('save', async function () {
  if (this.isModified('status') && this.status === 'completed') {
    const endDate = this.projectEndDate || new Date();
    if (!this.projectEndDate) {
      this.projectEndDate = endDate;
    }
    const deadline = new Date(endDate);
    deadline.setDate(deadline.getDate() + 15);
    this.paymentDeadline = deadline;
  }
});

applicationSchema.index({ project: 1, trainer: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);

