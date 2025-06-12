const leaveService = require('../services/leaveService');
const { fmtWIB }  = require('../utils/time');

/* helper untuk merapikan output */
const view = (l) => ({
  ...l,
  startDate: l.startDate ? fmtWIB(l.startDate, 'yyyy-MM-dd') : null,
  endDate  : l.endDate   ? fmtWIB(l.endDate,   'yyyy-MM-dd') : null,
  createdAt: l.createdAt ? fmtWIB(l.createdAt, 'yyyy-MM-dd HH:mm') : null,
});

/* ▸ ajukan cuti */
exports.requestLeave = async (req, res, next) => {
  try {
    const saved = await leaveService.requestLeave({ userId: req.user.id, ...req.body });
    res.status(201).json({ message: 'Cuti diajukan', result: view(saved) });
  } catch (e) { next(e); }
};

/* ▸ approve / reject */
const requireLeaveId = (req, res) => {
  if (!req.body?.leaveId) {
    res.status(400).json({ message: 'leaveId tidak boleh kosong' });
    return null;
  }
  return req.body.leaveId;
};

exports.approveLeave = async (req, res, next) => {
  const leaveId = requireLeaveId(req, res);
  if (!leaveId) return;
  try {
    const upd = await leaveService.approveLeave({ leaveId, approverId: req.user.id });
    res.json({ message: 'Cuti disetujui', result: view(upd) });
  } catch (e) { next(e); }
};

exports.rejectLeave = async (req, res, next) => {
  const leaveId = requireLeaveId(req, res);
  if (!leaveId) return;
  try {
    const upd = await leaveService.rejectLeave({ leaveId, approverId: req.user.id });
    res.json({ message: 'Cuti ditolak', result: view(upd) });
  } catch (e) { next(e); }
};

/* ▸ list */
exports.getUserLeaves = async (req, res, next) => {
  try {
    const list = await leaveService.getUserLeaves(req.user.id);
    res.json(list.map(view));
  } catch (e) { next(e); }
};

exports.getAllLeaves = async (_req, res, next) => {
  try {
    const list = await leaveService.getAllLeaves();
    res.json(list.map(view));
  } catch (e) { next(e); }
};

/* ▸ SEMUA request (status PENDING) untuk admin */
exports.getAllLeaveRequests = async (_req, res, next) => {
  try {
    const list = await leaveService.getAllLeaveRequests();
    res.json(list.map(view));
  } catch (e) { next(e); }
};
