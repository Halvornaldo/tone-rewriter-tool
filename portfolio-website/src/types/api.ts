export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: Date
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
  details?: Record<string, any>
}

export interface ContactFormData {
  name: string
  email: string
  subject: 'general' | 'project' | 'collaboration' | 'other'
  message: string
  budget?: string
  timeline?: string
  honeypot?: string // Anti-spam field
}

export interface NewsletterSubscription {
  email: string
  name?: string
  interests?: string[]
  source?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams {
  query: string
  filters?: Record<string, any>
  page?: number
  limit?: number
}

export interface FileUpload {
  file: File
  uploadType: 'image' | 'document' | 'video' | 'other'
  metadata?: Record<string, any>
}

export interface UploadResponse {
  url: string
  filename: string
  size: number
  type: string
  metadata?: Record<string, any>
}

// Rate limiting types
export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

export interface RateLimitInfo {
  remaining: number
  resetTime: Date
  totalHits: number
}

// Analytics types
export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  sessionId?: string
  timestamp?: Date
}

export interface PageView {
  path: string
  title: string
  referrer?: string
  userAgent?: string
  userId?: string
  sessionId?: string
  timestamp: Date
}

// SEO types
export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  robots?: string
  structuredData?: Record<string, any>
}

// Form validation types
export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface FormState<T = any> {
  data: T
  errors: ValidationError[]
  isSubmitting: boolean
  isValid: boolean
  touched: Record<string, boolean>
}

// Common utility types
export type ID = string | number

export type Timestamp = Date | string

export type Status = 'idle' | 'loading' | 'success' | 'error'

export type Theme = 'light' | 'dark' | 'system'

export type Language = 'en' | 'no' | 'es' | 'fr' | 'de'

export interface UserPreferences {
  theme: Theme
  language: Language
  emailNotifications: boolean
  pushNotifications: boolean
  newsletter: boolean
}

// Environment and configuration types
export interface AppConfig {
  app: {
    name: string
    version: string
    environment: 'development' | 'staging' | 'production'
    url: string
  }
  api: {
    baseUrl: string
    version: string
    timeout: number
  }
  features: {
    blog: boolean
    newsletter: boolean
    comments: boolean
    analytics: boolean
    darkMode: boolean
    i18n: boolean
  }
  integrations: {
    googleAnalytics?: string
    posthog?: string
    sentry?: string
    vercel?: boolean
  }
}

export interface DatabaseConfig {
  url: string
  maxConnections: number
  ssl?: boolean
  migrations?: boolean
}

export interface EmailConfig {
  provider: 'smtp' | 'sendgrid' | 'mailgun' | 'resend'
  from: string
  replyTo?: string
  templates: Record<string, string>
}

// Generic utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}