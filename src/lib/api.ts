import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Helper function to handle Supabase errors
function handleError(error: any): never {
  throw new Error(error?.message || 'An error occurred');
}

// Events API
export const eventsAPI = {
  getAll: async (params?: { featured?: boolean; limit?: number }) => {
    if (!supabase) throw new Error("Supabase is not configured");
    
    let query = supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });

    if (params?.featured) {
      query = query.eq("is_featured", true);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) handleError(error);
    return data || [];
  },

  getOne: async (id: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();
    if (error) handleError(error);
    return data;
  },

  create: async (data: CreateEventData) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("events")
      .insert(data)
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  update: async (id: string, data: Partial<CreateEventData>) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("events")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  delete: async (id: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);
    if (error) handleError(error);
  },

  getPhotos: async (eventId: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("event_photos")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });
    if (error) handleError(error);
    return data || [];
  },

  addPhoto: async (eventId: string, data: { image_url: string; caption?: string }) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("event_photos")
      .insert({ ...data, event_id: eventId })
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  deletePhoto: async (photoId: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase
      .from("event_photos")
      .delete()
      .eq("id", photoId);
    if (error) handleError(error);
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (params?: { featured?: boolean; limit?: number }) => {
    if (!supabase) throw new Error("Supabase is not configured");
    
    let query = supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (params?.featured) {
      query = query.eq("is_featured", true);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) handleError(error);
    return data || [];
  },

  getOne: async (id: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    if (error) handleError(error);
    return data;
  },

  create: async (data: CreateProjectData) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("projects")
      .insert(data)
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  update: async (id: string, data: Partial<CreateProjectData>) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("projects")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  delete: async (id: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);
    if (error) handleError(error);
  },
};

// Team API
export const teamAPI = {
  getAll: async () => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) handleError(error);
    return data || [];
  },

  getOne: async (id: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", id)
      .single();
    if (error) handleError(error);
    return data;
  },

  create: async (data: CreateTeamMemberData) => {
    if (!supabase) throw new Error("Supabase is not configured");
    
    // Get current max display_order
    const { data: members } = await supabase
      .from("team_members")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1);
    
    const displayOrder = members && members.length > 0 
      ? (members[0].display_order || 0) + 1 
      : 0;

    const { data: result, error } = await supabase
      .from("team_members")
      .insert({ ...data, display_order: displayOrder })
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  update: async (id: string, data: Partial<CreateTeamMemberData>) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("team_members")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  delete: async (id: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", id);
    if (error) handleError(error);
  },

  reorder: async (orders: { id: string; display_order: number }[]) => {
    if (!supabase) throw new Error("Supabase is not configured");
    // Update each member's display_order
    const updates = orders.map(order =>
      supabase
        .from("team_members")
        .update({ display_order: order.display_order })
        .eq("id", order.id)
    );
    await Promise.all(updates);
    return teamAPI.getAll();
  },
};

// Gallery API
export const galleryAPI = {
  getAll: async (params?: { category?: string; event_id?: string; limit?: number }) => {
    if (!supabase) throw new Error("Supabase is not configured");
    
    let query = supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (params?.category) {
      query = query.eq("category", params.category);
    }

    if (params?.event_id) {
      query = query.eq("event_id", params.event_id);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) handleError(error);
    return data || [];
  },

  getCategories: async () => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("category");
    if (error) handleError(error);
    const categories = new Set((data || []).map(p => p.category).filter(Boolean));
    return Array.from(categories) as string[];
  },

  create: async (data: CreateGalleryPhotoData) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("gallery_photos")
      .insert(data)
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  update: async (id: string, data: Partial<CreateGalleryPhotoData>) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("gallery_photos")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  delete: async (id: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase
      .from("gallery_photos")
      .delete()
      .eq("id", id);
    if (error) handleError(error);
  },
};

// Contact API
export const contactAPI = {
  submit: async (data: { name: string; email: string; message: string }) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("contact_submissions")
      .insert({ ...data, is_read: false })
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  getAll: async (params?: { is_read?: boolean }) => {
    if (!supabase) throw new Error("Supabase is not configured");
    
    let query = supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (params?.is_read !== undefined) {
      query = query.eq("is_read", params.is_read);
    }

    const { data, error } = await query;
    if (error) handleError(error);
    return data || [];
  },

  markRead: async (id: string, is_read: boolean) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("contact_submissions")
      .update({ is_read })
      .eq("id", id)
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  delete: async (id: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);
    if (error) handleError(error);
  },
};

// Applications API
export const applicationsAPI = {
  submit: async (data: CreateApplicationData) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("join_applications")
      .insert({ ...data, is_reviewed: false })
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  getAll: async (params?: { is_reviewed?: boolean }) => {
    if (!supabase) throw new Error("Supabase is not configured");
    
    let query = supabase
      .from("join_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (params?.is_reviewed !== undefined) {
      query = query.eq("is_reviewed", params.is_reviewed);
    }

    const { data, error } = await query;
    if (error) handleError(error);
    return data || [];
  },

  markReviewed: async (id: string, is_reviewed: boolean) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("join_applications")
      .update({ is_reviewed })
      .eq("id", id)
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  delete: async (id: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase
      .from("join_applications")
      .delete()
      .eq("id", id);
    if (error) handleError(error);
  },
};

// Users API (Admin only)
export const usersAPI = {
  getAll: async () => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) handleError(error);
    return data || [];
  },

  create: async (data: { email: string; password: string; fullName?: string; isAdmin?: boolean }) => {
    // Call backend API endpoint for user creation
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/auth/admin/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create user');
    }

    return await response.json();
  },

  update: async (userId: string, data: Partial<{ full_name: string; is_admin: boolean }>) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: result, error } = await supabase
      .from("profiles")
      .update(data)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) handleError(error);
    return result;
  },

  delete: async (userId: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    // Note: Deleting from profiles will cascade delete auth user if foreign key is set up
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", userId);
    if (error) handleError(error);
  },
};

// Helper function to get auth token
async function getAuthToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

// Stats API
export const statsAPI = {
  getAdminStats: async () => {
    if (!supabase) throw new Error("Supabase is not configured");
    
    const [events, projects, team, gallery, contacts, applications] = await Promise.all([
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("team_members").select("*", { count: "exact", head: true }),
      supabase.from("gallery_photos").select("*", { count: "exact", head: true }),
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("join_applications").select("*", { count: "exact", head: true }).eq("is_reviewed", false),
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

  getPublicStats: async () => {
    if (!supabase) throw new Error("Supabase is not configured");
    
    const [events, projects, team] = await Promise.all([
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("team_members").select("*", { count: "exact", head: true }),
    ]);

    return {
      events: events.count || 0,
      projects: projects.count || 0,
      members: team.count || 0,
    };
  },
};

// Upload API - Using Supabase Storage
export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    if (!supabase) throw new Error("Supabase is not configured");
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) handleError(error);

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return { url: publicUrl, filename: fileName };
  },

  deleteImage: async (filename: string) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase.storage
      .from('images')
      .remove([`uploads/${filename}`]);
    if (error) handleError(error);
  },
};

// Types
export interface User {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  avatar_url: string | null;
}

export type Event = Tables<'events'>;
export type CreateEventData = TablesInsert<'events'>;
export type EventPhoto = Tables<'event_photos'>;

export type Project = Tables<'projects'>;
export type CreateProjectData = TablesInsert<'projects'>;

export type TeamMember = Tables<'team_members'>;
export type CreateTeamMemberData = Omit<TablesInsert<'team_members'>, 'display_order'>;

export type GalleryPhoto = Tables<'gallery_photos'>;
export type CreateGalleryPhotoData = TablesInsert<'gallery_photos'>;

export type ContactSubmission = Tables<'contact_submissions'>;

export type JoinApplication = Tables<'join_applications'>;
export type CreateApplicationData = Omit<TablesInsert<'join_applications'>, 'is_reviewed'>;

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

export type UserProfile = Tables<'profiles'>;
