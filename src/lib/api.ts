const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Token storage
const getToken = () => localStorage.getItem('auth_token');
const setToken = (token: string) => localStorage.setItem('auth_token', token);
const removeToken = () => localStorage.removeItem('auth_token');

// Fetch wrapper with auth
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'An error occurred');
  }

  return data;
}

// Auth API
export const authAPI = {
  signUp: async (email: string, password: string, fullName?: string) => {
    const data = await fetchAPI<{ user: User; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    setToken(data.token);
    return data;
  },

  signIn: async (email: string, password: string) => {
    const data = await fetchAPI<{ user: User; token: string }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  signOut: () => {
    removeToken();
  },

  getMe: () => fetchAPI<{ user: User }>('/auth/me'),

  updateProfile: (data: { fullName?: string; avatarUrl?: string }) =>
    fetchAPI<{ user: User }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    fetchAPI('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  isAuthenticated: () => !!getToken(),
};

// Events API
export const eventsAPI = {
  getAll: (params?: { featured?: boolean; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.featured) query.set('featured', 'true');
    if (params?.limit) query.set('limit', params.limit.toString());
    return fetchAPI<Event[]>(`/events?${query}`);
  },

  getOne: (id: string) => fetchAPI<Event>(`/events/${id}`),

  create: (data: CreateEventData) =>
    fetchAPI<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateEventData>) =>
    fetchAPI<Event>(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/events/${id}`, { method: 'DELETE' }),

  getPhotos: (eventId: string) => fetchAPI<EventPhoto[]>(`/events/${eventId}/photos`),

  addPhoto: (eventId: string, data: { image_url: string; caption?: string }) =>
    fetchAPI<EventPhoto>(`/events/${eventId}/photos`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deletePhoto: (photoId: string) =>
    fetchAPI(`/events/photos/${photoId}`, { method: 'DELETE' }),
};

// Projects API
export const projectsAPI = {
  getAll: (params?: { featured?: boolean; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.featured) query.set('featured', 'true');
    if (params?.limit) query.set('limit', params.limit.toString());
    return fetchAPI<Project[]>(`/projects?${query}`);
  },

  getOne: (id: string) => fetchAPI<Project>(`/projects/${id}`),

  create: (data: CreateProjectData) =>
    fetchAPI<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateProjectData>) =>
    fetchAPI<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/projects/${id}`, { method: 'DELETE' }),
};

// Team API
export const teamAPI = {
  getAll: () => fetchAPI<TeamMember[]>('/team'),

  getOne: (id: string) => fetchAPI<TeamMember>(`/team/${id}`),

  create: (data: CreateTeamMemberData) =>
    fetchAPI<TeamMember>('/team', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateTeamMemberData>) =>
    fetchAPI<TeamMember>(`/team/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/team/${id}`, { method: 'DELETE' }),

  reorder: (orders: { id: string; display_order: number }[]) =>
    fetchAPI<TeamMember[]>('/team/reorder', {
      method: 'POST',
      body: JSON.stringify({ orders }),
    }),
};

// Gallery API
export const galleryAPI = {
  getAll: (params?: { category?: string; event_id?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.event_id) query.set('event_id', params.event_id);
    if (params?.limit) query.set('limit', params.limit.toString());
    return fetchAPI<GalleryPhoto[]>(`/gallery?${query}`);
  },

  getCategories: () => fetchAPI<string[]>('/gallery/categories'),

  create: (data: CreateGalleryPhotoData) =>
    fetchAPI<GalleryPhoto>('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateGalleryPhotoData>) =>
    fetchAPI<GalleryPhoto>(`/gallery/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/gallery/${id}`, { method: 'DELETE' }),
};

// Contact API
export const contactAPI = {
  submit: (data: { name: string; email: string; message: string }) =>
    fetchAPI('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (params?: { is_read?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.is_read !== undefined) query.set('is_read', params.is_read.toString());
    return fetchAPI<ContactSubmission[]>(`/contact?${query}`);
  },

  markRead: (id: string, is_read: boolean) =>
    fetchAPI<ContactSubmission>(`/contact/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_read }),
    }),

  delete: (id: string) =>
    fetchAPI(`/contact/${id}`, { method: 'DELETE' }),
};

// Applications API
export const applicationsAPI = {
  submit: (data: CreateApplicationData) =>
    fetchAPI('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (params?: { is_reviewed?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.is_reviewed !== undefined) query.set('is_reviewed', params.is_reviewed.toString());
    return fetchAPI<JoinApplication[]>(`/applications?${query}`);
  },

  markReviewed: (id: string, is_reviewed: boolean) =>
    fetchAPI<JoinApplication>(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_reviewed }),
    }),

  delete: (id: string) =>
    fetchAPI(`/applications/${id}`, { method: 'DELETE' }),
};

// Stats API
export const statsAPI = {
  getAdminStats: () => fetchAPI<AdminStats>('/stats'),
  getPublicStats: () => fetchAPI<PublicStats>('/stats/public'),
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
    return data;
  },

  deleteImage: (filename: string) =>
    fetchAPI(`/upload/${filename}`, { method: 'DELETE' }),
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
