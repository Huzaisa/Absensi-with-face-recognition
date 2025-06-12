const shiftService = require('../services/shiftService');
const { fmtWIB }   = require('../utils/time');

const viewShift = (s) => ({
  ...s,
  startTime: fmtWIB(s.startTime),
  endTime  : fmtWIB(s.endTime),
  createdAt: s.createdAt ? fmtWIB(s.createdAt, 'yyyy-MM-dd HH:mm') : undefined,
  updatedAt: s.updatedAt ? fmtWIB(s.updatedAt, 'yyyy-MM-dd HH:mm') : undefined,
});


exports.createShift = async (req, res, next) => {
  try {
    const shift = await shiftService.createShift(req.body);
    res.status(201).json(viewShift(shift));
  } catch (e) { next(e); }
};


exports.assignShiftToUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN')
      return res.status(403).json({ message: 'Hanya admin yang bisa assign shift ke user.' });

    const { userId, date, shiftId } = req.body;
    if (!userId || !date || !shiftId)
      return res.status(400).json({ message: 'userId, date, dan shiftId wajib diisi.' });

    const m = await shiftService.assignShiftToUser({ userId, date, shiftId });
    res.status(201).json(m);
  } catch (e) { next(e); }
};


exports.getShiftForUser = async (req, res, next) => {
  try {
    const { userId, date } = req.params;
    const m = await shiftService.getUserShiftByDate(userId, date);
    if (!m) return res.status(404).json({ message: 'No shift found' });

    res.json({ ...m, shift: viewShift(m.shift) });
  } catch (e) { next(e); }
};


exports.getAllShifts = async (req, res, next) => {
  try {
    const shifts = await shiftService.getAllShifts();
    const map    = await shiftService.getAllShiftMappings();

    res.json(
      shifts.map((s) => ({
        ...viewShift(s),
        assigned: map.find((m) => m.shiftId === s.id) || null,
      }))
    );
  } catch (e) { next(e); }
};
