const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/clock-in', authMiddleware, attendanceController.clockIn);

router.post('/clock-out', authMiddleware, attendanceController.clockOut);

module.exports = router;
