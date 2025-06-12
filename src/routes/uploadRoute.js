const express  = require('express');
const router   = express.Router();
const ctl      = require('../controllers/uploadController');
const auth     = require('../middlewares/authMiddleware');
const role     = require('../middlewares/roleMiddleware');
const upload   = require('../middlewares/uploadMiddleware'); // multer

router.use(auth);

/* ── POST – tambahkan dokumen (file optional) ── */
router.post('/', upload.single('document'), ctl.uploadDocument);

/* ── GET – dokumen milik user login ── */
router.get('/me', ctl.getUserDocuments);

/* ── ADMIN ONLY ──────────────────────────────── */
router.get('/all', role('ADMIN'), ctl.getAllDocuments);
router.delete('/:id', role('ADMIN'), ctl.deleteDocument);

/* ── detail dokumen (user mana pun, optional boleh di‐sekat) ── */
router.get('/:id', ctl.getDocument);

module.exports = router;
