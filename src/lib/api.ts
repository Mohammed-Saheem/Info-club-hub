/**
 * API Layer - Exports Supabase-based API
 * 
 * This file re-exports all APIs from supabase-api.ts
 * All database operations now go through Supabase instead of a custom backend.
 */

export {
  // Types
  type User,
  type Event,
  type CreateEventData,
  type EventPhoto,
  type Project,
  type CreateProjectData,
  type TeamMember,
  type CreateTeamMemberData,
  type GalleryPhoto,
  type CreateGalleryPhotoData,
  type ContactSubmission,
  type JoinApplication,
  type CreateApplicationData,
  type AdminStats,
  type PublicStats,
  type AdminUser,
  type CreateUserData,
  type UpdateUserData,

  // APIs
  authAPI,
  eventsAPI,
  projectsAPI,
  teamAPI,
  galleryAPI,
  contactAPI,
  applicationsAPI,
  statsAPI,
  uploadAPI,
  adminUserAPI,
} from './supabase-api';
