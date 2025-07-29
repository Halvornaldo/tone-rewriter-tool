import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'
import { getSecurityConfig } from './env'

/**
 * CSRF Protection Utility
 * Implements double submit cookie pattern for CSRF protection
 */

const CSRF_TOKEN_HEADER = 'X-CSRF-Token'
const CSRF_COOKIE_NAME = '__csrf-token'
const TOKEN_LENGTH = 32

/**
 * Generate a secure CSRF token
 */
function generateToken(): string {
  return randomBytes(TOKEN_LENGTH).toString('hex')
}

/**
 * Create a hash of the token for comparison
 */
function hashToken(token: string, secret: string): string {
  return createHash('sha256')
    .update(token + secret)
    .digest('hex')
}

/**
 * Generate CSRF token and set it in cookies
 */
export function generateCSRFToken(response: NextResponse): string {
  const token = generateToken()
  const { csrfSecret } = getSecurityConfig()
  const hashedToken = hashToken(token, csrfSecret)
  
  // Set secure cookie with the hashed token
  response.cookies.set(CSRF_COOKIE_NAME, hashedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
  
  return token
}

/**
 * Validate CSRF token from request
 */
export function validateCSRFToken(request: NextRequest): boolean {
  try {
    const tokenFromHeader = request.headers.get(CSRF_TOKEN_HEADER)
    const tokenFromCookie = request.cookies.get(CSRF_COOKIE_NAME)?.value
    
    if (!tokenFromHeader || !tokenFromCookie) {
      return false
    }
    
    const { csrfSecret } = getSecurityConfig()
    const expectedHash = hashToken(tokenFromHeader, csrfSecret)
    
    // Use timing-safe comparison
    return timingSafeEqual(expectedHash, tokenFromCookie)
  } catch (error) {
    console.error('CSRF validation error:', error)
    return false
  }
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * CSRF protection middleware
 */
export function withCSRFProtection(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const method = request.method
    
    // Skip CSRF check for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const response = await handler(request)
      
      // Generate and set CSRF token for safe requests
      if (method === 'GET') {
        generateCSRFToken(response)
      }
      
      return response
    }
    
    // Validate CSRF token for unsafe methods
    if (!validateCSRFToken(request)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid CSRF token',
          code: 'CSRF_INVALID' 
        },
        { status: 403 }
      )
    }
    
    return handler(request)
  }
}

/**
 * Get CSRF token for client-side usage
 */
export function getCSRFTokenFromRequest(request: NextRequest): string | null {
  return request.headers.get(CSRF_TOKEN_HEADER)
}

/**
 * Helper to create CSRF-protected API response
 */
export function createCSRFResponse(data: any, status = 200): NextResponse {
  const response = NextResponse.json(data, { status })
  generateCSRFToken(response)
  return response
}

/**
 * Client-side helper to get CSRF token from meta tag
 */
export const CSRFTokenScript = `
  window.getCSRFToken = function() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : null;
  };
  
  // Add CSRF token to all fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(url, options = {}) {
    const token = window.getCSRFToken();
    if (token && options.method && !['GET', 'HEAD'].includes(options.method.toUpperCase())) {
      options.headers = {
        ...options.headers,
        '${CSRF_TOKEN_HEADER}': token
      };
    }
    return originalFetch(url, options);
  };
`

/**
 * React hook for CSRF token management
 */
export const useCSRFToken = () => {
  if (typeof window === 'undefined') {
    return null
  }
  
  const getToken = (): string | null => {
    const meta = document.querySelector('meta[name="csrf-token"]')
    return meta?.getAttribute('content') || null
  }
  
  const addTokenToHeaders = (headers: HeadersInit = {}): HeadersInit => {
    const token = getToken()
    if (token) {
      return {
        ...headers,
        [CSRF_TOKEN_HEADER]: token,
      }
    }
    return headers
  }
  
  return { getToken, addTokenToHeaders }
}