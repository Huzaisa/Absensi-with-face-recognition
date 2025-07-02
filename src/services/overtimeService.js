const prisma = require('../config/db');
const { dateOnlyToMidnightUtc, hhmmWIBtoUtcDate, isoAsWibToUtc } = require('../utils/time');

/** konversi 'HH:mm' (WIB) / ISO → Date UTC */
const parseTime = (val) => {
  if (!val) return null;
  if (typeof val !== 'string') throw new Error('Waktu harus string');
  return val.includes('T') ? isoAsWibToUtc(val) : hhmmWIBtoUtcDate(val);
};

/** otomatis bikin startTime/endTime dari “hours” */
const deriveTimes = (dateStr, hours) => {
  const start = new Date(`${dateStr}T18:00:00+07:00`); // default WIB
  const end   = new Date(start.getTime() + Number(hours) * 60 * 60 * 1000);

  return {
    startTime: start.toISOString(), // ubah ke string ISO
    endTime: end.toISOString()
  };
};


exports.requestOvertime = async ({
  userId, date, startTime, endTime, hours, reason,
}) => {
  const midnightUtc = dateOnlyToMidnightUtc(date);

  // 1. Cek duplikat lembur
  const dup = await prisma.overtime.findFirst({
    where: { userId, date: midnightUtc },
  });
  if (dup) throw new Error('Sudah ada pengajuan lembur di tanggal ini.');

  // 2. Cek konflik dengan cuti
  const onLeave = await prisma.leave.findFirst({
    where: {
      userId,
      status: 'APPROVED',
      startDate: { lte: midnightUtc },
      endDate:   { gte: midnightUtc },
    },
  });
  if (onLeave) throw new Error('Tidak dapat mengajukan lembur saat sedang cuti.');

  // 3. Handle jika hanya kirim hours
  if (!startTime && !endTime && hours) {
    ({ startTime, endTime } = deriveTimes(date, hours));
  }

  // 4. Simpan lembur
  return prisma.overtime.create({
    data: {
      userId,
      date: midnightUtc,
      startTime: parseTime(startTime),
      endTime:   parseTime(endTime),
      reason,
      approved: false,
    },
  });
};

exports.approveOvertime = ({ overtimeId, approverId }) =>
  prisma.overtime.update({
    where: { id: overtimeId },
    data : { approved: true, approverId },
  });

exports.rejectOvertime = ({ overtimeId, approverId }) =>
  prisma.overtime.update({
    where: { id: overtimeId },
    data : { approved: false, approverId },
  });

exports.getUserOvertime = (userId, { startDate, endDate, skip = 0, take = 10 } = {}) =>
  prisma.overtime.findMany({
    where: {
      userId,
      ...(startDate && endDate
        ? {
            date: {
              gte: new Date(`${startDate}T00:00:00Z`),
              lte: new Date(`${endDate}T23:59:59Z`),
            }
          }
        : {})
    },
    orderBy: { date: 'desc' },
    skip, take,
  });

exports.getAllOvertimeRequests= () =>
  prisma.overtime.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });
