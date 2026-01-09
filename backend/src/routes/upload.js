const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { upload, getFileUrl, deleteFile } = require('../utils/upload');

const router = express.Router();

// Upload single image (admin only)
router.post('/', authenticate, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: { message: 'No file uploaded' } });
  res.json({ url: getFileUrl(req.file.filename), filename: req.file.filename, originalName: req.file.originalname, size: req.file.size });
});

// Delete file (admin only)
router.delete('/:filename', authenticate, requireAdmin, (req, res) => {
  try {
    deleteFile(req.params.filename);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to delete file' } });
  }
});

module.exports = router;
