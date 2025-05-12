const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const controller = require('../controllers/overtimeController');

router.use(auth);

// Karyawan
router.post('/request', controller.requestOvertime);
router.get('/me', controller.getUserOvertime);

// Admin
router.get('/all', role(['ADMIN']), controller.getAllOvertime);
router.post('/approve', role(['ADMIN']), controller.approveOvertime);

module.exports = router;
