'use client'

/**
 * Accessibility utilities and helpers
 * Provides WCAG 2.1 AA compliance and enhanced accessibility features
 */

import React, { useEffect, useRef, useState } from 'react'

// Focus management utilities
export class FocusManager {
  private static focusStack: HTMLElement[] = []
  private static focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'details',
    'summary',
    'iframe',
    'object',
    'embed',
    'area[href]',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
  ].join(', ')

  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableSelector))
      .filter(el => this.isVisible(el)) as HTMLElement[]
  }

  static getFirstFocusableElement(container: HTMLElement): HTMLElement | null {
    const focusable = this.getFocusableElements(container)
    return focusable[0] || null
  }

  static getLastFocusableElement(container: HTMLElement): HTMLElement | null {
    const focusable = this.getFocusableElements(container)
    return focusable[focusable.length - 1] || null
  }

  static trapFocus(container: HTMLElement): () => void {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusable = this.getFocusableElements(container)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }

  static saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement)
    }
  }

  static restoreFocus(): void {
    const lastFocused = this.focusStack.pop()
    if (lastFocused && this.isVisible(lastFocused)) {
      lastFocused.focus()
    }
  }

  private static isVisible(element: Element): boolean {
    const style = window.getComputedStyle(element)
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      parseFloat(style.opacity) > 0
    )
  }
}

// React hooks for accessibility
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const cleanup = FocusManager.trapFocus(container)

    // Focus the first focusable element
    const firstFocusable = FocusManager.getFirstFocusableElement(container)
    if (firstFocusable) {
      firstFocusable.focus()
    }

    return cleanup
  }, [isActive])

  return containerRef
}

export function useAnnouncer() {
  const [announcements, setAnnouncements] = useState<string[]>([])

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Add timestamp to ensure screen readers pick up repeated messages
    const timestampedMessage = `${message} ${Date.now()}`
    setAnnouncements(prev => [...prev, timestampedMessage])

    // Clear announcement after a delay to keep the list manageable
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(msg => msg !== timestampedMessage))
    }, 10000)
  }

  return { announce, announcements }
}

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

export function useHighContrast(): boolean {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setPrefersHighContrast(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersHighContrast
}

// Skip link component
export interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        focus:z-50 bg-blue-600 text-white px-4 py-2 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
    >
      {children}
    </a>
  )
}

// Screen reader only text component
export interface ScreenReaderOnlyProps {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
}

export function ScreenReaderOnly({ children, as: Component = 'span' }: ScreenReaderOnlyProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  )
}

// Accessible icon component
export interface AccessibleIconProps {
  children: React.ReactNode
  label: string
  decorative?: boolean
}

export function AccessibleIcon({ 
  children, 
  label, 
  decorative = false 
}: AccessibleIconProps) {
  if (decorative) {
    return (
      <span aria-hidden="true">
        {children}
      </span>
    )
  }

  return (
    <span role="img" aria-label={label}>
      {children}
    </span>
  )
}

// Live region component for announcements
export interface LiveRegionProps {
  children: React.ReactNode
  priority?: 'polite' | 'assertive'
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
}

export function LiveRegion({ 
  children, 
  priority = 'polite',
  atomic = false,
  relevant = 'all'
}: LiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className="sr-only"
    >
      {children}
    </div>
  )
}

// Accessible dialog/modal wrapper
export interface DialogWrapperProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
  description?: string
}

export function DialogWrapper({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  description 
}: DialogWrapperProps) {
  const dialogRef = useFocusTrap(isOpen)

  useEffect(() => {
    if (isOpen) {
      FocusManager.saveFocus()
      document.body.style.overflow = 'hidden'
    } else {
      FocusManager.restoreFocus()
      document.body.style.overflow = ''
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? 'dialog-description' : undefined}
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <ScreenReaderOnly as="h2" id="dialog-title">
          {title}
        </ScreenReaderOnly>
        {description && (
          <ScreenReaderOnly as="p" id="dialog-description">
            {description}
          </ScreenReaderOnly>
        )}
        {children}
      </div>
    </div>
  )
}

// Color contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    // Simple luminance calculation - in production, use a proper color library
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    
    const sRGB = [r, g, b].map(val => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

export function meetsContrastRequirement(
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA',
  textSize: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background)
  
  if (level === 'AAA') {
    return textSize === 'large' ? ratio >= 4.5 : ratio >= 7
  } else {
    return textSize === 'large' ? ratio >= 3 : ratio >= 4.5
  }
}

// Keyboard navigation utilities
export const KEYBOARD_KEYS = {
  TAB: 'Tab',
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const

export function createKeyboardHandler(
  handlers: Partial<Record<keyof typeof KEYBOARD_KEYS, (event: KeyboardEvent) => void>>
) {
  return (event: KeyboardEvent) => {
    const key = event.key as keyof typeof KEYBOARD_KEYS
    const handler = handlers[key]
    if (handler) {
      handler(event)
    }
  }
}

// Accessible form utilities
export function generateAccessibleId(prefix: string = 'field'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export interface AccessibleFormFieldProps {
  id?: string
  label: string
  error?: string
  description?: string
  required?: boolean
}

export function getFormFieldProps({ 
  id, 
  label, 
  error, 
  description, 
  required 
}: AccessibleFormFieldProps) {
  const fieldId = id || generateAccessibleId()
  const errorId = `${fieldId}-error`
  const descriptionId = `${fieldId}-description`
  
  return {
    fieldId,
    labelId: `${fieldId}-label`,
    errorId,
    descriptionId,
    ariaDescribedBy: [
      error ? errorId : null,
      description ? descriptionId : null,
    ].filter(Boolean).join(' ') || undefined,
    ariaInvalid: error ? 'true' as const : undefined,
    ariaRequired: required ? 'true' as const : undefined,
  }
}

// Touch target size validation
export function validateTouchTargetSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  const minSize = 44 // WCAG 2.1 AAA minimum touch target size
  return rect.width >= minSize && rect.height >= minSize
}

// Initialize accessibility features
export function initializeAccessibility(): void {
  if (typeof window === 'undefined') return

  // Add focus-visible polyfill behavior for better focus indicators
  let hadKeyboardEvent = true
  let keyboardThrottleTimeout: number

  const handlePointerDown = () => {
    hadKeyboardEvent = false
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey || e.altKey || e.ctrlKey) return
    hadKeyboardEvent = true
  }

  const handleFocus = (e: FocusEvent) => {
    if (hadKeyboardEvent || (e.target as HTMLElement).matches(':focus-visible')) {
      (e.target as HTMLElement).classList.add('focus-visible')
    }
  }

  const handleBlur = (e: FocusEvent) => {
    (e.target as HTMLElement).classList.remove('focus-visible')
  }

  document.addEventListener('keydown', handleKeyDown, true)
  document.addEventListener('mousedown', handlePointerDown, true)
  document.addEventListener('pointerdown', handlePointerDown, true)
  document.addEventListener('touchstart', handlePointerDown, true)
  document.addEventListener('focus', handleFocus, true)
  document.addEventListener('blur', handleBlur, true)

  // Add high contrast mode detection
  const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
  const applyHighContrast = (matches: boolean) => {
    document.documentElement.classList.toggle('high-contrast', matches)
  }
  
  applyHighContrast(highContrastQuery.matches)
  highContrastQuery.addEventListener('change', (e) => applyHighContrast(e.matches))

  // Add reduced motion detection
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const applyReducedMotion = (matches: boolean) => {
    document.documentElement.classList.toggle('reduced-motion', matches)
  }
  
  applyReducedMotion(reducedMotionQuery.matches)
  reducedMotionQuery.addEventListener('change', (e) => applyReducedMotion(e.matches))
}