const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');
const auth = require('../middlewares/authMiddleware');

// Buat shift baru
router.post('/', auth, shiftController.createShift);

// Assign shift ke user
router.post('/assign', auth, shiftController.assignShiftToUser);

// Ambil shift user pada tanggal tertentu
router.get('/user/:userId/date/:date', auth, (req, res, next) => {
  console.log('Handler for getShiftForUser is called');  // Debugging log
  return shiftController.getShiftForUser(req, res, next);
});

// Ambil semua shift
router.get('/', auth, shiftController.getAllShifts);

module.exports = router;
