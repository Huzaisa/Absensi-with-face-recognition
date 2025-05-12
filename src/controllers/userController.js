const prisma = require('../config/db');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = { name, email };
  if (password) data.password = await bcrypt.hash(password, 10);

  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data,
  });
  res.json(updated);
};

exports.deleteUser = async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ success: true });
};
