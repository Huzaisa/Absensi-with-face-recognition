const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

const attendanceRoutes = require('./routes/attendanceRoute');
const overtimeRoutes = require('./routes/overtimeRoute');
const leaveRoutes = require('./routes/leaveRoute');
const shiftRoutes = require('./routes/shiftRoute');
const uploadRoutes = require('./routes/uploadRoute');

require('./jobs/dbBackupJob'); // ⏰ cron job jalan otomatis

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
app.use('/documents', express.static('public/documents'));

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/attendance', attendanceRoutes);
app.use('/api/overtime', overtimeRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/shift', shiftRoutes);
app.use('/api/upload', uploadRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err); // Log error
  res.status(500).json({ message: err.message });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
