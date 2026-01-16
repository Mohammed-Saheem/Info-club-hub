/**
 * Supabase API Layer - Replaces the custom backend
 * 
 * This file provides all the database operations using Supabase
 * instead of the custom Node.js backend.
 */

import { supabase } from '@/integrations/supabase/client';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export interface User {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  avatar_url: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  venue: string | null;
  banner_image: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  event_date: string;
  venue?: string;
  banner_image?: string;
  is_featured?: boolean;
}

export interface EventPhoto {
  id: string;
  event_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  title: string;
  description?: string;
  tech_stack?: string[];
  github_url?: string;
  demo_url?: string;
  image_url?: string;
  is_featured?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  email: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTeamMemberData {
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  github_url?: string;
  email?: string;
  display_order?: number;
}

export interface GalleryPhoto {
  id: string;
  title: string | null;
  image_url: string;
  category: string | null;
  event_id: string | null;
  created_at: string;
}

export interface CreateGalleryPhotoData {
  image_url: string;
  title?: string;
  category?: string;
  event_id?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface JoinApplication {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  year_of_study: string | null;
  department: string | null;
  why_join: string | null;
  skills: string | null;
  is_reviewed: boolean;
  created_at: string;
}

export interface CreateApplicationData {
  name: string;
  email: string;
  phone?: string;
  year_of_study?: string;
  department?: string;
  why_join?: string;
  skills?: string;
}

export interface AdminStats {
  events: number;
  projects: number;
  team: number;
  gallery: number;
  unread_contacts: number;
  pending_applications: number;
}

export interface PublicStats {
  events: number;
  projects: number;
  members: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper to check Supabase availability
// ═══════════════════════════════════════════════════════════════════════════

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.');
  }
  return supabase;
}

// ═══════════════════════════════════════════════════════════════════════════
// Auth API
// ═══════════════════════════════════════════════════════════════════════════

export const authAPI = {
  signUp: async (email: string, password: string, fullName?: string) => {
    const sb = ensureSupabase();
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) throw error;
    
    // Get the profile
    const profile = await authAPI.getMe();
    return { user: profile, session: data.session };
  },

  signIn: async (email: string, password: string) => {
    const sb = ensureSupabase();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    const profile = await authAPI.getMe();
    return { user: profile, session: data.session };
  },

  signOut: async () => {
    const sb = ensureSupabase();
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  },

  getMe: async (): Promise<User> => {
    const sb = ensureSupabase();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile, error } = await sb
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) throw error;
    return profile as User;
  },

  updateProfile: async (data: { fullName?: string; avatarUrl?: string }) => {
    const sb = ensureSupabase();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile, error } = await sb
      .from('profiles')
      .update({
        full_name: data.fullName,
        avatar_url: data.avatarUrl
      })
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return { user: profile as User };
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const sb = ensureSupabase();
    // Note: Supabase doesn't require current password for update
    const { error } = await sb.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return { success: true };
  },

  isAuthenticated: async (): Promise<boolean> => {
    const sb = ensureSupabase();
    const { data: { session } } = await sb.auth.getSession();
    return !!session;
  },

  getSession: async () => {
    const sb = ensureSupabase();
    const { data: { session } } = await sb.auth.getSession();
    return session;
  },

  onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
    const sb = ensureSupabase();
    return sb.auth.onAuthStateChange(callback);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Events API
// ═══════════════════════════════════════════════════════════════════════════

export const eventsAPI = {
  getAll: async (params?: { featured?: boolean; limit?: number }): Promise<Event[]> => {
    const sb = ensureSupabase();
    let query = sb.from('events').select('*').order('event_date', { ascending: false });
    
    if (params?.featured) {
      query = query.eq('is_featured', true);
    }
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Event[];
  },

  getOne: async (id: string): Promise<Event> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Event;
  },

  create: async (eventData: CreateEventData): Promise<Event> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('events')
      .insert(eventData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Event;
  },

  update: async (id: string, eventData: Partial<CreateEventData>): Promise<Event> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Event;
  },

  delete: async (id: string): Promise<void> => {
    const sb = ensureSupabase();
    const { error } = await sb.from('events').delete().eq('id', id);
    if (error) throw error;
  },

  getPhotos: async (eventId: string): Promise<EventPhoto[]> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('event_photos')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as EventPhoto[];
  },

  addPhoto: async (eventId: string, photoData: { image_url: string; caption?: string }): Promise<EventPhoto> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('event_photos')
      .insert({ event_id: eventId, ...photoData })
      .select()
      .single();
    
    if (error) throw error;
    return data as EventPhoto;
  },

  deletePhoto: async (photoId: string): Promise<void> => {
    const sb = ensureSupabase();
    const { error } = await sb.from('event_photos').delete().eq('id', photoId);
    if (error) throw error;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Projects API
// ═══════════════════════════════════════════════════════════════════════════

export const projectsAPI = {
  getAll: async (params?: { featured?: boolean; limit?: number }): Promise<Project[]> => {
    const sb = ensureSupabase();
    let query = sb.from('projects').select('*').order('created_at', { ascending: false });
    
    if (params?.featured) {
      query = query.eq('is_featured', true);
    }
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Project[];
  },

  getOne: async (id: string): Promise<Project> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  create: async (projectData: CreateProjectData): Promise<Project> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('projects')
      .insert(projectData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  update: async (id: string, projectData: Partial<CreateProjectData>): Promise<Project> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  delete: async (id: string): Promise<void> => {
    const sb = ensureSupabase();
    const { error } = await sb.from('projects').delete().eq('id', id);
    if (error) throw error;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Team API
// ═══════════════════════════════════════════════════════════════════════════

export const teamAPI = {
  getAll: async (): Promise<TeamMember[]> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data as TeamMember[];
  },

  getOne: async (id: string): Promise<TeamMember> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as TeamMember;
  },

  create: async (memberData: CreateTeamMemberData): Promise<TeamMember> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('team_members')
      .insert(memberData)
      .select()
      .single();
    
    if (error) throw error;
    return data as TeamMember;
  },

  update: async (id: string, memberData: Partial<CreateTeamMemberData>): Promise<TeamMember> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('team_members')
      .update(memberData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as TeamMember;
  },

  delete: async (id: string): Promise<void> => {
    const sb = ensureSupabase();
    const { error } = await sb.from('team_members').delete().eq('id', id);
    if (error) throw error;
  },

  reorder: async (orders: { id: string; display_order: number }[]): Promise<TeamMember[]> => {
    const sb = ensureSupabase();
    
    // Update each member's display_order
    for (const order of orders) {
      const { error } = await sb
        .from('team_members')
        .update({ display_order: order.display_order })
        .eq('id', order.id);
      if (error) throw error;
    }
    
    // Return updated list
    return teamAPI.getAll();
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Gallery API
// ═══════════════════════════════════════════════════════════════════════════

export const galleryAPI = {
  getAll: async (params?: { category?: string; event_id?: string; limit?: number }): Promise<GalleryPhoto[]> => {
    const sb = ensureSupabase();
    let query = sb.from('gallery_photos').select('*').order('created_at', { ascending: false });
    
    if (params?.category) {
      query = query.eq('category', params.category);
    }
    if (params?.event_id) {
      query = query.eq('event_id', params.event_id);
    }
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as GalleryPhoto[];
  },

  getCategories: async (): Promise<string[]> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('gallery_photos')
      .select('category')
      .not('category', 'is', null);
    
    if (error) throw error;
    
    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category).filter(Boolean))];
    return categories as string[];
  },

  create: async (photoData: CreateGalleryPhotoData): Promise<GalleryPhoto> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('gallery_photos')
      .insert(photoData)
      .select()
      .single();
    
    if (error) throw error;
    return data as GalleryPhoto;
  },

  update: async (id: string, photoData: Partial<CreateGalleryPhotoData>): Promise<GalleryPhoto> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('gallery_photos')
      .update(photoData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as GalleryPhoto;
  },

  delete: async (id: string): Promise<void> => {
    const sb = ensureSupabase();
    const { error } = await sb.from('gallery_photos').delete().eq('id', id);
    if (error) throw error;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Contact API
// ═══════════════════════════════════════════════════════════════════════════

export const contactAPI = {
  submit: async (contactData: { name: string; email: string; message: string }): Promise<void> => {
    const sb = ensureSupabase();
    const { error } = await sb.from('contact_submissions').insert(contactData);
    if (error) throw error;
  },

  getAll: async (params?: { is_read?: boolean }): Promise<ContactSubmission[]> => {
    const sb = ensureSupabase();
    let query = sb.from('contact_submissions').select('*').order('created_at', { ascending: false });
    
    if (params?.is_read !== undefined) {
      query = query.eq('is_read', params.is_read);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as ContactSubmission[];
  },

  markRead: async (id: string, is_read: boolean): Promise<ContactSubmission> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('contact_submissions')
      .update({ is_read })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as ContactSubmission;
  },

  delete: async (id: string): Promise<void> => {
    const sb = ensureSupabase();
    const { error } = await sb.from('contact_submissions').delete().eq('id', id);
    if (error) throw error;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Applications API
// ═══════════════════════════════════════════════════════════════════════════

export const applicationsAPI = {
  submit: async (appData: CreateApplicationData): Promise<void> => {
    const sb = ensureSupabase();
    const { error } = await sb.from('join_applications').insert(appData);
    if (error) throw error;
  },

  getAll: async (params?: { is_reviewed?: boolean }): Promise<JoinApplication[]> => {
    const sb = ensureSupabase();
    let query = sb.from('join_applications').select('*').order('created_at', { ascending: false });
    
    if (params?.is_reviewed !== undefined) {
      query = query.eq('is_reviewed', params.is_reviewed);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as JoinApplication[];
  },

  markReviewed: async (id: string, is_reviewed: boolean): Promise<JoinApplication> => {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('join_applications')
      .update({ is_reviewed })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as JoinApplication;
  },

  delete: async (id: string): Promise<void> => {
    const sb = ensureSupabase();
    const { error } = await sb.from('join_applications').delete().eq('id', id);
    if (error) throw error;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Stats API
// ═══════════════════════════════════════════════════════════════════════════

export const statsAPI = {
  getAdminStats: async (): Promise<AdminStats> => {
    const sb = ensureSupabase();
    
    const [events, projects, team, gallery, contacts, applications] = await Promise.all([
      sb.from('events').select('id', { count: 'exact', head: true }),
      sb.from('projects').select('id', { count: 'exact', head: true }),
      sb.from('team_members').select('id', { count: 'exact', head: true }),
      sb.from('gallery_photos').select('id', { count: 'exact', head: true }),
      sb.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('is_read', false),
      sb.from('join_applications').select('id', { count: 'exact', head: true }).eq('is_reviewed', false),
    ]);
    
    return {
      events: events.count || 0,
      projects: projects.count || 0,
      team: team.count || 0,
      gallery: gallery.count || 0,
      unread_contacts: contacts.count || 0,
      pending_applications: applications.count || 0,
    };
  },

  getPublicStats: async (): Promise<PublicStats> => {
    const sb = ensureSupabase();
    
    const [events, projects, team] = await Promise.all([
      sb.from('events').select('id', { count: 'exact', head: true }),
      sb.from('projects').select('id', { count: 'exact', head: true }),
      sb.from('team_members').select('id', { count: 'exact', head: true }),
    ]);
    
    return {
      events: events.count || 0,
      projects: projects.count || 0,
      members: team.count || 0,
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Upload API (Using Supabase Storage)
// ═══════════════════════════════════════════════════════════════════════════

export const uploadAPI = {
  uploadImage: async (file: File, bucket: string = 'gallery'): Promise<{ url: string; filename: string }> => {
    const sb = ensureSupabase();
    
    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${crypto.randomUUID()}.${ext}`;
    
    const { error } = await sb.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = sb.storage.from(bucket).getPublicUrl(filename);
    
    return { url: urlData.publicUrl, filename };
  },

  deleteImage: async (filename: string, bucket: string = 'gallery'): Promise<void> => {
    const sb = ensureSupabase();
    const { error } = await sb.storage.from(bucket).remove([filename]);
    if (error) throw error;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Admin User API (Calls backend which uses service_role key)
// ═══════════════════════════════════════════════════════════════════════════

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface AdminUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
  created_at?: string;
  last_sign_in_at?: string;
  full_name: string | null;
  is_admin: boolean;
  avatar_url?: string | null;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName?: string;
  isAdmin?: boolean;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  fullName?: string;
  isAdmin?: boolean;
}

/**
 * Get the auth token from Supabase session
 */
async function getAuthToken(): Promise<string> {
  const sb = ensureSupabase();
  const { data: { session } } = await sb.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }
  return session.access_token;
}

/**
 * Admin User Management API
 * 
 * These functions call the backend API which uses the Supabase service_role key
 * to perform admin operations. This avoids the "User not allowed" error that
 * occurs when trying to use supabase.auth.admin functions from the client.
 */
export const adminUserAPI = {
  /**
   * List all users
   */
  listUsers: async (): Promise<AdminUser[]> => {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to list users');
    }
    
    const { users } = await response.json();
    return users;
  },

  /**
   * Get a single user by ID
   */
  getUser: async (id: string): Promise<AdminUser> => {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get user');
    }
    
    const { user } = await response.json();
    return user;
  },

  /**
   * Create a new user with confirmed email
   */
  createUser: async (data: CreateUserData): Promise<AdminUser> => {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create user');
    }
    
    const { user } = await response.json();
    return user;
  },

  /**
   * Update an existing user
   */
  updateUser: async (id: string, data: UpdateUserData): Promise<AdminUser> => {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to update user');
    }
    
    const { user } = await response.json();
    return user;
  },

  /**
   * Delete a user
   */
  deleteUser: async (id: string): Promise<void> => {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to delete user');
    }
  },

  /**
   * Invite a user by email (sends magic link)
   */
  inviteUser: async (email: string): Promise<AdminUser> => {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/api/admin/users/invite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to invite user');
    }
    
    const { user } = await response.json();
    return user;
  },

  /**
   * Reset a user's password (generates recovery link)
   */
  resetUserPassword: async (id: string): Promise<{ message: string; resetLink?: string }> => {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}/reset-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to reset password');
    }
    
    return response.json();
  }
};
