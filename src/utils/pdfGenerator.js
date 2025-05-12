const PDFDocument = require('pdfkit');
const { format } = require('date-fns');

exports.generatePDF = async (data, month, year) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.fontSize(16).text(`Laporan Kehadiran Bulan ${month}-${year}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text('Nama\t\tHadir\tIzin\tCuti\tLembur (jam)');

    data.forEach((row) => {
      doc.text(`${row.name}\t\t${row.hadir || 0}\t${row.izin || 0}\t${row.cuti || 0}\t${row.lembur || 0}`);
    });

    doc.end();
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
  });
};
