import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { BrokerAnalysisHeader } from './BrokerAnalysisHeader'
import { BrokerAnalysisFooter } from './BrokerAnalysisFooter'
import { cn, skipLinkClasses } from '@/lib/style-utils'

/**
 * Enhanced Layout Props Interface
 * Provides comprehensive configuration options for the base layout
 */
export interface LayoutProps {
  /** Main content to render */
  children: ReactNode
  /** Optional custom header component */
  header?: ReactNode
  /** Optional custom footer component */
  footer?: ReactNode
  /** Whether to show the header (default: true) */
  showHeader?: boolean
  /** Whether to show the footer (default: true) */
  showFooter?: boolean
  /** Additional CSS classes for the layout container */
  className?: string
  /** Custom total traders count for header */
  totalTraders?: number
  /** Whether to enable skip navigation links (default: true) */
  enableSkipLinks?: boolean
  /** Custom skip link targets */
  skipLinks?: Array<{
    href: string
    label: string
    id?: string
  }>
  /** Layout variant for different page types */
  variant?: 'default' | 'minimal' | 'full-width'
  /** Whether to apply responsive padding (default: true) */
  responsivePadding?: boolean
}

/**
 * Enhanced Base Layout Component
 * 
 * Provides a consistent, accessible layout structure with:
 * - Improved TypeScript interfaces
 * - Enhanced accessibility attributes
 * - Responsive design patterns
 * - Skip navigation links
 * - Flexible configuration options
 */
export function Layout({
  children,
  header,
  footer,
  showHeader = true,
  showFooter = true,
  className,
  totalTraders = 2500000,
  enableSkipLinks = true,
  skipLinks,
  variant = 'default',
  responsivePadding = true,
}: LayoutProps) {
  const location = useLocation()
  const [isClient, setIsClient] = useState(false)

  // Track client-side rendering for accessibility features
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Default skip links configuration
  const defaultSkipLinks = [
    { href: '#main-content', label: 'Skip to main content', id: 'skip-main' },
    { href: '#navigation', label: 'Skip to navigation', id: 'skip-nav' },
    { href: '#footer', label: 'Skip to footer', id: 'skip-footer' },
  ]

  const activeSkipLinks = skipLinks || defaultSkipLinks

  // Layout variant classes
  const layoutClasses = cn(
    'min-h-screen flex flex-col',
    'bg-professional-black text-pure-white',
    {
      'container mx-auto max-w-7xl': variant === 'default' && responsivePadding,
      'w-full': variant === 'full-width',
      'max-w-4xl mx-auto': variant === 'minimal',
    },
    className
  )

  // Main content classes
  const mainClasses = cn(
    'flex-1',
    {
      'px-4 sm:px-6 lg:px-8': responsivePadding && variant !== 'full-width',
    }
  )

  /**
   * Handle skip link navigation
   */
  const handleSkipLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const target = document.getElementById(targetId.replace('#', ''))
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  /**
   * Handle skip link keyboard navigation
   */
  const handleSkipLinkKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, targetId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const target = document.getElementById(targetId.replace('#', ''))
      if (target) {
        target.focus()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <div className={layoutClasses}>
      {/* Skip Navigation Links */}
      {enableSkipLinks && isClient && (
        <div 
          className="sr-only focus-within:not-sr-only"
          role="navigation"
          aria-label="Skip navigation links"
        >
          {activeSkipLinks.map((link, index) => (
            <a
              key={link.id || `skip-${index}`}
              href={link.href}
              className={cn(
                skipLinkClasses(),
                'absolute z-[9999]',
                {
                  'top-4 left-4': index === 0,
                  'top-4 left-40': index === 1,
                  'top-4 left-72': index === 2,
                  [`top-4 left-${96 + (index - 3) * 32}`]: index > 2,
                }
              )}
              onClick={(e) => handleSkipLinkClick(e, link.href)}
              onKeyDown={(e) => handleSkipLinkKeyDown(e, link.href)}
              aria-describedby={`${link.id || `skip-${index}`}-description`}
            >
              {link.label}
              <span 
                id={`${link.id || `skip-${index}`}-description`}
                className="sr-only"
              >
                Press Enter or Space to navigate to {link.label.toLowerCase()}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Header */}
      {showHeader && (
        <div role="banner">
          {header || <BrokerAnalysisHeader totalTraders={totalTraders} />}
        </div>
      )}

      {/* Main Content */}
      <main
        id="main-content"
        className={mainClasses}
        tabIndex={-1}
        role="main"
        aria-label="Main content"
        data-pathname={location.pathname}
        style={{ outline: 'none' }}
      >
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <div role="contentinfo">
          {footer || <BrokerAnalysisFooter />}
        </div>
      )}
    </div>
  )
}

/**
 * Layout Variants
 * Pre-configured layout components for common use cases
 */

/**
 * Minimal Layout - For simple pages like auth, errors, etc.
 */
export function MinimalLayout({ children, ...props }: Omit<LayoutProps, 'variant'>) {
  return (
    <Layout
      variant="minimal"
      showHeader={false}
      showFooter={false}
      enableSkipLinks={false}
      {...props}
    >
      {children}
    </Layout>
  )
}

/**
 * Full Width Layout - For pages that need full screen width
 */
export function FullWidthLayout({ children, ...props }: Omit<LayoutProps, 'variant'>) {
  return (
    <Layout
      variant="full-width"
      responsivePadding={false}
      {...props}
    >
      {children}
    </Layout>
  )
}

/**
 * Content Layout - Standard layout with responsive padding
 */
export function ContentLayout({ children, ...props }: Omit<LayoutProps, 'variant'>) {
  return (
    <Layout
      variant="default"
      responsivePadding={true}
      {...props}
    >
      {children}
    </Layout>
  )
}