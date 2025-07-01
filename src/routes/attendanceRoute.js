const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post(
  '/clock-in',
  authMiddleware,
  upload.single('file'), 
  attendanceController.clockIn
);

router.post('/clock-out', authMiddleware, attendanceController.clockOut);
router.get('/history', authMiddleware, attendanceController.getAttendanceHistory);

module.exports = router;
