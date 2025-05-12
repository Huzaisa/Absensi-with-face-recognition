const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const prisma = require('../config/db');
const { format } = require('date-fns');

const BACKUP_DIR = path.join(__dirname, '../../backups');
const DATABASE_URL = process.env.DATABASE_URL;

// 1. Backup DB (tiap malam jam 2)
cron.schedule('0 2 * * *', async () => {
  const fileName = `backup_${format(new Date(), 'yyyy-MM-dd')}.sql`;
  const backupPath = path.join(BACKUP_DIR, fileName);

  const command = `npx prisma db pull && pg_dump "${DATABASE_URL}" > "${backupPath}"`;

  exec(command, (err) => {
    if (err) console.error('❌ Gagal backup:', err);
    else console.log('✅ Backup sukses:', fileName);
  });
});

// 2. Hapus file backup > 30 hari
cron.schedule('0 3 * * *', () => {
  const files = fs.readdirSync(BACKUP_DIR);

  files.forEach((file) => {
    const filePath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filePath);
    const ageInDays = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);

    if (ageInDays > 30) {
      fs.unlinkSync(filePath);
      console.log('🗑️ Deleted old backup:', file);
    }
  });
});

// 3. Reminder admin kalau ada user belum absen ≥ 3 hari
cron.schedule('0 8 * * *', async () => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - 3);

  const users = await prisma.user.findMany({
    where: {
      role: 'USER',
      attendances: {
        none: {
          date: {
            gte: thresholdDate,
          },
        },
      },
    },
    select: {
      name: true,
      email: true,
    },
  });

  if (users.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const adminEmails = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { email: true },
  });

  const html = `
    <h3>Karyawan Tidak Absen ≥ 3 Hari</h3>
    <ul>
      ${users.map((u) => `<li>${u.name}</li>`).join('')}
    </ul>
  `;

  await transporter.sendMail({
    from: `"Absensi Bot" <${process.env.EMAIL_FROM}>`,
    to: adminEmails.map((a) => a.email).join(','),
    subject: '🚨 Reminder: Karyawan Belum Absen 3 Hari',
    html,
  });

  console.log('📧 Reminder dikirim ke admin.');
});

// 4. Kirim laporan otomatis ke semua karyawan setiap tanggal 1
cron.schedule('0 7 1 * *', async () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const { generatePDF } = require('../utils/pdfGenerator');
  const reportService = require('../services/reportService');

  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    select: { id: true, email: true, name: true },
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  for (const user of users) {
    const report = await reportService.getAttendanceReport({ userId: user.id, month, year });
    const pdfBuffer = await generatePDF(report, month + 1, year);

    await transporter.sendMail({
      from: `"Absensi Bot" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: `📊 Laporan Kehadiran Bulan ${month + 1}-${year}`,
      text: `Hai ${user.name},\nBerikut laporan kehadiran kamu bulan ini.`,
      attachments: [
        {
          filename: `laporan-${month + 1}-${year}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log(`📤 Laporan terkirim ke ${user.name}`);
  }
});
