import * as React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const skeletonVariants = cva(
  'animate-pulse rounded-md bg-gray-700',
  {
    variants: {
      variant: {
        default: 'bg-gray-700',
        light: 'bg-gray-600',
        dark: 'bg-gray-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(skeletonVariants({ variant, className }))}
      {...props}
    />
  )
)
Skeleton.displayName = 'Skeleton'

// Predefined skeleton components for common use cases
export interface CardSkeletonProps {
  showImage?: boolean
  showFooter?: boolean
  className?: string
}

const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ showImage = true, showFooter = true, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-gray-600 bg-[#1a1a1a] p-6 space-y-4',
        className
      )}
    >
      {showImage && <Skeleton className="h-48 w-full" />}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      {showFooter && (
        <div className="flex space-x-2 pt-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      )}
    </div>
  )
)
CardSkeleton.displayName = 'CardSkeleton'

export interface TableSkeletonProps {
  rows?: number
  columns?: number
  showHeader?: boolean
  className?: string
}

const TableSkeleton = React.forwardRef<HTMLDivElement, TableSkeletonProps>(
  ({ rows = 5, columns = 4, showHeader = true, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-gray-600 bg-[#1a1a1a] overflow-hidden',
        className
      )}
    >
      {showHeader && (
        <div className="bg-[#0f0f0f] p-4 border-b border-gray-600">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton key={index} className="h-4" />
            ))}
          </div>
        </div>
      )}
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={rowIndex} 
            className="grid gap-4" 
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
)
TableSkeleton.displayName = 'TableSkeleton'

export interface ListSkeletonProps {
  items?: number
  showAvatar?: boolean
  className?: string
}

const ListSkeleton = React.forwardRef<HTMLDivElement, ListSkeletonProps>(
  ({ items = 5, showAvatar = false, className }, ref) => (
    <div ref={ref} className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
)
ListSkeleton.displayName = 'ListSkeleton'

export interface TextSkeletonProps {
  lines?: number
  className?: string
}

const TextSkeleton = React.forwardRef<HTMLDivElement, TextSkeletonProps>(
  ({ lines = 3, className }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index} 
          className={cn(
            'h-4',
            index === lines - 1 ? 'w-2/3' : 'w-full'
          )} 
        />
      ))}
    </div>
  )
)
TextSkeleton.displayName = 'TextSkeleton'

// Broker-specific skeleton components
export interface BrokerCardSkeletonProps {
  className?: string
}

const BrokerCardSkeleton = React.forwardRef<HTMLDivElement, BrokerCardSkeletonProps>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-gray-600 bg-[#1a1a1a] p-6 space-y-4',
        className
      )}
    >
      {/* Header with logo and rating */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      
      {/* Features */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Skeleton className="h-1 w-1 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex space-x-2 pt-4">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  )
)
BrokerCardSkeleton.displayName = 'BrokerCardSkeleton'

export interface BrokerComparisonSkeletonProps {
  brokers?: number
  className?: string
}

const BrokerComparisonSkeleton = React.forwardRef<HTMLDivElement, BrokerComparisonSkeletonProps>(
  ({ brokers = 3, className }, ref) => (
    <div ref={ref} className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      
      {/* Comparison table */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${brokers}, 1fr)` }}>
        {/* Header row */}
        <div></div>
        {Array.from({ length: brokers }).map((_, index) => (
          <div key={index} className="text-center space-y-2">
            <Skeleton className="h-12 w-12 rounded mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
        
        {/* Feature rows */}
        {Array.from({ length: 8 }).map((_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <Skeleton className="h-4 w-32" />
            {Array.from({ length: brokers }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-16 mx-auto" />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
)
BrokerComparisonSkeleton.displayName = 'BrokerComparisonSkeleton'

export {
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  ListSkeleton,
  TextSkeleton,
  BrokerCardSkeleton,
  BrokerComparisonSkeleton,
  skeletonVariants,
}
