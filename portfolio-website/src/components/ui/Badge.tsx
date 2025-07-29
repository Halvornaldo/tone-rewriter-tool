import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className,
    variant = 'default',
    size = 'md',
    children,
    ...props 
  }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800 border-gray-200',
      primary: 'bg-primary-100 text-primary-800 border-primary-200',
      secondary: 'bg-gray-100 text-gray-600 border-gray-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
    }
    
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    }
    
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full border',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

interface DotBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeProps['variant']
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const DotBadge = React.forwardRef<HTMLSpanElement, DotBadgeProps>(
  ({ 
    className,
    variant = 'default',
    size = 'md',
    children,
    ...props 
  }, ref) => {
    const dotColors = {
      default: 'bg-gray-400',
      primary: 'bg-primary-500',
      secondary: 'bg-gray-400',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
    }
    
    const textColors = {
      default: 'text-gray-800',
      primary: 'text-primary-800',
      secondary: 'text-gray-600',
      success: 'text-green-800',
      warning: 'text-yellow-800',
      error: 'text-red-800',
      info: 'text-blue-800',
    }
    
    const sizes = {
      sm: { text: 'text-xs', dot: 'w-1.5 h-1.5' },
      md: { text: 'text-sm', dot: 'w-2 h-2' },
      lg: { text: 'text-base', dot: 'w-2.5 h-2.5' },
    }
    
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 font-medium',
          textColors[variant],
          sizes[size].text,
          className
        )}
        {...props}
      >
        <span 
          className={cn(
            'rounded-full',
            dotColors[variant],
            sizes[size].dot
          )} 
        />
        {children}
      </span>
    )
  }
)

DotBadge.displayName = 'DotBadge'