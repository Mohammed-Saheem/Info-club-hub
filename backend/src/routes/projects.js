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

// Get all projects (public)
router.get('/', (req, res, next) => {
  try {
    let projects = db.all('projects');
    if (req.query.featured === 'true') projects = projects.filter(p => p.is_featured);
    projects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (req.query.limit) projects = projects.slice(0, parseInt(req.query.limit));
    res.json(projects);
  } catch (error) { next(error); }
});

// Get single project
router.get('/:id', (req, res, next) => {
  try {
    const project = db.findById('projects', req.params.id);
    if (!project) return res.status(404).json({ error: { message: 'Project not found' } });
    res.json(project);
  } catch (error) { next(error); }
});

// Create project (admin only)
router.post('/', authenticate, requireAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  handleValidation
], (req, res, next) => {
  try {
    const { title, description, tech_stack, github_url, demo_url, image_url, is_featured } = req.body;
    const project = db.insert('projects', { id: uuidv4(), title, description: description || null, tech_stack: tech_stack || [], github_url: github_url || null, demo_url: demo_url || null, image_url: image_url || null, is_featured: !!is_featured });
    res.status(201).json(project);
  } catch (error) { next(error); }
});

// Update project (admin only)
router.patch('/:id', authenticate, requireAdmin, (req, res, next) => {
  try {
    const existing = db.findById('projects', req.params.id);
    if (!existing) return res.status(404).json({ error: { message: 'Project not found' } });
    const { title, description, tech_stack, github_url, demo_url, image_url, is_featured } = req.body;
    const project = db.update('projects', req.params.id, {
      title: title ?? existing.title,
      description: description ?? existing.description,
      tech_stack: tech_stack ?? existing.tech_stack,
      github_url: github_url ?? existing.github_url,
      demo_url: demo_url ?? existing.demo_url,
      image_url: image_url ?? existing.image_url,
      is_featured: is_featured !== undefined ? !!is_featured : existing.is_featured
    });
    res.json(project);
  } catch (error) { next(error); }
});

// Delete project (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res, next) => {
  try {
    if (!db.delete('projects', req.params.id)) return res.status(404).json({ error: { message: 'Project not found' } });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) { next(error); }
});

module.exports = router;
