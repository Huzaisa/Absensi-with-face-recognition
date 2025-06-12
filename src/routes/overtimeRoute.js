const express = require('express');
const router   = express.Router();
const auth     = require('../middlewares/authMiddleware');
const role     = require('../middlewares/roleMiddleware');
const ctl      = require('../controllers/overtimeController');

router.use(auth);                 // semua butuh token

// Karyawan
router.post('/request', ctl.requestOvertime);
router.get ('/me'    , ctl.getUserOvertime);

// Admin
router.get ('/all'   , role('ADMIN'),        ctl.getAllOvertime);
router.post('/approve', role('ADMIN'),       ctl.approveOvertime);
router.post('/reject' , role('ADMIN'),       ctl.rejectOvertime); // optional
module.exports = router;
