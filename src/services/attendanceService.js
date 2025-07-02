const prisma = require('../config/db');
const { utcToZonedTime } = require('../utils/time');
const { isAfter, setHours, setMinutes, setSeconds, addMinutes } = require('date-fns');
const { getUserShiftByDate } = require('./shiftService');

const TIME_ZONE = 'Asia/Jakarta';
const GRACE_MINUTES = 10;

const midnightUtcFromJakarta = (dJakarta) =>
  new Date(Date.UTC(dJakarta.getFullYear(), dJakarta.getMonth(), dJakarta.getDate()));

// Fungsi bantu untuk normalisasi waktu shift ke hari ini (WIB)
const normalizeTimeToToday = (shiftDateObj, nowJakarta) => {
  return setSeconds(
    setMinutes(setHours(new Date(nowJakarta), shiftDateObj.getHours()), shiftDateObj.getMinutes()),
    0
  );
};

async function validateOvertimeClockOut(userId, nowUtc) {
  const over = await prisma.overtime.findFirst({
    where: { userId, approved: true },
    orderBy: { date: 'desc' },
  });
  if (over && nowUtc < over.endTime) {
    console.warn('⛔ Clock-out sebelum lembur selesai.');
    // throw new Error('Clock-out dilakukan sebelum lembur selesai.');
  }
}

exports.clockIn = async (userId) => {
  const nowUtc = new Date();
  const nowJakarta = utcToZonedTime(nowUtc, TIME_ZONE);
  const midnightUtc = midnightUtcFromJakarta(nowJakarta);

  // Cek apakah sedang cuti
  const onLeave = await prisma.leave.findFirst({
    where: {
      userId,
      status: 'APPROVED',
      startDate: { lte: midnightUtc },
      endDate: { gte: midnightUtc },
    },
  });

  if (onLeave) {
    throw new Error('Sedang cuti — tidak dapat melakukan absensi.');
  }

  // Cek apakah sudah clock-in hari ini
  const existing = await prisma.attendance.findUnique({
    where: { userId_date: { userId, date: midnightUtc } },
    include: {
      user: { select: { id: true, name: true, email: true } },
      shift: { include: { shift: true } },
    },
  });

  if (existing?.clockIn) {
    const tanggal = nowJakarta.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const error = new Error(`Anda sudah absen pada tanggal ${tanggal}.`);
    error.code = 'ALREADY_CLOCKED_IN';
    throw error;
  }

  // ================= Pastikan ShiftMapping Ada =================
  let shiftMapping = await prisma.shiftMapping.findFirst({
    where: { userId, date: midnightUtc },
  });

  if (!shiftMapping) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { defaultShiftId: true },
    });

    if (!user?.defaultShiftId) {
      throw new Error('User belum memiliki shift hari ini dan tidak ada default shift.');
    }

    // Buat ShiftMapping dengan defaultShift
    shiftMapping = await prisma.shiftMapping.create({
      data: {
        userId,
        date: midnightUtc,
        shiftId: user.defaultShiftId,
      },
    });
  }

  // ================= LOGIKA SHIFT =================
  let status = 'ONTIME';
  let isLate = false;

  const shift = await prisma.shift.findUnique({
    where: { id: shiftMapping.shiftId },
  });

  if (!shift) throw new Error('Shift tidak ditemukan.');

  const shiftStartJakarta = utcToZonedTime(shift.startTime, TIME_ZONE);
  const shiftStartToday = normalizeTimeToToday(shiftStartJakarta, nowJakarta);
  const shiftStartWithTolerance = addMinutes(shiftStartToday, GRACE_MINUTES);

  // Debug
  console.log('-------------------');
  console.log('🕒 Waktu sekarang (Jakarta):', nowJakarta.toString());
  console.log('⏰ Waktu mulai shift:', shiftStartToday.toString());
  console.log('🎟️ Toleransi keterlambatan (10 menit):', shiftStartWithTolerance.toString());

  isLate = isAfter(nowJakarta, shiftStartWithTolerance);
  if (isLate) status = 'LATE';

  // ================= SIMPAN ABSENSI =================
  const attendance = await prisma.attendance.upsert({
    where: { userId_date: { userId, date: midnightUtc } },
    create: { userId, date: midnightUtc, clockIn: nowUtc, status, isLate },
    update: { clockIn: nowUtc, status, isLate },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      shift: {
        include: { shift: true },
      },
    },
  });

  return attendance;
};



exports.clockOut = async (userId) => {
  const nowUtc = new Date();
  const nowJakarta = utcToZonedTime(nowUtc, TIME_ZONE);
  const midnightUtc = midnightUtcFromJakarta(nowJakarta);

  // Pastikan sudah pernah clock-in
  const existing = await prisma.attendance.findUnique({
    where: { userId_date: { userId, date: midnightUtc } },
  });
  if (!existing || !existing.clockIn) {
    throw new Error('Anda belum melakukan clock-in pada hari ini.');
  }

  const attendance = await prisma.attendance.update({
    where: { userId_date: { userId, date: midnightUtc } },
    data: { clockOut: nowUtc },
    include: {
      user: { select: { id: true, name: true, email: true } },
      shift: { include: { shift: true } },
    },
  });
  return attendance;
};
