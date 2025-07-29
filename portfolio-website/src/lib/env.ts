import { z } from 'zod'

/**
 * Environment variables validation schema
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  
  // Site configuration
  NEXT_PUBLIC_SITE_URL: z.string().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Portfolio'),
  NEXT_PUBLIC_SITE_DESCRIPTION: z.string().default('Developer Portfolio'),
  
  // Optional configurations with simple validation
  CONTACT_EMAIL: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // API Security - allow empty strings for development
  API_SECRET_KEY: z.string().optional(),
  CSRF_SECRET: z.string().optional(),
  
  // Rate limiting with defaults
  RATE_LIMIT_MAX: z.string().default('100'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  
  // Analytics and monitoring (optional)
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  
  // Database (if needed)
  DATABASE_URL: z.string().optional(),
  
  // File upload limits
  MAX_FILE_SIZE: z.string().default('5242880'),
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/webp,application/pdf'),
})

/**
 * Validates and parses environment variables
 * Throws an error if validation fails
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(
        (err) => `${err.path.join('.')}: ${err.message}`
      ).join('\n')
      
      console.error('❌ Invalid environment variables:')
      console.error(formattedErrors)
      throw new Error('Environment validation failed')
    }
    throw error
  }
}

// Export validated environment variables
export const env = validateEnv()

// Type for environment variables
export type Env = z.infer<typeof envSchema>

/**
 * Check if we're running in production
 */
export const isProduction = env.NODE_ENV === 'production'

/**
 * Check if we're running in development
 */
export const isDevelopment = env.NODE_ENV === 'development'

/**
 * Check if we're running in staging
 */
export const isStaging = env.NODE_ENV === 'staging'

/**
 * Get the base URL for the application
 */
export function getBaseUrl() {
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`
  return env.NEXT_PUBLIC_SITE_URL
}

/**
 * Sanitize sensitive environment variables for client-side logging
 */
export function getSafeEnvForClient() {
  return {
    NODE_ENV: env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_DESCRIPTION: env.NEXT_PUBLIC_SITE_DESCRIPTION,
    NEXT_PUBLIC_GA_ID: env.NEXT_PUBLIC_GA_ID,
  }
}

/**
 * Email configuration validation
 */
export function validateEmailConfig() {
  const requiredFields = ['CONTACT_EMAIL', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'] as const
  const missingFields = requiredFields.filter(field => !env[field])
  
  if (missingFields.length > 0) {
    throw new Error(`Missing email configuration: ${missingFields.join(', ')}`)
  }
  
  return {
    email: env.CONTACT_EMAIL!,
    host: env.SMTP_HOST!,
    port: parseInt(env.SMTP_PORT!),
    user: env.SMTP_USER!,
    pass: env.SMTP_PASS!,
  }
}

/**
 * Security configuration
 */
export function getSecurityConfig() {
  return {
    apiSecretKey: env.API_SECRET_KEY || generateSecretKey(),
    csrfSecret: env.CSRF_SECRET || generateSecretKey(),
    rateLimitMax: parseInt(env.RATE_LIMIT_MAX || '100'),
    rateLimitWindowMs: parseInt(env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxFileSize: parseInt(env.MAX_FILE_SIZE || '5242880'),
    allowedFileTypes: (env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf').split(','),
  }
}

/**
 * Generate a secure random key for development
 */
function generateSecretKey(): string {
  if (isProduction) {
    throw new Error('Secret keys must be explicitly set in production')
  }
  
  // For development only - generate a random key
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}