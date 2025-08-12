import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/style-utils'

/**
 * Breadcrumb Item Interface
 */
export interface BreadcrumbItem {
  /** Display label for the breadcrumb */
  label: string
  /** URL to navigate to (optional for current page) */
  href?: string
  /** Whether this is the current page */
  current?: boolean
  /** Icon to display (optional) */
  icon?: React.ComponentType<{ className?: string }>
  /** Additional data for structured data */
  position?: number
}

/**
 * Breadcrumb Props Interface
 */
export interface BreadcrumbProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[]
  /** Whether to show home icon (default: true) */
  showHomeIcon?: boolean
  /** Custom separator component */
  separator?: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** Maximum number of items to show before truncation */
  maxItems?: number
  /** Whether to enable structured data (default: true) */
  enableStructuredData?: boolean
}

/**
 * Breadcrumb Navigation Component
 * 
 * Provides accessible breadcrumb navigation with:
 * - Structured data for SEO
 * - Keyboard navigation support
 * - Screen reader compatibility
 * - Responsive design
 * - Customizable appearance
 */
export function Breadcrumb({
  items,
  showHomeIcon = true,
  separator,
  className,
  maxItems = 5,
  enableStructuredData = true,
}: BreadcrumbProps) {
  // Filter out empty items and ensure proper structure
  const validItems = items.filter(item => item.label && item.label.trim() !== '')
  
  // Add home item if not present and showHomeIcon is true
  const breadcrumbItems = showHomeIcon && validItems[0]?.label !== 'Home' 
    ? [{ label: 'Home', href: '/', icon: Home, position: 1 }, ...validItems.map((item, index) => ({ ...item, position: index + 2 }))]
    : validItems.map((item, index) => ({ ...item, position: index + 1 }))

  // Handle truncation if there are too many items
  const displayItems = breadcrumbItems.length > maxItems
    ? [
        breadcrumbItems[0], // Always show first item (Home)
        { label: '...', href: undefined, current: false, position: 2 },
        ...breadcrumbItems.slice(-2) // Show last 2 items
      ]
    : breadcrumbItems

  // Generate structured data for SEO
  const structuredData = enableStructuredData ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position || index + 1,
      name: item.label,
      ...(item.href ? { item: window.location.origin + item.href } : {}),
    })),
  } : null

  // Default separator
  const defaultSeparator = (
    <ChevronRight 
      className="w-4 h-4 text-light-grey" 
      aria-hidden="true"
    />
  )

  /**
   * Handle keyboard navigation for breadcrumb links
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (href) {
        // Use React Router navigation instead of window.location
        const event = new CustomEvent('breadcrumb-navigate', { detail: { href } })
        window.dispatchEvent(event)
      }
    }
  }

  /**
   * Handle focus management for keyboard navigation
   */
  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    // Announce the breadcrumb item to screen readers
    const announcement = `Breadcrumb link: ${e.currentTarget.textContent}`
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = announcement
    document.body.appendChild(announcer)
    
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }

  if (displayItems.length === 0) {
    return null
  }

  return (
    <>
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <nav
        className={cn(
          'flex items-center space-x-2 text-sm',
          className
        )}
        role="navigation"
        aria-label="Breadcrumb navigation"
      >
        <ol className="flex items-center space-x-2" role="list">
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1
            const isTruncated = item.label === '...'
            const Icon = item.icon

            return (
              <Fragment key={`${item.label}-${index}`}>
                <li
                  className={cn(
                    'flex items-center',
                    {
                      'text-light-grey': !item.current && !isLast,
                      'text-pure-white font-medium': item.current || isLast,
                    }
                  )}
                  role="listitem"
                >
                  {isTruncated ? (
                    <span
                      className="text-light-grey px-2"
                      aria-label="More breadcrumb items"
                    >
                      {item.label}
                    </span>
                  ) : item.href && !item.current ? (
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center space-x-1 hover:text-pure-white',
                        'focus:text-pure-white focus:outline-none',
                        'focus:ring-2 focus:ring-accent-blue focus:ring-offset-2',
                        'focus:ring-offset-professional-black rounded-sm',
                        'px-2 py-1 -mx-2 -my-1 transition-all duration-200',
                        'hover:bg-charcoal-grey/50 focus:bg-charcoal-grey/50'
                      )}
                      onKeyDown={(e) => handleKeyDown(e, item.href!)}
                      onFocus={handleFocus}
                      aria-current={item.current ? 'page' : undefined}
                      aria-describedby={`breadcrumb-${index}-desc`}
                    >
                      {Icon && (
                        <Icon 
                          className="w-4 h-4" 
                          aria-hidden="true"
                        />
                      )}
                      <span>{item.label}</span>
                      <span 
                        id={`breadcrumb-${index}-desc`} 
                        className="sr-only"
                      >
                        Navigate to {item.label} page
                      </span>
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        'flex items-center space-x-1',
                        {
                          'cursor-default': item.current || isLast,
                        }
                      )}
                      aria-current={item.current || isLast ? 'page' : undefined}
                    >
                      {Icon && (
                        <Icon 
                          className="w-4 h-4" 
                          aria-hidden="true"
                        />
                      )}
                      <span>{item.label}</span>
                    </span>
                  )}
                </li>

                {/* Separator */}
                {!isLast && (
                  <li className="flex items-center" aria-hidden="true">
                    {separator || defaultSeparator}
                  </li>
                )}
              </Fragment>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

/**
 * Breadcrumb Utilities
 */

/**
 * Generate breadcrumbs from pathname
 */
export function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  
  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    return {
      label,
      href,
      current: index === segments.length - 1,
      position: index + 2, // +2 because Home is position 1
    }
  })
}

/**
 * Create breadcrumbs for broker pages
 */
export function createBrokerBreadcrumbs(brokerName: string): BreadcrumbItem[] {
  return [
    { label: 'Brokers', href: '/brokers', position: 2 },
    { label: brokerName, current: true, position: 3 },
  ]
}

/**
 * Create breadcrumbs for comparison pages
 */
export function createComparisonBreadcrumbs(comparisonType?: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Compare', href: '/compare', position: 2 },
  ]
  
  if (comparisonType) {
    breadcrumbs.push({
      label: comparisonType
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      current: true,
      position: 3,
    })
  }
  
  return breadcrumbs
}

/**
 * Create breadcrumbs for tool pages
 */
export function createToolBreadcrumbs(toolName: string): BreadcrumbItem[] {
  return [
    { label: 'Tools', href: '/tools', position: 2 },
    { label: toolName, current: true, position: 3 },
  ]
}

/**
 * Create breadcrumbs for education pages
 */
export function createEducationBreadcrumbs(category?: string, article?: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Education', href: '/education', position: 2 },
  ]
  
  if (category) {
    breadcrumbs.push({
      label: category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      href: `/education/${category}`,
      position: 3,
    })
  }
  
  if (article) {
    breadcrumbs.push({
      label: article
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      current: true,
      position: 4,
    })
  }
  
  return breadcrumbs
}

/**
 * Create breadcrumbs for news pages
 */
export function createNewsBreadcrumbs(category?: string, article?: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'News', href: '/news', position: 2 },
  ]
  
  if (category) {
    breadcrumbs.push({
      label: category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      href: `/news/${category}`,
      position: 3,
    })
  }
  
  if (article) {
    breadcrumbs.push({
      label: article
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      current: true,
      position: 4,
    })
  }
  
  return breadcrumbs
}
