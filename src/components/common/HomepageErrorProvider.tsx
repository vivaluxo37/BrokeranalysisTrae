import React, { ReactNode, useEffect } from 'react'
import { HomepageErrorBoundary } from './HomepageErrorBoundary'
import { ErrorMonitoringDashboard, useErrorMonitoring } from './ErrorMonitoringDashboard'
import { NotificationSystem } from './NotificationSystem'
import { errorReportingService } from '@/services/ErrorReportingService'
import { useHomepageIntegration } from '@/contexts'

interface HomepageErrorProviderProps {
  children: ReactNode
  enableMonitoring?: boolean
}

/**
 * Homepage Error Provider
 * Provides comprehensive error handling, monitoring, and reporting for the entire homepage
 */
export const HomepageErrorProvider: React.FC<HomepageErrorProviderProps> = ({
  children,
  enableMonitoring = import.meta.env.DEV,
}) => {
  const { actions } = useHomepageIntegration()
  const errorMonitoring = useErrorMonitoring()

  useEffect(() => {
    // Subscribe to error reports and show notifications for critical errors
    const unsubscribe = errorReportingService.subscribe((report) => {
      if (report.severity === 'critical') {
        actions.addNotification({
          type: 'error',
          message: `Critical error in ${report.context.section}: ${report.error.message}`,
        })
      } else if (report.severity === 'high') {
        actions.addNotification({
          type: 'warning',
          message: `Error in ${report.context.section}. Some features may not work properly.`,
        })
      }
    })

    return unsubscribe
  }, [actions])

  return (
    <HomepageErrorBoundary
      section="homepage-root"
      component="HomepageErrorProvider"
      feature="error-provider"
      enableRetry={true}
      maxRetries={3}
    >
      {children}
      
      {/* Notification system for error alerts */}
      <NotificationSystem />
      
      {/* Error monitoring dashboard (development only) */}
      {enableMonitoring && (
        <ErrorMonitoringDashboard
          isVisible={errorMonitoring.isVisible}
          onClose={errorMonitoring.hide}
        />
      )}
    </HomepageErrorBoundary>
  )
}

/**
 * Section Error Boundary
 * Wraps individual homepage sections with appropriate error boundaries
 */
interface SectionErrorBoundaryProps {
  children: ReactNode
  section: string
  component?: string
  feature?: string
  fallback?: ReactNode
  enableRetry?: boolean
  maxRetries?: number
}

export const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({
  children,
  section,
  component,
  feature,
  fallback,
  enableRetry = true,
  maxRetries = 2,
}) => {
  return (
    <HomepageErrorBoundary
      section={section}
      component={component}
      feature={feature}
      fallback={fallback}
      enableRetry={enableRetry}
      maxRetries={maxRetries}
    >
      {children}
    </HomepageErrorBoundary>
  )
}

/**
 * Feature Error Boundary
 * Wraps specific features with error boundaries and appropriate fallbacks
 */
interface FeatureErrorBoundaryProps {
  children: ReactNode
  feature: 'search' | 'ai' | 'broker-comparison' | 'auth' | 'profile' | 'data-loading'
  section?: string
  component?: string
  customFallback?: ReactNode
}

export const FeatureErrorBoundary: React.FC<FeatureErrorBoundaryProps> = ({
  children,
  feature,
  section = 'unknown',
  component,
  customFallback,
}) => {
  // Import fallback components dynamically to avoid circular dependencies
  const getFallbackComponent = () => {
    if (customFallback) return customFallback

    switch (feature) {
      case 'search':
        return React.lazy(() => 
          import('./FallbackComponents').then(module => ({ 
            default: module.SearchFallback 
          }))
        )
      case 'ai':
        return React.lazy(() => 
          import('./FallbackComponents').then(module => ({ 
            default: module.AIFallback 
          }))
        )
      case 'broker-comparison':
        return React.lazy(() => 
          import('./FallbackComponents').then(module => ({ 
            default: module.BrokerComparisonFallback 
          }))
        )
      case 'auth':
        return React.lazy(() => 
          import('./FallbackComponents').then(module => ({ 
            default: module.AuthFallback 
          }))
        )
      case 'profile':
        return React.lazy(() => 
          import('./FallbackComponents').then(module => ({ 
            default: module.ProfileFallback 
          }))
        )
      case 'data-loading':
        return React.lazy(() => 
          import('./FallbackComponents').then(module => ({ 
            default: module.DataLoadingFallback 
          }))
        )
      default:
        return undefined
    }
  }

  const FallbackComponent = getFallbackComponent()

  return (
    <HomepageErrorBoundary
      section={section}
      component={component}
      feature={feature}
      fallback={FallbackComponent ? (
        <React.Suspense fallback={<div>Loading error fallback...</div>}>
          <FallbackComponent />
        </React.Suspense>
      ) : undefined}
      enableRetry={true}
      maxRetries={feature === 'data-loading' ? 3 : 2}
    >
      {children}
    </HomepageErrorBoundary>
  )
}

/**
 * Error Recovery Hook
 * Provides utilities for error recovery and reporting
 */
export const useErrorRecovery = () => {
  const { actions } = useHomepageIntegration()

  const reportError = (error: Error, context: {
    section: string
    component?: string
    feature?: string
    metadata?: Record<string, any>
  }) => {
    const errorId = errorReportingService.reportError(error, context)
    
    // Show user notification for non-critical errors
    if (context.section !== 'background') {
      actions.addNotification({
        type: 'error',
        message: `An error occurred in ${context.section}. We've been notified and are working on a fix.`,
      })
    }

    return errorId
  }

  const reportHandledError = (message: string, context: {
    section: string
    component?: string
    feature?: string
    metadata?: Record<string, any>
  }) => {
    return errorReportingService.reportHandledError(message, context)
  }

  const reportPerformanceIssue = (
    metric: string,
    value: number,
    threshold: number,
    context: {
      section: string
      component?: string
      feature?: string
    }
  ) => {
    return errorReportingService.reportPerformanceIssue(metric, value, threshold, context)
  }

  const getErrorStats = () => {
    return errorReportingService.getStats()
  }

  const hasRecentErrors = (section: string, minutes = 5) => {
    return errorReportingService.hasRecentErrors(section, minutes)
  }

  return {
    reportError,
    reportHandledError,
    reportPerformanceIssue,
    getErrorStats,
    hasRecentErrors,
  }
}

/**
 * Error Status Hook
 * Provides information about error status for UI components
 */
export const useErrorStatus = (section: string) => {
  const [hasErrors, setHasErrors] = React.useState(false)
  const [errorCount, setErrorCount] = React.useState(0)

  useEffect(() => {
    const updateErrorStatus = () => {
      const sectionErrors = errorReportingService.getErrorsForSection(section)
      const recentErrors = errorReportingService.hasRecentErrors(section, 10) // Last 10 minutes
      
      setHasErrors(recentErrors)
      setErrorCount(sectionErrors.length)
    }

    // Initial check
    updateErrorStatus()

    // Subscribe to error updates
    const unsubscribe = errorReportingService.subscribe((report) => {
      if (report.context.section === section) {
        updateErrorStatus()
      }
    })

    return unsubscribe
  }, [section])

  return {
    hasErrors,
    errorCount,
    hasRecentErrors: hasErrors,
  }
}
