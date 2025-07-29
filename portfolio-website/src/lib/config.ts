import { env } from './env'

/**
 * Site configuration using validated environment variables
 * Provides type-safe access to all site configuration
 */
export const siteConfig = {
  // Basic site information
  name: env.NEXT_PUBLIC_SITE_NAME,
  description: env.NEXT_PUBLIC_SITE_DESCRIPTION,
  url: env.NEXT_PUBLIC_SITE_URL,
  
  // SEO and social media
  ogImage: '/og-image.jpg',
  creator: '@yourusername',
  keywords: [
    'developer',
    'portfolio',
    'web development',
    'full stack',
    'react',
    'next.js',
    'typescript',
    'javascript',
    'node.js',
    'freelancer',
    'software engineer',
    'ui/ux',
    'responsive design',
    'modern web apps',
  ],
  
  // Social media and contact links
  links: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
    email: 'mailto:your.email@example.com',
    resume: '/resume.pdf',
    portfolio: env.NEXT_PUBLIC_SITE_URL,
  },
  
  // Contact information
  contact: {
    email: env.CONTACT_EMAIL || 'your.email@example.com',
    phone: process.env.CONTACT_PHONE,
    address: {
      city: process.env.CONTACT_CITY || 'Your City',
      country: process.env.CONTACT_COUNTRY || 'Your Country',
      timezone: process.env.CONTACT_TIMEZONE || 'UTC',
    },
  },
  
  // Feature flags
  features: {
    blog: true,
    newsletter: true,
    comments: false,
    analytics: !!env.NEXT_PUBLIC_GA_ID,
    darkMode: true,
    searchFunctionality: true,
    contactForm: true,
    projectFilters: true,
    skillsSection: true,
    testimonials: false,
    resume: true,
  },
  
  // Performance and technical settings
  performance: {
    enableServiceWorker: env.NODE_ENV === 'production',
    enableImageOptimization: true,
    enableFontOptimization: true,
    enableBundleAnalysis: env.NODE_ENV === 'development',
    lazyLoadImages: true,
    preloadCriticalAssets: true,
  },
  
  // Security settings
  security: {
    enableCSRF: true,
    enableRateLimit: true,
    enableInputSanitization: true,
    enableSecurityHeaders: true,
    enableContentSecurityPolicy: true,
    reportSecurityViolations: env.NODE_ENV === 'production',
  },
  
  // UI/UX settings
  ui: {
    maxWidth: '1280px',
    defaultTheme: 'light' as const,
    supportedLanguages: ['en'] as const,
    animationDuration: 300,
    toastDuration: 4000,
    debounceDelay: 300,
    itemsPerPage: 12,
    maxFileSize: env.MAX_FILE_SIZE,
  },
  
  // Content limits and validation
  limits: {
    maxProjectsOnHome: 6,
    maxBlogPostsOnHome: 3,
    maxTagsPerProject: 8,
    maxImagesPerProject: 10,
    maxContactFormLength: 2000,
    maxNewsletterNameLength: 100,
    maxSearchQueryLength: 200,
  },
  
  // External service configuration
  services: {
    analytics: {
      enabled: !!env.NEXT_PUBLIC_GA_ID,
      gaId: env.NEXT_PUBLIC_GA_ID,
      trackingConsent: true,
      anonymizeIP: true,
    },
    monitoring: {
      enabled: !!env.SENTRY_DSN,
      sentryDsn: env.SENTRY_DSN,
      environment: env.NODE_ENV,
      tracesSampleRate: env.NODE_ENV === 'development' ? 1.0 : 0.1,
    },
    email: {
      enabled: !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS),
      provider: 'smtp' as const,
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    },
  },
  
  // Development and debugging
  development: {
    enableDebugMode: env.NODE_ENV === 'development',
    enablePerformanceMonitoring: true,
    enableAccessibilityChecks: env.NODE_ENV === 'development',
    enableErrorLogging: true,
    showBundleAnalyzer: false,
  },
} as const

// Type definitions
export type SiteConfig = typeof siteConfig
export type FeatureFlags = typeof siteConfig.features
export type UIConfig = typeof siteConfig.ui
export type SecurityConfig = typeof siteConfig.security
export type PerformanceConfig = typeof siteConfig.performance

// Helper functions for configuration access
export const getFeature = (feature: keyof FeatureFlags): boolean => {
  return siteConfig.features[feature]
}

export const getLimit = (limit: keyof typeof siteConfig.limits): number => {
  return siteConfig.limits[limit]
}

export const isServiceEnabled = (service: keyof typeof siteConfig.services): boolean => {
  return siteConfig.services[service].enabled
}

export const getUIConfig = <K extends keyof UIConfig>(key: K): UIConfig[K] => {
  return siteConfig.ui[key]
}

// Navigation configuration (moved from navigation.ts)
export const navigationConfig = {
  header: {
    showLogo: true,
    showSearchButton: getFeature('searchFunctionality'),
    showThemeToggle: getFeature('darkMode'),
    showLanguageSelector: false,
  },
  footer: {
    showNewsletter: getFeature('newsletter'),
    showSocialLinks: true,
    showSitemap: true,
    showPrivacyPolicy: true,
    copyrightYear: new Date().getFullYear(),
  },
  breadcrumbs: {
    enabled: true,
    showHome: true,
    maxItems: 5,
  },
} as const

// API endpoints configuration
export const apiConfig = {
  baseUrl: env.NODE_ENV === 'development' ? 'http://localhost:3000' : env.NEXT_PUBLIC_SITE_URL,
  endpoints: {
    contact: '/api/contact',
    newsletter: '/api/newsletter',
    projects: '/api/projects',
    blog: '/api/blog',
    search: '/api/search',
    upload: '/api/upload',
    analytics: '/api/analytics',
  },
  timeouts: {
    default: 10000, // 10 seconds
    upload: 30000,  // 30 seconds
    search: 5000,   // 5 seconds
  },
  retries: {
    default: 3,
    upload: 1,
    analytics: 0,
  },
} as const

export type ApiConfig = typeof apiConfig

// Theme configuration
export const themeConfig = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
  },
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const

export type ThemeConfig = typeof themeConfig