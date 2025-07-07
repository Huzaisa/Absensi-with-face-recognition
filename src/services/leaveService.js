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
exports.getUserLeaves = async (userId, { startDate, endDate, skip = 0, take = 10 } = {}) => {
  // Ambil semua cuti milik user
  const leaves = await prisma.leave.findMany({
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

  // Ambil dokumen terbaru milik user dengan tipe 'leave'
  const doc = await prisma.document.findFirst({
    where: { userId, type: 'leave' },
    orderBy: { uploadedAt: 'desc' },
  });

  // Gabungkan setiap item cuti dengan dokumen (kalau ada)
  return leaves.map(leave => ({
    ...leave,
    document: doc || null
  }));
};



exports.getAllLeaves = async () => {
  const leaves = await prisma.leave.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  // Ambil semua dokumen type 'leave'
  const documents = await prisma.document.findMany({
    where: { type: 'leave' },
    orderBy: { uploadedAt: 'desc' }
  });

  // Ambil hanya dokumen terbaru per user
  const latestDocPerUser = new Map();
  for (const doc of documents) {
    if (!latestDocPerUser.has(doc.userId)) {
      latestDocPerUser.set(doc.userId, doc);
    }
  }

  // Gabungkan data dokumen ke pengajuan cuti
  return leaves.map(leave => ({
    ...leave,
    document: latestDocPerUser.get(leave.userId) || null
  }));
};



/* hanya request PENDING */
exports.getAllLeaveRequests = () =>
  prisma.leave.findMany({
    where  : { status: 'PENDING' },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
