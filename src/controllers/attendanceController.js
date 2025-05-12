const attendanceService = require('../services/attendanceService');
const axios = require('axios');

exports.clockIn = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Verifikasi wajah melalui endpoint FastAPI
    const verify = await axios.post('http://localhost:8000/verify/');
    if (verify.data.userId !== userId) {
      return res.status(403).json({ message: 'Wajah tidak cocok dengan user login.' });
    }

    // Panggil service untuk clock-in
    const result = await attendanceService.clockIn(userId);
    res.json({ message: 'Clock in success', result });
  } catch (err) {
    next(err);
  }
};

exports.clockOut = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Panggil service untuk clock-out
    const result = await attendanceService.clockOut(userId);
    res.json({ message: 'Clock out success', result });
  } catch (err) {
    next(err);
  }
};
