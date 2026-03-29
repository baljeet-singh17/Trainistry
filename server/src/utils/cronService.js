const cron = require('node-cron');
const Project = require('../models/Project');
const CompanyProfile = require('../models/CompanyProfile');

// Runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  
  // Find projects where payment is pending and deadline has passed
  const overdueProjects = await Project.find({
    status: 'completed',
    paymentStatus: 'pending',
    paymentDeadline: { $lt: now }
  });

  for (let project of overdueProjects) {
    const daysOverdue = Math.floor((now - project.paymentDeadline) / (1000 * 60 * 60 * 24));

    if (daysOverdue === 1) {
      // Day 16: Send Overdue Email (Implementation depends on your emailService)
      console.log(`Sending warning to Company for project: ${project.title}`);
    } 
    else if (daysOverdue === 5) {
      // Day 20: Restrict Company access
      await CompanyProfile.findByIdAndUpdate(project.company, { 
        isBlacklisted: true,
        $inc: { trustScore: -10 } // Drop score by 10 points
      });
    }
  }
});