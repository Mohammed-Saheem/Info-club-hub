/**
 * Admin Users Routes
 * 
 * These routes handle user management using Supabase Admin API.
 * The service_role key is used server-side to perform admin operations
 * that are not allowed with the anon key on the client.
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { getSupabaseAdmin, isSupabaseAdminConfigured } = require('../config/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation error handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: { message: errors.array()[0].msg } });
  }
  next();
};

// Middleware to check if Supabase admin is configured
const requireSupabaseAdmin = (req, res, next) => {
  if (!isSupabaseAdminConfigured()) {
    return res.status(503).json({
      error: { message: 'Supabase admin is not configured. Contact the administrator.' }
    });
  }
  next();
};

/**
 * List all users
 * GET /api/admin/users
 * Requires: Admin authentication
 */
router.get('/users', authenticate, requireAdmin, requireSupabaseAdmin, async (req, res, next) => {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Error listing users:', error);
      return res.status(400).json({ error: { message: error.message } });
    }

    // Also fetch profiles for additional info
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('*');

    // Merge user data with profiles
    const usersWithProfiles = users.map(user => {
      const profile = profiles?.find(p => p.user_id === user.id);
      return {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        full_name: profile?.full_name || user.user_metadata?.full_name || null,
        is_admin: profile?.is_admin || false,
        avatar_url: profile?.avatar_url || null
      };
    });

    res.json({ users: usersWithProfiles });
  } catch (error) {
    next(error);
  }
});

/**
 * Get a single user by ID
 * GET /api/admin/users/:id
 * Requires: Admin authentication
 */
router.get('/users/:id', authenticate, requireAdmin, requireSupabaseAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(id);
    
    if (error) {
      console.error('Error getting user:', error);
      return res.status(400).json({ error: { message: error.message } });
    }

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    // Get profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', id)
      .single();

    res.json({
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        full_name: profile?.full_name || user.user_metadata?.full_name || null,
        is_admin: profile?.is_admin || false,
        avatar_url: profile?.avatar_url || null
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Create a new user (with confirmed email)
 * POST /api/admin/users
 * Requires: Admin authentication
 * Body: { email, password, fullName?, isAdmin? }
 */
router.post('/users', [
  authenticate,
  requireAdmin,
  requireSupabaseAdmin,
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').optional().trim(),
  body('isAdmin').optional().isBoolean(),
  handleValidation
], async (req, res, next) => {
  try {
    const { email, password, fullName, isAdmin = false } = req.body;
    const supabaseAdmin = getSupabaseAdmin();

    // Create user with email already confirmed
    const { data: { user }, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName
      }
    });

    if (error) {
      console.error('Error creating user:', error);
      return res.status(400).json({ error: { message: error.message } });
    }

    // Update profile with admin status if needed
    if (isAdmin && user) {
      await supabaseAdmin
        .from('profiles')
        .update({ is_admin: true, full_name: fullName })
        .eq('user_id', user.id);
    }

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        full_name: fullName || null,
        is_admin: isAdmin
      },
      message: 'User created successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update a user
 * PATCH /api/admin/users/:id
 * Requires: Admin authentication
 * Body: { email?, password?, fullName?, isAdmin? }
 */
router.patch('/users/:id', [
  authenticate,
  requireAdmin,
  requireSupabaseAdmin,
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').optional().trim(),
  body('isAdmin').optional().isBoolean(),
  handleValidation
], async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password, fullName, isAdmin } = req.body;
    const supabaseAdmin = getSupabaseAdmin();

    // Build auth update payload
    const authUpdate = {};
    if (email) authUpdate.email = email;
    if (password) authUpdate.password = password;
    if (fullName !== undefined) {
      authUpdate.user_metadata = { full_name: fullName };
    }

    // Update auth user if there are auth changes
    if (Object.keys(authUpdate).length > 0) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(id, authUpdate);
      if (error) {
        console.error('Error updating user auth:', error);
        return res.status(400).json({ error: { message: error.message } });
      }
    }

    // Update profile if there are profile changes
    const profileUpdate = {};
    if (fullName !== undefined) profileUpdate.full_name = fullName;
    if (isAdmin !== undefined) profileUpdate.is_admin = isAdmin;

    if (Object.keys(profileUpdate).length > 0) {
      const { error } = await supabaseAdmin
        .from('profiles')
        .update(profileUpdate)
        .eq('user_id', id);
      
      if (error) {
        console.error('Error updating profile:', error);
        return res.status(400).json({ error: { message: error.message } });
      }
    }

    // Fetch updated user
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(id);
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', id)
      .single();

    res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name || null,
        is_admin: profile?.is_admin || false
      },
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete a user
 * DELETE /api/admin/users/:id
 * Requires: Admin authentication
 */
router.delete('/users/:id', authenticate, requireAdmin, requireSupabaseAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const supabaseAdmin = getSupabaseAdmin();

    // Prevent self-deletion
    if (req.user.user_id === id) {
      return res.status(400).json({ error: { message: 'Cannot delete your own account' } });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    
    if (error) {
      console.error('Error deleting user:', error);
      return res.status(400).json({ error: { message: error.message } });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * Invite a user (sends magic link email)
 * POST /api/admin/users/invite
 * Requires: Admin authentication
 * Body: { email }
 */
router.post('/users/invite', [
  authenticate,
  requireAdmin,
  requireSupabaseAdmin,
  body('email').isEmail().withMessage('Valid email is required'),
  handleValidation
], async (req, res, next) => {
  try {
    const { email } = req.body;
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (error) {
      console.error('Error inviting user:', error);
      return res.status(400).json({ error: { message: error.message } });
    }

    res.json({
      user: data.user,
      message: 'Invitation sent successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Reset a user's password (generates a recovery link)
 * POST /api/admin/users/:id/reset-password
 * Requires: Admin authentication
 */
router.post('/users/:id/reset-password', authenticate, requireAdmin, requireSupabaseAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const supabaseAdmin = getSupabaseAdmin();

    // Get user email first
    const { data: { user }, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(id);
    
    if (getUserError || !user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    // Generate password recovery link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: user.email
    });

    if (error) {
      console.error('Error generating reset link:', error);
      return res.status(400).json({ error: { message: error.message } });
    }

    res.json({
      message: 'Password reset link generated',
      // Only return the link in development
      ...(process.env.NODE_ENV === 'development' && { resetLink: data.properties?.action_link })
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
