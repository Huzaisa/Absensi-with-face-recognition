const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const attendanceService = require('../services/attendanceService');
const prisma = require('../config/db'); // Tambahkan ini untuk validasi userId dari DB

exports.clockIn = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const filePath = req.file?.path;

    if (!filePath) {
      return res.status(400).json({ message: 'File tidak ditemukan dalam request.' });
    }

    // Kirim gambar ke face-recognition-api
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post('http://localhost:8000/verify/', form, {
      headers: form.getHeaders(),
    });

    const verifiedUserId = response.data?.userId;

    console.log('👉 userId dari token:', userId);
    console.log('👉 userId hasil verifikasi wajah:', verifiedUserId);

    // Jika hasil verifikasi tidak cocok
    if (!verifiedUserId || verifiedUserId !== userId) {
      return res.status(403).json({ message: 'Wajah tidak cocok dengan user login.' });
    }

    // Validasi apakah userId hasil verifikasi benar-benar ada di DB
    const userExists = await prisma.user.findUnique({
      where: { id: verifiedUserId },
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User hasil verifikasi wajah tidak ditemukan di database.' });
    }

    // Clock in
    const attendance = await attendanceService.clockIn(userId);

    res.json({
      message: `Clock-in berhasil untuk ${attendance.user.name}`,
      user: {
        id: attendance.user.id,
        name: attendance.user.name,
        email: attendance.user.email,
      },
      attendance,
    });
  } catch (err) {
    if (err.code === 'ALREADY_CLOCKED_IN') {
      return res.status(400).json({ message: err.message });
    }

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
      message: `Clock-out berhasil untuk ${attendance.user.name}`,
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



exports.clockOut = async (req, res, next) => {
  try {
    const attendance = await attendanceService.clockOut(req.user.id);
    res.json({
      message: `Clock-out berhasil untuk ${attendance.user.name}`,
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

// Ambil semua riwayat absensi user login
exports.getAttendanceHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const records = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'desc' }, // Urutkan dari terbaru
      include: {
        shift: {
          include: {
            shift: true, // Include data shift detail
          }
        }
      }
    });

    const history = records.map((a) => ({
      date: a.date.toISOString().split('T')[0], // Format tanggal YYYY-MM-DD
      clockIn: a.clockIn ? new Date(a.clockIn).toLocaleTimeString('id-ID') : null,
      clockOut: a.clockOut ? new Date(a.clockOut).toLocaleTimeString('id-ID') : null,
      status: a.status,
      isLate: a.isLate,
      shift: a.shift?.shift
        ? {
            name: a.shift.shift.name,
            startTime: new Date(a.shift.shift.startTime).toLocaleTimeString('id-ID'),
            endTime: new Date(a.shift.shift.endTime).toLocaleTimeString('id-ID'),
          }
        : null,
    }));

    res.json({ userId, history });
  } catch (err) {
    next(err);
  }
};
