const express = require('express');
const router = express.Router();
const { login, registerUser } = require('../controllers/authController');
const upload = require('../middlewares/uploadMiddleware');

router.post('/register', upload.single('photo'), registerUser);

router.post('/login', login);

module.exports = router;
