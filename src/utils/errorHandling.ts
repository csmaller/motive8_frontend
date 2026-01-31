// Error handling utilities for the application

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export class NetworkError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'NETWORK_ERROR') {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ValidationError extends Error {
  field?: string;
  code: string;

  constructor(message: string, field?: string, code: string = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
  }
}

export class FormSubmissionError extends Error {
  code: string;
  statusCode?: number;

  constructor(message: string, code: string = 'FORM_SUBMISSION_ERROR', statusCode?: number) {
    super(message);
    this.name = 'FormSubmissionError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Handles different types of errors and returns user-friendly messages
 */
export const handleError = (error: unknown): AppError => {
  console.error('Error occurred:', error);

  // Network errors
  if (error instanceof NetworkError) {
    return {
      message: getNetworkErrorMessage(error.statusCode),
      code: error.code,
      statusCode: error.statusCode
    };
  }

  // Validation errors
  if (error instanceof ValidationError) {
    return {
      message: error.message,
      code: error.code,
      details: { field: error.field }
    };
  }

  // Form submission errors
  if (error instanceof FormSubmissionError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    };
  }

  // Generic Error objects
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'GENERIC_ERROR'
    };
  }

  // Unknown error types
  return {
    message: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR',
    details: error
  };
};

/**
 * Returns user-friendly messages for network errors based on status codes
 */
const getNetworkErrorMessage = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return 'The request was invalid. Please check your information and try again.';
    case 401:
      return 'You are not authorized to perform this action. Please log in and try again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found. Please try again later.';
    case 408:
      return 'The request timed out. Please check your connection and try again.';
    case 409:
      return 'There was a conflict with your request. Please refresh and try again.';
    case 422:
      return 'The information provided is invalid. Please check your entries and try again.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'A server error occurred. Our team has been notified. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'The service is temporarily unavailable. Please try again in a few minutes.';
    default:
      if (statusCode >= 400 && statusCode < 500) {
        return 'There was a problem with your request. Please check your information and try again.';
      } else if (statusCode >= 500) {
        return 'A server error occurred. Please try again later.';
      }
      return 'A network error occurred. Please check your connection and try again.';
  }
};

/**
 * Simulates network requests with error handling for development
 */
export const simulateNetworkRequest = async <T>(
  data: T,
  options: {
    delay?: number;
    failureRate?: number;
    errorType?: 'network' | 'validation' | 'server';
  } = {}
): Promise<T> => {
  const { delay = 1000, failureRate = 0, errorType = 'network' } = options;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate random failures for testing
  if (Math.random() < failureRate) {
    switch (errorType) {
      case 'network':
        throw new NetworkError('Network connection failed', 500);
      case 'validation':
        throw new ValidationError('Invalid data provided');
      case 'server':
        throw new FormSubmissionError('Server error occurred', 'SERVER_ERROR', 500);
      default:
        throw new Error('Simulated error for testing');
    }
  }

  return data;
};

/**
 * Retry mechanism for failed operations
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on validation errors or client errors (4xx)
      if (error instanceof ValidationError || 
          (error instanceof NetworkError && error.statusCode >= 400 && error.statusCode < 500)) {
        throw error;
      }

      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
};

/**
 * Logs errors to external service (placeholder for real implementation)
 */
export const logErrorToService = (error: Error, context?: Record<string, unknown>): void => {
  // In a real application, you would send this to your error tracking service
  // Examples: Sentry, LogRocket, Bugsnag, etc.
  
  const errorData = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    context
  };

  console.error('Error logged:', errorData);
  
  // Example implementation:
  // fetch('/api/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorData)
  // }).catch(console.error);
};