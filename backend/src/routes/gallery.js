const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: { message: errors.array()[0].msg } });
  next();
};

// Get all gallery photos (public)
router.get('/', (req, res, next) => {
  try {
    const { category, limit } = req.query;
    let photos = db.all('gallery_photos').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (category) photos = photos.filter(p => p.category === category);
    if (limit) photos = photos.slice(0, parseInt(limit));
    res.json(photos);
  } catch (error) { next(error); }
});

// Get categories
router.get('/categories', (req, res, next) => {
  try {
    const photos = db.all('gallery_photos');
    const categories = [...new Set(photos.map(p => p.category).filter(Boolean))];
    res.json(categories);
  } catch (error) { next(error); }
});

// Create photo (admin only)
router.post('/', authenticate, requireAdmin, [
  body('image_url').notEmpty().withMessage('Image URL is required'),
  handleValidation
], (req, res, next) => {
  try {
    const { image_url, title, category, event_id } = req.body;
    const photo = db.insert('gallery_photos', { id: uuidv4(), image_url, title: title || null, category: category || null, event_id: event_id || null });
    res.status(201).json(photo);
  } catch (error) { next(error); }
});

// Delete photo (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res, next) => {
  try {
    if (!db.delete('gallery_photos', req.params.id)) return res.status(404).json({ error: { message: 'Photo not found' } });
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) { next(error); }
});

module.exports = router;
