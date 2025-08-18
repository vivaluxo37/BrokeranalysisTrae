import { ReactNode, Component } from 'react'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn, containerClasses, headingClasses, bodyClasses } from '@/lib/style-utils'

/**
 * Page Error Fallback Props Interface
 */
export interface PageErrorFallbackProps {
  /** Error object */
  error?: Error | null
  /** Function to reset error boundary */
  resetErrorBoundary?: () => void
  /** Custom error title */
  title?: string
  /** Custom error message */
  message?: string
  /** Custom error icon */
  icon?: ReactNode
  /** Error variant */
  variant?: 'default' | 'minimal' | 'full-page'
  /** Additional CSS classes */
  className?: string
  /** Whether to show technical details */
  showDetails?: boolean
  /** Custom actions */
  actions?: ReactNode
  /** Whether to show navigation options */
  showNavigation?: boolean
}

/**
 * Page Error Fallback Component
 * 
 * Provides consistent error handling with:
 * - User-friendly error messages
 * - Recovery actions
 * - Navigation options
 * - Accessibility support
 * - Technical details (in development)
 */
export function PageErrorFallback({
  error,
  resetErrorBoundary,
  title,
  message,
  icon,
  variant = 'default',
  className,
  showDetails = import.meta.env.DEV,
  actions,
  showNavigation = true,
}: PageErrorFallbackProps) {
  // Default error messages
  const defaultTitle = title || 'Something went wrong'
  const defaultMessage = message || 'We encountered an unexpected error. Please try again or contact support if the problem persists.'

  // Error type detection
  const isNetworkError = error?.message?.includes('fetch') || error?.message?.includes('network')
  const isNotFoundError = error?.message?.includes('404') || error?.message?.includes('not found')
  const isPermissionError = error?.message?.includes('403') || error?.message?.includes('unauthorized')

  // Contextual error messages
  const getContextualMessage = () => {
    if (isNetworkError) {
      return 'Unable to connect to our servers. Please check your internet connection and try again.'
    }
    if (isNotFoundError) {
      return 'The page or resource you\'re looking for could not be found.'
    }
    if (isPermissionError) {
      return 'You don\'t have permission to access this resource. Please sign in or contact support.'
    }
    return defaultMessage
  }

  const containerClass = cn(
    {
      'min-h-screen flex items-center justify-center': variant === 'full-page',
      'py-16 flex items-center justify-center': variant === 'default',
      'py-8 text-center': variant === 'minimal',
    },
    className
  )

  const contentClass = cn(
    'text-center max-w-md mx-auto',
    {
      'max-w-2xl': variant === 'full-page',
    }
  )

  /**
   * Handle retry action
   */
  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary()
    } else {
      window.location.reload()
    }
  }

  /**
   * Handle go back action
   */
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className={containerClass} role="alert" aria-live="assertive">
      <div className={contentClass}>
        {/* Error Icon */}
        <div className="mb-6">
          {icon || (
            <AlertTriangle 
              className="w-16 h-16 text-warning mx-auto" 
              aria-hidden="true"
            />
          )}
        </div>

        {/* Error Title */}
        <h1 className={cn(headingClasses(1), 'mb-4')}>
          {defaultTitle}
        </h1>

        {/* Error Message */}
        <p className={cn(bodyClasses('large'), 'text-light-grey mb-8')}>
          {getContextualMessage()}
        </p>

        {/* Error Details (Development Only) */}
        {showDetails && error && (
          <details className="mb-8 text-left bg-charcoal-grey rounded-lg p-4">
            <summary className="cursor-pointer text-sm font-medium text-light-grey mb-2">
              Technical Details
            </summary>
            <div className="text-xs text-light-grey font-mono">
              <p className="mb-2">
                <strong>Error:</strong> {error.name}
              </p>
              <p className="mb-2">
                <strong>Message:</strong> {error.message}
              </p>
              {error.stack && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className="mt-1 whitespace-pre-wrap text-xs">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Actions */}
        <div className="space-y-4">
          {/* Custom Actions */}
          {actions && (
            <div className="mb-4">
              {actions}
            </div>
          )}

          {/* Default Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Retry Button */}
            <Button
              onClick={handleRetry}
              className="flex items-center gap-2"
              aria-label="Retry the failed operation"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </Button>

            {/* Navigation Options */}
            {showNavigation && (
              <>
                <Button
                  variant="outline"
                  onClick={handleGoBack}
                  className="flex items-center gap-2"
                  aria-label="Go back to the previous page"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Go Back
                </Button>

                <Button
                  variant="ghost"
                  asChild
                  className="flex items-center gap-2"
                >
                  <Link to="/" aria-label="Return to homepage">
                    <Home className="w-4 h-4" aria-hidden="true" />
                    Home
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Support Information */}
        {variant !== 'minimal' && (
          <div className="mt-8 pt-6 border-t border-medium-grey">
            <p className="text-sm text-light-grey">
              If this problem continues, please{' '}
              <Link 
                to="/contact" 
                className="text-primary hover:underline focus:underline focus:outline-none"
              >
                contact our support team
              </Link>
              {' '}for assistance.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Error Fallback Variants
 */

/**
 * Network Error Fallback
 */
export function NetworkErrorFallback({ resetErrorBoundary }: { resetErrorBoundary?: () => void }) {
  return (
    <PageErrorFallback
      title="Connection Problem"
      message="Unable to connect to our servers. Please check your internet connection and try again."
      resetErrorBoundary={resetErrorBoundary}
      icon={<AlertTriangle className="w-16 h-16 text-warning mx-auto" />}
    />
  )
}

/**
 * Not Found Error Fallback
 */
export function NotFoundErrorFallback() {
  return (
    <PageErrorFallback
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      icon={<AlertTriangle className="w-16 h-16 text-warning mx-auto" />}
      showNavigation={true}
    />
  )
}

/**
 * Permission Error Fallback
 */
export function PermissionErrorFallback() {
  return (
    <PageErrorFallback
      title="Access Denied"
      message="You don't have permission to access this resource. Please sign in or contact support."
      icon={<AlertTriangle className="w-16 h-16 text-error mx-auto" />}
      actions={
        <Button asChild>
          <Link to="/auth/signin">Sign In</Link>
        </Button>
      }
    />
  )
}

/**
 * Minimal Error Fallback
 */
export function MinimalErrorFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error?: Error
  resetErrorBoundary?: () => void 
}) {
  return (
    <PageErrorFallback
      error={error}
      resetErrorBoundary={resetErrorBoundary}
      variant="minimal"
      showNavigation={false}
      showDetails={false}
    />
  )
}

/**
 * Simple Error Boundary Component
 */
class SimpleErrorBoundary extends Component<
  { children: ReactNode; fallback: (error: Error, reset: () => void) => ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback: (error: Error, reset: () => void) => ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error, this.reset)
    }

    return this.props.children
  }
}

/**
 * Error Boundary Wrapper
 * 
 * Higher-order component that wraps content with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<PageErrorFallbackProps>
) {
  return function WrappedComponent(props: P) {
    const FallbackComponent = fallback || PageErrorFallback

    return (
      <SimpleErrorBoundary
        fallback={(error, reset) => (
          <FallbackComponent error={error} resetErrorBoundary={reset} />
        )}
      >
        <Component {...props} />
      </SimpleErrorBoundary>
    )
  }
}

/**
 * Error Utilities
 */

/**
 * Create error fallback with custom message
 */
export function createErrorFallback(
  title: string, 
  message: string, 
  resetErrorBoundary?: () => void
) {
  return (
    <PageErrorFallback
      title={title}
      message={message}
      resetErrorBoundary={resetErrorBoundary}
    />
  )
}

/**
 * Error fallbacks for specific scenarios
 */
export const ErrorFallbacks = {
  network: (reset?: () => void) => <NetworkErrorFallback resetErrorBoundary={reset} />,
  notFound: () => <NotFoundErrorFallback />,
  permission: () => <PermissionErrorFallback />,
  minimal: (error?: Error, reset?: () => void) => (
    <MinimalErrorFallback error={error} resetErrorBoundary={reset} />
  ),
  generic: (error?: Error, reset?: () => void) => (
    <PageErrorFallback error={error} resetErrorBoundary={reset} />
  ),
}
