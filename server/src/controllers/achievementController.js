
const Achievement = require('../models/Achievement');

// @desc    Create new achievement
exports.createAchievement = async (req, res) => {
  try {
    const achievementData = {
      trainer: req.user.id,
      description: req.body.description,
      category: req.body.category || 'Project Completion',
      companyName: req.body.companyName,
      location: req.body.location
    };

    if (req.file) {
      // Strips 'src/' or 'src\' from the start of the path to maintain static route consistency
      achievementData.imageUrl = req.file.path.replace(/^src[\\/]/, "");
    }

    const achievement = await Achievement.create(achievementData);
    const populatedAchievement = await Achievement.findById(achievement._id).populate('trainer', 'name');

    res.status(201).json({ success: true, data: populatedAchievement });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all achievements
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find()
      .populate('trainer', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: achievements.length, data: achievements });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Like / Unlike Achievement
exports.likeAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement.likes.includes(req.user.id)) {
      achievement.likes.push(req.user.id);
    } else {
      achievement.likes = achievement.likes.filter(id => id.toString() !== req.user.id);
    }
    await achievement.save();
    res.status(200).json({ success: true, likes: achievement.likes });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Comment on Achievement
exports.commentAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    const newComment = {
      user: req.user.id,
      text: req.body.text,
      name: req.user.name
    };
    achievement.comments.unshift(newComment);
    await achievement.save();
    res.status(200).json({ success: true, data: achievement.comments });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Repost Achievement
exports.repostAchievement = async (req, res) => {
  try {
    const original = await Achievement.findById(req.params.id).populate('trainer', 'name');
    const repostData = {
      trainer: req.user.id,
      description: `Reposted from ${original.trainer.name}: ${original.description}`,
      category: original.category,
      companyName: original.companyName,
      imageUrl: original.imageUrl
    };
    const newPost = await Achievement.create(repostData);
    original.repostCount += 1;
    await original.save();
    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};