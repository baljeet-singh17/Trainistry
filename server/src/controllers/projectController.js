const Project = require('../models/Project');
const Application = require('../models/Application');
const TrainerProfile = require('../models/TrainerProfile');


// ===============================
// APPLY TO PROJECT (Trainer Only)
// ===============================
exports.applyToProject = async (req, res) => {
  try {
    if (req.user.role !== 'trainer') {
      return res.status(403).json({
        success: false,
        message: 'Only trainers can apply to projects'
      });
    }

    const { projectId } = req.params;
    const { resumeUrl, proposalMessage, expectedRate } = req.body;

    if (!resumeUrl || !proposalMessage) {
      return res.status(400).json({
        success: false,
        message: 'Resume URL and proposal message are required'
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const trainerProfile = await TrainerProfile.findOne({ user: req.user._id });
    if (!trainerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Trainer profile not found'
      });
    }

    const existingApplication = await Application.findOne({
      project: projectId,
      trainer: trainerProfile._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this project'
      });
    }

    const application = await Application.create({
      project: projectId,
      trainer: trainerProfile._id,
      resumeUrl,
      proposalMessage,
      expectedRate
    });

    const populatedApplication = await Application.findById(application._id)
      .populate({
        path: 'trainer',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .populate({
        path: 'project',
        populate: { path: 'company', select: 'name location industry' }
      });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: populatedApplication
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// GET ALL PROJECTS (Public)
// ===============================
exports.getAllProjects = async (req, res) => {
  try {

    const projects = await Project.find()
      .populate('company', 'name description location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// GET OPEN PROJECTS (Trainer Only)
// ===============================
exports.getOpenProjects = async (req, res) => {
  try {

    if (req.user.role !== 'trainer') {
      return res.status(403).json({
        success: false,
        message: 'Only trainers can view open projects'
      });
    }

    const openProjects = await Project.find({ status: 'open' })
      .populate('company', 'name location industry')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: openProjects
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};


// ===============================
// FILTER PROJECTS (NEW FEATURE)
// ===============================
exports.filterProjects = async (req, res) => {
  try {

    const {
      technology,
      location,
      status,
      tfaProvided,
      tocProvided
    } = req.query;

    let filter = {};

    if (technology) {
  filter.technology = { $regex: technology, $options: 'i' };
}

    if (location) {
  filter.location = { $regex: location, $options: 'i' };
}

    if (status) filter.status = status;

    if (tfaProvided) filter.tfaProvided = tfaProvided === "true";

    if (tocProvided) filter.tocProvided = tocProvided === "true";

    const projects = await Project.find(filter)
      .populate('company', 'name location industry')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results: projects.length,
      data: projects
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// ===============================
// GET SINGLE PROJECT BY ID
// ===============================
exports.getProjectById = async (req, res) => {
  try {

    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate('company', 'name description location');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};