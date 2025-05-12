const prisma = require('../config/db');
const { isAfter } = require('date-fns');

exports.clockIn = async (userId) => {
  const today = new Date().toISOString().split('T')[0];

  // Cek apakah sudah absen
  const existing = await prisma.attendance.findUnique({
    where: { userId_date: { userId, date: new Date(today) } },
  });

  if (existing && existing.clockIn) {
    throw new Error('Sudah absen hari ini.');
  }

  // Mencari shift yang sesuai dengan user dan tanggal hari ini
  const shift = await prisma.shiftMapping.findFirst({
    where: { userId, date: new Date(today) },
    include: { shift: true },
  });

  const now = new Date();
  const isLate = shift && isAfter(now, shift.shift.startTime);

  // Menyimpan absen ke database
  const attendance = await prisma.attendance.upsert({
    where: { userId_date: { userId, date: new Date(today) } },
    update: { clockIn: now, status: isLate ? 'LATE' : 'ONTIME', isLate },
    create: {
      userId,
      date: new Date(today),
      clockIn: now,
      status: isLate ? 'LATE' : 'ONTIME',
      isLate,
    },
  });

  return attendance;
};

exports.clockOut = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Mengupdate jam clock out
  const attendance = await prisma.attendance.update({
    where: { userId_date: { userId, date: new Date(today) } },
    data: { clockOut: new Date() },
  });

  return attendance;
};
