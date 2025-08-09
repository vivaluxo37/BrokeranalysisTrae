import React from 'react'
import { 
  Search, 
  Bot, 
  TrendingUp, 
  User, 
  Shield, 
  AlertCircle,
  RefreshCw,
  ExternalLink
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
  <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-center mb-4">
      <Search className="w-6 h-6 text-blue-600 mr-3" />
      <h3 className="text-lg font-semibold text-blue-900">Search Temporarily Unavailable</h3>
    </div>
    <p className="text-blue-700 mb-4">
      Our search functionality is currently experiencing issues. You can still browse brokers manually or try again in a moment.
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
        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Browse All Brokers
      </a>
    </div>
    {errorMessage && (
      <p className="text-xs text-blue-600 mt-2">Error: {errorMessage}</p>
    )}
  </div>
)

/**
 * AI assistant fallback
 */
export const AIFallback: React.FC<FallbackProps> = ({ onRetry, isRetrying, errorMessage }) => (
  <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
    <div className="flex items-center mb-4">
      <Bot className="w-6 h-6 text-purple-600 mr-3" />
      <h3 className="text-lg font-semibold text-purple-900">AI Assistant Unavailable</h3>
    </div>
    <p className="text-purple-700 mb-4">
      Our AI assistant is currently offline. You can still access our comprehensive broker guides and comparison tools.
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
        href="/guides"
        className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        View Guides
      </a>
    </div>
    {errorMessage && (
      <p className="text-xs text-purple-600 mt-2">Error: {errorMessage}</p>
    )}
  </div>
)

/**
 * Broker comparison fallback
 */
export const BrokerComparisonFallback: React.FC<FallbackProps> = ({ onRetry, isRetrying, errorMessage }) => (
  <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
    <div className="flex items-center mb-4">
      <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
      <h3 className="text-lg font-semibold text-green-900">Comparison Tool Unavailable</h3>
    </div>
    <p className="text-green-700 mb-4">
      The broker comparison tool is temporarily unavailable. You can still view individual broker profiles and reviews.
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
        href="/brokers"
        className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        View Broker Profiles
      </a>
    </div>
    {errorMessage && (
      <p className="text-xs text-green-600 mt-2">Error: {errorMessage}</p>
    )}
  </div>
)

/**
 * Authentication fallback
 */
export const AuthFallback: React.FC<FallbackProps> = ({ onRetry, isRetrying, errorMessage }) => (
  <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
    <div className="flex items-center mb-4">
      <User className="w-6 h-6 text-amber-600 mr-3" />
      <h3 className="text-lg font-semibold text-amber-900">Authentication Unavailable</h3>
    </div>
    <p className="text-amber-700 mb-4">
      Login and registration are temporarily unavailable. You can still browse brokers and access public content.
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
        href="/"
        className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Continue Browsing
      </a>
    </div>
    {errorMessage && (
      <p className="text-xs text-amber-600 mt-2">Error: {errorMessage}</p>
    )}
  </div>
)

/**
 * Profile management fallback
 */
export const ProfileFallback: React.FC<FallbackProps> = ({ onRetry, isRetrying, errorMessage }) => (
  <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-lg">
    <div className="flex items-center mb-4">
      <User className="w-6 h-6 text-indigo-600 mr-3" />
      <h3 className="text-lg font-semibold text-indigo-900">Profile Unavailable</h3>
    </div>
    <p className="text-indigo-700 mb-4">
      Your profile settings are temporarily unavailable. Your preferences are saved and will be restored shortly.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/"
        className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Return to Homepage
      </a>
    </div>
    {errorMessage && (
      <p className="text-xs text-indigo-600 mt-2">Error: {errorMessage}</p>
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
  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
    <div className="flex items-center mb-4">
      <Shield className="w-6 h-6 text-gray-600 mr-3" />
      <h3 className="text-lg font-semibold text-gray-900">Data Temporarily Unavailable</h3>
    </div>
    <p className="text-gray-700 mb-4">
      We're having trouble loading {dataType}. This is usually temporary and resolves quickly.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Page
      </button>
    </div>
    {errorMessage && (
      <p className="text-xs text-gray-600 mt-2">Error: {errorMessage}</p>
    )}
  </div>
)

/**
 * Network error fallback
 */
export const NetworkErrorFallback: React.FC<FallbackProps> = ({ onRetry, isRetrying, errorMessage }) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-center mb-4">
      <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
      <h3 className="text-lg font-semibold text-red-900">Connection Problem</h3>
    </div>
    <p className="text-red-700 mb-4">
      We're having trouble connecting to our servers. Please check your internet connection and try again.
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
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Page
      </button>
    </div>
    {errorMessage && (
      <p className="text-xs text-red-600 mt-2">Error: {errorMessage}</p>
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
  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
    <div className="flex items-center mb-4">
      {icon || <AlertCircle className="w-6 h-6 text-gray-600 mr-3" />}
      <h3 className="text-lg font-semibold text-gray-900">
        {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Unavailable
      </h3>
    </div>
    <p className="text-gray-700 mb-4">
      This {sectionName} is temporarily unavailable. Please try again or continue browsing other sections.
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
      <a
        href="/"
        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Return to Homepage
      </a>
    </div>
    {errorMessage && (
      <p className="text-xs text-gray-600 mt-2">Error: {errorMessage}</p>
    )}
  </div>
)