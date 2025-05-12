const ExcelJS = require('exceljs');

exports.generateExcel = async (data, month, year) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(`Rekap-${month}-${year}`);

  ws.columns = [
    { header: 'Nama', key: 'name' },
    { header: 'Hadir', key: 'hadir' },
    { header: 'Izin', key: 'izin' },
    { header: 'Cuti', key: 'cuti' },
    { header: 'Lembur (jam)', key: 'lembur' },
  ];

  data.forEach((item) => {
    ws.addRow(item);
  });

  const buffer = await wb.xlsx.writeBuffer();
  return buffer;
};
