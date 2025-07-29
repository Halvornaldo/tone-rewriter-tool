'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { Mail, CheckCircle, ArrowRight, Loader2, User, X } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { newsletterSchema, type NewsletterData } from '@/lib/validations'
import { cn } from '@/lib/utils'

interface NewsletterSignupProps {
  className?: string
  variant?: 'inline' | 'modal' | 'footer'
  onSuccess?: () => void
  title?: string
  description?: string
  showInterests?: boolean
}

const interests = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'DevOps',
  'Open Source',
  'Tech Tutorials',
  'Project Updates',
  'Industry News',
]

export function NewsletterSignup({
  className,
  variant = 'inline',
  onSuccess,
  title,
  description,
  showInterests = false,
}: NewsletterSignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setValue,
  } = useForm<NewsletterData>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      name: '',
      interests: [],
      source: variant,
      honeypot: '',
    },
  })

  const onSubmit = async (data: NewsletterData) => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          interests: selectedInterests,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe')
      }

      setIsSuccess(true)
      reset()
      setSelectedInterests([])
      toast.success('Welcome to the newsletter! Check your email for confirmation.')
      onSuccess?.()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to subscribe'
      toast.error(message)
      console.error('Newsletter signup error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleInterest = (interest: string) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest]
    
    setSelectedInterests(updated)
    setValue('interests', updated)
  }

  // Success state
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'text-center p-6 bg-green-50 rounded-lg border border-green-200',
          className
        )}
      >
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Successfully Subscribed!
        </h3>
        <p className="text-green-700 mb-4">
          Welcome to the newsletter! Check your inbox for a confirmation email.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSuccess(false)}
          className="text-green-700 hover:text-green-800"
        >
          Subscribe Another Email
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'space-y-4',
        variant === 'modal' && 'bg-white p-6 rounded-lg shadow-xl max-w-md w-full',
        className
      )}
    >
      {/* Header */}
      {(title || description) && (
        <div className="text-center space-y-2">
          {title && (
            <h3 className={cn(
              'font-semibold',
              variant === 'footer' ? 'text-white text-lg' : 'text-gray-900 text-xl'
            )}>
              {title}
            </h3>
          )}
          {description && (
            <p className={cn(
              'text-sm',
              variant === 'footer' ? 'text-gray-300' : 'text-gray-600'
            )}>
              {description}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Honeypot field */}
        <input
          {...register('honeypot')}
          type="text"
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Name field (optional for some variants) */}
        {variant !== 'footer' && (
          <Input
            {...register('name')}
            label="Name (Optional)"
            placeholder="Your name"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            className={variant === 'footer' ? 'bg-gray-800 border-gray-700 text-white' : ''}
          />
        )}

        {/* Email field */}
        <Input
          {...register('email')}
          type="email"
          label={variant === 'footer' ? undefined : 'Email Address'}
          placeholder="Enter your email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          required
          className={variant === 'footer' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : ''}
        />

        {/* Interests selection */}
        {showInterests && variant !== 'footer' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Interests (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {interests.map((interest) => (
                <motion.button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'px-3 py-2 text-xs rounded-full border transition-colors duration-200',
                    selectedInterests.includes(interest)
                      ? 'bg-primary-100 border-primary-500 text-primary-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {interest}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            isLoading={isSubmitting}
            className={cn(
              'flex-1',
              variant === 'footer' && 'bg-primary-600 hover:bg-primary-700'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Privacy notice */}
        <div className={cn(
          'text-xs',
          variant === 'footer' ? 'text-gray-400' : 'text-gray-500'
        )}>
          <p>
            No spam, unsubscribe at any time. View our{' '}
            <a 
              href="/privacy" 
              className={cn(
                'underline hover:no-underline',
                variant === 'footer' ? 'text-gray-300' : 'text-primary-600'
              )}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </form>
    </motion.div>
  )
}

/**
 * Modal wrapper for newsletter signup
 */
interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
}

export function NewsletterModal({ 
  isOpen, 
  onClose, 
  title = "Stay in the Loop",
  description = "Get the latest updates on projects, articles, and tech insights delivered to your inbox."
}: NewsletterModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-10"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <NewsletterSignup
                variant="modal"
                onSuccess={onClose}
                title={title}
                description={description}
                showInterests={true}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook for managing newsletter modal state
export function useNewsletterModal() {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(!isOpen),
  }
}