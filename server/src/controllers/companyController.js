
const CompanyProfile = require("../models/CompanyProfile");
const Project = require("../models/Project");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Post = require("../models/Post"); 
const sendEmail = require("../utils/emailService");

// =====================================
// GET COMPANY DASHBOARD STATS
// =====================================
exports.getCompanyDashboardStats = async (req, res) => {
  try {
    const company = await CompanyProfile.findOne({ user: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company profile not found" });
    }

    const projects = await Project.find({ company: company._id });
    const projectIds = projects.map(p => p._id);

    const warningCount = await Post.countDocuments({ 
      relatedCompany: company._id, 
      postType: 'warning' 
    });
    
    const calculatedScore = Math.max(0, 100 - (warningCount * 10));

    if (company.trustScore !== calculatedScore) {
      company.trustScore = calculatedScore;
      await company.save();
    }
    
    const stats = {
      totalPostings: projects.length,
      activeProjects: projects.filter(p => p.status === 'open' || p.status === 'assigned').length,
      paymentTrustScore: calculatedScore, 
      shortlistedTrainers: await Application.countDocuments({ 
        project: { $in: projectIds }, 
        status: 'shortlisted' 
      }),
      interviewsScheduled: await Application.countDocuments({ 
        project: { $in: projectIds }, 
        status: 'interview_scheduled' 
      }),
      activeDisputes: await Application.countDocuments({
        project: { $in: projectIds },
        isDisputed: true
      })
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET MY COMPANY PROFILE
// =====================================
// exports.getMyCompany = async (req, res) => {
//   try {
//     const company = await CompanyProfile
//       .findOne({ user: req.user._id })
//       .populate("user", "name email phone");

//     if (!company) {
//       return res.status(404).json({ success: false, message: "Company profile not found" });
//     }

//     const warningCount = await Post.countDocuments({ 
//       relatedCompany: company._id, 
//       postType: 'warning' 
//     });
    
//     company.trustScore = Math.max(0, 100 - (warningCount * 10));
//     await company.save();

//     res.status(200).json({ success: true, data: company });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// =====================================
// GET MY COMPANY PROFILE (Updated to include Connections)
// =====================================
exports.getMyCompany = async (req, res) => {
  try {
    const company = await CompanyProfile
      .findOne({ user: req.user._id })
      // ADDED 'followers' and 'following' to the populate list here:
      .populate("user", "name email phone followers following");

    if (!company) {
      return res.status(404).json({ success: false, message: "Company profile not found" });
    }

    const warningCount = await Post.countDocuments({ 
      relatedCompany: company._id, 
      postType: 'warning' 
    });
    
    company.trustScore = Math.max(0, 100 - (warningCount * 10));
    await company.save();

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// CREATE COMPANY PROFILE
// =====================================
exports.createCompany = async (req, res) => {
  try {
    const existing = await CompanyProfile.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: "Company profile already exists" });
    }

    const company = await CompanyProfile.create({
      user: req.user._id,
      trustScore: 100, 
      ...req.body
    });

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// POST PROJECT
// =====================================
exports.postProject = async (req, res) => {
  try {
    const company = await CompanyProfile.findOne({ user: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company profile not found" });
    }

    const project = await Project.create({
      company: company._id,
      ...req.body
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET COMPANY PROJECTS (Updated to merge Application Status)
// =====================================
// exports.getCompanyProjects = async (req, res) => {
//   try {
//     const company = await CompanyProfile.findOne({ user: req.user._id });
//     if (!company) {
//       return res.status(404).json({ success: false, message: "Company profile not found" });
//     }

//     // Get projects and convert to plain objects with .lean()
//     const projects = await Project.find({ company: company._id }).sort({ createdAt: -1 }).lean();

//     // Merge payment/dispute data from the Application collection
//     const projectsWithAppData = await Promise.all(projects.map(async (proj) => {
//       const selectedApp = await Application.findOne({ 
//         project: proj._id, 
//         status: { $in: ['selected', 'completed'] } 
//       }).select('isDisputed paymentStatus transactionId');

//       return {
//         ...proj,
//         isDisputed: selectedApp ? selectedApp.isDisputed : false,
//         paymentStatus: selectedApp ? selectedApp.paymentStatus : 'pending',
//         transactionId: selectedApp ? selectedApp.transactionId : null
//       };
//     }));

//     res.status(200).json({ success: true, data: projectsWithAppData });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
exports.getCompanyProjects = async (req, res) => {
  try {
    // 1. Find the profile linked to the logged-in user
    const company = await CompanyProfile.findOne({ user: req.user._id });
    
    if (!company) {
      return res.status(404).json({ success: false, message: "Company profile not found" });
    }

    // DEBUG LOG: Compare this ID with the one in your MongoDB Project document
    console.log("Current Profile ID:", company._id.toString());

    // 2. Fetch projects matching this specific profile ID
    const projects = await Project.find({ company: company._id })
      .sort({ createdAt: -1 })
      .lean();

    // 3. Merge Application Status (Disputes/Payments)
    const projectsWithAppData = await Promise.all(projects.map(async (proj) => {
      const selectedApp = await Application.findOne({ 
        project: proj._id, 
        status: { $in: ['selected', 'completed'] } 
      }).select('isDisputed paymentStatus transactionId');

      return {
        ...proj,
        isDisputed: selectedApp ? selectedApp.isDisputed : false,
        paymentStatus: selectedApp ? selectedApp.paymentStatus : 'pending',
        transactionId: selectedApp ? selectedApp.transactionId : null
      };
    }));

    res.status(200).json({ success: true, data: projectsWithAppData });
  } catch (error) {
    console.error("GET_PROJECTS_ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET PROJECT APPLICATIONS
// =====================================
exports.getProjectApplications = async (req, res) => {
  try {
    const applications = await Application.find({ project: req.params.projectId })
      .populate({
        path: "trainer",
        populate: { path: "user", select: "name email phone" }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// // =====================================
// // UPDATE APPLICATION STATUS
// // =====================================
// exports.updateApplicationStatus = async (req, res) => {
//   try {
//     const { applicationId } = req.params;
//     const { status, feedback, date, time, link } = req.body;

//     const application = await Application.findById(applicationId)
//       .populate("project")
//       .populate({
//         path: "trainer",
//         populate: { path: "user" }
//       });

//     if (!application) {
//       return res.status(404).json({ success: false, message: "Application not found" });
//     }

//     application.status = status;
//     if (feedback) application.feedback = feedback;
    
//     if (status === 'interview_scheduled') {
//       application.interviewDate = date;
//       application.interviewTime = time;
//       application.meetingLink = link;
//     }
    
//     await application.save();

//     const trainerUser = application.trainer.user;
//     let emailSubject = '';
//     let emailHtml = '';

//     if (status === 'selected') {
//       emailSubject = `🎉 Selection Confirmed: ${application.project.title}`;
//       emailHtml = `
//         <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//           <h2 style="color: #4338ca;">Congratulations ${trainerUser.name}!</h2>
//           <p>You have been <b>Selected</b> for the industrial project: <strong>${application.project.title}</strong>.</p>
//           <p>The company will reach out to you at <strong>${trainerUser.phone}</strong> to discuss the schedule.</p>
//           <p>Best Regards,<br/><strong>Trainistry Team</strong></p>
//         </div>`;
//     } 
//     else if (status === 'interview_scheduled') {
//       emailSubject = `📅 Interview Scheduled: ${application.project.title}`;
//       emailHtml = `
//         <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//           <h2 style="color: #f59e0b;">Interview Invitation</h2>
//           <p>Hi ${trainerUser.name}, an interview has been scheduled for <strong>${application.project.title}</strong>.</p>
//           <p><b>Date:</b> ${date}<br/><b>Time:</b> ${time}</p>
//           <p><b>Meeting Link:</b> <a href="${link}">${link}</a></p>
//           <p>Best Regards,<br/>Trainistry Team</p>
//         </div>`;
//     }
//     else if (status === 'rejected') {
//       emailSubject = `Update: ${application.project.title}`;
//       emailHtml = `
//         <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//           <p>Hi ${trainerUser.name},</p>
//           <p>The company has decided not to proceed with your application for <strong>${application.project.title}</strong>.</p>
//           ${feedback ? `<p><b>Note:</b> ${feedback}</p>` : ''}
//           <p>Keep applying!</p>
//         </div>`;
//     }

//     if (emailSubject) {
//       await sendEmail({
//         email: trainerUser.email,
//         subject: emailSubject,
//         html: emailHtml
//       });
//     }

//     res.status(200).json({ success: true, message: `Status updated to ${status} and Trainer notified.` });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// =====================================
// UPDATE APPLICATION STATUS
// =====================================
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, feedback, date, time, link } = req.body;

    // Log the incoming status to check for string mismatches (e.g., 'shortlisted' vs 'Shortlisted')
    console.log(`Updating Application ${applicationId} to status: ${status}`);

    const application = await Application.findById(applicationId)
      .populate("project")
      .populate({
        path: "trainer",
        populate: { path: "user" }
      });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.status = status;
    if (feedback) application.feedback = feedback;
    
    if (status === 'interview_scheduled') {
      application.interviewDate = date;
      application.interviewTime = time;
      application.meetingLink = link;
    }
    
    await application.save();

    const trainerUser = application.trainer.user;
    let emailSubject = '';
    let emailHtml = '';

    // UPDATED LOGIC: Trigger email if status is 'selected' OR 'shortlisted'
    if (status === 'selected' || status === 'shortlisted') {
      emailSubject = `🎉 Selection Confirmed: ${application.project.title}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #4338ca;">Congratulations ${trainerUser.name}!</h2>
          <p>You have been <b>Selected/Shortlisted</b> for the industrial project: <strong>${application.project.title}</strong>.</p>
          <p>The company will reach out to you at <strong>${trainerUser.phone}</strong> to discuss the next steps and schedule.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 14px;">Best Regards,<br/><strong>Trainistry Team</strong></p>
        </div>`;
    } 
    else if (status === 'interview_scheduled') {
      emailSubject = `📅 Interview Scheduled: ${application.project.title}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #f59e0b;">Interview Invitation</h2>
          <p>Hi ${trainerUser.name}, an interview has been scheduled for <strong>${application.project.title}</strong>.</p>
          <div style="background: #fff9eb; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><b>Date:</b> ${date}</p>
            <p><b>Time:</b> ${time}</p>
            <p><b>Meeting Link:</b> <a href="${link}">${link}</a></p>
          </div>
          <p style="color: #666; font-size: 14px;">Best Regards,<br/>Trainistry Team</p>
        </div>`;
    }
    else if (status === 'rejected') {
      emailSubject = `Update regarding: ${application.project.title}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px;">
          <p>Hi ${trainerUser.name},</p>
          <p>The company has decided not to proceed with your application for <strong>${application.project.title}</strong> at this time.</p>
          ${feedback ? `<p style="padding: 10px; background: #f9fafb; border-left: 4px solid #d1d5db;"><b>Feedback from Company:</b> ${feedback}</p>` : ''}
          <p>Don't be discouraged—keep applying to other relevant projects on Trainistry!</p>
          <p style="color: #666; font-size: 14px;">Best Regards,<br/>Trainistry Team</p>
        </div>`;
    }

    // Only attempt to send if a subject was assigned based on the status
    if (emailSubject) {
      try {
        await sendEmail({
          email: trainerUser.email,
          subject: emailSubject,
          html: emailHtml
        });
        console.log(`Email successfully sent to: ${trainerUser.email}`);
      } catch (emailError) {
        console.error("EMAIL_SEND_FAILURE:", emailError.message);
        // We don't return 500 here because the DB update was successful
      }
    }

    res.status(200).json({ 
      success: true, 
      message: `Status updated to ${status} and Trainer notified via email.` 
    });
  } catch (error) {
    console.error("UPDATE_STATUS_ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// UPDATE PROJECT STATUS (15-Day Rule)
// =====================================
exports.updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    project.status = status.toLowerCase();

    if (status.toLowerCase() === 'completed') {
      const now = new Date();
      const deadline = new Date(now);
      deadline.setDate(deadline.getDate() + 15);
      project.paymentDeadline = deadline;

      await Application.updateMany(
        { project: projectId, status: 'selected' },
        { 
          status: 'completed', 
          projectEndDate: now,
          paymentDeadline: deadline 
        }
      );
    }

    await project.save();
    
    res.status(200).json({ 
      success: true, 
      message: status.toLowerCase() === 'completed' ? "Project and Application completed. Payment deadline set." : "Status updated" 
    });
  } catch (error) {
    console.error("Project Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// SCHEDULE INTERVIEW
// =====================================
exports.scheduleInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { date, time, link } = req.body; 

    const application = await Application.findById(applicationId)
      .populate("project")
      .populate({ path: "trainer", populate: { path: "user" } });

    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    application.status = "interview_scheduled"; 
    application.interviewDate = date; 
    application.interviewTime = time;
    application.meetingLink = link;
    await application.save();

    await Notification.create({
      recipient: application.trainer.user._id,
      recipientType: "trainer",
      message: `Interview scheduled for "${application.project.title}" on ${date} at ${time}.`,
      type: "interview_scheduled"
    });

    res.status(200).json({ success: true, message: "Interview scheduled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// RESOLVE DISPUTE (Updated with Email)
// =====================================
exports.resolveDispute = async (req, res) => {
  try {
    const projectId = req.params.applicationId;
    const { transactionId } = req.body;

    const application = await Application.findOne({ 
      project: projectId, 
      isDisputed: true 
    }).populate({
      path: 'trainer',
      populate: { path: 'user', select: 'name email' }
    }).populate('project', 'title company');

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: "No active dispute found for this project." 
      });
    }

    application.isDisputed = false;
    application.paymentStatus = 'cleared'; 
    application.status = 'completed'; 
    application.transactionId = transactionId;
    await application.save();

    await Post.deleteMany({ 
      relatedCompany: application.project.company || application.project, 
      postType: 'warning'
    });

    const trainerUser = application.trainer.user;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #4338ca; border-radius: 10px;">
        <h2 style="color: #10b981;">💰 Payment Received!</h2>
        <p>Hi ${trainerUser.name},</p>
        <p>The company has resolved the dispute for the project: <strong>${application.project.title}</strong>.</p>
        <p><b>Transaction Reference:</b> ${transactionId}</p>
        <p>The payment has been marked as <b>Cleared</b> on your dashboard.</p>
        <p>Best Regards,<br/><strong>Trainistry Team</strong></p>
      </div>`;

    await sendEmail({
      email: trainerUser.email,
      subject: `✅ Dispute Resolved & Payment Cleared: ${application.project.title}`,
      html: emailHtml
    });

    await Notification.create({
      recipient: trainerUser._id,
      recipientType: "trainer",
      message: `Dispute Resolved: Payment received for "${application.project.title}". Ref: ${transactionId}`,
      type: "payment_resolved" 
    });

    res.status(200).json({ success: true, message: "Dispute resolved and Trainer notified via email." });

  } catch (error) {
    console.error("Resolution Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET COMPANIES / BY ID
// =====================================
exports.getCompanies = async (req, res) => {
  try {
    const companies = await CompanyProfile.find().populate("user", "name email");
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await CompanyProfile.findById(req.params.id).populate("user", "name email phone");
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// =====================================
// SEARCH COMPANIES
// =====================================
exports.searchCompanies = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim().length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // UPDATED: Changed 'companyName' to 'name' to match your Model
    const companies = await CompanyProfile.find({
      $or: [
        { name: { $regex: name.trim(), $options: "i" } },
        { location: { $regex: name.trim(), $options: "i" } }
      ]
    }).populate("user", "name email");

    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.followCompany = async (req, res) => {
  try {
    const targetUserId = req.params.targetId;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: "You cannot connect with yourself" });
    }

    const user = await User.findById(currentUserId);
    const isFollowing = user.following && user.following.includes(targetUserId);

    // Use findByIdAndUpdate to bypass full document validation
    await User.findByIdAndUpdate(currentUserId, {
      [isFollowing ? '$pull' : '$addToSet']: { following: targetUserId }
    });

    res.status(200).json({ 
      success: true, 
      isFollowing: !isFollowing,
      message: isFollowing ? "Unfollowed" : "Followed" 
    });
  } catch (error) {
    console.error("FOLLOW_ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// // =====================================
// // UPDATE COMPANY PROFILE
// // =====================================
// exports.updateCompanyProfile = async (req, res) => {
//   try {
//     const { name, industry, location, description } = req.body;

//     // 1. Find the profile belonging to the logged-in user
//     let profile = await CompanyProfile.findOne({ user: req.user._id });

//     if (!profile) {
//       return res.status(404).json({
//         success: false,
//         message: "Company profile not found"
//       });
//     }

//     // 2. Update the fields if provided in the request body
//     if (name) profile.name = name;
//     if (industry) profile.industry = industry;
//     if (location) profile.location = location;
//     if (description) profile.description = description;

//     // 3. Save the changes
//     // This uses your existing CompanyProfile model constraints
//     await profile.save();

//     // 4. Return the updated profile with populated user data
//     // This ensures your Frontend state (profile.user.followers, etc.) stays intact
//     const updatedProfile = await CompanyProfile.findOne({ user: req.user._id })
//       .populate("user", "name email phone followers following");

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       data: updatedProfile
//     });

//   } catch (error) {
//     console.error("UPDATE_PROFILE_ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Server Error: Could not update profile"
//     });
//   }
// };
// =====================================
// UPDATE COMPANY PROFILE (Updated for Verification Toggle)
// =====================================
exports.updateCompanyProfile = async (req, res) => {
  try {
    // 1. Add 'isVerified' to the destructured body
    const { name, industry, location, description, isVerified } = req.body;

    let profile = await CompanyProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found"
      });
    }

    // 2. Update the fields if provided in the request body
    if (name) profile.name = name;
    if (industry) profile.industry = industry;
    if (location) profile.location = location;
    if (description) profile.description = description;
    
    // 3. Handle the verification toggle
    // We check if it's undefined to allow 'false' to be passed
    if (isVerified !== undefined) {
      profile.isVerified = isVerified;
    }

    // 4. Save the changes
    await profile.save();

    // 5. Return the updated profile with populated user data
    const updatedProfile = await CompanyProfile.findOne({ user: req.user._id })
      .populate("user", "name email phone followers following");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile
    });

  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error: Could not update profile"
    });
  }
};