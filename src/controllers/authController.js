const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwtUtils');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const faceFile = req.file;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        photo: faceFile ? faceFile.filename : null,
      },
    });

    console.log(`🟢 User created in DB: ${newUser.name} (${newUser.id})`);

    if (faceFile) {
      try {
        const formData = new FormData();
        formData.append('userId', newUser.id);
        formData.append('file', fs.createReadStream(faceFile.path));

        const response = await axios.post('http://localhost:8000/register/', formData, {
          headers: formData.getHeaders(),
        });

        const responseData = response.data;

        console.log('📸 Face API response:', responseData);

        if (
          response.status === 200 &&
          responseData.detail &&
          !responseData.detail.includes('Tidak ada wajah')
        ) {
          console.log(`✅ Face registered successfully for ${newUser.name}`);
          return res.status(201).json({ message: 'User registered with face.', user: newUser });
        } else {
          console.warn(`⚠️ Face registration issue for ${newUser.name}:`, responseData.detail);
          return res.status(400).json({
            message: 'Face registration failed.',
            detail: responseData.detail || 'Unknown error from face recognition service',
          });
        }
      } catch (faceApiError) {
        console.error('❌ Error from face recognition service:', faceApiError?.response?.data || faceApiError.message);
        return res.status(500).json({
          message: 'Error calling face recognition service.',
          error: faceApiError?.response?.data || faceApiError.message,
        });
      }
    }

    console.log(`ℹ️ No face file uploaded for ${newUser.name}`);
    res.status(201).json({ message: 'User registered without face.', user: newUser });
  } catch (err) {
    console.error('❌ Error in user registration:', err.message);
    next(err);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};
