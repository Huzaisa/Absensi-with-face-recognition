const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

// Buat shift baru
router.post('/', auth,role('ADMIN'), shiftController.createShift);

// Assign shift ke user
router.post('/assign', auth, role('ADMIN'),shiftController.assignShiftToUser);
// Ambil semua mapping shift
router.get('/mappings', auth, role('ADMIN'), shiftController.getAllShiftMappings);

// Hapus shift mapping (pastikan ini di bawah import controller)
router.delete('/mapping', auth, role('ADMIN'), shiftController.deleteShiftMapping);


// Ambil shift user pada tanggal tertentu
router.get('/user/:userId/date/:date', auth, (req, res, next) => {
  console.log('Handler for getShiftForUser is called');  // Debugging log
  return shiftController.getShiftForUser(req, res, next);
});


// Ambil semua shift
router.get('/', auth, shiftController.getAllShifts);
router.delete('/:id', auth, role('ADMIN'), shiftController.deleteShift);

module.exports = router;
