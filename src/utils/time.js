const { utcToZonedTime, formatInTimeZone } = require('date-fns-tz');

const TIME_ZONE = 'Asia/Jakarta';

/**
 * Konversi tanggal string (misalnya "2025-06-30") ke 00:00:00 UTC
 */
const dateOnlyToMidnightUtc = (str) => new Date(`${str}T00:00:00Z`);

/**
 * Konversi string "HH:mm" (jam-menit WIB) → Date UTC tetap (default menggunakan tanggal 1 Jan 2025)
 * Ini berguna untuk menyimpan ke database Shift (misalnya 07:00 WIB)
 */
const hhmmWIBtoUtcDate = (hhmm) =>
  new Date(`2025-01-01T${hhmm}:00+07:00`);

/**
 * Konversi ISO string (misalnya "2025-06-30T07:00:00") ke Date UTC dari zona WIB
 */
const isoAsWibToUtc = (isoStr) => {
  const core = isoStr.split(/[Z+]/)[0];
  return new Date(`${core}+07:00`);
};

/**
 * Format waktu dalam zona WIB ke string, default hanya jam dan menit
 */
const fmtWIB = (date, fmt = 'HH:mm') =>
  formatInTimeZone(date, TIME_ZONE, fmt);

/**
 * Fungsi bantu: normalisasi waktu jam/menit dari shift ke hari ini (WIB)
 * Misalnya: startTime = 07:00 WIB (dari 2025-01-01T00:00Z) → kita ubah ke hari ini jam 07:00 WIB
 * (digunakan di clockIn)
 */
const normalizeTimeToToday = (shiftTimeWIB, nowJakarta) => {
  const hours = shiftTimeWIB.getHours();
  const minutes = shiftTimeWIB.getMinutes();
  const dateCopy = new Date(nowJakarta);
  dateCopy.setHours(hours, minutes, 0, 0);
  return dateCopy;
};

module.exports = {
  TIME_ZONE,
  utcToZonedTime,
  hhmmWIBtoUtcDate,
  isoAsWibToUtc,
  fmtWIB,
  dateOnlyToMidnightUtc,
  normalizeTimeToToday
};
