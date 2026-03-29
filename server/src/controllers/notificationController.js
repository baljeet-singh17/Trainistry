
const Notification = require("../models/Notification");
const CompanyProfile = require("../models/CompanyProfile");

// ================= TRAINER NOTIFICATIONS =================
exports.getTrainerNotifications = async (req, res) => {
  try {
    if (req.user.role !== "trainer") {
      return res.status(403).json({
        success: false,
        message: "Trainer access only"
      });
    }

    const notifications = await Notification.find({
      recipient: req.user._id,
      recipientType: "trainer"
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notifications
    });

  } catch (error) {
    console.error("Trainer notification error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= COMPANY NOTIFICATIONS =================
exports.getCompanyNotifications = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Company access only"
      });
    }

    const company = await CompanyProfile.findOne({
      user: req.user._id
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found"
      });
    }

    const notifications = await Notification.find({
      recipient: company._id,
      recipientType: "company"
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notifications
    });

  } catch (error) {
    console.error("Company notification error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= MARK AS READ =================
exports.markAsRead = async (req, res) => {
  try {

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });

  } catch (error) {
    console.error("Mark read error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};