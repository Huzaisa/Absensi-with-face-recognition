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

    const { userId, shiftId, date, isPermanent } = req.body;
    if (!userId || !shiftId || (!date && !isPermanent)) {
      return res.status(400).json({ message: 'userId, shiftId, dan date/isPermanent wajib diisi.' });
    }

    const result = await shiftService.assignShiftToUser({ userId, shiftId, date, isPermanent });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
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
    const mappings = await shiftService.getAllShiftMappings();

    res.json(
      shifts.map((s) => {
        const assigned = mappings.find((m) => m.shiftId === s.id);
        return {
          ...viewShift(s),
          assigned: assigned
            ? {
                id: assigned.id,
                date: assigned.date,
                user: assigned.user
                  ? {
                      id: assigned.user.id,
                      name: assigned.user.name,
                      email: assigned.user.email
                    }
                  : null
              }
            : null
        };
      })
    );
  } catch (e) {
    next(e);
  }
};

exports.getAllShiftMappings = async (req, res, next) => {
  try {
    const mappings = await shiftService.getAllShiftMappings();
    res.json(
      mappings.map((m) => ({
        id: m.id,
        date: m.date,
        user: {
          id: m.user.id,
          name: m.user.name,
          email: m.user.email
        },
        shift: {
          id: m.shift.id,
          name: m.shift.name,
          startTime: m.shift.startTime,
          endTime: m.shift.endTime
        }
      }))
    );
  } catch (e) {
    next(e);
  }
};


