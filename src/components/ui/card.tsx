import * as React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/style-utils'

const cardVariants = cva(
  'rounded-lg border bg-[#1a1a1a] text-white shadow-sm transition-all duration-200 h-full',
  {
    variants: {
      variant: {
        default: 'border-gray-600',
        featured: 'border-2 border-gray-400 shadow-lg',
        compact: 'p-4',
        interactive: 'cursor-pointer border-gray-600 hover:border-gray-400 hover:bg-[#1f1f1f] hover:-translate-y-1 hover:shadow-md active:translate-y-0',
        broker: 'border-gray-600 hover:border-gray-400 transition-colors',
        tool: 'border-gray-600 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]',
        content: 'border-gray-600 bg-[#1a1a1a]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: LucideIcon
    badge?: string
  }
>(({ className, icon: Icon, badge, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  >
    {(Icon || badge) && (
      <div className="flex items-center justify-between mb-2">
        {Icon && <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
        {badge && (
          <span className="inline-flex items-center rounded-full bg-gray-800 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-gray-700">
            {badge}
          </span>
        )}
      </div>
    )}
    {children}
  </div>
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6
  }
>(({ className, level = 3, ...props }, ref) => {
  const Comp = `h${level}` as keyof JSX.IntrinsicElements
  return (
    <Comp
      ref={ref}
      className={cn(
        'font-semibold leading-none tracking-tight text-white',
        {
          'text-3xl': level === 1,
          'text-2xl': level === 2,
          'text-xl': level === 3,
          'text-lg': level === 4,
          'text-base': level === 5,
          'text-sm': level === 6,
        },
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-400 leading-relaxed', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// Specialized Card Components

export interface ProfessionalCardProps extends CardProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  loading?: boolean
}

const ProfessionalCard = React.forwardRef<HTMLDivElement, ProfessionalCardProps>(
  ({ header, footer, loading, children, className, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(
        'flex flex-col',
        loading && 'animate-pulse',
        className
      )}
      {...props}
    >
      {header && (
        <div className="border-b border-gray-700 p-6 pb-4">
          {header}
        </div>
      )}
      <div className="flex-1 p-6">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2" />
          </div>
        ) : (
          children
        )}
      </div>
      {footer && (
        <div className="border-t border-gray-700 p-6 pt-4">
          {footer}
        </div>
      )}
    </Card>
  )
)
ProfessionalCard.displayName = 'ProfessionalCard'

// Broker-specific card variant
export interface BrokerCardProps extends CardProps {
  brokerName: string
  rating?: number
  features?: string[]
  onCompare?: () => void
  onViewDetails?: () => void
}

const BrokerCard = React.forwardRef<HTMLDivElement, BrokerCardProps>(
  ({ 
    brokerName, 
    rating, 
    features = [], 
    onCompare, 
    onViewDetails,
    className,
    children,
    ...props 
  }, ref) => (
    <Card
      ref={ref}
      variant="broker"
      className={cn('flex flex-col', className)}
      {...props}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle level={4}>{brokerName}</CardTitle>
          {rating && (
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {children}
        {features.length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-300 mb-2">Key Features</h5>
            <ul className="space-y-1">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-gray-400 flex items-center">
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      {(onCompare || onViewDetails) && (
        <CardFooter className="space-x-2">
          {onCompare && (
            <button
              onClick={onCompare}
              className="flex-1 px-3 py-2 text-sm border border-gray-600 rounded-md hover:border-gray-400 transition-colors"
            >
              Compare
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex-1 px-3 py-2 text-sm bg-white text-black rounded-md hover:bg-gray-100 transition-colors"
            >
              View Details
            </button>
          )}
        </CardFooter>
      )}
    </Card>
  )
)
BrokerCard.displayName = 'BrokerCard'

// Tool-specific card variant
export interface ToolCardProps extends CardProps {
  toolName: string
  description: string
  icon?: LucideIcon
  onUse?: () => void
}

const ToolCard = React.forwardRef<HTMLDivElement, ToolCardProps>(
  ({ toolName, description, icon: Icon, onUse, className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="tool"
      className={cn('flex flex-col', className)}
      {...props}
    >
      <CardHeader icon={Icon}>
        <CardTitle level={4}>{toolName}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      {onUse && (
        <CardFooter>
          <button
            onClick={onUse}
            className="w-full px-4 py-2 bg-white text-black rounded-md hover:bg-gray-100 transition-colors font-medium"
          >
            Use Tool
          </button>
        </CardFooter>
      )}
    </Card>
  )
)
ToolCard.displayName = 'ToolCard'

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  ProfessionalCard,
  BrokerCard,
  ToolCard,
  cardVariants,
  type CardProps
}
