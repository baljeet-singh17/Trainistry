// @desc    Role-based authorization middleware
// @route   Middleware
// @access  Private (requires specific roles)

// Higher-order function that returns middleware for specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized to access this route. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// Specific middleware for admin-only routes
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  next();
};

// Specific middleware for company-only routes
const companyOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user' });
  }

  if (req.user.role !== 'company') {
    return res.status(403).json({ message: 'Access denied. Company only.' });
  }

  next();
};

// Specific middleware for trainer-only routes
const trainerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user' });
  }

  if (req.user.role !== 'trainer') {
    return res.status(403).json({ message: 'Access denied. Trainer only.' });
  }

  next();
};

// Middleware for admin and company routes
const adminOrCompany = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user' });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'company') {
    return res.status(403).json({ message: 'Access denied. Admin or Company only.' });
  }

  next();
};

// Middleware for admin and trainer routes
const adminOrTrainer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user' });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'trainer') {
    return res.status(403).json({ message: 'Access denied. Admin or Trainer only.' });
  }

  next();
};

module.exports = {
  authorize,
  adminOnly,
  companyOnly,
  trainerOnly,
  adminOrCompany,
  adminOrTrainer
};

