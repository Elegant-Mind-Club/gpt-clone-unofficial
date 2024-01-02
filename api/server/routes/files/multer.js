const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

// UCLA BEGIN EDIT
// Add excel files to supportedTypes
// const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const supportedTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
// UCLA END EDIT
const sizeLimit = 20 * 1024 * 1024; // 20 MB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const outputPath = path.join(req.app.locals.config.imageOutput, 'temp');
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
    cb(null, outputPath);
  },
  filename: function (req, file, cb) {
    req.file_id = crypto.randomUUID();
    const fileExt = path.extname(file.originalname);
    cb(null, `img-${req.file_id}${fileExt}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!supportedTypes.includes(file.mimetype)) {
    return cb(
      // UCLA BEGIN EDIT
      // Change error message to include excel files
      // new Error('Unsupported file type. Only JPEG, JPG, PNG, and WEBP files are allowed.'),
      new Error('Unsupported file type. Only JPEG, JPG, PNG, WEBP, and excel files are allowed.'),
      // UCLA END EDIT
      false,
    );
  }

  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: sizeLimit } });

module.exports = upload;
