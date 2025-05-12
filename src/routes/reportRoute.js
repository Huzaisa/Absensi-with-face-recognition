const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.use(auth);

router.get('/', controller.getMonthlyReport); // Bisa admin/user
router.get('/pdf', role(['ADMIN']), controller.exportReportPDF);
router.get('/excel', role(['ADMIN']), controller.exportReportExcel);

module.exports = router;
