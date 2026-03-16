// User roles for the platform
module.exports = {
  TRAINER: 'trainer',
  COMPANY: 'company',
  ADMIN: 'admin'
};

// Role display names
module.exports.roleNames = {
  trainer: 'Trainer',
  company: 'Company',
  admin: 'Admin'
};

// Role permissions (for future use)
module.exports.permissions = {
  admin: [
    'manage_users',
    'manage_projects',
    'manage_applications',
    'view_analytics',
    'manage_platform'
  ],
  company: [
    'post_projects',
    'manage_projects',
    'view_applications',
    'shortlist_trainers',
    'schedule_interviews'
  ],
  trainer: [
    'view_projects',
    'apply_projects',
    'upload_resume',
    'update_profile'
  ]
};

