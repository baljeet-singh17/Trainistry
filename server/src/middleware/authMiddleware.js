// const jwt = require('jsonwebtoken');
// const User = require('../models/User');


// // 🔐 Protect routes (JWT verification)
// exports.protect = async (req, res, next) => {
//   try {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith('Bearer')
//     ) {
//       token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//       return res.status(401).json({
//         message: 'Not authorized, no token'
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id).select('-password');

//     if (!user) {
//       return res.status(401).json({
//         message: 'User not found'
//       });
//     }

//     req.user = user;

//     return next();   // ✅ IMPORTANT: return next()

//   } catch (error) {
//     return res.status(401).json({
//       message: 'Not authorized, token failed'
//     });
//   }
// };


// // 🔒 Role-based Authorization
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({
//         message: 'User not authenticated'
//       });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         message: `Access denied for role: ${req.user.role}`
//       });
//     }

//     return next();   
//   };
// };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔐 Protect routes (JWT verification)
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, no token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Crucial: Ensure we use decoded.id to match how you likely sign the token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    req.user = user;
    return next(); 

  } catch (error) {
    return res.status(401).json({
      message: 'Not authorized, token failed'
    });
  }
};

// 🔒 Role-based Authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied for role: ${req.user.role}`
      });
    }

    return next();   
  };
};