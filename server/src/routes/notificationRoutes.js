const express = require('express');
const router = express.Router();
const { getCompanyNotifications, markAsRead } = require('../controllers/notificationController');

// Get all unread notifications for a specific company
router.get('/:companyId', getCompanyNotifications);

// Mark a specific notification as seen
router.put('/:id/read', markAsRead);

module.exports = router;