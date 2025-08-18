import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, BookOpen, ExternalLink, GraduationCap, RefreshCw, Users } from 'lucide-react'
import { errorReportingService } from '@/services/ErrorReportingService'

interface Props {
  children: ReactNode
  contentType?: string
  contentTitle?: string
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
 * Specialized error boundary for education pages
 * Handles education-specific errors with appropriate fallback UI and recovery mechanisms
 */
export class EducationPageErrorBoundary extends Component<Props, State> {
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
    // Report error to error reporting service with education context
    const errorId = errorReportingService.reportError(error, {
      section: 'education-page',
      component: 'EducationPageErrorBoundary',
      feature: 'education-content',
      metadata: {
        contentType: this.props.contentType,
        contentTitle: this.props.contentTitle,
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
        errorType: this.classifyEducationError(error),
      },
    })

    this.setState({ errorId })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Auto-retry for recoverable education content errors
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
    }, 2000) // Wait 2 seconds before retrying education content
  }

  shouldAutoRetry = (error: Error): boolean => {
    // Auto-retry for content loading and undefined access errors
    return (
      error.message.includes('Cannot read properties of undefined') ||
      error.message.includes('content') ||
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk')
    )
  }

  classifyEducationError = (error: Error): string => {
    if (error.message.includes('Cannot read properties of undefined')) {
      return 'content-property-access'
    }
    if (error.message.includes('content') && error.message.includes('not found')) {
      return 'content-not-found'
    }
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'content-fetch-error'
    }
    if (error.name === 'ChunkLoadError') {
      return 'content-chunk-load'
    }
    if (error.message.includes('undefined') && error.message.includes('link')) {
      return 'content-link-error'
    }
    return 'education-unknown'
  }

  getContentIcon = () => {
    const contentType = this.props.contentType?.toLowerCase()
    
    if (contentType?.includes('course') || contentType?.includes('lesson')) {
      return <GraduationCap className="w-8 h-8 text-gray-400 mr-3" />
    }
    if (contentType?.includes('article') || contentType?.includes('guide')) {
      return <BookOpen className="w-8 h-8 text-gray-400 mr-3" />
    }
    if (contentType?.includes('community') || contentType?.includes('forum')) {
      return <Users className="w-8 h-8 text-gray-400 mr-3" />
    }
    return <BookOpen className="w-8 h-8 text-gray-400 mr-3" />
  }

  reportIssue = () => {
    if (this.state.errorId) {
      const subject = encodeURIComponent(`Education Content Error: ${this.props.contentTitle || this.props.contentType || 'Unknown Content'}`)
      const body = encodeURIComponent(
        `Error ID: ${this.state.errorId}\n` +
        `Content: ${this.props.contentTitle || 'Unknown'}\n` +
        `Content Type: ${this.props.contentType || 'Unknown'}\n` +
        `Error: ${this.state.error?.message || 'Unknown error'}\n` +
        `Error Type: ${this.classifyEducationError(this.state.error!)}\n\n` +
        `Please describe what educational content you were trying to access:`
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

      // Education-specific error UI
      return (
        <div className="min-h-screen bg-gray-50">
          {/* Header with education context */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center">
                {this.getContentIcon()}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {this.props.contentTitle || 'Educational Content'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {this.props.contentType ? `Type: ${this.props.contentType}` : 'Learning resources'}
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
                  Educational Content Unavailable
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  We're having trouble loading {this.props.contentTitle || 'this educational content'}. 
                  This could be due to a temporary content issue or network problem.
                </p>

                {this.state.isRetrying ? (
                  <div className="flex items-center justify-center text-accent-blue mb-6">
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Reloading content...
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
                      href="/education"
                      className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Browse All Education
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

                {/* Alternative educational content */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Explore other educational resources:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <a
                      href="/education/beginner"
                      className="flex items-center p-3 bg-white rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <GraduationCap className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Beginner Guides</div>
                        <div className="text-gray-500">Start your trading journey</div>
                      </div>
                    </a>
                    
                    <a
                      href="/education/trading-basics"
                      className="flex items-center p-3 bg-white rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <BookOpen className="w-5 h-5 text-accent-blue mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Trading Basics</div>
                        <div className="text-gray-500">Essential trading concepts</div>
                      </div>
                    </a>
                    
                    <a
                      href="/education/glossary"
                      className="flex items-center p-3 bg-white rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <BookOpen className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Trading Glossary</div>
                        <div className="text-gray-500">Learn trading terminology</div>
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
                {import.meta.env.DEV && this.state.error && (
                  <details className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                    <summary className="cursor-pointer text-red-800 font-medium mb-2">
                      Error Details (Development)
                    </summary>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong className="text-red-800">Error Type:</strong>
                        <span className="text-red-700 ml-2">{this.classifyEducationError(this.state.error)}</span>
                      </div>
                      <div>
                        <strong className="text-red-800">Content Title:</strong>
                        <span className="text-red-700 ml-2">{this.props.contentTitle || 'Not provided'}</span>
                      </div>
                      <div>
                        <strong className="text-red-800">Content Type:</strong>
                        <span className="text-red-700 ml-2">{this.props.contentType || 'Not provided'}</span>
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
 * Higher-order component for wrapping education components with error boundary
 */
export function withEducationErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  contentType?: string,
  contentTitle?: string,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <EducationPageErrorBoundary 
      contentType={contentType} 
      contentTitle={contentTitle}
      fallback={fallback}
    >
      <Component {...props} />
    </EducationPageErrorBoundary>
  )

  WrappedComponent.displayName = `withEducationErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Education-specific fallback components
 */
export const EducationContentFallback: React.FC<{
  contentTitle?: string
  contentType?: string
  onRetry?: () => void
  isRetrying?: boolean
}> = ({ contentTitle, contentType, onRetry, isRetrying }) => (
  <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-center mb-4">
      <BookOpen className="w-6 h-6 text-accent-blue mr-3" />
      <h3 className="text-lg font-semibold text-blue-900">
        Content Unavailable
      </h3>
    </div>
    <p className="text-blue-800 mb-4">
      {contentTitle || 'This educational content'} is temporarily unavailable. 
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
        href="/education"
        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-900 rounded-md hover:bg-blue-200 transition-colors"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Browse All Education
      </a>
    </div>
    {contentType && (
      <p className="text-xs text-accent-blue mt-2">Content Type: {contentType}</p>
    )}
  </div>
)

export const CourseErrorFallback: React.FC<{
  courseName?: string
  onRetry?: () => void
  isRetrying?: boolean
}> = ({ courseName, onRetry, isRetrying }) => (
  <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
    <div className="flex items-center mb-4">
      <GraduationCap className="w-6 h-6 text-green-600 mr-3" />
      <h3 className="text-lg font-semibold text-green-900">
        Course Unavailable
      </h3>
    </div>
    <p className="text-green-800 mb-4">
      {courseName || 'This course'} is currently unavailable. 
      Please try again or explore other courses.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/education/courses"
        className="inline-flex items-center px-4 py-2 bg-green-100 text-green-900 rounded-md hover:bg-green-200 transition-colors"
      >
        <GraduationCap className="w-4 h-4 mr-2" />
        Browse All Courses
      </a>
    </div>
  </div>
)

export const ArticleErrorFallback: React.FC<{
  articleTitle?: string
  onRetry?: () => void
  isRetrying?: boolean
}> = ({ articleTitle, onRetry, isRetrying }) => (
  <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
    <div className="flex items-center mb-4">
      <BookOpen className="w-6 h-6 text-purple-600 mr-3" />
      <h3 className="text-lg font-semibold text-purple-900">
        Article Unavailable
      </h3>
    </div>
    <p className="text-purple-800 mb-4">
      {articleTitle || 'This article'} could not be loaded. 
      Please try again or browse other articles.
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
        href="/education/articles"
        className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-900 rounded-md hover:bg-purple-200 transition-colors"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Browse All Articles
      </a>
    </div>
  </div>
)

export const EducationLinkErrorFallback: React.FC<{
  linkText?: string
  onRetry?: () => void
  isRetrying?: boolean
}> = ({ linkText, onRetry, isRetrying }) => (
  <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
    <div className="flex items-center mb-4">
      <AlertTriangle className="w-6 h-6 text-amber-600 mr-3" />
      <h3 className="text-lg font-semibold text-amber-900">
        Link Error
      </h3>
    </div>
    <p className="text-amber-800 mb-4">
      The link {linkText ? `"${linkText}"` : 'you clicked'} appears to be broken or unavailable. 
      This might be due to content being moved or temporarily unavailable.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/education"
        className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-900 rounded-md hover:bg-amber-200 transition-colors"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Back to Education
      </a>
    </div>
  </div>
)
