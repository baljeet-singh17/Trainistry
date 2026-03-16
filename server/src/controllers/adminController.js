const User = require('../models/User');
const Project = require('../models/Project');
const Application = require('../models/Application');
const CompanyProfile = require('../models/CompanyProfile');
const TrainerProfile = require('../models/TrainerProfile');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;

    let query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('GetAllUsers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('GetUserById error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive, phone, location, companyName } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.isActive = isActive !== undefined ? isActive : user.isActive;
    user.phone = phone || user.phone;
    user.location = location || user.location;
    user.companyName = companyName || user.companyName;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      companyName: updatedUser.companyName,
      phone: updatedUser.phone,
      location: updatedUser.location
    });
  } catch (error) {
    console.error('UpdateUser error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DeleteUser error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Deactivate/Activate user (admin)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deactivating own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive
    });
  } catch (error) {
    console.error('ToggleUserStatus error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getPlatformStats = async (req, res) => {
  try {
    // Get user counts by role
    const userCounts = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get active/inactive user counts
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    // Get project counts
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'active' });

    // Get application counts
    const totalApplications = await Application.countDocuments();
    
    // Get application status counts
    const applicationStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format user counts
    const usersByRole = {
      admin: 0,
      company: 0,
      trainer: 0
    };
    
    userCounts.forEach(item => {
      usersByRole[item._id] = item.count;
    });

    // Format application status
    const appsByStatus = {};
    applicationStatus.forEach(item => {
      appsByStatus[item._id] = item.count;
    });

    res.json({
      users: {
        total: activeUsers + inactiveUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        byRole: usersByRole
      },
      projects: {
        total: totalProjects,
        active: activeProjects
      },
      applications: {
        total: totalApplications,
        byStatus: appsByStatus
      },
      companyProfiles: await CompanyProfile.countDocuments(),
      trainerProfiles: await TrainerProfile.countDocuments()
    });
  } catch (error) {
    console.error('GetPlatformStats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all projects (admin view)
// @route   GET /api/admin/projects
// @access  Private (Admin)
const getAllProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    
    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate('companyId', 'name companyName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('GetAllProjects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all applications (admin view)
// @route   GET /api/admin/applications
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('projectId', 'title technology location')
      .populate('trainerId', 'name email phone')
      .populate('companyId', 'companyName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('GetAllApplications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboard = async (req, res) => {
  try {
    // Recent users (last 5)
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent projects (last 5)
    const recentProjects = await Project.find()
      .populate('companyId', 'companyName')
      .sort({ createdAt: -1 })
      .limit(5);

    // Pending applications
    const pendingApplications = await Application.countDocuments({ status: 'pending' });

    // Active trainers count
    const activeTrainers = await User.countDocuments({ role: 'trainer', isActive: true });

    // Active companies count
    const activeCompanies = await User.countDocuments({ role: 'company', isActive: true });

    res.json({
      recentUsers,
      recentProjects,
      pendingApplications,
      activeTrainers,
      activeCompanies
    });
  } catch (error) {
    console.error('GetDashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getPlatformStats,
  getAllProjects,
  getAllApplications,
  getDashboard
};

