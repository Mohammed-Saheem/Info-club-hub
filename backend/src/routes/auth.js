const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: { message: errors.array()[0].msg } });
  }
  next();
};

// Sign up
router.post('/signup', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').optional().trim(),
  handleValidation
], (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;
    const existingUser = db.findOne('profiles', u => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: { message: 'Email already registered' } });
    }
    const passwordHash = bcrypt.hashSync(password, 10);
    const user = db.insert('profiles', {
      id: uuidv4(),
      user_id: uuidv4(),
      email: email.toLowerCase(),
      password_hash: passwordHash,
      full_name: fullName || null,
      is_admin: false,
      avatar_url: null
    });
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.status(201).json({ user: { id: user.id, user_id: user.user_id, email: user.email, full_name: user.full_name, is_admin: user.is_admin, avatar_url: user.avatar_url }, token });
  } catch (error) { next(error); }
});

// Sign in
router.post('/signin', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
], (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = db.findOne('profiles', u => u.email === email.toLowerCase());
    if (!user) return res.status(401).json({ error: { message: 'Invalid email or password' } });
    if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: { message: 'Invalid email or password' } });
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ user: { id: user.id, user_id: user.user_id, email: user.email, full_name: user.full_name, is_admin: user.is_admin, avatar_url: user.avatar_url }, token });
  } catch (error) { next(error); }
});

// Get current user
router.get('/me', authenticate, (req, res) => {
  res.json({ user: { id: req.user.id, user_id: req.user.user_id, email: req.user.email, full_name: req.user.full_name, is_admin: req.user.is_admin, avatar_url: req.user.avatar_url } });
});

module.exports = router;
