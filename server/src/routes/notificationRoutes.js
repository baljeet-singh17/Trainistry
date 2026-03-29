
const express = require("express");
const router = express.Router();

const {
  getTrainerNotifications,
  getCompanyNotifications,
  markAsRead
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// TRAINER
router.get("/trainer", protect, getTrainerNotifications);

// COMPANY
router.get("/company", protect, getCompanyNotifications);

// MARK READ
router.put("/:id/read", protect, markAsRead);

module.exports = router;