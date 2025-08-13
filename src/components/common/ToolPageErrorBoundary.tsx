import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, Calculator, ExternalLink, RefreshCw, Settings, Wrench } from 'lucide-react'
import { errorReportingService } from '@/services/ErrorReportingService'

interface Props {
  children: ReactNode
  toolName?: string
  toolType?: string
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
 * Specialized error boundary for tool pages
 * Handles tool-specific errors with appropriate fallback UI and recovery mechanisms
 */
export class ToolPageErrorBoundary extends Component<Props, State> {
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
    // Report error to error reporting service with tool context
    const errorId = errorReportingService.reportError(error, {
      section: 'tool-page',
      component: 'ToolPageErrorBoundary',
      feature: 'tool-functionality',
      metadata: {
        toolName: this.props.toolName,
        toolType: this.props.toolType,
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
        errorType: this.classifyToolError(error),
      },
    })

    this.setState({ errorId })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Auto-retry for recoverable tool errors
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
    }, 2000) // Wait 2 seconds before retrying tool
  }

  shouldAutoRetry = (error: Error): boolean => {
    // Auto-retry for collection and data access errors
    return (
      error.message.includes('Cannot read properties of undefined') ||
      error.message.includes('reading \'add\'') ||
      error.message.includes('collection') ||
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk')
    )
  }

  classifyToolError = (error: Error): string => {
    if (error.message.includes('Cannot read properties of undefined')) {
      if (error.message.includes('reading \'add\'')) {
        return 'collection-method-access'
      }
      return 'undefined-property-access'
    }
    if (error.message.includes('collection')) {
      return 'collection-error'
    }
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'tool-data-fetch'
    }
    if (error.name === 'ChunkLoadError') {
      return 'tool-chunk-load'
    }
    if (error.message.includes('calculation') || error.message.includes('compute')) {
      return 'tool-calculation'
    }
    return 'tool-unknown'
  }

  getToolIcon = () => {
    const toolType = this.props.toolType?.toLowerCase()
    
    if (toolType?.includes('calculator')) {
      return <Calculator className="w-8 h-8 text-gray-400 mr-3" />
    }
    if (toolType?.includes('comparison')) {
      return <Settings className="w-8 h-8 text-gray-400 mr-3" />
    }
    return <Wrench className="w-8 h-8 text-gray-400 mr-3" />
  }

  reportIssue = () => {
    if (this.state.errorId) {
      const subject = encodeURIComponent(`Tool Error: ${this.props.toolName || this.props.toolType || 'Unknown Tool'}`)
      const body = encodeURIComponent(
        `Error ID: ${this.state.errorId}\n` +
        `Tool: ${this.props.toolName || 'Unknown'}\n` +
        `Tool Type: ${this.props.toolType || 'Unknown'}\n` +
        `Error: ${this.state.error?.message || 'Unknown error'}\n` +
        `Error Type: ${this.classifyToolError(this.state.error!)}\n\n` +
        `Please describe what you were trying to do with this tool:`
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

      // Tool-specific error UI
      return (
        <div className="min-h-screen bg-gray-50">
          {/* Header with tool context */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center">
                {this.getToolIcon()}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {this.props.toolName || 'Trading Tool'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {this.props.toolType ? `Type: ${this.props.toolType}` : 'Tool functionality'}
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
                  Tool Temporarily Unavailable
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  {this.props.toolName || 'This tool'} is experiencing technical difficulties. 
                  This could be due to a data processing issue or temporary system problem.
                </p>

                {this.state.isRetrying ? (
                  <div className="flex items-center justify-center text-accent-blue mb-6">
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Reloading tool...
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    {(this.props.enableRetry !== false) && (
                      <button
                        onClick={this.handleRetry}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Try Again
                      </button>
                    )}
                    
                    <a
                      href="/tools"
                      className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      <Wrench className="w-5 h-5 mr-2" />
                      Browse All Tools
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

                {/* Alternative tools */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Try these alternative tools:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <a
                      href="/tools/broker-finder"
                      className="flex items-center p-3 bg-white rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-accent-blue mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Find My Broker</div>
                        <div className="text-gray-500">Get personalized recommendations</div>
                      </div>
                    </a>
                    
                    <a
                      href="/tools/spread-comparison"
                      className="flex items-center p-3 bg-white rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Calculator className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Spread Comparison</div>
                        <div className="text-gray-500">Compare broker spreads</div>
                      </div>
                    </a>
                    
                    <a
                      href="/tools/leverage-calculator"
                      className="flex items-center p-3 bg-white rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Calculator className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Leverage Calculator</div>
                        <div className="text-gray-500">Calculate position sizes</div>
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
                        Retry attempts: {this.state.retryCount}/{this.props.maxRetries || 2}
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
                        <span className="text-red-700 ml-2">{this.classifyToolError(this.state.error)}</span>
                      </div>
                      <div>
                        <strong className="text-red-800">Tool Name:</strong>
                        <span className="text-red-700 ml-2">{this.props.toolName || 'Not provided'}</span>
                      </div>
                      <div>
                        <strong className="text-red-800">Tool Type:</strong>
                        <span className="text-red-700 ml-2">{this.props.toolType || 'Not provided'}</span>
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
 * Higher-order component for wrapping tool components with error boundary
 */
export function withToolErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  toolName?: string,
  toolType?: string,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ToolPageErrorBoundary 
      toolName={toolName} 
      toolType={toolType}
      fallback={fallback}
    >
      <Component {...props} />
    </ToolPageErrorBoundary>
  )

  WrappedComponent.displayName = `withToolErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Tool-specific fallback components
 */
export const ToolDataFallback: React.FC<{
  toolName?: string
  toolType?: string
  onRetry?: () => void
  isRetrying?: boolean
}> = ({ toolName, toolType, onRetry, isRetrying }) => (
  <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
    <div className="flex items-center mb-4">
      <Wrench className="w-6 h-6 text-purple-600 mr-3" />
      <h3 className="text-lg font-semibold text-purple-900">
        Tool Data Unavailable
      </h3>
    </div>
    <p className="text-purple-800 mb-4">
      {toolName || 'This tool'} is having trouble loading its data. 
      This is usually temporary and resolves quickly.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/tools"
        className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-900 rounded-md hover:bg-purple-200 transition-colors"
      >
        <Wrench className="w-4 h-4 mr-2" />
        Browse All Tools
      </a>
    </div>
    {toolType && (
      <p className="text-xs text-purple-600 mt-2">Tool Type: {toolType}</p>
    )}
  </div>
)

export const CalculatorErrorFallback: React.FC<{
  calculatorName?: string
  onRetry?: () => void
  isRetrying?: boolean
}> = ({ calculatorName, onRetry, isRetrying }) => (
  <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
    <div className="flex items-center mb-4">
      <Calculator className="w-6 h-6 text-green-600 mr-3" />
      <h3 className="text-lg font-semibold text-green-900">
        Calculator Error
      </h3>
    </div>
    <p className="text-green-800 mb-4">
      {calculatorName || 'This calculator'} encountered an error during calculation. 
      Please check your inputs and try again.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Recalculating...' : 'Try Again'}
        </button>
      )}
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center px-4 py-2 bg-green-100 text-green-900 rounded-md hover:bg-green-200 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Reset Calculator
      </button>
    </div>
  </div>
)

export const CollectionErrorFallback: React.FC<{
  collectionName?: string
  onRetry?: () => void
  isRetrying?: boolean
}> = ({ collectionName, onRetry, isRetrying }) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-center mb-4">
      <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
      <h3 className="text-lg font-semibold text-red-900">
        Collection Access Error
      </h3>
    </div>
    <p className="text-red-800 mb-4">
      There was an error accessing {collectionName || 'the data collection'}. 
      This might be due to a temporary data synchronization issue.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/tools"
        className="inline-flex items-center px-4 py-2 bg-red-100 text-red-900 rounded-md hover:bg-red-200 transition-colors"
      >
        <Wrench className="w-4 h-4 mr-2" />
        Browse Other Tools
      </a>
    </div>
  </div>
)
