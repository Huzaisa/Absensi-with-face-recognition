const leaveService = require('../services/leaveService');

exports.requestLeave = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, reason } = req.body;
    const result = await leaveService.requestLeave({ userId, startDate, endDate, reason });
    res.status(201).json({ message: 'Cuti diajukan', result });
  } catch (err) {
    next(err);
  }
};

exports.approveLeave = async (req, res, next) => {
  try {
    const approverId = req.user.id;
    const { leaveId } = req.body;
    const result = await leaveService.approveLeave({ leaveId, approverId });
    res.json({ message: 'Cuti disetujui', result });
  } catch (err) {
    next(err);
  }
};

exports.rejectLeave = async (req, res, next) => {
  try {
    const approverId = req.user.id;
    const { leaveId } = req.body;
    const result = await leaveService.rejectLeave({ leaveId, approverId });
    res.json({ message: 'Cuti ditolak', result });
  } catch (err) {
    next(err);
  }
};

exports.getUserLeaves = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await leaveService.getUserLeaves(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getAllLeaves = async (req, res, next) => {
  try {
    const data = await leaveService.getAllLeaves();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
