import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { env, isDevelopment } from './env'

/**
 * Custom error classes for different types of errors
 */

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean
  public code?: string

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    this.code = code
    
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  public fields?: Record<string, string>

  constructor(message: string, fields?: Record<string, string>) {
    super(message, 400, 'VALIDATION_ERROR')
    this.fields = fields
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden access') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class RateLimitError extends AppError {
  public retryAfter?: number

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED')
    this.retryAfter = retryAfter
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR')
  }
}

export class ExternalServiceError extends AppError {
  public service: string

  constructor(service: string, message: string = 'External service error') {
    super(`${service}: ${message}`, 503, 'EXTERNAL_SERVICE_ERROR')
    this.service = service
  }
}

/**
 * Error logging utility
 */
function logError(error: Error, context?: Record<string, any>) {
  const logData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
  }

  if (isDevelopment) {
    console.error('🚨 Application Error:', logData)
  } else {
    // In production, send to monitoring service (Sentry, etc.)
    console.error(JSON.stringify(logData))
    
    // TODO: Send to external monitoring service
    // Example: Sentry.captureException(error, { extra: context })
  }
}

/**
 * Format error for API response
 */
function formatErrorResponse(error: Error) {
  if (error instanceof AppError) {
    const response: any = {
      success: false,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    }

    // Add specific fields for validation errors
    if (error instanceof ValidationError && error.fields) {
      response.fields = error.fields
    }

    // Add retry after for rate limit errors
    if (error instanceof RateLimitError && error.retryAfter) {
      response.retryAfter = error.retryAfter
    }

    return response
  }

  if (error instanceof ZodError) {
    const fields: Record<string, string> = {}
    error.errors.forEach((err) => {
      const path = err.path.join('.')
      fields[path] = err.message
    })

    return {
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      fields,
      timestamp: new Date().toISOString(),
    }
  }

  // Generic error response
  return {
    success: false,
    error: isDevelopment ? error.message : 'Internal server error',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
  }
}

/**
 * Error handling middleware for API routes
 */
export function withErrorHandling(
  handler: (...args: any[]) => Promise<NextResponse>
) {
  return async (...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      const appError = error as Error
      
      // Log the error
      logError(appError, {
        handler: handler.name,
        args: isDevelopment ? args : undefined,
      })

      // Format and return error response
      const errorResponse = formatErrorResponse(appError)
      const statusCode = error instanceof AppError ? error.statusCode : 500

      return NextResponse.json(errorResponse, { status: statusCode })
    }
  }
}

/**
 * Async function wrapper with error handling
 */
export function catchAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return ((...args: any[]) => {
    return Promise.resolve(fn(...args)).catch((error) => {
      logError(error, { function: fn.name })
      throw error
    })
  }) as T
}

/**
 * Error boundary for React components
 */
export class ErrorBoundary extends Error {
  public componentStack?: string

  constructor(error: Error, errorInfo?: { componentStack: string }) {
    super(error.message)
    this.name = 'ErrorBoundary'
    this.stack = error.stack
    this.componentStack = errorInfo?.componentStack
  }
}

/**
 * Handle and normalize different types of errors
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof ZodError) {
    const fields: Record<string, string> = {}
    error.errors.forEach((err) => {
      const path = err.path.join('.')
      fields[path] = err.message
    })
    return new ValidationError('Validation failed', fields)
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return new AppError((error as Error).message)
  }

  if (typeof error === 'string') {
    return new AppError(error)
  }

  return new AppError('An unknown error occurred')
}

/**
 * Error reporting utilities
 */
export const errorReporting = {
  /**
   * Report error to external service
   */
  report: (error: Error, context?: Record<string, any>) => {
    logError(error, context)
    
    // TODO: Integrate with external error reporting service
    // Example integrations:
    // - Sentry.captureException(error, { extra: context })
    // - LogRocket.captureException(error)
    // - Bugsnag.notify(error, context)
  },

  /**
   * Report performance issues
   */
  reportPerformance: (metric: string, value: number, context?: Record<string, any>) => {
    if (isDevelopment) {
      console.warn(`⚡ Performance Warning: ${metric} = ${value}ms`, context)
    }
    
    // TODO: Send to analytics service
  },

  /**
   * Report security incidents
   */
  reportSecurity: (incident: string, context?: Record<string, any>) => {
    const securityLog = {
      incident,
      timestamp: new Date().toISOString(),
      context,
      severity: 'high',
    }

    console.error('🔒 Security Incident:', securityLog)
    
    // TODO: Send to security monitoring service
    // Example: Send to SIEM, security team notification, etc.
  },
}

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
  VALIDATION: {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_URL: 'Please enter a valid URL',
    TOO_SHORT: 'This field is too short',
    TOO_LONG: 'This field is too long',
    INVALID_FORMAT: 'Invalid format',
  },
  AUTH: {
    UNAUTHORIZED: 'You are not authorized to perform this action',
    SESSION_EXPIRED: 'Your session has expired. Please log in again',
    INVALID_CREDENTIALS: 'Invalid credentials provided',
  },
  RATE_LIMIT: {
    EXCEEDED: 'Too many requests. Please try again later',
    CONTACT_FORM: 'You have submitted too many contact forms. Please try again later',
    NEWSLETTER: 'You have signed up for too many newsletters. Please try again later',
  },
  GENERAL: {
    INTERNAL_ERROR: 'An internal error occurred. Please try again later',
    NOT_FOUND: 'The requested resource was not found',
    NETWORK_ERROR: 'Network error. Please check your connection and try again',
    MAINTENANCE: 'The service is currently under maintenance. Please try again later',
  },
} as const

/**
 * Error handling configuration
 */
export const errorConfig = {
  // Whether to expose error details in production
  exposeErrorDetails: isDevelopment,
  
  // Maximum error message length
  maxErrorMessageLength: 500,
  
  // Error retention for debugging
  errorRetentionDays: 30,
  
  // Rate limiting for error reporting
  maxErrorReportsPerMinute: 10,
}