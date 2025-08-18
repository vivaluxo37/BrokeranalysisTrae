/**
 * Enhanced Review Form Component
 * 
 * Features:
 * - Rating system (1-5 stars)
 * - Body textarea with character limit
 * - Form validation
 * - Captcha integration ready
 * - Duplicate detection preparation
 * - Profanity filtering
 */

import React, { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Star, Send, AlertCircle, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useReviewSubmission } from '@/hooks/useReviewSubmission'
import { toast } from 'sonner'
import { Turnstile } from '@marsidev/react-turnstile'

// Form validation schema
const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5, 'Rating must be between 1 and 5'),
  body: z.string()
    .min(10, 'Review must be at least 10 characters long')
    .max(1000, 'Review must be less than 1000 characters')
    .refine((val) => val.trim().length > 0, 'Review cannot be empty'),
  captchaToken: z.string().min(1, 'Please complete the security verification')
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  brokerId: string
  brokerName: string
  onSubmit?: (data: ReviewFormData & { captchaToken?: string; simHash?: string }) => Promise<void>
  isSubmitting?: boolean
  className?: string
}

export function ReviewForm({ 
  brokerId, 
  brokerName, 
  onSubmit, 
  isSubmitting = false,
  className = '' 
}: ReviewFormProps) {
  const { user } = useAuth()
  const [hoveredRating, setHoveredRating] = useState(0)
  const [captchaError, setCaptchaError] = useState<string | null>(null)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  // Use the enhanced review submission hook
  const reviewSubmission = useReviewSubmission({
    brokerId,
    onSuccess: () => {
      // Reset form on success
      form.reset()
      setCaptchaVerified(false)
      setCaptchaError(null)
    },
    onError: (error) => {
      console.error('Review submission error:', error)
    }
  })
  
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      body: '',
      captchaToken: ''
    }
  })

  const watchedRating = form.watch('rating')
  const watchedBody = form.watch('body')

  // Handle star rating click
  const handleRatingClick = useCallback((rating: number) => {
    form.setValue('rating', rating, { shouldValidate: true })
  }, [form])

  // Handle star hover
  const handleRatingHover = useCallback((rating: number) => {
    setHoveredRating(rating)
  }, [])

  // Handle star hover leave
  const handleRatingLeave = useCallback(() => {
    setHoveredRating(0)
  }, [])

  // Handle captcha success
  const handleCaptchaSuccess = useCallback((token: string) => {
    form.setValue('captchaToken', token, { shouldValidate: true })
    setCaptchaVerified(true)
    setCaptchaError(null)
  }, [form])

  // Handle captcha error
  const handleCaptchaError = useCallback((error?: Error) => {
    form.setValue('captchaToken', '', { shouldValidate: true })
    setCaptchaVerified(false)
    setCaptchaError(error?.message || 'Captcha verification failed')
  }, [form])

  // Handle captcha expire
  const handleCaptchaExpire = useCallback(() => {
    form.setValue('captchaToken', '', { shouldValidate: true })
    setCaptchaVerified(false)
    setCaptchaError('Captcha expired, please try again')
  }, [form])

  // Simple SimHash implementation for duplicate detection
  const computeSimHash = useCallback((text: string): string => {
    // Simplified SimHash - in production, use a proper library
    const words = text.toLowerCase().split(/\s+/)
    const hash = words.reduce((acc, word) => {
      let wordHash = 0
      for (let i = 0; i < word.length; i++) {
        wordHash = ((wordHash << 5) - wordHash + word.charCodeAt(i)) & 0xffffffff
      }
      return acc ^ wordHash
    }, 0)
    return Math.abs(hash).toString(16)
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async (data: ReviewFormData) => {
    if (!user) {
      toast.error('You must be logged in to submit a review')
      return
    }

    if (!captchaVerified || !data.captchaToken) {
      toast.error('Please complete the security verification')
      return
    }

    // Submit review using the enhanced hook
    await reviewSubmission.mutateAsync({
      rating: data.rating,
      body: data.body,
      captchaToken: data.captchaToken
    })

    // Call parent callback if provided
    if (onSubmit) {
      await onSubmit({
        rating: data.rating,
        body: data.body,
        captchaToken: data.captchaToken
      })
    }
  }, [user, onSubmit, captchaVerified, form, reviewSubmission])

  // Render star rating component
  const renderStarRating = () => {
    const displayRating = hoveredRating || watchedRating
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= displayRating
          const isHovered = star <= hoveredRating
          
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => handleRatingHover(star)}
              onMouseLeave={handleRatingLeave}
              className="p-1 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            >
              <Star
                className={`w-8 h-8 transition-colors duration-200 ${
                  isActive
                    ? isHovered
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 hover:text-yellow-200'
                }`}
              />
            </button>
          )
        })}
        {watchedRating > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            {watchedRating} star{watchedRating !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    )
  }

  // Don't render if user is not authenticated
  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to write a review for {brokerName}.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Write a Review for {brokerName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Rating Field */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Overall Rating *
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {renderStarRating()}
                      {form.formState.errors.rating && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.rating.message}
                        </p>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Review Body Field */}
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Your Review *
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Textarea
                        {...field}
                        placeholder="Share your experience with this broker. What did you like? What could be improved? Be specific and helpful to other traders."
                        className="min-h-[120px] resize-none"
                        maxLength={1000}
                      />
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Minimum 10 characters</span>
                        <span className={watchedBody.length > 900 ? 'text-orange-500' : ''}>
                          {watchedBody.length}/1000
                        </span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Captcha Verification */}
            <FormField
              control={form.control}
              name="captchaToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security Verification *
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Turnstile
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || 'demo-site-key'}
                        onSuccess={handleCaptchaSuccess}
                        onError={handleCaptchaError}
                        onExpire={handleCaptchaExpire}
                        options={{
                          theme: 'light',
                          size: 'normal'
                        }}
                      />
                      {captchaError && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {captchaError}
                        </p>
                      )}
                      {captchaVerified && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Security verification completed
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Guidelines */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Review Guidelines:</strong> Please be honest and constructive. 
                Reviews are moderated and must comply with our community standards. 
                Spam, fake reviews, and inappropriate content will be removed.
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || reviewSubmission.isPending || !form.formState.isValid}
                className="flex-1"
              >
                {(isSubmitting || reviewSubmission.isPending) ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset()
                  setCaptchaVerified(false)
                  setCaptchaError(null)
                }}
                disabled={isSubmitting || reviewSubmission.isPending}
              >
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ReviewForm