const express = require('express');
const router = express.Router();
const controller = require('../controllers/uploadController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Middleware untuk handle upload file

router.use(auth);

// Route untuk upload dokumen izin
router.post('/', upload.single('document'), controller.uploadDocument); // "document" fieldname digunakan di form

// Lihat dokumen milik user sendiri
router.get('/me', controller.getUserDocuments);

// Lihat semua dokumen (hanya admin)
router.get('/all', role(['ADMIN']), controller.getAllDocuments);

module.exports = router;
