import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, Building2, ExternalLink, RefreshCw, TrendingUp } from 'lucide-react'
import { errorReportingService } from '@/services/ErrorReportingService'
import type { Broker } from '@/types/brokerTypes'

interface Props {
  children: ReactNode
  brokerId?: string
  brokerName?: string
  fallback?: ReactNode
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
 * Specialized error boundary for broker pages
 * Handles broker-specific errors with appropriate fallback UI and recovery mechanisms
 */
export class BrokerPageErrorBoundary extends Component<Props, State> {
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
    // Report error to error reporting service with broker context
    const errorId = errorReportingService.reportError(error, {
      section: 'broker-page',
      component: 'BrokerPageErrorBoundary',
      feature: 'broker-data-loading',
      metadata: {
        brokerId: this.props.brokerId,
        brokerName: this.props.brokerName,
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
        errorType: this.classifyBrokerError(error),
      },
    })

    this.setState({ errorId })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Auto-retry for recoverable broker data errors
    if (this.shouldAutoRetry(error) && this.state.retryCount < (this.props.maxRetries || 3)) {
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
    }, 3000) // Wait 3 seconds before retrying broker data
  }

  shouldAutoRetry = (error: Error): boolean => {
    // Auto-retry for broker data loading errors
    return (
      error.message.includes('broker is not defined') ||
      error.message.includes('Cannot read properties of undefined') ||
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk')
    )
  }

  classifyBrokerError = (error: Error): string => {
    if (error.message.includes('broker is not defined')) {
      return 'broker-data-missing'
    }
    if (error.message.includes('Cannot read properties of undefined')) {
      return 'broker-property-access'
    }
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'broker-data-fetch'
    }
    if (error.name === 'ChunkLoadError') {
      return 'broker-chunk-load'
    }
    return 'broker-unknown'
  }

  reportIssue = () => {
    if (this.state.errorId) {
      const subject = encodeURIComponent(`Broker Page Error: ${this.props.brokerName || this.props.brokerId || 'Unknown'}`)
      const body = encodeURIComponent(
        `Error ID: ${this.state.errorId}\n` +
        `Broker: ${this.props.brokerName || 'Unknown'}\n` +
        `Broker ID: ${this.props.brokerId || 'Unknown'}\n` +
        `Error: ${this.state.error?.message || 'Unknown error'}\n` +
        `Error Type: ${this.classifyBrokerError(this.state.error!)}\n\n` +
        `Please describe what you were trying to do with this broker page:`
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

      // Broker-specific error UI
      return (
        <div className="min-h-screen bg-gray-50">
          {/* Header with broker context */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-gray-400 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {this.props.brokerName || 'Broker Page'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {this.props.brokerId ? `ID: ${this.props.brokerId}` : 'Broker information'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Broker Information Unavailable
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  We're having trouble loading information for {this.props.brokerName || 'this broker'}. 
                  This could be due to a temporary data issue or network problem.
                </p>

                {this.state.isRetrying ? (
                  <div className="flex items-center justify-center text-blue-600 mb-6">
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Reloading broker information...
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    {(this.props.enableRetry !== false) && (
                      <button
                        onClick={this.handleRetry}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Try Loading Again
                      </button>
                    )}
                    
                    <a
                      href="/brokers"
                      className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Browse All Brokers
                    </a>

                    {this.state.errorId && (
                      <button
                        onClick={this.reportIssue}
                        className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Report Issue
                      </button>
                    )}
                  </div>
                )}

                {/* Alternative actions */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    What you can do instead:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <a
                      href="/brokers"
                      className="flex items-center p-3 bg-white rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Browse Brokers</div>
                        <div className="text-gray-500">View all available brokers</div>
                      </div>
                    </a>
                    
                    <a
                      href="/tools/broker-finder"
                      className="flex items-center p-3 bg-white rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Building2 className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Find My Broker</div>
                        <div className="text-gray-500">Get personalized recommendations</div>
                      </div>
                    </a>
                    
                    <a
                      href="/comparison"
                      className="flex items-center p-3 bg-white rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <TrendingUp className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Compare Brokers</div>
                        <div className="text-gray-500">Side-by-side comparison</div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Error details */}
                {this.state.errorId && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-2">
                      Error ID: {this.state.errorId}
                    </p>
                    {this.state.retryCount > 0 && (
                      <p className="text-xs text-gray-500">
                        Retry attempts: {this.state.retryCount}/{this.props.maxRetries || 3}
                      </p>
                    )}
                  </div>
                )}

                {/* Development error details */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                    <summary className="cursor-pointer text-red-800 font-medium mb-2">
                      Error Details (Development)
                    </summary>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong className="text-red-800">Error Type:</strong>
                        <span className="text-red-700 ml-2">{this.classifyBrokerError(this.state.error)}</span>
                      </div>
                      <div>
                        <strong className="text-red-800">Broker ID:</strong>
                        <span className="text-red-700 ml-2">{this.props.brokerId || 'Not provided'}</span>
                      </div>
                      <div>
                        <strong className="text-red-800">Broker Name:</strong>
                        <span className="text-red-700 ml-2">{this.props.brokerName || 'Not provided'}</span>
                      </div>
                      <pre className="text-red-700 whitespace-pre-wrap overflow-auto bg-red-100 p-2 rounded">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Higher-order component for wrapping broker components with error boundary
 */
export function withBrokerErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  brokerId?: string,
  brokerName?: string,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <BrokerPageErrorBoundary 
      brokerId={brokerId} 
      brokerName={brokerName}
      fallback={fallback}
    >
      <Component {...props} />
    </BrokerPageErrorBoundary>
  )

  WrappedComponent.displayName = `withBrokerErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Broker-specific fallback components
 */
export const BrokerDataFallback: React.FC<{
  brokerId?: string
  brokerName?: string
  onRetry?: () => void
  isRetrying?: boolean
}> = ({ brokerId, brokerName, onRetry, isRetrying }) => (
  <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-center mb-4">
      <Building2 className="w-6 h-6 text-blue-600 mr-3" />
      <h3 className="text-lg font-semibold text-blue-900">
        Broker Data Unavailable
      </h3>
    </div>
    <p className="text-blue-800 mb-4">
      We're having trouble loading information for {brokerName || 'this broker'}. 
      This is usually temporary and resolves quickly.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/brokers"
        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-900 rounded-md hover:bg-blue-200 transition-colors"
      >
        <TrendingUp className="w-4 h-4 mr-2" />
        Browse All Brokers
      </a>
    </div>
    {brokerId && (
      <p className="text-xs text-blue-600 mt-2">Broker ID: {brokerId}</p>
    )}
  </div>
)

export const BrokerNotFoundFallback: React.FC<{
  brokerId?: string
  brokerName?: string
}> = ({ brokerId, brokerName }) => (
  <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
    <div className="flex items-center mb-4">
      <AlertTriangle className="w-6 h-6 text-amber-600 mr-3" />
      <h3 className="text-lg font-semibold text-amber-900">
        Broker Not Found
      </h3>
    </div>
    <p className="text-amber-800 mb-4">
      The broker {brokerName || brokerId || 'you\'re looking for'} could not be found. 
      It may have been removed or the link may be incorrect.
    </p>
    <div className="flex gap-3">
      <a
        href="/brokers"
        className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
      >
        <TrendingUp className="w-4 h-4 mr-2" />
        Browse All Brokers
      </a>
      <a
        href="/tools/broker-finder"
        className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-900 rounded-md hover:bg-amber-200 transition-colors"
      >
        <Building2 className="w-4 h-4 mr-2" />
        Find My Broker
      </a>
    </div>
  </div>
)