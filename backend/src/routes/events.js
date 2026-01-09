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

// Get all events (public)
router.get('/', (req, res, next) => {
  try {
    let events = db.all('events');
    if (req.query.featured === 'true') events = events.filter(e => e.is_featured);
    events.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
    if (req.query.limit) events = events.slice(0, parseInt(req.query.limit));
    res.json(events);
  } catch (error) { next(error); }
});

// Get single event
router.get('/:id', (req, res, next) => {
  try {
    const event = db.findById('events', req.params.id);
    if (!event) return res.status(404).json({ error: { message: 'Event not found' } });
    res.json(event);
  } catch (error) { next(error); }
});

// Create event (admin only)
router.post('/', authenticate, requireAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('event_date').notEmpty().withMessage('Date is required'),
  handleValidation
], (req, res, next) => {
  try {
    const { title, description, event_date, venue, banner_image, is_featured } = req.body;
    const event = db.insert('events', { id: uuidv4(), title, description: description || null, event_date, venue: venue || null, banner_image: banner_image || null, is_featured: !!is_featured });
    res.status(201).json(event);
  } catch (error) { next(error); }
});

// Update event (admin only)
router.patch('/:id', authenticate, requireAdmin, (req, res, next) => {
  try {
    const existing = db.findById('events', req.params.id);
    if (!existing) return res.status(404).json({ error: { message: 'Event not found' } });
    const { title, description, event_date, venue, banner_image, is_featured } = req.body;
    const event = db.update('events', req.params.id, {
      title: title ?? existing.title,
      description: description ?? existing.description,
      event_date: event_date ?? existing.event_date,
      venue: venue ?? existing.venue,
      banner_image: banner_image ?? existing.banner_image,
      is_featured: is_featured !== undefined ? !!is_featured : existing.is_featured
    });
    res.json(event);
  } catch (error) { next(error); }
});

// Delete event (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res, next) => {
  try {
    if (!db.delete('events', req.params.id)) return res.status(404).json({ error: { message: 'Event not found' } });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) { next(error); }
});

module.exports = router;
