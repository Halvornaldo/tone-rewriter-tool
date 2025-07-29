'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { Send, CheckCircle, AlertCircle, Loader2, User, Mail, MessageSquare } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { contactFormSchema, type ContactFormData } from '@/lib/validations'
import { cn } from '@/lib/utils'

interface ContactFormProps {
  className?: string
  onSuccess?: () => void
  compact?: boolean
}

export function ContactForm({ className, onSuccess, compact = false }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, touchedFields },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      subject: 'general',
      message: '',
      budget: '',
      timeline: '',
      honeypot: '', // Anti-spam field
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // CSRF token will be added automatically by the middleware
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      setIsSuccess(true)
      reset()
      toast.success('Message sent successfully! I\'ll get back to you soon.')
      onSuccess?.()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message'
      toast.error(message)
      console.error('Contact form error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess && compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'flex items-center justify-center p-8 bg-green-50 rounded-lg border border-green-200',
          className
        )}
      >
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Message Sent!
          </h3>
          <p className="text-green-700">
            Thank you for reaching out. I'll get back to you soon.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-6', className)}
      noValidate
    >
      {/* Success State for full form */}
      {isSuccess && !compact && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">
              Message sent successfully! I'll get back to you soon.
            </p>
          </div>
        </motion.div>
      )}

      {/* Honeypot field - hidden from users */}
      <input
        {...register('honeypot')}
        type="text"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-1">
          <Input
            {...register('name')}
            label="Full Name"
            placeholder="John Doe"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            required
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={cn(
              touchedFields.name && !errors.name && 'border-green-300 focus:border-green-500 focus:ring-green-500'
            )}
          />
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <Input
            {...register('email')}
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            required
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={cn(
              touchedFields.email && !errors.email && 'border-green-300 focus:border-green-500 focus:ring-green-500'
            )}
          />
        </div>
      </div>

      {/* Subject Field */}
      <div className="space-y-1">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject <span className="text-red-500">*</span>
        </label>
        <select
          {...register('subject')}
          id="subject"
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'bg-white text-gray-900 transition-colors duration-200',
            errors.subject && 'border-red-300 focus:ring-red-500 focus:border-red-500'
          )}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
        >
          <option value="general">General Inquiry</option>
          <option value="project">Project Discussion</option>
          <option value="collaboration">Collaboration</option>
          <option value="other">Other</option>
        </select>
        {errors.subject && (
          <p id="subject-error" className="text-sm text-red-600" role="alert">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-1">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MessageSquare className="absolute top-3 left-3 w-4 h-4 text-gray-400 pointer-events-none" />
          <textarea
            {...register('message')}
            id="message"
            rows={6}
            placeholder="Tell me about your project, ideas, or how I can help you..."
            className={cn(
              'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'placeholder-gray-400 text-gray-900 transition-colors duration-200 resize-vertical',
              errors.message && 'border-red-300 focus:ring-red-500 focus:border-red-500',
              touchedFields.message && !errors.message && 'border-green-300 focus:border-green-500 focus:ring-green-500'
            )}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
        </div>
        {errors.message && (
          <p id="message-error" className="text-sm text-red-600" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Optional Fields */}
      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Input
              {...register('budget')}
              label="Budget Range (Optional)"
              placeholder="e.g., $5,000 - $10,000"
              error={errors.budget?.message}
            />
          </div>

          <div className="space-y-1">
            <Input
              {...register('timeline')}
              label="Timeline (Optional)"
              placeholder="e.g., 2-3 months"
              error={errors.timeline?.message}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </>
          )}
        </Button>

        {/* Form validation status */}
        <div className="flex items-center text-sm">
          {Object.keys(errors).length > 0 ? (
            <div className="flex items-center text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              Please fix the errors above
            </div>
          ) : touchedFields.name && touchedFields.email && touchedFields.message ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Form looks good!
            </div>
          ) : null}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="text-xs text-gray-500 border-t pt-4">
        <p>
          By submitting this form, you agree to our{' '}
          <a href="/privacy" className="text-primary-600 hover:underline">
            Privacy Policy
          </a>
          . Your information will be used solely to respond to your inquiry and will never be shared with third parties.
        </p>
      </div>
    </motion.form>
  )
}

// Export types for external usage
export type { ContactFormData }