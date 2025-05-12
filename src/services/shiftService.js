const prisma = require('../config/db');

exports.createShift = async ({ name, startTime, endTime }) => {
  console.log('Creating shift with:', name, startTime, endTime);  // Debugging log
  return prisma.shift.create({
    data: {
      name,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });
};

exports.assignShiftToUser = async ({ userId, shiftId, date }) => {
  console.log('Assigning shift to user:', userId, shiftId, date);  // Debugging log
  return prisma.shiftMapping.upsert({
    where: {
      userId_date: {
        userId,
        date: new Date(date),
      },
    },
    update: { shiftId },
    create: {
      userId,
      shiftId,
      date: new Date(date),
    },
  });
};

exports.getUserShiftByDate = async (userId, date) => {
  console.log('Fetching shift mapping for userId:', userId, 'date:', date);  // Debugging log
  return prisma.shiftMapping.findFirst({
    where: {
      userId,
      date: new Date(date),
    },
    include: { shift: true },
  });
};

exports.getAllShifts = async () => {
  console.log('Fetching all shifts');  // Debugging log
  return prisma.shift.findMany();
};
