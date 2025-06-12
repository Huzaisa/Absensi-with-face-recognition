const prisma = require('../config/db');
const {
  utcToZonedTime,
  hhmmWIBtoUtcDate,
  TIME_ZONE,
} = require('../utils/time');


const toLocalShift = (s) =>
  s && {
    ...s,
    startTime: utcToZonedTime(s.startTime, TIME_ZONE),
    endTime  : utcToZonedTime(s.endTime,   TIME_ZONE),
  };


const parseToUtc = (val) => {
 
  if (!val.includes('T')) return hhmmWIBtoUtcDate(val);

 
  const core = val.split(/[Z+]/)[0];          
  return new Date(`${core}+07:00`);
};


const parseDateParamToMidnightUtc = (inp) => {
  if (!inp.includes('T')) return new Date(`${inp}T00:00:00Z`);
  const d = new Date(inp);                    
  if (isNaN(d)) throw new Error('Tanggal tidak valid');
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};


exports.createShift = async ({ name, startTime, endTime }) => {
  const shift = await prisma.shift.create({
    data: {
      name,
      startTime: parseToUtc(startTime),
      endTime  : parseToUtc(endTime),
    },
  });
  return toLocalShift(shift);
};


exports.assignShiftToUser = async ({ userId, shiftId, date }) => {
  const [user, shift] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.shift.findUnique({ where: { id: shiftId } }),
  ]);
  if (!user)  throw new Error(`User ${userId} tidak ditemukan`);
  if (!shift) throw new Error(`Shift ${shiftId} tidak ditemukan`);

  const midnightUtc = parseDateParamToMidnightUtc(date);
  return prisma.shiftMapping.upsert({
    where : { userId_date: { userId, date: midnightUtc } },
    update: { shiftId },
    create: { userId, shiftId, date: midnightUtc },
  });
};


exports.getUserShiftByDate = async (userId, date) => {
  const midnightUtc = parseDateParamToMidnightUtc(date);
  const m = await prisma.shiftMapping.findFirst({
    where: { userId, date: midnightUtc },
    include: { shift: true },
  });
  if (m) m.shift = toLocalShift(m.shift);
  return m;
};


exports.getAllShiftMappings = async () => prisma.shiftMapping.findMany();


exports.getAllShifts = async () => {
  const shifts = await prisma.shift.findMany();
  return shifts.map(toLocalShift);
};
