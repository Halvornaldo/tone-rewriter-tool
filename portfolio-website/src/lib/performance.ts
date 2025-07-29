/**
 * Performance optimization utilities
 * Handles bundle optimization, lazy loading, and performance monitoring
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react'
import { isDevelopment } from './env'

// Lazy loading with better error handling
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType<any>
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      const component = await importFn()
      return component
    } catch (error) {
      console.error('Failed to load component:', error)
      
      // Return fallback component or a generic error component
      if (fallback) {
        return { default: fallback }
      }
      
      // Generic error fallback
      const ErrorFallback: ComponentType<any> = () => (
        <div className="p-4 text-center text-red-600">
          <p>Failed to load component</p>
          {isDevelopment && (
            <details className="mt-2 text-xs text-left">
              <summary>Error details</summary>
              <pre>{error instanceof Error ? error.stack : String(error)}</pre>
            </details>
          )}
        </div>
      )
      
      return { default: ErrorFallback as T }
    }
  })
}

// Preload components for better UX
export function preloadComponent(importFn: () => Promise<any>): void {
  // Only preload in production to avoid development overhead
  if (!isDevelopment) {
    importFn().catch((error) => {
      console.warn('Failed to preload component:', error)
    })
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  private observers: PerformanceObserver[] = []

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  private constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObservers()
    }
  }

  private initializeObservers(): void {
    // Observe paint metrics
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(`paint.${entry.name}`, entry.startTime)
        }
      })
      paintObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(paintObserver)
    } catch (error) {
      console.warn('Paint observer not supported:', error)
    }

    // Observe navigation metrics
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navEntry = entry as PerformanceNavigationTiming
          this.recordMetric('navigation.domContentLoaded', navEntry.domContentLoadedEventEnd)
          this.recordMetric('navigation.load', navEntry.loadEventEnd)
          this.recordMetric('navigation.ttfb', navEntry.responseStart - navEntry.requestStart)
        }
      })
      navigationObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navigationObserver)
    } catch (error) {
      console.warn('Navigation observer not supported:', error)
    }

    // Observe largest contentful paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          this.recordMetric('lcp', lastEntry.startTime)
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)
    } catch (error) {
      console.warn('LCP observer not supported:', error)
    }
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const values = this.metrics.get(name)!
    values.push(value)
    
    // Keep only the last 100 measurements
    if (values.length > 100) {
      values.shift()
    }

    // Log performance issues in development
    if (isDevelopment) {
      this.checkPerformanceThresholds(name, value)
    }
  }

  private checkPerformanceThresholds(name: string, value: number): void {
    const thresholds: Record<string, number> = {
      'paint.first-contentful-paint': 2000,
      'paint.first-paint': 1000,
      'lcp': 2500,
      'navigation.domContentLoaded': 3000,
      'navigation.load': 5000,
      'navigation.ttfb': 600,
    }

    const threshold = thresholds[name]
    if (threshold && value > threshold) {
      console.warn(`⚡ Performance Warning: ${name} took ${value.toFixed(2)}ms (threshold: ${threshold}ms)`)
    }
  }

  getMetrics(): Record<string, { average: number; min: number; max: number; count: number }> {
    const result: Record<string, any> = {}
    
    for (const [name, values] of this.metrics.entries()) {
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0)
        result[name] = {
          average: sum / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length,
        }
      }
    }
    
    return result
  }

  reportMetrics(): void {
    const metrics = this.getMetrics()
    
    if (isDevelopment) {
      console.table(metrics)
    } else {
      // Send to analytics service in production
      // Example: analytics.track('performance_metrics', metrics)
    }
  }

  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics.clear()
  }
}

// Bundle size optimization utilities
export function analyzeBundle(): void {
  if (isDevelopment && typeof window !== 'undefined') {
    // Simple bundle analysis for development
    const scripts = Array.from(document.querySelectorAll('script[src]'))
    const totalSize = scripts.length
    
    console.group('📦 Bundle Analysis')
    console.log(`Total scripts: ${totalSize}`)
    
    scripts.forEach((script, index) => {
      const src = (script as HTMLScriptElement).src
      console.log(`${index + 1}. ${src.split('/').pop()}`)
    })
    
    console.groupEnd()
  }
}

// Image optimization utilities
export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpg' | 'png'
  blur?: boolean
}

export function optimizeImageUrl(
  src: string, 
  options: ImageOptimizationOptions = {}
): string {
  if (!src || src.startsWith('data:')) {
    return src
  }

  const {
    width,
    height,
    quality = 85,
    format,
    blur = false,
  } = options

  // For Next.js Image optimization
  const params = new URLSearchParams()
  
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  if (quality !== 85) params.set('q', quality.toString())
  if (format) params.set('f', format)
  if (blur) params.set('blur', '20')

  const queryString = params.toString()
  return queryString ? `${src}?${queryString}` : src
}

// Resource hints for better loading
export function addResourceHint(
  href: string,
  type: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch',
  as?: string
): void {
  if (typeof window === 'undefined') return

  const existing = document.querySelector(`link[href="${href}"][rel="${type}"]`)
  if (existing) return

  const link = document.createElement('link')
  link.rel = type
  link.href = href
  
  if (as && type === 'preload') {
    link.as = as
  }
  
  if (type === 'preconnect') {
    link.crossOrigin = 'anonymous'
  }

  document.head.appendChild(link)
}

// Critical resource preloading
export function preloadCriticalResources(): void {
  // Preload critical fonts
  addResourceHint('https://fonts.gstatic.com', 'preconnect')
  addResourceHint('https://fonts.googleapis.com', 'preconnect')
  
  // Preload critical images (add your specific images)
  // addResourceHint('/hero-image.jpg', 'preload', 'image')
  
  // DNS prefetch for external services
  addResourceHint('https://vercel.com', 'dns-prefetch')
  addResourceHint('https://google-analytics.com', 'dns-prefetch')
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  })
}

// Debounced resize observer
export function createResizeObserver(
  callback: (entries: ResizeObserverEntry[]) => void,
  debounceMs = 100
): ResizeObserver | null {
  if (typeof window === 'undefined' || !('ResizeObserver' in window)) {
    return null
  }

  let timeoutId: NodeJS.Timeout

  const debouncedCallback = (entries: ResizeObserverEntry[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(entries), debounceMs)
  }

  return new ResizeObserver(debouncedCallback)
}

// Web Vitals monitoring
export interface WebVitalsMetric {
  name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB'
  value: number
  id: string
  delta: number
}

export function reportWebVitals(metric: WebVitalsMetric): void {
  const monitor = PerformanceMonitor.getInstance()
  monitor.recordMetric(`webvitals.${metric.name.toLowerCase()}`, metric.value)

  if (isDevelopment) {
    console.log(`📊 Web Vital - ${metric.name}:`, metric.value)
  }

  // Send to analytics service
  // Example: analytics.track('web_vital', {
  //   name: metric.name,
  //   value: metric.value,
  //   id: metric.id,
  // })
}

// Memory usage monitoring
export function monitorMemoryUsage(): void {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return
  }

  const memory = (performance as any).memory
  if (!memory) return

  const monitor = PerformanceMonitor.getInstance()
  
  setInterval(() => {
    monitor.recordMetric('memory.used', memory.usedJSHeapSize)
    monitor.recordMetric('memory.total', memory.totalJSHeapSize)
    monitor.recordMetric('memory.limit', memory.jsHeapSizeLimit)
    
    // Warn about memory leaks
    const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    if (usagePercentage > 90) {
      console.warn(`🚨 High memory usage: ${usagePercentage.toFixed(1)}%`)
    }
  }, 30000) // Check every 30 seconds
}

// Initialize performance monitoring
export function initializePerformanceMonitoring(): void {
  if (typeof window === 'undefined') return

  const monitor = PerformanceMonitor.getInstance()
  
  // Monitor memory usage
  monitorMemoryUsage()
  
  // Preload critical resources
  preloadCriticalResources()
  
  // Report metrics periodically
  setInterval(() => {
    monitor.reportMetrics()
  }, 60000) // Every minute

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    monitor.cleanup()
  })
}

// Component-level performance measurement
export function measureComponentRender<T extends any[]>(
  componentName: string,
  renderFn: (...args: T) => any
) {
  return (...args: T) => {
    const start = performance.now()
    const result = renderFn(...args)
    const end = performance.now()
    
    const monitor = PerformanceMonitor.getInstance()
    monitor.recordMetric(`component.${componentName}`, end - start)
    
    return result
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()