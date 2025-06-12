const prisma = require('../config/db');

exports.saveDocument = async ({ userId, fileName, filePath, type }) => {
  return prisma.document.create({
    data: {
      userId,
      fileName,
      filePath,
      type,
    },
  });
};

exports.getAllDocuments = async () => {
  return prisma.document.findMany({
    include: { user: true },
    orderBy: { uploadedAt: 'desc' },
  });
};

exports.getUserDocuments = async (userId) => {
  return prisma.document.findMany({
    where: { userId },
    orderBy: { uploadedAt: 'desc' },
  });
};

exports.getDocument = (id) =>
  prisma.document.findUnique({ where: { id } });

/* hapus dokumen */
exports.deleteDocument = (id) =>
  prisma.document.delete({ where: { id } });