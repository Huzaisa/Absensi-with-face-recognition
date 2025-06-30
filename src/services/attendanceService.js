const prisma = require('../config/db');
const { utcToZonedTime } = require('../utils/time');
const { isAfter, setHours, setMinutes, setSeconds } = require('date-fns');
const { getUserShiftByDate } = require('./shiftService');

const TIME_ZONE = 'Asia/Jakarta';

const midnightUtcFromJakarta = (dJakarta) =>
  new Date(Date.UTC(dJakarta.getFullYear(), dJakarta.getMonth(), dJakarta.getDate()));

// Fungsi bantu untuk normalisasi waktu shift ke hari ini (WIB)
const normalizeTimeToToday = (shiftDateObj, nowJakarta) => {
  return setSeconds(
    setMinutes(setHours(new Date(nowJakarta), shiftDateObj.getHours()), shiftDateObj.getMinutes()),
    0
  );
};

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

  // ================= LOGIKA SHIFT =================
  let status = 'ONTIME';
  let isLate = false;

  const dateStr = nowJakarta.toISOString().split('T')[0];
  const shiftMapping = await getUserShiftByDate(userId, dateStr);

  if (!shiftMapping || !shiftMapping.shift) {
    throw new Error('User belum punya shift hari ini');
  }

  const shift = shiftMapping.shift;

  const shiftStartJakarta = utcToZonedTime(shift.startTime, TIME_ZONE);
  const shiftStartToday = normalizeTimeToToday(shiftStartJakarta, nowJakarta);

  isLate = isAfter(nowJakarta, shiftStartToday);
  if (isLate) status = 'LATE';

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
  const midnightUtc = midnightUtcFromJakarta(
    utcToZonedTime(nowUtc, TIME_ZONE)
  );

  return prisma.attendance.update({
    where: { userId_date: { userId, date: midnightUtc } },
    data : { clockOut: nowUtc },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      shift: {
        include: { shift: true }
      }
    }
  });
};
