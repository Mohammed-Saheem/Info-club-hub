const express = require('express');
const db = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats (admin only)
router.get('/', authenticate, requireAdmin, (req, res, next) => {
  try {
    res.json({
      events: db.count('events'),
      projects: db.count('projects'),
      team: db.count('team_members'),
      gallery: db.count('gallery_photos'),
      unread_contacts: db.filter('contact_submissions', s => !s.is_read).length,
      pending_applications: db.filter('join_applications', a => !a.is_reviewed).length
    });
  } catch (error) { next(error); }
});

// Get public stats for homepage
router.get('/public', (req, res, next) => {
  try {
    res.json({
      events: db.count('events'),
      projects: db.count('projects'),
      members: db.count('team_members')
    });
  } catch (error) { next(error); }
});

module.exports = router;
