const uploadService = require('../services/uploadService');

exports.uploadDocument = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Dokumen wajib diupload' });
    }

    const { type } = req.body;

    const saved = await uploadService.saveDocument({
      userId,
      fileName: file.filename,
      filePath: file.path,
      type,
    });

    res.status(201).json({ message: 'Dokumen berhasil diupload', saved });
  } catch (err) {
    next(err);
  }
};


exports.getUserDocuments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const docs = await uploadService.getUserDocuments(userId);
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

exports.getAllDocuments = async (_req, res, next) => {
  try {
    const docs = await uploadService.getAllDocuments();
    res.json(docs);
  } catch (err) {
    next(err);
  }
};
