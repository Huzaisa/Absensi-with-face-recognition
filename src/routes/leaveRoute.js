const express = require('express');
const router = express.Router();
const controller = require('../controllers/leaveController');
const auth  = require('../middlewares/authMiddleware');
const role  = require('../middlewares/roleMiddleware');

router.use(auth);                // semua butuh token

/* ──────────────  USER  ────────────── */
router.post('/request', controller.requestLeave);
router.get ('/me',      controller.getUserLeaves);

/* ──────────────  ADMIN  ───────────── */
router.get ('/all',        role('ADMIN'), controller.getAllLeaves);
router.get ('/allrequest', role('ADMIN'), controller.getAllLeaveRequests);
router.post('/approve',    role('ADMIN'), controller.approveLeave);
router.post('/reject',     role('ADMIN'), controller.rejectLeave);

module.exports = router;
