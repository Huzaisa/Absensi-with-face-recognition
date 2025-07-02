const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { generateMonthlyReport } = require('../utils/pdfGenerator');
const { getAttendanceReport } = require('../services/reportService');

cron.schedule('0 6 1 * *', async () => {
  const reportPath = './monthly_report.pdf';
const today = new Date();
const month = today.getMonth() + 1;
const year = today.getFullYear();

const data = await reportService.getAttendanceReport({ month, year });  // Ambil data rekap
  generateMonthlyReport(data, reportPath);

  const transporter = nodemailer.createTransport({ /* your SMTP config */ });
  const users = await prisma.user.findMany();

  for (const user of users) {
    await transporter.sendMail({
      to: user.email,
      subject: 'Laporan Bulanan Anda',
      text: 'Silakan lihat laporan bulanan Anda di lampiran.',
      attachments: [{ path: reportPath }],
    });
  }
});
