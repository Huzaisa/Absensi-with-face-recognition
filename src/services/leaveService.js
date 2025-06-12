const prisma = require('../config/db');
const { dateOnlyToMidnightUtc } = require('../utils/time');

/* ▸ Ajukan */
exports.requestLeave = ({ userId, startDate, endDate, reason }) =>
  prisma.leave.create({
    data: {
      userId,
      startDate: dateOnlyToMidnightUtc(startDate),   // 'yyyy-MM-dd'
      endDate  : dateOnlyToMidnightUtc(endDate),
      reason,
      status   : 'PENDING',
    },
  });

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
exports.getUserLeaves = (userId) =>
  prisma.leave.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

exports.getAllLeaves = () =>
  prisma.leave.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });

/* hanya request PENDING */
exports.getAllLeaveRequests = () =>
  prisma.leave.findMany({
    where  : { status: 'PENDING' },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
