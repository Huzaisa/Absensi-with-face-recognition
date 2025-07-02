const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.get('/pdf', auth, role('ADMIN'), controller.exportReportPDF);
router.get('/pdftofile', auth, role('ADMIN'), controller.exportReportPDFToFile);

router.get('/excel', auth, role('ADMIN'), controller.exportReportExcel);
router.get('/', auth, controller.getMonthlyReport);

module.exports = router;
