import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn, containerClasses, sectionClasses } from '@/lib/style-utils'

/**
 * Page Loading State Props Interface
 */
export interface PageLoadingStateProps {
  /** Loading message */
  message?: string
  /** Custom loading icon */
  icon?: ReactNode
  /** Loading variant */
  variant?: 'default' | 'minimal' | 'skeleton'
  /** Additional CSS classes */
  className?: string
  /** Whether to show full page loading */
  fullPage?: boolean
}

/**
 * Page Loading State Component
 * 
 * Provides consistent loading states with:
 * - Accessible loading indicators
 * - Multiple visual variants
 * - Skeleton loading patterns
 * - Screen reader announcements
 */
export function PageLoadingState({
  message = 'Loading...',
  icon,
  variant = 'default',
  className,
  fullPage = true,
}: PageLoadingStateProps) {
  const containerClass = cn(
    {
      'min-h-screen flex items-center justify-center': fullPage,
      'py-12 flex items-center justify-center': !fullPage,
    },
    className
  )

  if (variant === 'skeleton') {
    return <SkeletonLoader className={className} />
  }

  if (variant === 'minimal') {
    return (
      <div className={containerClass}>
        <div className="flex items-center space-x-3">
          {icon || (
            <Loader2 
              className="w-5 h-5 animate-spin text-primary" 
              aria-hidden="true"
            />
          )}
          <span className="text-light-grey text-sm" aria-live="polite">
            {message}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="mb-4">
          {icon || (
            <Loader2 
              className="w-8 h-8 animate-spin text-primary mx-auto" 
              aria-hidden="true"
            />
          )}
        </div>
        <p 
          className="text-light-grey text-lg"
          aria-live="polite"
          role="status"
        >
          {message}
        </p>
      </div>
    </div>
  )
}

/**
 * Skeleton Loader Component
 * 
 * Provides skeleton loading patterns for different content types
 */
export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn(containerClasses(), sectionClasses(), className)}>
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-medium-grey rounded-md w-3/4 mb-4"></div>
          <div className="h-4 bg-medium-grey rounded-md w-1/2 mb-2"></div>
          <div className="h-4 bg-medium-grey rounded-md w-2/3"></div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-charcoal-grey rounded-lg p-6">
              <div className="h-4 bg-medium-grey rounded-md w-3/4 mb-3"></div>
              <div className="h-3 bg-medium-grey rounded-md w-full mb-2"></div>
              <div className="h-3 bg-medium-grey rounded-md w-5/6 mb-2"></div>
              <div className="h-3 bg-medium-grey rounded-md w-4/5"></div>
            </div>
          ))}
        </div>

        {/* Footer Skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-medium-grey rounded-md w-1/4"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-medium-grey rounded-md w-20"></div>
            <div className="h-8 bg-medium-grey rounded-md w-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Content Loading Skeleton
 * 
 * Skeleton for main content areas
 */
export function ContentSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse space-y-6', className)}>
      {/* Title */}
      <div className="h-8 bg-medium-grey rounded-md w-3/4"></div>
      
      {/* Paragraphs */}
      <div className="space-y-3">
        <div className="h-4 bg-medium-grey rounded-md w-full"></div>
        <div className="h-4 bg-medium-grey rounded-md w-5/6"></div>
        <div className="h-4 bg-medium-grey rounded-md w-4/5"></div>
      </div>
      
      {/* Image placeholder */}
      <div className="h-48 bg-medium-grey rounded-lg"></div>
      
      {/* More paragraphs */}
      <div className="space-y-3">
        <div className="h-4 bg-medium-grey rounded-md w-full"></div>
        <div className="h-4 bg-medium-grey rounded-md w-3/4"></div>
      </div>
    </div>
  )
}

/**
 * Card Loading Skeleton
 * 
 * Skeleton for card components
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-charcoal-grey rounded-lg p-6 animate-pulse', className)}>
      <div className="h-6 bg-medium-grey rounded-md w-3/4 mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-medium-grey rounded-md w-full"></div>
        <div className="h-4 bg-medium-grey rounded-md w-5/6"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-medium-grey rounded-md w-1/3"></div>
        <div className="h-8 bg-medium-grey rounded-md w-20"></div>
      </div>
    </div>
  )
}

/**
 * Table Loading Skeleton
 * 
 * Skeleton for table components
 */
export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  className 
}: { 
  rows?: number
  columns?: number
  className?: string 
}) {
  return (
    <div className={cn('animate-pulse', className)}>
      {/* Table Header */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {[...Array(columns)].map((_, index) => (
          <div key={index} className="h-6 bg-medium-grey rounded-md"></div>
        ))}
      </div>
      
      {/* Table Rows */}
      <div className="space-y-3">
        {[...Array(rows)].map((_, rowIndex) => (
          <div 
            key={rowIndex} 
            className="grid gap-4" 
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {[...Array(columns)].map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-medium-grey rounded-md"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Loading State Utilities
 */

/**
 * Create loading state with custom message
 */
export function createLoadingState(message: string, variant?: PageLoadingStateProps['variant']) {
  return <PageLoadingState message={message} variant={variant} />
}

/**
 * Create skeleton loading state
 */
export function createSkeletonState(className?: string) {
  return <SkeletonLoader className={className} />
}

/**
 * Loading state for specific content types
 */
export const LoadingStates = {
  page: (message?: string) => <PageLoadingState message={message} />,
  content: (className?: string) => <ContentSkeleton className={className} />,
  cards: (count: number = 3, className?: string) => (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6', className)}>
      {[...Array(count)].map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  ),
  table: (rows?: number, columns?: number, className?: string) => (
    <TableSkeleton rows={rows} columns={columns} className={className} />
  ),
  minimal: (message?: string) => (
    <PageLoadingState message={message} variant="minimal" fullPage={false} />
  ),
}
