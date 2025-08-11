import React from 'react'
import { 
  AlertCircle, 
  Bot, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Shield,
  TrendingUp,
  User
} from 'lucide-react'

interface FallbackProps {
  onRetry?: () => void
  isRetrying?: boolean
  errorMessage?: string
}

/**
 * Search functionality fallback
 */
export const SearchFallback: React.FC<FallbackProps> = ({ onRetry, isRetrying, errorMessage }) => (
  <div className="p-6 bg-blue-900 border border-blue-700 rounded-lg">
    <div className="flex items-center mb-4">
      <Search className="w-6 h-6 text-blue-300 mr-3" />
      <h3 className="text-lg font-semibold text-blue-100">Search Temporarily Unavailable</h3>
    </div>
    <p className="text-blue-200 mb-4">
      Our search functionality is currently experiencing issues. You can still browse brokers manually or try again in a moment.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-900 rounded-md hover:bg-blue-200 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/brokers"
        className="inline-flex items-center px-4 py-2 bg-blue-700 text-blue-100 rounded-md hover:bg-blue-600 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Browse All Brokers
      </a>
    </div>
    {errorMessage && (
      <p className="text-xs text-blue-300 mt-2">Error: {errorMessage}</p>
    )}
  </div>
)

/**
 * AI assistant fallback
 */
export const AIFallback: React.FC<FallbackProps> = ({ onRetry, isRetrying, errorMessage }) => (
  <div className="p-6 bg-purple-900 border border-purple-700 rounded-lg">
    <div className="flex items-center mb-4">
      <Bot className="w-6 h-6 text-purple-300 mr-3" />
      <h3 className="text-lg font-semibold text-purple-100">AI Assistant Unavailable</h3>
    </div>
    <p className="text-purple-200 mb-4">
      Our AI assistant is currently offline. You can still access our comprehensive broker guides and comparison tools.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-900 rounded-md hover:bg-purple-200 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/guides"
        className="inline-flex items-center px-4 py-2 bg-purple-700 text-purple-100 rounded-md hover:bg-purple-600 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        View Guides
      </a>
    </div>
    {errorMessage && (
      <p className="text-xs text-purple-300 mt-2">Error: {errorMessage}</p>
    )}
  </div>
)

/**
 * Broker comparison fallback
 */
export const BrokerComparisonFallback: React.FC<FallbackProps> = ({ onRetry, isRetrying, errorMessage }) => (
  <div className="p-6 bg-green-900 border border-green-700 rounded-lg">
    <div className="flex items-center mb-4">
      <TrendingUp className="w-6 h-6 text-green-300 mr-3" />
      <h3 className="text-lg font-semibold text-green-100">Comparison Tool Unavailable</h3>
    </div>
    <p className="text-green-200 mb-4">
      The broker comparison tool is temporarily unavailable. You can still view individual broker profiles and reviews.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-green-100 text-green-900 rounded-md hover:bg-green-200 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/brokers"
        className="inline-flex items-center px-4 py-2 bg-green-700 text-green-100 rounded-md hover:bg-green-600 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        View Broker Profiles
      </a>
    </div>
    {errorMessage && (
      <p className="text-xs text-green-300 mt-2">Error: {errorMessage}</p>
    )}
  </div>
)

/**
 * Authentication fallback
 */
export const AuthFallback: React.FC<FallbackProps> = ({ onRetry, isRetrying, errorMessage }) => (
  <div className="p-6 bg-amber-900 border border-amber-700 rounded-lg">
    <div className="flex items-center mb-4">
      <User className="w-6 h-6 text-amber-300 mr-3" />
      <h3 className="text-lg font-semibold text-amber-100">Authentication Unavailable</h3>
    </div>
    <p className="text-amber-200 mb-4">
      Login and registration are temporarily unavailable. You can still browse brokers and access public content.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-900 rounded-md hover:bg-amber-200 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/"
        className="inline-flex items-center px-4 py-2 bg-amber-700 text-amber-100 rounded-md hover:bg-amber-600 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Continue Browsing
      </a>
    </div>
    {errorMessage && (
      <p className="text-xs text-amber-300 mt-2">Error: {errorMessage}</p>
    )}
  </div>
)

/**
 * Profile management fallback
 */
export const ProfileFallback: React.FC<FallbackProps> = ({ onRetry, isRetrying, errorMessage }) => (
  <div className="p-6 bg-indigo-900 border border-indigo-700 rounded-lg">
    <div className="flex items-center mb-4">
      <User className="w-6 h-6 text-indigo-300 mr-3" />
      <h3 className="text-lg font-semibold text-indigo-100">Profile Unavailable</h3>
    </div>
    <p className="text-indigo-200 mb-4">
      Your profile settings are temporarily unavailable. Your preferences are saved and will be restored shortly.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-900 rounded-md hover:bg-indigo-200 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/"
        className="inline-flex items-center px-4 py-2 bg-indigo-700 text-indigo-100 rounded-md hover:bg-indigo-600 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Return to Homepage
      </a>
    </div>
    {errorMessage && (
      <p className="text-xs text-indigo-300 mt-2">Error: {errorMessage}</p>
    )}
  </div>
)

/**
 * Data loading fallback
 */
export const DataLoadingFallback: React.FC<FallbackProps & { dataType?: string }> = ({ 
  onRetry, 
  isRetrying, 
  errorMessage,
  dataType = 'data'
}) => (
  <div className="p-6 bg-charcoal-grey border border-medium-grey rounded-lg">
    <div className="flex items-center mb-4">
      <Shield className="w-6 h-6 text-light-grey mr-3" />
      <h3 className="text-lg font-semibold text-pure-white">Data Temporarily Unavailable</h3>
    </div>
    <p className="text-light-grey mb-4">
      We're having trouble loading {dataType}. This is usually temporary and resolves quickly.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-pure-white text-professional-black rounded-md hover:bg-off-white disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center px-4 py-2 bg-medium-grey text-pure-white rounded-md hover:bg-light-grey hover:text-professional-black transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Page
      </button>
    </div>
    {errorMessage && (
      <p className="text-xs text-muted-text mt-2">Error: {errorMessage}</p>
    )}
  </div>
)

/**
 * Network error fallback
 */
export const NetworkErrorFallback: React.FC<FallbackProps> = ({ onRetry, isRetrying, errorMessage }) => (
  <div className="p-6 bg-red-900 border border-red-700 rounded-lg">
    <div className="flex items-center mb-4">
      <AlertCircle className="w-6 h-6 text-red-300 mr-3" />
      <h3 className="text-lg font-semibold text-red-100">Connection Problem</h3>
    </div>
    <p className="text-red-200 mb-4">
      We're having trouble connecting to our servers. Please check your internet connection and try again.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-red-100 text-red-900 rounded-md hover:bg-red-200 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center px-4 py-2 bg-red-700 text-red-100 rounded-md hover:bg-red-600 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Page
      </button>
    </div>
    {errorMessage && (
      <p className="text-xs text-red-300 mt-2">Error: {errorMessage}</p>
    )}
  </div>
)

/**
 * Generic section fallback
 */
export const SectionFallback: React.FC<FallbackProps & { 
  sectionName?: string
  icon?: React.ReactNode
}> = ({ 
  onRetry, 
  isRetrying, 
  errorMessage,
  sectionName = 'section',
  icon
}) => (
  <div className="p-6 bg-charcoal-grey border border-medium-grey rounded-lg">
    <div className="flex items-center mb-4">
      {icon || <AlertCircle className="w-6 h-6 text-light-grey mr-3" />}
      <h3 className="text-lg font-semibold text-pure-white">
        {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Unavailable
      </h3>
    </div>
    <p className="text-light-grey mb-4">
      This {sectionName} is temporarily unavailable. Please try again or continue browsing other sections.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-pure-white text-professional-black rounded-md hover:bg-off-white disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/"
        className="inline-flex items-center px-4 py-2 bg-medium-grey text-pure-white rounded-md hover:bg-light-grey hover:text-professional-black transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Return to Homepage
      </a>
    </div>
    {errorMessage && (
      <p className="text-xs text-muted-text mt-2">Error: {errorMessage}</p>
    )}
  </div>
)
