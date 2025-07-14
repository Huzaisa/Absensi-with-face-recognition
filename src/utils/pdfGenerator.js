const fs = require('fs');
const PDFDocument = require('pdfkit');

function generateStyledReport(doc, data, month, year) {
  doc.fontSize(18).font('Helvetica-Bold').text(`Laporan Kehadiran Bulanan`, { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(13).font('Helvetica').text(`Periode: ${month}/${year}`, { align: 'center' });
  doc.moveDown(1);

  const tableTop = doc.y;
  const rowHeight = 22;

  const col = {
    nama: 40,
    hadir: 180,
    izin: 250,
    cuti: 350,
    telat: 410,
    lembur: 470,
  };

  const totalWidth = col.lembur + 90;

  // Header background
  doc
    .rect(col.nama - 2, tableTop - 2, totalWidth - col.nama, rowHeight)
    .fill('#f0f0f0');

  doc
    .fillColor('#000000')
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('Nama', col.nama, tableTop + 4, { width: 130 })
    .text('Hadir', col.hadir, tableTop + 4, { width: 60, align: 'center' })
    .text('Pengajuan Izin', col.izin, tableTop + 4, { width: 90, align: 'center' }) // ✅ diperluas
    .text('Cuti', col.cuti, tableTop + 4, { width: 50, align: 'center' })
    .text('Telat', col.telat, tableTop + 4, { width: 50, align: 'center' })
    .text('Lembur (jam)', col.lembur, tableTop + 4, { width: 90, align: 'center' });

  doc
    .moveTo(col.nama - 2, tableTop + rowHeight)
    .lineTo(totalWidth, tableTop + rowHeight)
    .strokeColor('#999999')
    .stroke();

  let y = tableTop + rowHeight + 5;
  doc.font('Helvetica').fontSize(11);

  data.forEach((row, index) => {
    const bgColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
    doc.rect(col.nama - 2, y - 3, totalWidth - col.nama, rowHeight).fill(bgColor).fillColor('#000000');

    doc
      .text(row.name, col.nama, y, { width: 130 })
      .text(row.hadir || 0, col.hadir, y, { width: 60, align: 'center' })
      .text(row.izin || 0, col.izin, y, { width: 90, align: 'center' })
      .text(row.cuti || 0, col.cuti, y, { width: 50, align: 'center' })
      .text(row.telat || 0, col.telat, y, { width: 50, align: 'center' })
      .text(row.lembur || 0, col.lembur, y, { width: 90, align: 'center' });

    y += rowHeight;
  });

  doc.moveDown(2);
  doc.fontSize(10).fillColor('#999999').text(
    'Laporan ini dihasilkan otomatis oleh sistem Absensi Face Recognition',
    { align: 'center' }
  );
}


exports.generatePDF = (data, month, year) => new Promise((resolve) => {
  const doc = new PDFDocument({ margin: 40 });
  const buffers = [];

  generateStyledReport(doc, data, month, year);

  doc.end();
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => resolve(Buffer.concat(buffers)));
});

exports.generatePDFToFile = (data, month, year, filePath) => new Promise((resolve, reject) => {
  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  generateStyledReport(doc, data, month, year);

  doc.end();
  stream.on('finish', resolve);
  stream.on('error', reject);
});

exports.generateMonthlyReport = (data, filePath) => new Promise((resolve, reject) => {
  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  generateStyledReport(doc, data, month, year);

  doc.end();
  stream.on('finish', resolve);
  stream.on('error', reject);
});
