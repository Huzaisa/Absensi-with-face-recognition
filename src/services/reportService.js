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
  const endDate   = endOfMonth  (new Date(year, month - 1));

  /* ─────────── Query di pr isma ─────────── */
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

  /* ─────────── Rekap per-user ─────────── */
  const rekap = {};
  const ensure = (uid) => {
    if (!rekap[uid]) rekap[uid] = { hadir: 0, izin: 0, cuti: 0, lembur: 0 };
    return rekap[uid];
  };

  attendances.forEach((a) => {
    if (a.clockIn) ensure(a.userId).hadir += 1;
  });

  leaves.forEach((l) => {
    const bucket = ensure(l.userId);
    if (l.status === 'APPROVED') bucket.cuti += 1;
    else                         bucket.izin  += 1;
  });

  overtimes.forEach((o) => {
    const jam = differenceInHours(o.endTime, o.startTime);
    ensure(o.userId).lembur += jam;
  });

  /* ─────────── Gabungkan dengan nama user ─────────── */
  return users.map((u) => ({ name: u.name, ...rekap[u.id] }));
};
