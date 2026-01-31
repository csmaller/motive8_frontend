import type { ValidationRule } from '../types';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (supports various formats)
const PHONE_REGEX = /^[+]?[1-9][\d]{0,15}$/;

// Contact Form Validation Schema
export const contactFormValidation = {
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    maxLength: { value: 50, message: 'Name must be less than 50 characters' }
  } as ValidationRule,
  
  email: {
    required: 'Email is required',
    pattern: { value: EMAIL_REGEX, message: 'Please enter a valid email address' }
  } as ValidationRule,
  
  phone: {
    pattern: { value: PHONE_REGEX, message: 'Please enter a valid phone number' }
  } as ValidationRule,
  
  message: {
    required: 'Message is required',
    minLength: { value: 10, message: 'Message must be at least 10 characters' },
    maxLength: { value: 1000, message: 'Message must be less than 1000 characters' }
  } as ValidationRule
};

// Registration Form Validation Schema
export const registrationFormValidation = {
  firstName: {
    required: 'First name is required',
    minLength: { value: 2, message: 'First name must be at least 2 characters' },
    maxLength: { value: 30, message: 'First name must be less than 30 characters' }
  } as ValidationRule,
  
  lastName: {
    required: 'Last name is required',
    minLength: { value: 2, message: 'Last name must be at least 2 characters' },
    maxLength: { value: 30, message: 'Last name must be less than 30 characters' }
  } as ValidationRule,
  
  email: {
    required: 'Email is required',
    pattern: { value: EMAIL_REGEX, message: 'Please enter a valid email address' }
  } as ValidationRule,
  
  phone: {
    required: 'Phone number is required',
    pattern: { value: PHONE_REGEX, message: 'Please enter a valid phone number' }
  } as ValidationRule,
  
  emergencyContact: {
    required: 'Emergency contact name is required',
    minLength: { value: 2, message: 'Emergency contact name must be at least 2 characters' }
  } as ValidationRule,
  
  emergencyPhone: {
    required: 'Emergency contact phone is required',
    pattern: { value: PHONE_REGEX, message: 'Please enter a valid emergency contact phone number' }
  } as ValidationRule,
  
  experience: {
    required: 'Please select your experience level'
  } as ValidationRule,
  
  classPreference: {
    required: 'Please select a class preference'
  } as ValidationRule,
  
  agreeToTerms: {
    validate: (value: boolean) => value || 'You must agree to the terms and conditions'
  } as ValidationRule
};

// Utility functions for validation
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone.replace(/[\s\-()]/g, ''));
};

export const validateRequired = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  return value != null && value !== '';
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

// Form submission helpers
export const formatFormData = <T extends Record<string, unknown>>(data: T): T => {
  const formatted = {} as T;
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (typeof value === 'string') {
      (formatted as Record<string, unknown>)[key] = value.trim();
    } else {
      (formatted as Record<string, unknown>)[key] = value;
    }
  });
  
  return formatted;
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};