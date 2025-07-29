/**
 * Common TypeScript utility types and interfaces
 * Provides consistent typing across the application
 */

// Base types
export type ID = string | number
export type Timestamp = Date | string
export type Status = 'idle' | 'loading' | 'success' | 'error'
export type Theme = 'light' | 'dark' | 'system'
export type Language = 'en' | 'no' | 'es' | 'fr' | 'de'

// Utility types for better type safety
export type NonEmptyArray<T> = [T, ...T[]]
export type SafeOmit<T, K extends keyof T> = Omit<T, K>
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>
export type PartialBy<T, K extends keyof T> = SafeOmit<T, K> & Partial<Pick<T, K>>
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// Brand types for better type safety
export type Email = string & { readonly __brand: 'Email' }
export type URL = string & { readonly __brand: 'URL' }
export type Slug = string & { readonly __brand: 'Slug' }
export type HTML = string & { readonly __brand: 'HTML' }
export type Markdown = string & { readonly __brand: 'Markdown' }

// Type guards
export function isEmail(value: string): value is Email {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export function isURL(value: string): value is URL {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function isSlug(value: string): value is Slug {
  const slugRegex = /^[a-z0-9-]+$/
  return slugRegex.test(value)
}

// Component prop utilities
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type ComponentColor = 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'

// React component utilities
export type PropsWithChildren<P = {}> = P & {
  children?: React.ReactNode
}

export type ComponentProps<T extends keyof JSX.IntrinsicElements> = 
  JSX.IntrinsicElements[T]

export type ForwardRefComponent<T, P = {}> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>

// Form types
export interface FormField<T = string> {
  value: T
  error?: string
  touched: boolean
  disabled?: boolean
}

export interface FormState<T extends Record<string, any>> {
  fields: {
    [K in keyof T]: FormField<T[K]>
  }
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
  submitCount: number
}

// API types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
  requestId?: string
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
  details?: Record<string, unknown>
  stack?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Database/Content types
export interface BaseEntity {
  id: ID
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface PublishableEntity extends BaseEntity {
  published: boolean
  publishedAt?: Timestamp
}

export interface SortableEntity extends BaseEntity {
  sortOrder: number
}

export interface SlugEntity extends BaseEntity {
  slug: Slug
}

// SEO and Meta types
export interface SEOMeta {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: URL
  noIndex?: boolean
  noFollow?: boolean
  ogTitle?: string
  ogDescription?: string
  ogImage?: URL
  ogType?: 'website' | 'article' | 'product' | 'profile'
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: URL
  structuredData?: Record<string, unknown>
}

// Navigation types
export interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<any>
  external?: boolean
  disabled?: boolean
  badge?: string
  children?: NavigationItem[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

// User preferences
export interface UserPreferences {
  theme: Theme
  language: Language
  emailNotifications: boolean
  pushNotifications: boolean
  newsletter: boolean
  reducedMotion: boolean
  highContrast: boolean
}

// Analytics and tracking
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, string | number | boolean>
  userId?: string
  sessionId?: string
  timestamp?: Timestamp
}

export interface PageView {
  path: string
  title: string
  referrer?: string
  userAgent?: string
  userId?: string
  sessionId?: string
  timestamp: Timestamp
  duration?: number
}

// Error types
export interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
  errorBoundary?: string
  timestamp: Timestamp
  userId?: string
  sessionId?: string
  url?: string
  userAgent?: string
}

// Performance monitoring
export interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count' | 'percentage'
  timestamp: Timestamp
  page?: string
  userId?: string
}

// Feature flags
export interface FeatureFlag {
  key: string
  enabled: boolean
  rolloutPercentage?: number
  conditions?: Record<string, unknown>
}

// A/B Testing
export interface Experiment {
  id: string
  name: string
  variant: string
  startDate: Timestamp
  endDate?: Timestamp
  active: boolean
}

// Content management
export interface ContentBlock {
  id: string
  type: 'text' | 'image' | 'video' | 'code' | 'quote' | 'divider'
  content: Record<string, unknown>
  order: number
}

export interface ContentRevision {
  id: string
  contentId: string
  version: number
  data: Record<string, unknown>
  createdAt: Timestamp
  createdBy: string
  message?: string
}

// File handling
export interface FileInfo {
  id: string
  filename: string
  originalName: string
  size: number
  mimeType: string
  url: URL
  thumbnailUrl?: URL
  alt?: string
  caption?: string
  uploadedAt: Timestamp
  uploadedBy?: string
}

// Validation helpers
export type ValidatedData<T> = {
  [K in keyof T]: T[K] extends string ? NonEmptyString<T[K]> : T[K]
}

export type NonEmptyString<T extends string> = T extends '' ? never : T

// Event handling
export type EventHandler<T = Event> = (event: T) => void
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>

// Loading states
export type LoadingState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

// Local storage helpers
export type StorageKey = 
  | 'user-preferences'
  | 'theme'
  | 'language'
  | 'recent-searches'
  | 'draft-content'
  | 'analytics-consent'

export interface StorageValue<T = unknown> {
  data: T
  timestamp: number
  expires?: number
}

// Generic utilities
export type Entries<T> = Array<[keyof T, T[keyof T]]>
export type Values<T> = T[keyof T]
export type Keys<T> = keyof T

// Promise utilities
export type PromiseResult<T> = T extends Promise<infer U> ? U : T
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = 
  T extends (...args: any) => Promise<infer U> ? U : any

// Function utilities
export type AnyFunction = (...args: any[]) => any
export type NoopFunction = () => void
export type VoidFunction = () => void

// Component state patterns
export interface AsyncComponentState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  lastFetch?: Timestamp
}

export interface InfiniteScrollState<T> {
  items: T[]
  hasMore: boolean
  loading: boolean
  error: Error | null
  page: number
}

// Configuration types
export interface AppConfig {
  app: {
    name: string
    version: string
    environment: 'development' | 'staging' | 'production'
    baseUrl: URL
  }
  api: {
    baseUrl: URL
    version: string
    timeout: number
  }
  features: Record<string, boolean>
  limits: {
    maxFileSize: number
    maxUploadCount: number
    rateLimitRequests: number
    rateLimitWindow: number
  }
}