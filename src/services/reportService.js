const prisma             = require('../config/db');
const { startOfMonth,
        endOfMonth,
        differenceInHours } = require('date-fns');

/**
 * @param {Object}   arg
 * @param {String?}  arg.userId – jika null → seluruh user
 * @param {Number}   arg.month  – 1-12
 * @param {Number}   arg.year   – YYYY
 */
exports.getAttendanceReport = async ({ userId, month, year }) => {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  const [attendances, leaves, overtimes, users] = await Promise.all([
    prisma.attendance.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
        ...(userId && { userId }),
      },
    }),
    prisma.leave.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        ...(userId && { userId }),
      },
    }),
    prisma.overtime.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
        approved: true,
        ...(userId && { userId }),
      },
    }),
    prisma.user.findMany({
      where : userId ? { id: userId } : {},
      select: { id: true, name: true },
    }),
  ]);

  const rekap = {};
  const ensure = (uid) => {
    if (!rekap[uid]) rekap[uid] = { hadir: 0, izin: 0, cuti: 0, lembur: 0, telat: 0 };
    return rekap[uid];
  };

  attendances.forEach((a) => {
    const bucket = ensure(a.userId);
    if (a.clockIn) {
      bucket.hadir += 1;

      const expectedStart = new Date(a.date);
      expectedStart.setHours(8, 5, 0, 0); // batas toleransi jam 08:05

      const actualClockIn = new Date(a.clockIn);
      if (actualClockIn > expectedStart) {
        bucket.telat += 1;
      }
    }
  });

  leaves.forEach((l) => {
    const bucket = ensure(l.userId);
    if (l.status === 'APPROVED') bucket.cuti += 1;
    else                         bucket.izin += 1;
  });

  overtimes.forEach((o) => {
    const jam = differenceInHours(o.endTime, o.startTime);
    ensure(o.userId).lembur += jam;
  });

  return users.map((u) => ({ name: u.name, ...rekap[u.id] }));
};

