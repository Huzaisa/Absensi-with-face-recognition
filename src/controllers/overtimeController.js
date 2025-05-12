const overtimeService = require('../services/overtimeService');

exports.requestOvertime = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await overtimeService.requestOvertime({ ...req.body, userId });
    res.status(201).json({ message: 'Lembur diajukan', result });
  } catch (err) {
    next(err);
  }
};

exports.approveOvertime = async (req, res, next) => {
  try {
    const { overtimeId } = req.body;
    const approverId = req.user.id;
    const result = await overtimeService.approveOvertime({ overtimeId, approverId });
    res.json({ message: 'Lembur disetujui', result });
  } catch (err) {
    next(err);
  }
};

exports.getUserOvertime = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await overtimeService.getUserOvertime(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getAllOvertime = async (req, res, next) => {
  try {
    const data = await overtimeService.getAllOvertimeRequests();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
