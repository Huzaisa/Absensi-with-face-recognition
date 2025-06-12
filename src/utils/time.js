
const { utcToZonedTime, formatInTimeZone } = require('date-fns-tz');

const TIME_ZONE = 'Asia/Jakarta';

const dateOnlyToMidnightUtc = (str) => new Date(`${str}T00:00:00Z`);

/** konversi string "HH:mm" (jam-menit WIB) → Date UTC */
const hhmmWIBtoUtcDate = (hhmm) =>
  
  new Date(`2025-01-01T${hhmm}:00+07:00`);

  const isoAsWibToUtc = (isoStr) => {
  const core = isoStr.split(/[Z+]/)[0];          // buang 'Z' / offset
  return new Date(`${core}+07:00`);
};

/** bantu format WIB default "HH:mm" */
const fmtWIB = (date, fmt = 'HH:mm') =>
  formatInTimeZone(date, TIME_ZONE, fmt);

module.exports = {
  TIME_ZONE,
  utcToZonedTime,
  hhmmWIBtoUtcDate,
  fmtWIB,
  isoAsWibToUtc,
  dateOnlyToMidnightUtc
};
