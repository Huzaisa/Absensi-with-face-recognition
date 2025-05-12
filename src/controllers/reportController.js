const reportService = require('../services/reportService');
const { generatePDF } = require('../utils/pdfGenerator');
const { generateExcel } = require('../utils/excelGenerator');

exports.getMonthlyReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.role === 'ADMIN' ? null : req.user.id;

    const report = await reportService.getAttendanceReport({
      userId,
      month: Number(month),
      year: Number(year),
    });

    res.json({ report });
  } catch (err) {
    next(err);
  }
};

exports.exportReportPDF = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const report = await reportService.getAttendanceReport({
      month: Number(month),
      year: Number(year),
    });

    const buffer = await generatePDF(report, month, year);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report-${month}-${year}.pdf"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

exports.exportReportExcel = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const report = await reportService.getAttendanceReport({
      month: Number(month),
      year: Number(year),
    });

    const buffer = await generateExcel(report, month, year);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="report-${month}-${year}.xlsx"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};
