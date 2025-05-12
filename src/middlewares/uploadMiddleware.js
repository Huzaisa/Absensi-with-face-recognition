const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Gunakan req.query.type karena req.body belum ter-parse saat ini
    const type = req.query.type || req.headers['x-file-type'];
    let uploadPath = '';

    if (type === 'document') {
      uploadPath = path.join(__dirname, '../../public/documents');
    } else if (type === 'faceImage') {
      uploadPath = path.join(__dirname, '../../public/uploads/employee_faces');
    } else {
      return cb(new Error('Tipe file tidak valid.'));
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG, PNG, and PDF are allowed.'));
    }
  }
});

module.exports = upload;
