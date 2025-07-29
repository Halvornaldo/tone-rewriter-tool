'use client'

import React, { Component, ReactNode, ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { isDevelopment } from '@/lib/env'
import { errorReporting } from '@/lib/errors'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
  level?: 'page' | 'section' | 'component'
}

interface ErrorFallbackProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  resetError: () => void
  errorId: string | null
  level: 'page' | 'section' | 'component'
}

type ComponentType<P = {}> = React.ComponentType<P>

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props
    
    this.setState({ errorInfo })
    
    // Report error to monitoring service
    errorReporting.report(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
      level: this.props.level || 'component',
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    })

    // Call custom error handler
    onError?.(error, errorInfo)

    // Log to console in development
    if (isDevelopment) {
      console.group('🚨 Error Boundary Caught Error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Component Stack:', errorInfo.componentStack)
      console.groupEnd()
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state
    
    if (hasError && prevProps.children !== this.props.children) {
      if (resetOnPropsChange) {
        this.resetError()
      }
    }
    
    if (hasError && resetKeys) {
      const prevResetKeys = prevProps.resetKeys || []
      const hasResetKeyChanged = resetKeys.some((key, idx) => key !== prevResetKeys[idx])
      
      if (hasResetKeyChanged) {
        this.resetError()
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    })
  }

  render() {
    const { hasError, error, errorInfo, errorId } = this.state
    const { children, fallback: FallbackComponent, level = 'component' } = this.props

    if (hasError) {
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error}
            errorInfo={errorInfo}
            resetError={this.resetError}
            errorId={errorId}
            level={level}
          />
        )
      }

      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          resetError={this.resetError}
          errorId={errorId}
          level={level}
        />
      )
    }

    return children
  }
}

// Default error fallback component
function DefaultErrorFallback({ 
  error, 
  errorInfo, 
  resetError, 
  errorId, 
  level 
}: ErrorFallbackProps) {
  const isPageLevel = level === 'page'
  const isSectionLevel = level === 'section'

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const handleReportBug = () => {
    const subject = `Error Report - ${errorId}`
    const body = `
Error: ${error?.message || 'Unknown error'}
Error ID: ${errorId}
Timestamp: ${new Date().toISOString()}
URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}
User Agent: ${typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}

${isDevelopment ? `
Stack Trace:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}
` : ''}
    `.trim()

    const mailtoUrl = `mailto:support@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  return (
    <div
      className={`
        flex flex-col items-center justify-center p-8 text-center
        ${isPageLevel ? 'min-h-screen bg-gray-50' : ''}
        ${isSectionLevel ? 'min-h-[400px] bg-gray-50 rounded-lg border border-gray-200' : ''}
        ${level === 'component' ? 'min-h-[200px] bg-red-50 rounded-lg border border-red-200' : ''}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md mx-auto">
        {/* Error Icon */}
        <div
          className={`
            mx-auto mb-6 rounded-full flex items-center justify-center
            ${isPageLevel ? 'w-20 h-20 bg-red-100' : 'w-16 h-16 bg-red-100'}
          `}
        >
          <AlertTriangle
            className={`
              text-red-600
              ${isPageLevel ? 'w-10 h-10' : 'w-8 h-8'}
            `}
          />
        </div>

        {/* Error Title */}
        <h2
          className={`
            font-bold text-gray-900 mb-4
            ${isPageLevel ? 'text-2xl' : 'text-xl'}
          `}
        >
          {isPageLevel && 'Oops! Something went wrong'}
          {isSectionLevel && 'Section Error'}
          {level === 'component' && 'Component Error'}
        </h2>

        {/* Error Description */}
        <p
          className={`
            text-gray-600 mb-6
            ${isPageLevel ? 'text-lg' : 'text-base'}
          `}
        >
          {isPageLevel && 'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.'}
          {isSectionLevel && 'This section failed to load properly. You can try refreshing or continue browsing other parts of the site.'}
          {level === 'component' && 'This component encountered an error and could not be displayed.'}
        </p>

        {/* Error ID */}
        {errorId && (
          <p className="text-xs text-gray-500 mb-6 font-mono">
            Error ID: {errorId}
          </p>
        )}

        {/* Development Error Details */}
        {isDevelopment && error && (
          <details className="mb-6 text-left bg-gray-100 rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-sm text-gray-700 mb-2">
              Error Details (Development)
            </summary>
            <div className="text-xs font-mono text-gray-600 space-y-2">
              <div>
                <strong>Message:</strong>
                <pre className="whitespace-pre-wrap mt-1">{error.message}</pre>
              </div>
              {error.stack && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className="whitespace-pre-wrap mt-1 max-h-40 overflow-auto">
                    {error.stack}
                  </pre>
                </div>
              )}
              {errorInfo?.componentStack && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className="whitespace-pre-wrap mt-1 max-h-40 overflow-auto">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={resetError}
            variant="primary"
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          {isPageLevel && (
            <>
              <Button
                onClick={handleReload}
                variant="secondary"
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>

              <Button
                onClick={handleGoHome}
                variant="ghost"
                className="flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </>
          )}

          <Button
            onClick={handleReportBug}
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-500"
          >
            <Bug className="w-4 h-4 mr-2" />
            Report Bug
          </Button>
        </div>

        {/* Additional Help */}
        {isPageLevel && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Need help? Contact our support team:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                support@example.com
              </a>
              <a
                href="/contact"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Contact Form
              </a>
              <a
                href="/help"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Help Center
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Specialized error boundaries for different use cases
export function PageErrorBoundary({ children, ...props }: Omit<ErrorBoundaryProps, 'level'>) {
  return (
    <ErrorBoundary level="page" {...props}>
      {children}
    </ErrorBoundary>
  )
}

export function SectionErrorBoundary({ children, ...props }: Omit<ErrorBoundaryProps, 'level'>) {
  return (
    <ErrorBoundary level="section" {...props}>
      {children}
    </ErrorBoundary>
  )
}

export function ComponentErrorBoundary({ children, ...props }: Omit<ErrorBoundaryProps, 'level'>) {
  return (
    <ErrorBoundary level="component" {...props}>
      {children}
    </ErrorBoundary>
  )
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Hook for programmatic error throwing (useful for testing)
export function useErrorHandler() {
  return (error: Error) => {
    throw error
  }
}