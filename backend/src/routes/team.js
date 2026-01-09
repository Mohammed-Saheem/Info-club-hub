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

// Get all team members (public)
router.get('/', (req, res, next) => {
  try {
    const members = db.all('team_members').sort((a, b) => a.display_order - b.display_order);
    res.json(members);
  } catch (error) { next(error); }
});

// Get single team member
router.get('/:id', (req, res, next) => {
  try {
    const member = db.findById('team_members', req.params.id);
    if (!member) return res.status(404).json({ error: { message: 'Team member not found' } });
    res.json(member);
  } catch (error) { next(error); }
});

// Create team member (admin only)
router.post('/', authenticate, requireAdmin, [
  body('name').notEmpty().withMessage('Name is required'),
  body('role').notEmpty().withMessage('Role is required'),
  handleValidation
], (req, res, next) => {
  try {
    const { name, role, bio, photo_url, linkedin_url, github_url, email, display_order } = req.body;
    const member = db.insert('team_members', { id: uuidv4(), name, role, bio: bio || null, photo_url: photo_url || null, linkedin_url: linkedin_url || null, github_url: github_url || null, email: email || null, display_order: display_order || 0 });
    res.status(201).json(member);
  } catch (error) { next(error); }
});

// Update team member (admin only)
router.patch('/:id', authenticate, requireAdmin, (req, res, next) => {
  try {
    const existing = db.findById('team_members', req.params.id);
    if (!existing) return res.status(404).json({ error: { message: 'Team member not found' } });
    const { name, role, bio, photo_url, linkedin_url, github_url, email, display_order } = req.body;
    const member = db.update('team_members', req.params.id, {
      name: name ?? existing.name,
      role: role ?? existing.role,
      bio: bio ?? existing.bio,
      photo_url: photo_url ?? existing.photo_url,
      linkedin_url: linkedin_url ?? existing.linkedin_url,
      github_url: github_url ?? existing.github_url,
      email: email ?? existing.email,
      display_order: display_order ?? existing.display_order
    });
    res.json(member);
  } catch (error) { next(error); }
});

// Delete team member (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res, next) => {
  try {
    if (!db.delete('team_members', req.params.id)) return res.status(404).json({ error: { message: 'Team member not found' } });
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) { next(error); }
});

module.exports = router;
