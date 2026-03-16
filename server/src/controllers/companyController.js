const CompanyProfile = require('../models/CompanyProfile');
const Project = require('../models/Project');
const Application = require('../models/Application');

// ===============================
// COMPANY PROFILE LOGIC
// ===============================
exports.createCompany = async (req, res) => {
  try {
    const { name, email, industry, location, description } = req.body;
    const existingCompany = await CompanyProfile.findOne({ email });
    if (existingCompany) return res.status(400).json({ success: false, message: 'Email already exists' });

    const company = await CompanyProfile.create({ name, email, industry, location, description });
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await CompanyProfile.find();
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await CompanyProfile.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await CompanyProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    await CompanyProfile.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Company deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// PROJECT & APPLICATION LOGIC
// ===============================
exports.postProject = async (req, res) => {
  try {
    const project = await Project.create({ company: req.params.companyId, ...req.body });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompanyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ company: req.params.companyId });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectApplications = async (req, res) => {
  try {
    const applications = await Application.find({ project: req.params.projectId })
      .populate('trainer', 'name email technology'); 
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, interviewDate } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status, interviewDate },
      { new: true }
    );
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};