import { NextRequest, NextResponse } from 'next/server'
import { getSecurityConfig } from './env'

/**
 * Rate Limiting Implementation
 * Uses in-memory storage for rate limiting (consider Redis for production)
 */

interface RateLimitInfo {
  count: number
  resetTime: number
  firstRequestTime: number
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitInfo>()

// Cleanup interval to remove expired entries
const CLEANUP_INTERVAL = 5 * 60 * 1000 // 5 minutes
let cleanupTimer: NodeJS.Timeout | null = null

/**
 * Start cleanup process
 */
function startCleanup() {
  if (cleanupTimer) return
  
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, info] of rateLimitStore.entries()) {
      if (now > info.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }, CLEANUP_INTERVAL)
}

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0] || 'unknown'
  
  // Include User-Agent hash for additional uniqueness
  const userAgent = request.headers.get('user-agent') || ''
  const userAgentHash = userAgent.slice(0, 50) // Simple hash alternative
  
  return `${ip}:${userAgentHash}`
}

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 100,
  windowMs = 15 * 60 * 1000 // 15 minutes
): {
  allowed: boolean
  remaining: number
  resetTime: number
  totalRequests: number
} {
  startCleanup()
  
  const now = Date.now()
  const info = rateLimitStore.get(identifier)
  
  if (!info || now > info.resetTime) {
    // First request or window expired
    const resetTime = now + windowMs
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
      firstRequestTime: now,
    })
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime,
      totalRequests: 1,
    }
  }
  
  // Within existing window
  info.count++
  rateLimitStore.set(identifier, info)
  
  const allowed = info.count <= maxRequests
  const remaining = Math.max(0, maxRequests - info.count)
  
  return {
    allowed,
    remaining,
    resetTime: info.resetTime,
    totalRequests: info.count,
  }
}

/**
 * Rate limiting middleware
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  options?: {
    maxRequests?: number
    windowMs?: number
    skipSuccessfulRequests?: boolean
    skipFailedRequests?: boolean
    keyGenerator?: (request: NextRequest) => string
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { rateLimitMax, rateLimitWindowMs } = getSecurityConfig()
    
    const {
      maxRequests = rateLimitMax,
      windowMs = rateLimitWindowMs,
      skipSuccessfulRequests = false,
      skipFailedRequests = false,
      keyGenerator = getClientIdentifier,
    } = options || {}
    
    const identifier = keyGenerator(request)
    const rateLimitInfo = checkRateLimit(identifier, maxRequests, windowMs)
    
    // Set rate limit headers
    const headers = new Headers()
    headers.set('X-RateLimit-Limit', maxRequests.toString())
    headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString())
    headers.set('X-RateLimit-Reset', Math.ceil(rateLimitInfo.resetTime / 1000).toString())
    
    if (!rateLimitInfo.allowed) {
      headers.set('Retry-After', Math.ceil((rateLimitInfo.resetTime - Date.now()) / 1000).toString())
      
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimitInfo.resetTime - Date.now()) / 1000),
        },
        { status: 429, headers }
      )
    }
    
    // Execute the handler
    let response: NextResponse
    try {
      response = await handler(request)
    } catch (error) {
      // If handler throws, still count it unless skipFailedRequests is true
      if (skipFailedRequests) {
        // Decrement the count
        const info = rateLimitStore.get(identifier)
        if (info) {
          info.count = Math.max(0, info.count - 1)
          rateLimitStore.set(identifier, info)
        }
      }
      throw error
    }
    
    // Handle skipSuccessfulRequests option
    if (skipSuccessfulRequests && response.status >= 200 && response.status < 300) {
      const info = rateLimitStore.get(identifier)
      if (info) {
        info.count = Math.max(0, info.count - 1)
        rateLimitStore.set(identifier, info)
      }
    }
    
    // Add rate limit headers to response
    for (const [key, value] of headers.entries()) {
      response.headers.set(key, value)
    }
    
    return response
  }
}

/**
 * Specialized rate limiting for different endpoints
 */
export const contactFormRateLimit = (handler: any) =>
  withRateLimit(handler, {
    maxRequests: 5, // 5 contact form submissions
    windowMs: 60 * 60 * 1000, // per hour
  })

export const newsletterRateLimit = (handler: any) =>
  withRateLimit(handler, {
    maxRequests: 3, // 3 newsletter signups
    windowMs: 60 * 60 * 1000, // per hour
  })

export const searchRateLimit = (handler: any) =>
  withRateLimit(handler, {
    maxRequests: 100, // 100 searches
    windowMs: 60 * 1000, // per minute
    skipSuccessfulRequests: true,
  })

export const apiRateLimit = (handler: any) =>
  withRateLimit(handler, {
    maxRequests: 200, // 200 API calls
    windowMs: 15 * 60 * 1000, // per 15 minutes
  })

/**
 * Get current rate limit status for a client
 */
export function getRateLimitStatus(request: NextRequest): {
  identifier: string
  current: RateLimitInfo | null
  isLimited: boolean
} {
  const identifier = getClientIdentifier(request)
  const current = rateLimitStore.get(identifier) || null
  const { rateLimitMax } = getSecurityConfig()
  
  const isLimited = current ? current.count >= rateLimitMax : false
  
  return {
    identifier,
    current,
    isLimited,
  }
}

/**
 * Clear rate limit for a specific identifier (admin function)
 */
export function clearRateLimit(identifier: string): boolean {
  return rateLimitStore.delete(identifier)
}

/**
 * Get all rate limit entries (admin function)
 */
export function getAllRateLimits(): Array<{ identifier: string; info: RateLimitInfo }> {
  return Array.from(rateLimitStore.entries()).map(([identifier, info]) => ({
    identifier,
    info,
  }))
}

/**
 * Custom rate limit key generators
 */
export const rateLimitKeyGenerators = {
  byIP: (request: NextRequest) => {
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')
    return cfConnectingIp || realIp || forwardedFor?.split(',')[0] || 'unknown'
  },
  
  byUserAgent: (request: NextRequest) => {
    return request.headers.get('user-agent') || 'unknown'
  },
  
  byEmail: (request: NextRequest, email?: string) => {
    return email || 'anonymous'
  },
  
  combined: (request: NextRequest) => getClientIdentifier(request),
}

/**
 * Graceful shutdown - clear the cleanup timer
 */
export function shutdownRateLimit() {
  if (cleanupTimer) {
    clearInterval(cleanupTimer)
    cleanupTimer = null
  }
  rateLimitStore.clear()
}