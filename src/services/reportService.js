const prisma = require('../config/db');
const { startOfMonth, endOfMonth } = require('date-fns');

exports.getAttendanceReport = async ({ userId, month, year }) => {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  const where = {
    date: {
      gte: startDate,
      lte: endDate,
    },
  };

  if (userId) where.userId = userId;

  const attendances = await prisma.attendance.findMany({ where });
  const leaves = await prisma.leave.findMany({ where });
  const overtimes = await prisma.overtime.findMany({ where });

  const report = {};

  // Group by user
  [...attendances, ...leaves, ...overtimes].forEach((item) => {
    const uid = item.userId;
    if (!report[uid]) {
      report[uid] = { hadir: 0, izin: 0, cuti: 0, lembur: 0 };
    }

    if (item.status === 'HADIR') report[uid].hadir++;
    if (item.type === 'IZIN') report[uid].izin++;
    if (item.type === 'CUTI') report[uid].cuti++;
    if (item.status === 'DISETUJUI' && item.durationHours) report[uid].lembur += item.durationHours;
  });

  const users = await prisma.user.findMany({
    where: userId ? { id: userId } : {},
    select: { id: true, name: true },
  });

  return users.map((user) => ({
    name: user.name,
    ...report[user.id],
  }));
};
