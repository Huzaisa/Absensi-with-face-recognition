const cron = require('node-cron');
const nodemailer = require('nodemailer');
const prisma = require('../config/db');
const fs = require('fs');
const path = require('path');
const { generateMonthlyReport } = require('../utils/pdfGenerator');
const reportService = require('../services/reportService');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 📁 Pastikan folder `reportfiles` tersedia
const ensureReportFolder = () => {
  const folderPath = path.join(__dirname, '../../reportfiles');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log('📁 Folder reportfiles dibuat.');
  }
  return folderPath;
};

// 🧹 Hapus file lebih dari 2 bulan
const cleanupOldReports = (folderPath) => {
  const now = new Date();
  const cutoff = new Date(now.setMonth(now.getMonth() - 2)); // 2 bulan lalu

  const files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    const fullPath = path.join(folderPath, file);
    const stats = fs.statSync(fullPath);
    if (stats.isFile()) {
      const modified = new Date(stats.mtime);
      if (modified < cutoff) {
        fs.unlinkSync(fullPath);
        console.log(`🗑️ File lama dihapus: ${file}`);
      }
    }
  });
};

const sendMonthlyReport = async () => {
  console.log('🚀 Menjalankan pengiriman laporan bulanan...');
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const reportFolder = ensureReportFolder();
    cleanupOldReports(reportFolder); // 🧹 Hapus file lama dulu

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });

    for (const user of users) {
      const isAdmin = user.role === 'ADMIN';
      const fileName = `laporan_${user.name}_${user.id}_${month}-${year}.pdf`;
      const reportPath = path.join(reportFolder, fileName);

      const reportData = await reportService.getAttendanceReport({
        userId: isAdmin ? null : user.id,
        month,
        year,
      });

      // Validasi data EMPLOYEE
      if (!isAdmin) {
        const isValid = reportData.length === 1 && reportData[0].name === user.name;
        if (!isValid) {
          console.warn(`⚠️ Data tidak valid untuk ${user.email}, laporan tidak dikirim.`);
          continue;
        }
      }

      await generateMonthlyReport(reportData, reportPath);

      await transporter.sendMail({
        from: `"Absensi Bot" <${process.env.EMAIL_FROM}>`,
        to: user.email,
        subject: `📊 Laporan Kehadiran ${isAdmin ? 'Semua Karyawan' : 'Anda'} – ${month}/${year}`,
        text: `Halo ${user.name},\n\nBerikut adalah laporan kehadiran ${isAdmin ? 'seluruh karyawan' : 'Anda'} bulan ini.`,
        attachments: [{ path: reportPath }],
      });

      console.log(`📤 Laporan terkirim ke ${user.email} (${isAdmin ? 'ADMIN' : 'EMPLOYEE'})`);
    }

    console.log('✅ Semua laporan bulanan berhasil dikirim dan file lama dibersihkan.');
  } catch (err) {
    console.error('❌ Gagal mengirim laporan bulanan:', err);
  }
};

// Cron job tiap tanggal 1 jam 6 pagi
cron.schedule('0 6 1 * *', sendMonthlyReport);

// Manual execution
if (require.main === module) {
  sendMonthlyReport();
}
