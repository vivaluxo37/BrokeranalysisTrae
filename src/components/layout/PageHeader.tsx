import { ReactNode } from 'react'
import { cn, headingClasses, bodyClasses } from '@/lib/style-utils'

/**
 * Page Header Props Interface
 */
export interface PageHeaderProps {
  /** Page title */
  title: string
  /** Page subtitle or description */
  subtitle?: string
  /** Page description */
  description?: string
  /** Header actions (buttons, etc.) */
  actions?: ReactNode
  /** Custom header content */
  children?: ReactNode
  /** Additional CSS classes */
  className?: string
  /** Title level for accessibility */
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Header variant */
  variant?: 'default' | 'centered' | 'minimal'
  /** Whether to show decorative elements */
  showDecorations?: boolean
}

/**
 * Page Header Component
 * 
 * Provides a consistent page header with:
 * - Proper heading hierarchy
 * - Flexible content areas
 * - Responsive design
 * - Accessibility support
 */
export function PageHeader({
  title,
  subtitle,
  description,
  actions,
  children,
  className,
  titleLevel = 1,
  variant = 'default',
  showDecorations = true,
}: PageHeaderProps) {
  const headerClasses = cn(
    'page-header',
    {
      'text-center': variant === 'centered',
      'py-8': variant === 'default',
      'py-4': variant === 'minimal',
    },
    className
  )

  const titleClasses = cn(
    headingClasses(titleLevel),
    {
      'mb-4': subtitle || description || actions,
      'mb-0': !subtitle && !description && !actions,
    }
  )

  const subtitleClasses = cn(
    headingClasses(Math.min(titleLevel + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6),
    'text-light-grey font-normal',
    {
      'mb-4': description || actions,
      'mb-0': !description && !actions,
    }
  )

  const descriptionClasses = cn(
    bodyClasses('large'),
    'text-light-grey max-w-3xl',
    {
      'mx-auto': variant === 'centered',
      'mb-6': actions,
      'mb-0': !actions,
    }
  )

  const actionsClasses = cn(
    'flex items-center gap-4',
    {
      'justify-center': variant === 'centered',
      'justify-start': variant !== 'centered',
    }
  )

  // Create the appropriate heading element
  const HeadingElement = `h${titleLevel}` as keyof JSX.IntrinsicElements

  return (
    <header className={headerClasses} role="banner">
      {/* Decorative Background Elements */}
      {showDecorations && variant === 'default' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
        </div>
      )}

      <div className="relative">
        {/* Title */}
        <HeadingElement className={titleClasses}>
          {title}
        </HeadingElement>

        {/* Subtitle */}
        {subtitle && (
          <div className={subtitleClasses}>
            {subtitle}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className={descriptionClasses}>
            {description}
          </p>
        )}

        {/* Actions */}
        {actions && (
          <div className={actionsClasses}>
            {actions}
          </div>
        )}

        {/* Custom Content */}
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>
    </header>
  )
}

/**
 * Page Header Variants
 */

/**
 * Hero Page Header - Large, centered header for landing pages
 */
export function HeroPageHeader({
  variant = 'centered',
  titleLevel = 1,
  showDecorations = true,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <PageHeader
      {...props}
      variant={variant}
      titleLevel={titleLevel}
      showDecorations={showDecorations}
      className={cn('py-16 md:py-24', className)}
    />
  )
}

/**
 * Section Header - Smaller header for page sections
 */
export function SectionHeader({
  variant = 'default',
  titleLevel = 2,
  showDecorations = false,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <PageHeader
      {...props}
      variant={variant}
      titleLevel={titleLevel}
      showDecorations={showDecorations}
      className={cn('py-6', className)}
    />
  )
}

/**
 * Minimal Header - Simple header for utility pages
 */
export function MinimalHeader({
  variant = 'minimal',
  titleLevel = 1,
  showDecorations = false,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <PageHeader
      {...props}
      variant={variant}
      titleLevel={titleLevel}
      showDecorations={showDecorations}
      className={cn('py-4', className)}
    />
  )
}
