import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, Bug, ExternalLink, RefreshCw } from 'lucide-react'
import { errorReportingService } from '@/services/ErrorReportingService'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  section?: string
  component?: string
  feature?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  enableRetry?: boolean
  maxRetries?: number
}

interface State {
  hasError: boolean
  error?: Error
  errorId?: string
  retryCount: number
  isRetrying: boolean
}

/**
 * Error boundary component for homepage sections
 * Provides graceful degradation when components fail
 */
export class HomepageErrorBoundary extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout

  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false, 
      retryCount: 0,
      isRetrying: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report error to error reporting service
    const errorId = errorReportingService.reportError(error, {
      section: this.props.section || 'unknown',
      component: this.props.component,
      feature: this.props.feature,
      metadata: {
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
      },
    })

    this.setState({ errorId })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Auto-retry for certain types of errors
    if (this.shouldAutoRetry(error) && this.state.retryCount < (this.props.maxRetries || 2)) {
      this.scheduleRetry()
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorId: undefined,
      retryCount: this.state.retryCount + 1,
      isRetrying: false,
    })
  }

  scheduleRetry = () => {
    this.setState({ isRetrying: true })
    this.retryTimeout = setTimeout(() => {
      this.handleRetry()
    }, 2000) // Wait 2 seconds before retrying
  }

  shouldAutoRetry = (error: Error): boolean => {
    // Auto-retry for network errors and chunk loading errors
    return (
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk') ||
      error.message.includes('fetch') ||
      error.message.includes('network')
    )
  }

  reportIssue = () => {
    if (this.state.errorId) {
      // In a real implementation, this could open a support ticket
      // or redirect to a feedback form with the error ID pre-filled
      const subject = encodeURIComponent(`Error Report: ${this.props.section}`)
      const body = encodeURIComponent(
        `Error ID: ${this.state.errorId}\n` +
        `Section: ${this.props.section}\n` +
        `Component: ${this.props.component || 'N/A'}\n` +
        `Error: ${this.state.error?.message || 'Unknown error'}\n\n` +
        `Please describe what you were doing when this error occurred:`
      )
      
      window.open(`mailto:support@brokeranalysis.com?subject=${subject}&body=${body}`)
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 text-center mb-4 max-w-md">
            {this.props.section 
              ? `The ${this.props.section} section encountered an error and couldn't load properly.`
              : 'This section encountered an error and couldn\'t load properly.'
            }
          </p>
          
          {this.state.isRetrying ? (
            <div className="flex items-center text-accent-blue mb-4">
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Retrying...
            </div>
          ) : (
            <div className="flex gap-2 mb-4">
              {(this.props.enableRetry !== false) && (
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              )}
              
              {this.state.errorId && (
                <button
                  onClick={this.reportIssue}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Report Issue
                </button>
              )}
            </div>
          )}

          {this.state.errorId && (
            <p className="text-xs text-gray-500 mb-4">
              Error ID: {this.state.errorId}
            </p>
          )}

          {this.state.retryCount > 0 && (
            <p className="text-xs text-gray-500 mb-4">
              Retry attempts: {this.state.retryCount}/{this.props.maxRetries || 2}
            </p>
          )}

          {import.meta.env.DEV && this.state.error && (
            <details className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md w-full max-w-2xl">
              <summary className="cursor-pointer text-red-800 font-medium">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap overflow-auto">
                {this.state.error.stack}
              </pre>
              {this.state.errorId && (
                <div className="mt-2 text-sm text-red-700">
                  <strong>Error ID:</strong> {this.state.errorId}
                </div>
              )}
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  section?: string,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <HomepageErrorBoundary section={section} fallback={fallback}>
      <Component {...props} />
    </HomepageErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Fallback components for different sections
 */
export const SearchFallback = () => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <p className="text-gray-600">Search is temporarily unavailable. Please try again later.</p>
  </div>
)

export const AIFallback = () => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <p className="text-gray-600">AI assistant is temporarily unavailable. Please try again later.</p>
  </div>
)

export const BrokerComparisonFallback = () => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <p className="text-gray-600">Broker comparison is temporarily unavailable. Please try again later.</p>
  </div>
)

export const AuthFallback = () => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <p className="text-gray-600">Authentication is temporarily unavailable. Please try again later.</p>
  </div>
)
