// Form Data Interfaces
export interface ContactFormData extends Record<string, unknown> {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface RegistrationFormData extends Record<string, unknown> {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  classPreference: string;
  medicalConditions?: string;
  agreeToTerms: boolean;
}

// Content Models
export interface Coach {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  image?: string;
  certifications: string[];
  yearsExperience: number;
  email?: string;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  type: 'race' | 'training' | 'social';
  registrationRequired: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  registrationDeadline?: Date;
  cost?: number;
  imageUrl?: string;
}

export interface VelocityClass {
  id: string;
  name: string;
  description: string;
  schedule: string;
  duration: string;
  maxParticipants: number;
  currentEnrollment: number;
  instructor: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  cost: number;
  location: string;
  equipment?: string[];
  prerequisites?: string[];
}

// Store Models
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'apparel' | 'gear' | 'accessories' | 'nutrition';
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  sizes?: string[];
  colors?: string[];
  rating: number;
  reviewCount: number;
  features?: string[];
  brand?: string;
}

// News Models
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  category: 'race-results' | 'training-tips' | 'team-news' | 'events' | 'general';
  featuredImage?: string;
  tags: string[];
  featured: boolean;
  readTime: number;
}

// User Management Models

/**
 * Base Person interface - represents personal information
 * This maps to the 'person' table in the database
 */
export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  image?: string;
  specializations?: string[]; // For coaches - their areas of expertise
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User interface - represents authentication and account information
 * This maps to the 'user' table in the database
 */
export interface User {
  id: string;
  personId: string; // Foreign key to Person
  username: string;
  email: string;
  lastLogin?: Date;
  createdAt: Date;
  user_type:string;
  updatedAt: Date;
}

/**
 * Combined User with Person data - used for display and management
 * This represents a JOIN between user and person tables
 */
export interface UserProfile extends User {
  person: Person;
}

/**
 * Computed properties for user display
 */
export interface UserDisplayInfo {
  fullName: string;
  initials: string;
  isCoach: boolean;
  isAdmin: boolean;
}

/**
 * Helper type for creating new users
 */
export interface CreateUserData {
  // Person data
  firstName: string;
  lastName: string;
  phone?: string;
  image?: string;
  imageFile?: File; // Actual file for upload
  specializations?: string[];
  // User data
  username: string;
  email: string;
  password: string;
}

/**
 * Helper type for updating users
 */
export interface UpdateUserData {
  // Person data
  firstName?: string;
  lastName?: string;
  phone?: string;
  image?: string;
  imageFile?: File; // Actual file for upload
  specializations?: string[];
  // User data
  email?: string;
  password?: string;
}

// Page Content Model
export interface PageContent {
  title: string;
  description: string;
  image?: string;
  content: React.ReactNode;
}

// Navigation Models
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  description: string;
}

// Form Validation Models
export interface FormError {
  field: string;
  message: string;
  type: 'required' | 'pattern' | 'minLength' | 'maxLength' | 'custom';
}

export interface ValidationRule {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: unknown) => boolean | string;
}

// API Response Models
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Carousel Models
export interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

// Component Props Models
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

// State Management Models
export interface NavigationState {
  isMenuOpen: boolean;
  currentPath: string;
}

export interface AppState {
  navigation: NavigationState;
  loading: boolean;
  error: string | null;
}

// Utility Types
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type EventType = 'race' | 'training' | 'social';
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
export type ProductCategory = 'apparel' | 'gear' | 'accessories' | 'nutrition';
export type NewsCategory = 'race-results' | 'training-tips' | 'team-news' | 'events' | 'general';
export type NewsStatus = 'draft' | 'published' | 'archived';

// Constants
export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'race', label: 'Race' },
  { value: 'training', label: 'Training' },
  { value: 'social', label: 'Social' }
];

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'apparel', label: 'Apparel' },
  { value: 'gear', label: 'Gear' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'nutrition', label: 'Nutrition' }
];

export const NEWS_CATEGORIES: { value: NewsCategory; label: string }[] = [
  { value: 'race-results', label: 'Race Results' },
  { value: 'training-tips', label: 'Training Tips' },
  { value: 'team-news', label: 'Team News' },
  { value: 'events', label: 'Events' },
  { value: 'general', label: 'General' }
];

export const NEWS_STATUSES: { value: NewsStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' }
];

// User/Person Utility Functions
export const getUserDisplayInfo = (userProfile: UserProfile): UserDisplayInfo => {
  const fullName = `${userProfile.person.firstName} ${userProfile.person.lastName}`;
  const initials = `${userProfile.person.firstName[0]}${userProfile.person.lastName[0]}`;
  const isCoach = userProfile.person.specializations && userProfile.person.specializations.length > 0;
  const isAdmin = userProfile.email === 'admin@m8team.com' || userProfile.email.endsWith('@m8team.com');
  
  return {
    fullName,
    initials,
    isCoach: !!isCoach,
    isAdmin
  };
};

export const isUserCoach = (userProfile: UserProfile): boolean => {
  return !!(userProfile.person.specializations && userProfile.person.specializations.length > 0);
};

export const isUserAdmin = (userProfile: UserProfile): boolean => {
  return userProfile.email === 'admin@m8team.com' || userProfile.email.endsWith('@m8team.com');
};

// Type aliases for backward compatibility (deprecated - use UserProfile instead)
/** @deprecated Use UserProfile instead */
export type UserWithPerson = UserProfile;