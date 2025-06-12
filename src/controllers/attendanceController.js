const attendanceService = require('../services/attendanceService');
const axios             = require('axios');

/* —–––––––– CLOCK-IN —–––––––– */
exports.clockIn = async (req, res, next) => {
  try {
    const userId = req.user.id;

    /* 1. Verifikasi wajah (FastAPI) */
    const { data } = await axios.post('http://localhost:8000/verify/');
    if (data.userId !== userId) {
      return res.status(403).json({ message: 'Wajah tidak cocok dengan user login.' });
    }

    /* 2. Proses attendance */
    const attendance = await attendanceService.clockIn(userId);
    res.json({ message: 'Clock-in success', attendance });
  } catch (err) {
    /* Error dari FastAPI → teruskan */
    if (err.response?.data?.detail) {
      return res.status(err.response.status).json({ message: err.response.data.detail });
    }
    /* Error dari service (mis. sedang cuti) */
    if (err.message) {
      return res.status(403).json({ message: err.message });
    }
    next(err);
  }
};

/* —–––––––– CLOCK-OUT —–––––––– */
exports.clockOut = async (req, res, next) => {
  try {
    const attendance = await attendanceService.clockOut(req.user.id);
    res.json({ message: 'Clock-out success', attendance });
  } catch (err) { next(err); }
};
