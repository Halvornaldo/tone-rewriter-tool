import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface WizardStepProps {
  title: string
  description: string
  stepNumber: number
  totalSteps: number
  isActive: boolean
  children: React.ReactNode
  className?: string
}

export const WizardStep: React.FC<WizardStepProps> = ({
  title,
  description,
  stepNumber,
  totalSteps,
  isActive,
  children,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'wizard-step',
        isActive && 'active',
        className
      )}
    >
      {/* Step Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-500 font-medium">
            {stepNumber} / {totalSteps}
          </span>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {children}
      </div>
    </motion.div>
  )
}