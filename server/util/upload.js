// utils/uploadUtil.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure temp folder exists
const tempDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// Multer setup
const upload = multer({
  dest: tempDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Only CSV files are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;