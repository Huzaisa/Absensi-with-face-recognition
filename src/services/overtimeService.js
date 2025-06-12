const prisma                   = require('../config/db');
const { dateOnlyToMidnightUtc,
        hhmmWIBtoUtcDate,
        isoAsWibToUtc }        = require('../utils/time');

/* konversi 'HH:mm' (WIB) / ISO → Date UTC */
const parseTime = (val) => {
  if (!val) return null;                 // jika undefined/null
  if (typeof val !== 'string')
    throw new Error('Waktu harus string');
  return val.includes('T') ? isoAsWibToUtc(val) : hhmmWIBtoUtcDate(val);
};

/* otomatis bikin startTime/endTime dari “hours” */
const deriveTimes = (dateStr, hours) => {
  const start = new Date(`${dateStr}T18:00:00+07:00`); // default 18-00 WIB
  const end   = new Date(start.getTime() + Number(hours) * 60 * 60 * 1000);
  return { startTime: start, endTime: end };
};

exports.requestOvertime = async ({
  userId, date, startTime, endTime, hours, reason,
}) => {
  const midnightUtc = dateOnlyToMidnightUtc(date);

  // Cek duplikat lembur di tanggal yang sama
  const dup = await prisma.overtime.findFirst({
    where: { userId, date: midnightUtc },
  });
  if (dup) throw new Error('Sudah ada pengajuan lembur di tanggal ini.');

  // jika user hanya mengirim "hours"
  if (!startTime && !endTime && hours) {
    ({ startTime, endTime } = deriveTimes(date, hours));
  }

  return prisma.overtime.create({
    data: {
      userId,
      date      : midnightUtc,
      startTime : parseTime(startTime),
      endTime   : parseTime(endTime),
      reason,
      approved  : false,
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

exports.getUserOvertime       = (userId) => prisma.overtime.findMany({ where: { userId }, orderBy: { date: 'desc' } });
exports.getAllOvertimeRequests= ()       => prisma.overtime.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
