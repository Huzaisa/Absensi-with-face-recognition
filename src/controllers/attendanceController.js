const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const attendanceService = require('../services/attendanceService');

exports.clockIn = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const filePath = req.file?.path;

    if (!filePath) {
      return res.status(400).json({ message: 'File tidak ditemukan dalam request.' });
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const { data } = await axios.post('http://localhost:8000/verify/', form, {
      headers: form.getHeaders(),
    });

    if (data.userId !== userId) {
      return res.status(403).json({ message: 'Wajah tidak cocok dengan user login.' });
    }

    const attendance = await attendanceService.clockIn(userId);

    res.json({
      message: `Clock-in success for ${attendance.user.name}`,
      user: {
        id: attendance.user.id,
        name: attendance.user.name,
        email: attendance.user.email,
      },
      attendance,
    });
  } catch (err) {
    if (err.response?.data?.detail) {
      return res.status(err.response.status).json({ message: err.response.data.detail });
    }
    next(err);
  }
};




exports.clockOut = async (req, res, next) => {
  try {
    const attendance = await attendanceService.clockOut(req.user.id);
    res.json({
      message: `Clock-out success for ${attendance.user.name}`,
      user: {
        id: attendance.user.id,
        name: attendance.user.name,
        email: attendance.user.email,
      },
      attendance,
    });
  } catch (err) {
    next(err);
  }
};

