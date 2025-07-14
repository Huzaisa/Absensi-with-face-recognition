const prisma = require('../config/db');
const {
  startOfMonth,
  endOfMonth,
  differenceInHours,
} = require('date-fns');

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
    // ⏱️ Kehadiran
    prisma.attendance.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
        ...(userId && { userId }),
      },
    }),

    // 🟡 Semua pengajuan cuti & izin
    prisma.leave.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        ...(userId && { userId }),
      },
    }),

    // 💼 Lembur disetujui
    prisma.overtime.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
        approved: true,
        ...(userId && { userId }),
      },
    }),

    // 👤 Ambil data user
    prisma.user.findMany({
      where: userId ? { id: userId } : {},
      select: { id: true, name: true },
    }),
  ]);

  // 🗂️ Rekap struktur awal
  const rekap = {};
  const ensure = (uid) => {
    if (!rekap[uid]) {
      rekap[uid] = {
        hadir: 0,
        izin: 0,
        cuti: 0,
        lembur: 0,
        telat: 0,
      };
    }
    return rekap[uid];
  };

  // ✅ Hadir dan Telat (berdasarkan status)
  attendances.forEach((a) => {
    const bucket = ensure(a.userId);

    if (a.clockIn) {
      bucket.hadir += 1;
    }

    if (a.status?.toUpperCase() === 'LATE') {
      bucket.telat += 1;
    }
  });

  // ✅ Leave: pisahkan cuti (APPROVED) dan izin (selain itu)
  leaves.forEach((l) => {
    const bucket = ensure(l.userId);

    if (l.status === 'APPROVED') {
      bucket.cuti += 1;
    } else {
      bucket.izin += 1;
    }
  });

  // ✅ Lembur (jumlah jam)
overtimes.forEach((o) => {
  const bucket = ensure(o.userId);
  const jam = Math.abs(differenceInHours(o.endTime, o.startTime));
  bucket.lembur += jam;
});

  // ⏬ Kembalikan data hasil rekap
  return users.map((u) => ({
    name: u.name,
    ...rekap[u.id],
  }));
};
