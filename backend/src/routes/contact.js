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

// Submit contact form (public)
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required'),
  handleValidation
], (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    db.insert('contact_submissions', { id: uuidv4(), name, email, message, is_read: false });
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) { next(error); }
});

// Get all submissions (admin only)
router.get('/', authenticate, requireAdmin, (req, res, next) => {
  try {
    const submissions = db.all('contact_submissions').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(submissions);
  } catch (error) { next(error); }
});

// Mark as read (admin only)
router.patch('/:id', authenticate, requireAdmin, (req, res, next) => {
  try {
    const { is_read } = req.body;
    const submission = db.update('contact_submissions', req.params.id, { is_read: !!is_read });
    if (!submission) return res.status(404).json({ error: { message: 'Submission not found' } });
    res.json(submission);
  } catch (error) { next(error); }
});

// Delete submission (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res, next) => {
  try {
    db.delete('contact_submissions', req.params.id);
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) { next(error); }
});

module.exports = router;
