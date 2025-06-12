const prisma = require('../config/db');
const { utcToZonedTime } = require('../utils/time');
const { isAfter } = require('date-fns');

const TIME_ZONE = 'Asia/Jakarta';


const midnightUtcFromJakarta = (dJakarta) =>
  new Date(Date.UTC(dJakarta.getFullYear(), dJakarta.getMonth(), dJakarta.getDate()));


exports.clockIn = async (userId) => {
  const nowUtc     = new Date();
  const nowJakarta = utcToZonedTime(nowUtc, TIME_ZONE);
  const midnightUtc = midnightUtcFromJakarta(nowJakarta);

  const onLeave = await prisma.leave.findFirst({
    where: {
      userId,
      status: 'APPROVED',
      startDate: { lte: midnightUtc },
      endDate  : { gte: midnightUtc },
    },
  });
  if (onLeave) {
    throw new Error('Sedang cuti — tidak dapat melakukan absensi.');
  }
  const existing = await prisma.attendance.findUnique({
    where: { userId_date: { userId, date: midnightUtc } },
    include: { shift: { include: { shift: true } } }, 
  });

 
  if (existing?.clockIn) return existing;

 
  let status = 'ONTIME';
  let isLate = false;
  const shift = existing?.shift?.shift; 
  if (shift) {
    const shiftStartJakarta = utcToZonedTime(shift.startTime, TIME_ZONE);
    isLate = isAfter(nowJakarta, shiftStartJakarta);
    if (isLate) status = 'LATE';
  }

 
  const attendance = await prisma.attendance.upsert({
    where : { userId_date: { userId, date: midnightUtc } },
    create: { userId, date: midnightUtc, clockIn: nowUtc, status, isLate },
    update: { clockIn: nowUtc, status, isLate },
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
  });
};
