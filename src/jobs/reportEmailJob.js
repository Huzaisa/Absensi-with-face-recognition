const cron = require('node-cron');
const nodemailer = require('nodemailer');
const prisma = require('../config/db');
const { generatePDFToFile } = require('../utils/pdfGenerator');
const reportService = require('../services/reportService');
const fs = require('fs');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMonthlyReport = async () => {
  console.log('🚀 Menjalankan pengiriman laporan bulanan...');
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const reportPath = `./monthly_report_${month}-${year}.pdf`;

    const data = await reportService.getAttendanceReport({ month, year });
    await generatePDFToFile(data, month, year, reportPath);

    const users = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: { email: true, name: true },
    });

    const failedLogPath = './failed_email_log.txt';
    fs.writeFileSync(failedLogPath, ''); // Kosongkan log lama

    let successCount = 0;
    let failedCount = 0;

    for (const user of users) {
      if (!user.email) {
        const msg = `⚠️ ${user.name} tidak punya email. Dilewati.\n`;
        fs.appendFileSync(failedLogPath, msg);
        console.warn(msg.trim());
        failedCount++;
        continue;
      }

      try {
        await transporter.sendMail({
          from: `"Absensi Bot" <${process.env.EMAIL_FROM}>`,
          to: user.email,
          subject: `📊 Laporan Bulanan Kehadiran (${month}-${year})`,
          text: `Halo ${user.name},\nBerikut laporan kehadiran Anda bulan ini.`,
          attachments: [{ path: reportPath }],
        });

        console.log(`📤 Laporan terkirim ke ${user.email}`);
        successCount++;
      } catch (emailErr) {
        const failMsg = `❌ Gagal kirim ke ${user.email}: ${emailErr.message}\n`;
        fs.appendFileSync(failedLogPath, failMsg);
        console.error(failMsg.trim());
        failedCount++;
      }
    }

    console.log(`\n✅ Pengiriman laporan selesai  (${successCount} user berhasil) dan (${failedCount} user gagal)\n`);

  } catch (err) {
    console.error('❌ Gagal mengirim laporan bulanan:', err);
  }
};

// Cron job: tiap tanggal 1 jam 6 pagi
cron.schedule('0 6 1 * *', sendMonthlyReport);

// Jalankan manual via terminal
if (require.main === module) {
  sendMonthlyReport();
}
