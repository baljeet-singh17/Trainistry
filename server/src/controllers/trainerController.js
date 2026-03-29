
const Project = require('../models/Project');
const Application = require('../models/Application');
const TrainerProfile = require('../models/TrainerProfile');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const Post = require('../models/Post'); 
const CompanyProfile = require('../models/CompanyProfile'); 

// ===============================
// DASHBOARD & PROFILE
// ===============================

exports.getTrainerDashboard = async (req, res) => {
  try {
    const trainer = await TrainerProfile.findOne({ user: req.user._id })
      .populate('user', 'name email role followers following');
      
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer profile not found' });

    const totalApplications = await Application.countDocuments({ trainer: trainer._id });
    const interviews = await Application.countDocuments({ trainer: trainer._id, status: 'interview_scheduled' });
    const accepted = await Application.countDocuments({ trainer: trainer._id, status: 'accepted' });

    res.status(200).json({ 
      success: true, 
      data: { profile: trainer, stats: { totalApplications, interviews, accepted } } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await TrainerProfile.findOne({ user: req.user._id })
      .populate({
        path: 'user',
        select: 'name email role followers following',
        populate: [
          { path: 'followers', select: 'name role' },
          { path: 'following', select: 'name role' }
        ]
      });

    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const profile = await TrainerProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    const { expertise, experienceYears, location, bio, availability } = req.body;

    if (expertise) {
      try {
        profile.expertise = JSON.parse(expertise);
      } catch (e) {
        profile.expertise = expertise;
      }
    }

    if (experienceYears !== undefined) profile.experienceYears = experienceYears;
    if (location !== undefined) profile.location = location;
    if (bio !== undefined) profile.bio = bio;
    if (availability && ['available', 'busy'].includes(availability)) profile.availability = availability;

    if (req.file) {
      profile.resumeUrl = `http://localhost:5000/uploads/resumes/${req.file.filename}`;
    }

    const updatedProfile = await profile.save();
    res.status(200).json({ success: true, data: updatedProfile, availability: updatedProfile.availability });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// PROJECTS & APPLICATIONS
// ===============================

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'open' }).populate('company', 'name location industry').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('company', 'name location industry');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applyToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const trainer = await TrainerProfile.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!trainer) return res.status(404).json({ success: false, message: "Trainer profile not found" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    
    const existing = await Application.findOne({ project: projectId, trainer: trainer._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied to this project' });

    const resumePath = req.file 
      ? `http://localhost:5000/uploads/resumes/${req.file.filename}` 
      : trainer.resumeUrl;

    if (!resumePath) {
      return res.status(400).json({ success: false, message: "Please upload a resume" });
    }

    const application = await Application.create({
      project: projectId,
      trainer: trainer._id,
      resumeUrl: resumePath,
      proposalMessage: req.body.proposalMessage,
      expectedRate: req.body.expectedRate
    });

    await Notification.create({
      recipient: project.company,
      recipientType: 'company',
      message: `${trainer.user.name} applied to your project: "${project.title}"`,
      type: 'new_application',
      relatedApplication: application._id
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATED: Now fetches paymentStatus and transactionId
exports.getMyApplications = async (req, res) => {
  try {
    const trainer = await TrainerProfile.findOne({ user: req.user._id });
    if (!trainer) return res.status(404).json({ success: false, message: "Trainer not found" });

    const applications = await Application.find({ trainer: trainer._id })
      .populate({ 
          path: 'project', 
          populate: { path: 'company', select: 'name location industry' } 
      })
      .select('+paymentStatus +transactionId') // Ensures these fields are included if hidden in schema
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.withdrawApplication = async (req, res) => {
  try {
    const trainer = await TrainerProfile.findOne({ user: req.user._id });
    const application = await Application.findOne({ _id: req.params.applicationId, trainer: trainer._id });

    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    if (application.status === 'accepted') return res.status(400).json({ success: false, message: "Cannot withdraw accepted application" });

    await Application.findByIdAndDelete(req.params.applicationId);
    res.status(200).json({ success: true, message: "Application withdrawn" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// SOCIAL & NETWORK
// ===============================

exports.searchTrainers = async (req, res) => {
  try {
    const { name, expertise, location } = req.query;
    let userIds = [];

    if (name) {
      const users = await User.find({ name: { $regex: name, $options: 'i' }, role: 'trainer' }).select('_id');
      userIds = users.map(u => u._id);
    }

    const filter = {};
    if (name) filter.user = { $in: userIds };
    if (expertise) filter.expertise = { $regex: expertise, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };

    const trainers = await TrainerProfile.find(filter).populate('user', 'name email followers following');
    res.status(200).json({ success: true, data: trainers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.followUnfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) return res.status(404).json({ success: false, message: "User not found" });

    const isFollowing = currentUser.following.some(id => id.toString() === targetUserId);

    if (isFollowing) {
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
      await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
    } else {
      await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });
      await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
    }

    res.status(200).json({ 
      success: true, 
      isFollowing: !isFollowing, 
      message: isFollowing ? "Unfollowed" : "Followed" 
    });
  } catch (error) {
    console.error("FOLLOW_ERROR:", error);
    res.status(500).json({ success: false, message: "Connection update failed" });
  }
};

exports.getNetworkFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select('following');
    
    const achievements = await Achievement.find()
      .populate({
        path: 'trainer',
        populate: { path: 'user', select: 'name role followers following' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      data: achievements,
      currentUserFollowing: currentUser ? currentUser.following : [] 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// FEEDBACK & LIKES
// ===============================

exports.likeDislikeTrainer = async (req, res) => {
  try {
    const { trainerId, action } = req.body;
    const profile = await TrainerProfile.findById(trainerId);
    if (!profile) return res.status(404).json({ success: false, message: "Trainer profile not found" });

    if (action === 'like') profile.likes = (profile.likes || 0) + 1;
    else profile.dislikes = (profile.dislikes || 0) + 1;
    
    await profile.save();
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addFeedback = async (req, res) => {
  try {
    const { trainerId, comment } = req.body;
    const profile = await TrainerProfile.findById(trainerId);
    if (!profile) return res.status(404).json({ success: false, message: "Trainer profile not found" });

    profile.feedbacks.push({ sender: req.user._id, comment, date: Date.now() });
    await profile.save();
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// PAYMENT & DISPUTES
// ===============================
exports.markAsDisputed = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('project');
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.isDisputed = true;
    await application.save();

    const company = await CompanyProfile.findOne({ _id: application.project.company });
    
    if (company) {
      await Post.create({
        user: req.user._id, 
        authorRole: req.user.role || 'trainer', 
        title: "⚠️ Industrial Payment Dispute", 
        description: `A formal dispute has been raised against ${company.companyName || 'the company'} regarding the project "${application.project.title}". The 15-day industrial payment window has been exceeded.`, 
        postType: 'warning',
        relatedCompany: company._id
      });

      const currentScore = company.paymentTrustScore || 100;
      company.paymentTrustScore = Math.max(0, currentScore - 10);
      
      await company.save();
    }

    res.status(200).json({ 
      success: true, 
      message: "Dispute raised, warning posted, and Trust Score penalized.",
      newScore: company ? company.paymentTrustScore : null 
    });
  } catch (error) {
    console.error("Dispute Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.raiseDispute = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { reason } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const now = new Date();
    const deadline = new Date(project.paymentDeadline);
    
    if (now <= deadline) {
      return res.status(400).json({ 
        success: false, 
        message: "Dispute can only be raised after the 15-day industrial window expires." 
      });
    }

    project.isDisputed = true;
    project.disputeReason = reason || "Automatic: Payment overdue beyond 15-day window.";
    project.disputeDate = now;
    
    await project.save();

    await Notification.create({
      recipient: project.company,
      recipientType: 'company',
      message: `DISPUTE ALERT: A trainer has raised a dispute for "${project.title}" regarding an overdue payment.`,
      type: 'dispute_raised'
    });

    res.status(200).json({ success: true, message: "Dispute raised. Trainistry Admin has been notified." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};