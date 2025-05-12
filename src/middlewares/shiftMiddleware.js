const { isBefore, isAfter } = require('date-fns')

// Middleware untuk memastikan tanggal shift valid
exports.validateShiftDate = (req, res, next) => {
  const { startTime, endTime } = req.body

  if (isBefore(new Date(endTime), new Date(startTime))) {
    return res.status(400).json({ message: 'End time must be after start time' })
  }

  next()
}

