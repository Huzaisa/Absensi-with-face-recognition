const shiftService = require('../services/shiftService');

exports.createShift = async (req, res, next) => {
  try {
    const shift = await shiftService.createShift(req.body);
    res.status(201).json(shift);
  } catch (err) {
    next(err);
  }
};

exports.assignShiftToUser = async (req, res, next) => {
  try {
    const mapping = await shiftService.assignShiftToUser(req.body);
    res.json(mapping);
  } catch (err) {
    next(err);
  }
};

exports.getShiftForUser = async (req, res, next) => {
  try {
    const { userId, date } = req.params;
    console.log(`Fetching shift for userId: ${userId}, date: ${date}`);  // Debugging log
    const mapping = await shiftService.getUserShiftByDate(userId, date);
    if (!mapping) return res.status(404).json({ message: 'No shift found' });
    res.json(mapping);
  } catch (err) {
    next(err);
  }
};

exports.getAllShifts = async (req, res, next) => {
  try {
    const shifts = await shiftService.getAllShifts();
    res.json(shifts);
  } catch (err) {
    next(err);
  }
};
