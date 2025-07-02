const prisma = require('../config/db');
const { dateOnlyToMidnightUtc } = require('../utils/time');

/* ▸ Ajukan */
exports.requestLeave = async ({ userId, startDate, endDate, reason }) => {
  const startUtc = dateOnlyToMidnightUtc(startDate);
  const endUtc = dateOnlyToMidnightUtc(endDate);

  // Cek duplikat cuti
  const dup = await prisma.leave.findFirst({ where: { userId, startDate: startUtc, endDate: endUtc } });
  if (dup) throw new Error('Sudah ada pengajuan cuti di rentang tanggal tersebut.');

  return prisma.leave.create({
    data: { userId, startDate: startUtc, endDate: endUtc, reason, status: 'PENDING' },
  });
};

/* ▸ Approve / Reject (dengan pengecekan ada-tidaknya record) */
const updateStatus = async (leaveId, status, approverId) => {
  const exist = await prisma.leave.findUnique({ where: { id: leaveId } });
  if (!exist) throw new Error('Pengajuan cuti tidak ditemukan');

  return prisma.leave.update({
    where: { id: leaveId },
    data : { status, approverId },
  });
};
exports.approveLeave = (p) => updateStatus(p.leaveId, 'APPROVED', p.approverId);
exports.rejectLeave  = (p) => updateStatus(p.leaveId, 'REJECTED',  p.approverId);

/* ▸ List */
exports.getUserLeaves = (userId, { startDate, endDate, skip = 0, take = 10 } = {}) =>
  prisma.leave.findMany({
    where: {
      userId,
      ...(startDate && endDate
        ? {
            startDate: { gte: dateOnlyToMidnightUtc(startDate) },
            endDate:   { lte: dateOnlyToMidnightUtc(endDate) },
          }
        : {})
    },
    orderBy: { createdAt: 'desc' },
    skip, take,
  });


exports.getAllLeaves = () =>
  prisma.leave.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });

/* hanya request PENDING */
exports.getAllLeaveRequests = () =>
  prisma.leave.findMany({
    where  : { status: 'PENDING' },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
