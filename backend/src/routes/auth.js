const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { createClient } = require('@supabase/supabase-js');

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

// Admin: Create user using Supabase Admin API (for Supabase integration)
// This endpoint accepts Supabase JWT tokens instead of backend JWT tokens
router.post('/admin/create-user', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').optional().trim(),
  body('isAdmin').optional().isBoolean(),
  handleValidation
], async (req, res, next) => {
  try {
    const { email, password, fullName, isAdmin } = req.body;
    
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ 
        error: { message: 'Supabase Admin API not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend .env' } 
      });
    }

    // Verify Supabase JWT token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: { message: 'No token provided' } });
    }

    const token = authHeader.split(' ')[1];
    
    // Create Supabase Admin client to verify token
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify the token and get user
    const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !authUser) {
      return res.status(401).json({ error: { message: 'Invalid or expired token' } });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('user_id', authUser.id)
      .single();

    if (profileError || !profile?.is_admin) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    // Check if user already exists in auth.users
    const { data: existingAuthUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingAuthUser?.users?.some(u => u.email === email.toLowerCase());
    
    if (userExists) {
      return res.status(400).json({ error: { message: 'User already exists' } });
    }

    // Create user in auth.users using Admin API
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName || null
      }
    });

    if (createError) {
      return res.status(400).json({ error: { message: createError.message } });
    }

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update profile to set is_admin if needed
    if (isAdmin && newUser.user) {
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ is_admin: true })
        .eq('user_id', newUser.user.id);

      if (updateError) {
        console.error('Error updating admin status:', updateError);
        // Don't fail the request, just log the error
      }
    }

    // Fetch the created profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', newUser.user.id)
      .single();

    if (profileError) {
      return res.status(500).json({ 
        error: { message: 'User created but profile not found. Error: ' + profileError.message } 
      });
    }

    res.status(201).json({ 
      user: {
        id: profile.id,
        user_id: profile.user_id,
        email: profile.email,
        full_name: profile.full_name,
        is_admin: profile.is_admin,
        avatar_url: profile.avatar_url
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
