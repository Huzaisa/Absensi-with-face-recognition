const path = require('path');
const fs = require('fs');
const reportService  = require('../services/reportService');
const { generatePDF, generatePDFToFile } = require('../utils/pdfGenerator');
const { generateExcel } = require('../utils/excelGenerator');

const parseMY = (q) => ({
  month: Number(q.month) || (new Date().getMonth()+1),
  year : Number(q.year ) || (new Date().getFullYear()),
});

exports.getMonthlyReport = async (req, res, next) => {
  try {
    const { month, year } = parseMY(req.query);
    const userId = req.user.role === 'ADMIN' ? null : req.user.id;

    const report = await reportService.getAttendanceReport({ userId, month, year });
    res.json({ report });
  } catch (err) { next(err); }
};

exports.exportReportPDF = async (req, res, next) => {
  try {
    const { month, year } = parseMY(req.query);
    const report = await reportService.getAttendanceReport({ month, year });

    const buffer = await generatePDF(report, month, year);
    // Ubah buffer menjadi string Base64
    const base64Pdf = buffer.toString('base64');

    // Kirim sebagai JSON, atau langsung string Base64 jika Anda mau
    res.status(200).json({
        status: 'success',
        data: `data:application/pdf;base64,${base64Pdf}` // Ini URI yang akan Anda gunakan di frontend
    });
    // Atau jika hanya ingin mengirim string base64 saja (tanpa JSON wrapper)
    // res.setHeader('Content-Type', 'text/plain'); // Atau application/json jika diwrap
    // res.send(data:application/pdf;base64,${base64Pdf});

  } catch (err) { next(err); }
};

exports.exportReportPDFToFile = async (req, res, next) => {
  try {
    const { month, year } = parseMY(req.query);
    const report = await reportService.getAttendanceReport({ month, year });

    const filePath = path.join(__dirname, `../../public/documents/laporan-${month}-${year}.pdf`);
    await generatePDFToFile(report, month, year, filePath);

    res.json({ message: 'PDF disimpan', path: `/documents/laporan-${month}-${year}.pdf` });
  } catch (err) { next(err); }
};

exports.exportReportExcel = async (req, res, next) => {
  try {
    const { month, year } = parseMY(req.query);
    const report = await reportService.getAttendanceReport({ month, year });

    const buffer = await generateExcel(report, month, year);
    res.setHeader('Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition',
      `attachment; filename="report-${month}-${year}.xlsx"`);
    res.send(buffer);
  } catch (err) { next(err); }
};
