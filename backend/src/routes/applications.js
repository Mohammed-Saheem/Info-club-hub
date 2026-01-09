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

// Submit join application (public)
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  handleValidation
], (req, res, next) => {
  try {
    const { name, email, phone, year_of_study, department, why_join, skills } = req.body;
    db.insert('join_applications', { id: uuidv4(), name, email, phone: phone || null, year_of_study: year_of_study || null, department: department || null, why_join: why_join || null, skills: skills || null, is_reviewed: false });
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) { next(error); }
});

// Get all applications (admin only)
router.get('/', authenticate, requireAdmin, (req, res, next) => {
  try {
    const applications = db.all('join_applications').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(applications);
  } catch (error) { next(error); }
});

// Mark as reviewed (admin only)
router.patch('/:id', authenticate, requireAdmin, (req, res, next) => {
  try {
    const { is_reviewed } = req.body;
    const app = db.update('join_applications', req.params.id, { is_reviewed: !!is_reviewed });
    if (!app) return res.status(404).json({ error: { message: 'Application not found' } });
    res.json(app);
  } catch (error) { next(error); }
});

// Delete application (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res, next) => {
  try {
    db.delete('join_applications', req.params.id);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) { next(error); }
});

module.exports = router;
