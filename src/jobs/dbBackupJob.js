
const cron          = require('node-cron');
const { exec }      = require('child_process');
const path          = require('path');
const fs            = require('fs');
const nodemailer    = require('nodemailer');
const prisma        = require('../config/db');
const { format,
        subMonths,
        startOfMonth,
        endOfMonth } = require('date-fns');
require('dotenv').config();              


const BACKUP_DIR   = path.join(__dirname, '../../backups');
const DATABASE_URL = process.env.DATABASE_URL;


if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_FROM, pass: process.env.EMAIL_PASSWORD },
});


cron.schedule('0 2 * * *', () => {
  const fileName   = `backup_${format(new Date(), 'yyyy-MM-dd')}.dump`;
  const backupPath = path.join(BACKUP_DIR, fileName);

 
  const cmd = `pg_dump --file="${backupPath}" --format=custom "${DATABASE_URL}"`;

  exec(cmd, (err) => {
    if (err) console.error('❌ Gagal backup:', err);
    else     console.log('✅ Backup sukses:', fileName);
  });
});


cron.schedule('0 3 * * *', () => {
  fs.readdirSync(BACKUP_DIR).forEach((file) => {
    const p  = path.join(BACKUP_DIR, file);
    const age = (Date.now() - fs.statSync(p).mtimeMs) / 86_400_000; 
    if (age > 30) {
      fs.unlinkSync(p);
      console.log('🗑️  Old backup deleted:', file);
    }
  });
});


cron.schedule('0 8 * * *', async () => {
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000);

   
    const employees = await prisma.user.findMany({
      where: {
        role: 'EMPLOYEE',
        attendances: {
          none: { date: { gte: threeDaysAgo } },   
        },
      },
      select: { name: true },
    });

    if (!employees.length) return;

    const adminEmails = await prisma.user.findMany({
      where : { role: 'ADMIN' },
      select: { email: true },
    });

    await transporter.sendMail({
      from   : `"Absensi Bot" <${process.env.EMAIL_FROM}>`,
      to     : adminEmails.map((a) => a.email).join(','),
      subject: '🚨 Reminder: Karyawan belum absen ≥ 3 hari',
      html   : `
        <p>Berikut daftar karyawan yang tidak memiliki absensi 3 hari terakhir:</p>
        <ul>${employees.map((u) => `<li>${u.name}</li>`).join('')}</ul>
      `,
    });

    console.log('📧 Reminder absen dikirim ke admin.');
  } catch (e) { console.error('Reminder error:', e); }
});


cron.schedule('0 7 1 * *', async () => {
  try {
    const lastMonthDate = subMonths(new Date(), 1);
    const month = lastMonthDate.getMonth() + 1;   
    const year  = lastMonthDate.getFullYear();

    const reportService = require('../services/reportService');
    const { generatePDF } = require('../utils/pdfGenerator');

    const users = await prisma.user.findMany({
      where : { role: 'EMPLOYEE' },
      select: { id: true, email: true, name: true },
    });

    for (const u of users) {
      const data      = await reportService.getAttendanceReport({ userId: u.id, month, year });
      const pdfBuffer = await generatePDF(data, month, year);

      await transporter.sendMail({
        from   : `"Absensi Bot" <${process.env.EMAIL_FROM}>`,
        to     : u.email,
        subject: `📊 Laporan Kehadiran ${month}-${year}`,
        text   : `Hai ${u.name},\nBerikut laporan kehadiran kamu bulan lalu.`,
        attachments: [{ filename: `laporan-${month}-${year}.pdf`, content: pdfBuffer }],
      });

      console.log(`📤 Laporan bulan ${month}-${year} terkirim ke ${u.name}`);
    }
  } catch (e) { console.error('Kirim laporan otomatis gagal:', e); }
});
