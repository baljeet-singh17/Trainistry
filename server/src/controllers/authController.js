const User = require('../models/User');
const CompanyProfile = require('../models/CompanyProfile');
const TrainerProfile = require('../models/TrainerProfile');
const jwt = require('jsonwebtoken');

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,            // Collected from frontend
      expertise,        // Trainer field
      experienceYears,  // Trainer field
      location,         // Trainer/Company field
      bio,              // Trainer field
      resumeUrl,        // Trainer field
      industry,         // Company field
      description       // Company field
    } = req.body;

    // 1. Validation: Ensure phone is included since it's required in the Model
    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({
        message: 'Name, email, password, role, and phone are required'
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // 3. Create Base User
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone
    });

    // 4. Create Role-Specific Profiles
    if (role === 'company') {
      await CompanyProfile.create({
        user: user._id,
        name: name, // Using contact name as initial company name
        industry: industry || "General",
        location: location || "India",
        description: description || ""
      });
    } 
    else if (role === 'trainer') {
      if (!expertise) {
        return res.status(400).json({
          message: 'Expertise is required for trainer'
        });
      }

      // Build trainer profile object with provided data or defaults
      const trainerData = {
        user: user._id,
        expertise: expertise,
        experienceYears: experienceYears || 0,
        location: location || "India",
        bio: bio || "",
        resumeUrl: resumeUrl || ""
      };

      await TrainerProfile.create(trainerData);
    }

    // 5. Successful Response
    res.status(201).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error("REGISTER_ERROR:", error);
    res.status(500).json({
      message: error.message
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    let companyId = null;
    let trainerId = null;

    // Fetch Profile IDs so the frontend can redirect to the correct dashboard
    if (user.role === "company") {
      const companyProfile = await CompanyProfile.findOne({ user: user._id });
      if (companyProfile) {
        companyId = companyProfile._id;
      }
    }

    if (user.role === "trainer") {
      const trainerProfile = await TrainerProfile.findOne({ user: user._id });
      if (trainerProfile) {
        trainerId = trainerProfile._id;
      }
    }

    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId,
      trainerId,
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    res.status(500).json({
      message: error.message
    });
  }
};