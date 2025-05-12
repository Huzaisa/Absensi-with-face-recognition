const prisma = require('../config/db');

exports.requestLeave = async ({ userId, startDate, endDate, reason }) => {
  return prisma.leave.create({
    data: {
      userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
    },
  });
};

exports.approveLeave = async ({ leaveId, approverId }) => {
  return prisma.leave.update({
    where: { id: leaveId },
    data: {
      status: 'APPROVED',
      approverId,
    },
  });
};

exports.rejectLeave = async ({ leaveId, approverId }) => {
  return prisma.leave.update({
    where: { id: leaveId },
    data: {
      status: 'REJECTED',
      approverId,
    },
  });
};

exports.getUserLeaves = async (userId) => {
  return prisma.leave.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

exports.getAllLeaves = async () => {
  return prisma.leave.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
};
