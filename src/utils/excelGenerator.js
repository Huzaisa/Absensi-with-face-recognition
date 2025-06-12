const ExcelJS = require('exceljs');

exports.generateExcel = async (data, month, year) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(`Rekap-${month}-${year}`);

  ws.columns = [
    { header: 'Nama',         key: 'name',   width: 25 },
    { header: 'Hadir',        key: 'hadir',  width: 10 },
    { header: 'Izin',         key: 'izin',   width: 10 },
    { header: 'Cuti',         key: 'cuti',   width: 10 },
    { header: 'Lembur (jam)', key: 'lembur', width: 15 },
  ];

  data.forEach((row) => ws.addRow(row));
  ws.eachRow((r) => r.alignment = { vertical: 'middle', horizontal: 'center' });

  return wb.xlsx.writeBuffer();
};
