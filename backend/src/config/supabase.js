/**
 * Supabase Admin Client Configuration
 * 
 * This creates a Supabase client with the service_role key for admin operations.
 * IMPORTANT: This should ONLY be used on the server side, never expose the
 * service_role key to the browser/client.
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin = null;

if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  console.log('✅ Supabase admin client initialized');
} else {
  console.warn('⚠️  Supabase admin client not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
}

/**
 * Get the Supabase admin client
 * @throws Error if Supabase is not configured
 */
function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }
  return supabaseAdmin;
}

/**
 * Check if Supabase admin is available
 */
function isSupabaseAdminConfigured() {
  return supabaseAdmin !== null;
}

module.exports = {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
  supabaseAdmin
};
