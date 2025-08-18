/**
 * Review System Demo Component
 * 
 * Demonstrates the complete enhanced review system with:
 * - Cloudflare Turnstile captcha
 * - Profanity and PII filtering
 * - SimHash duplicate detection
 * - Admin moderation workflow
 * - TanStack Query cache management
 * - Toast notifications
 */

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ReviewForm } from './ReviewForm'
import { useBrokerReviews } from '@/hooks/useSupabase'
import { useInvalidateReviewCache } from '@/hooks/useReviewSubmission'
import { Button } from '@/components/ui/button'
import { RefreshCw, Shield, Filter, Hash, Eye, Bell } from 'lucide-react'
import { toast } from 'sonner'

interface ReviewSystemDemoProps {
  brokerId: string
  brokerName: string
}

export function ReviewSystemDemo({ brokerId, brokerName }: ReviewSystemDemoProps) {
  const { data: reviews, isLoading, error } = useBrokerReviews(brokerId, 'user')
  const { invalidateBrokerReviews, invalidateStats } = useInvalidateReviewCache()

  const handleRefreshCache = () => {
    invalidateBrokerReviews(brokerId)
    invalidateStats()
    toast.success('Cache refreshed successfully!')
  }

  const features = [
    {
      icon: Shield,
      title: 'Cloudflare Turnstile',
      description: 'Advanced captcha protection against bots and spam'
    },
    {
      icon: Filter,
      title: 'Content Filtering',
      description: 'Automatic profanity and PII detection with content sanitization'
    },
    {
      icon: Hash,
      title: 'Duplicate Detection',
      description: 'SimHash-based duplicate review detection and prevention'
    },
    {
      icon: Eye,
      title: 'Admin Moderation',
      description: 'Flagged content workflow with admin notes and approval system'
    },
    {
      icon: RefreshCw,
      title: 'Cache Management',
      description: 'TanStack Query integration with automatic cache invalidation'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Context-aware toast notifications with detailed feedback'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Enhanced Review System Demo
          </CardTitle>
          <CardDescription>
            Complete review submission system for {brokerName} with advanced security features
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Features</CardTitle>
          <CardDescription>
            This review system includes comprehensive protection and user experience enhancements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <Icon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Review</CardTitle>
          <CardDescription>
            Share your experience with {brokerName}. All submissions are protected by our security system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewForm 
            brokerId={brokerId}
            brokerName={brokerName}
          />
        </CardContent>
      </Card>

      {/* Existing Reviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>
              User reviews for {brokerName}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshCache}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Loading reviews...</span>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <p className="text-sm text-red-600">Error loading reviews: {error.message}</p>
            </div>
          )}
          
          {reviews && reviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
          
          {reviews && reviews.length > 0 && (
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review: any) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`text-sm ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-medium">{review.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.flagged && (
                        <Badge variant="secondary" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Moderated
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{review.body}</p>
                  {review.admin_notes && (
                    <p className="text-xs text-orange-600 mt-2 italic">
                      Admin notes: {review.admin_notes}
                    </p>
                  )}
                </div>
              ))}
              {reviews.length > 3 && (
                <p className="text-center text-sm text-muted-foreground">
                  Showing 3 of {reviews.length} reviews
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-green-800">Security Active</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Filter className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-blue-800">Filters Online</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
              <Hash className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-purple-800">Duplicate Check</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
              <RefreshCw className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-orange-800">Cache Ready</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReviewSystemDemo