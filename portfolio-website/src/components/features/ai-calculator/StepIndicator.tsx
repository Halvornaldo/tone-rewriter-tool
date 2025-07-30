import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  stepNumber: number
  isCompleted: boolean
  isCurrent: boolean
  isClickable?: boolean
  onClick?: () => void
  title: string
  description?: string
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  stepNumber,
  isCompleted,
  isCurrent,
  isClickable = false,
  onClick,
  title,
  description
}) => {
  const handleClick = () => {
    if (isClickable && onClick) {
      onClick()
    }
  }

  return (
    <div className="flex flex-col items-center text-center max-w-xs">
      {/* Step Circle */}
      <motion.div
        whileHover={isClickable ? { scale: 1.05 } : {}}
        whileTap={isClickable ? { scale: 0.95 } : {}}
        onClick={handleClick}
        className={cn(
          'step-indicator',
          isCompleted && 'completed',
          isCurrent && 'current',
          !isCompleted && !isCurrent && 'upcoming',
          isClickable && 'cursor-pointer hover:shadow-md transition-shadow'
        )}
      >
        {isCompleted ? (
          <Check className="w-4 h-4" />
        ) : (
          <span>{stepNumber}</span>
        )}
      </motion.div>

      {/* Step Info */}
      <div className="mt-3">
        <div className={cn(
          'text-sm font-medium',
          isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
        )}>
          {title}
        </div>
        {description && (
          <div className="text-xs text-gray-500 mt-1 hidden sm:block">
            {description}
          </div>
        )}
      </div>
    </div>
  )
}