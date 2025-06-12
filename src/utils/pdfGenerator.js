const PDFDocument = require('pdfkit');

exports.generatePDF = (data, month, year) => new Promise((resolve) => {
  const doc     = new PDFDocument({ margin: 40 });
  const buffers = [];

  doc.fontSize(16).text(`Laporan Kehadiran – ${month}/${year}`, { align: 'center' });
  doc.moveDown();

  /* header */
  doc.fontSize(12).text('Nama',  40, doc.y, { width: 150, continued: true });
  doc.text('Hadir',             190, doc.y, { width: 60,  continued: true, align: 'center' });
  doc.text('Izin',              250, doc.y, { width: 60,  continued: true, align: 'center' });
  doc.text('Cuti',              310, doc.y, { width: 60,  continued: true, align: 'center' });
  doc.text('Lembur (jam)',      370, doc.y, { width: 100, align: 'center' });
  doc.moveDown(0.5);

  /* rows */
  data.forEach((row) => {
    doc.text(row.name,   40,  doc.y, { width: 150, continued: true });
    doc.text(row.hadir || 0,  190,  doc.y, { width: 60,  continued: true, align: 'center' });
    doc.text(row.izin  || 0,  250,  doc.y, { width: 60,  continued: true, align: 'center' });
    doc.text(row.cuti  || 0,  310,  doc.y, { width: 60,  continued: true, align: 'center' });
    doc.text(row.lembur|| 0,  370,  doc.y, { width: 100, align: 'center' });
    doc.moveDown(0.5);
  });

  doc.end();
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => resolve(Buffer.concat(buffers)));
});
