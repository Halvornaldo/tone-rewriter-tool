import { z } from 'zod'

/**
 * Common validation utilities and schemas
 */

// Base field validations
const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters')

const subjectSchema = z.enum(['general', 'project', 'collaboration', 'other'], {
  errorMap: () => ({ message: 'Please select a valid subject' })
})

const messageSchema = z.string()
  .min(10, 'Message must be at least 10 characters')
  .max(2000, 'Message must be less than 2000 characters')

const honeypotSchema = z.string().max(0, 'Invalid submission')

// Sanitization utilities
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: nameSchema.transform(sanitizeString),
  email: emailSchema.transform(sanitizeEmail),
  subject: subjectSchema,
  message: messageSchema.transform(sanitizeString),
  budget: z.string()
    .max(100, 'Budget field must be less than 100 characters')
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
  timeline: z.string()
    .max(100, 'Timeline field must be less than 100 characters')
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
  honeypot: honeypotSchema.optional().default(''),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

/**
 * Newsletter subscription validation schema
 */
export const newsletterSchema = z.object({
  email: emailSchema.transform(sanitizeEmail),
  name: z.string()
    .max(100, 'Name must be less than 100 characters')
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
  interests: z.array(z.string()).max(10, 'Too many interests selected').optional(),
  source: z.string().max(50, 'Source must be less than 50 characters').optional(),
  honeypot: honeypotSchema.optional().default(''),
})

export type NewsletterData = z.infer<typeof newsletterSchema>

/**
 * Search/Filter validation schemas
 */
export const searchParamsSchema = z.object({
  query: z.string()
    .max(200, 'Search query must be less than 200 characters')
    .transform(sanitizeString)
    .optional(),
  category: z.string()
    .max(50, 'Category must be less than 50 characters')
    .transform(sanitizeString)
    .optional(),
  tag: z.string()
    .max(50, 'Tag must be less than 50 characters')
    .transform(sanitizeString)
    .optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['date', 'title', 'views', 'relevance']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type SearchParams = z.infer<typeof searchParamsSchema>

/**
 * File upload validation schema
 */
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a valid file' })
    .refine(file => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
      'File type must be JPEG, PNG, WebP, or PDF'
    ),
  uploadType: z.enum(['image', 'document', 'avatar'], {
    errorMap: () => ({ message: 'Please select a valid upload type' })
  }),
  metadata: z.record(z.string()).optional(),
})

export type FileUploadData = z.infer<typeof fileUploadSchema>

/**
 * API response schemas
 */
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  timestamp: z.date().default(() => new Date()),
})

export type ApiResponse<T = any> = Omit<z.infer<typeof apiResponseSchema>, 'data'> & {
  data?: T
}

/**
 * Rate limiting validation
 */
export const rateLimitSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  windowMs: z.number().int().positive(),
  maxRequests: z.number().int().positive(),
})

/**
 * Validation error formatting
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  
  error.errors.forEach((err) => {
    const path = err.path.join('.')
    errors[path] = err.message
  })
  
  return errors
}

/**
 * Safe validation wrapper that returns result and errors
 */
export function safeValidate<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): {
  success: boolean
  data?: z.infer<T>
  errors?: Record<string, string>
} {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatValidationErrors(error) }
    }
    return { success: false, errors: { general: 'Validation failed' } }
  }
}

/**
 * URL validation
 */
export const urlSchema = z.string().url('Please enter a valid URL')

/**
 * Slug validation (for URLs and IDs)
 */
export const slugSchema = z.string()
  .min(1, 'Slug is required')
  .max(100, 'Slug must be less than 100 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')

/**
 * Password validation (if needed for admin features)
 */
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')

/**
 * Content validation (for blog posts, projects, etc.)
 */
export const contentSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .transform(sanitizeString),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
    .transform(sanitizeString),
  content: z.string()
    .min(1, 'Content is required')
    .max(50000, 'Content must be less than 50,000 characters'),
  tags: z.array(z.string().max(30)).max(10, 'Maximum 10 tags allowed'),
  category: z.string().max(50, 'Category must be less than 50 characters').optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
})

export type ContentData = z.infer<typeof contentSchema>