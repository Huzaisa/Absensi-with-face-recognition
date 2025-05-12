const prisma = require('../config/db');

exports.requestOvertime = async ({ userId, date, startTime, endTime, reason }) => {
  const existing = await prisma.overtime.findFirst({
    where: {
      userId,
      date: new Date(date),
    },
  });

  if (existing) throw new Error('Sudah ada pengajuan lembur di tanggal ini.');

  return prisma.overtime.create({
    data: {
      userId,
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      reason,
    },
  });
};

exports.approveOvertime = async ({ overtimeId, approverId }) => {
  return prisma.overtime.update({
    where: { id: overtimeId },
    data: {
      approved: true,
      approverId,
    },
  });
};

exports.getUserOvertime = async (userId) => {
  return prisma.overtime.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
};

exports.getAllOvertimeRequests = async () => {
  return prisma.overtime.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
};
