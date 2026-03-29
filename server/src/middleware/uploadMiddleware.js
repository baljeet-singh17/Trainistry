const multer = require('multer');
const path = require('path');

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/resumes/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF/DOC/DOCX files allowed'), false);
  }
};

const uploadResume = multer({
  storage,
  fileFilter
});

module.exports = uploadResume;