/**
 * API Configuration
 * 
 * Uses environment variables to configure API endpoints.
 * - Development: Uses VITE_API_BASE_URL from .env.development
 * - Production: Uses VITE_API_BASE_URL from .env.production
 * 
 * Fallback: http://127.0.0.1:8000/api
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  people: `${API_BASE_URL}/people`,
  coaches: `${API_BASE_URL}/coaches`,
  events: `${API_BASE_URL}/events`,
  news: `${API_BASE_URL}/news`,
  products: `${API_BASE_URL}/products`,
  velocityClasses: `${API_BASE_URL}/velocity-classes`,
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    refresh: `${API_BASE_URL}/auth/refresh`,
  },
} as const;

// Helper to get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

// Helper to create auth headers
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};
