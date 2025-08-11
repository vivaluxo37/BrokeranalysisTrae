/**
 * Error Reporting Service
 * Handles error logging, reporting, and analytics for the homepage
 */

export interface ErrorReport {
  id: string
  timestamp: Date
  error: {
    name: string
    message: string
    stack?: string
  }
  context: {
    section: string
    component?: string
    userId?: string
    userAgent: string
    url: string
    feature?: string
  }
  severity: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
  metadata?: Record<string, any>
}

export interface ErrorStats {
  totalErrors: number
  errorsBySection: Record<string, number>
  errorsByType: Record<string, number>
  recentErrors: ErrorReport[]
  topErrors: {
    message: string
    count: number
    lastOccurred: Date
  }[]
}

export class ErrorReportingService {
  private errors: ErrorReport[] = []
  private maxStoredErrors = 100
  private listeners = new Set<(report: ErrorReport) => void>()

  /**
   * Report an error with context
   */
  reportError(
    error: Error,
    context: {
      section: string
      component?: string
      feature?: string
      metadata?: Record<string, any>
    }
  ): string {
    const report: ErrorReport = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context: {
        ...context,
        userId: this.getCurrentUserId(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
      severity: this.determineSeverity(error, context),
      tags: this.generateTags(error, context),
      metadata: context.metadata,
    }

    // Store error
    this.storeError(report)

    // Notify listeners
    this.notifyListeners(report)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reported:', report)
    }

    // Send to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(report)
    }

    return report.id
  }

  /**
   * Report a handled error (non-critical)
   */
  reportHandledError(
    message: string,
    context: {
      section: string
      component?: string
      feature?: string
      metadata?: Record<string, any>
    }
  ): string {
    const error = new Error(message)
    error.name = 'HandledError'
    return this.reportError(error, context)
  }

  /**
   * Report a performance issue
   */
  reportPerformanceIssue(
    metric: string,
    value: number,
    threshold: number,
    context: {
      section: string
      component?: string
      feature?: string
    }
  ): string {
    const error = new Error(`Performance issue: ${metric} (${value}) exceeded threshold (${threshold})`)
    error.name = 'PerformanceIssue'
    
    return this.reportError(error, {
      ...context,
      metadata: {
        metric,
        value,
        threshold,
        performanceEntry: performance.now(),
      },
    })
  }

  /**
   * Subscribe to error reports
   */
  subscribe(listener: (report: ErrorReport) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Get error statistics
   */
  getStats(): ErrorStats {
    const errorsBySection: Record<string, number> = {}
    const errorsByType: Record<string, number> = {}
    const errorCounts: Record<string, { count: number; lastOccurred: Date }> = {}

    this.errors.forEach(error => {
      // Count by section
      errorsBySection[error.context.section] = (errorsBySection[error.context.section] || 0) + 1

      // Count by type
      errorsByType[error.error.name] = (errorsByType[error.error.name] || 0) + 1

      // Count by message
      const key = error.error.message
      if (!errorCounts[key]) {
        errorCounts[key] = { count: 0, lastOccurred: error.timestamp }
      }
      errorCounts[key].count++
      if (error.timestamp > errorCounts[key].lastOccurred) {
        errorCounts[key].lastOccurred = error.timestamp
      }
    })

    const topErrors = Object.entries(errorCounts)
      .map(([message, data]) => ({ message, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalErrors: this.errors.length,
      errorsBySection,
      errorsByType,
      recentErrors: this.errors.slice(-10),
      topErrors,
    }
  }

  /**
   * Clear all stored errors
   */
  clearErrors(): void {
    this.errors = []
  }

  /**
   * Get errors for a specific section
   */
  getErrorsForSection(section: string): ErrorReport[] {
    return this.errors.filter(error => error.context.section === section)
  }

  /**
   * Check if a section has recent errors
   */
  hasRecentErrors(section: string, minutes = 5): boolean {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000)
    return this.errors.some(
      error => error.context.section === section && error.timestamp > cutoff
    )
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get current user ID (if available)
   */
  private getCurrentUserId(): string | undefined {
    // This would typically get the user ID from auth context
    // For now, return undefined
    return undefined
  }

  /**
   * Determine error severity
   */
  private determineSeverity(
    error: Error,
    context: { section: string; component?: string; feature?: string }
  ): ErrorReport['severity'] {
    // Critical errors
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      return 'critical'
    }

    // High severity for core features
    if (['search', 'auth', 'broker-comparison'].includes(context.section)) {
      return 'high'
    }

    // Medium severity for UI components
    if (context.component) {
      return 'medium'
    }

    // Default to low
    return 'low'
  }

  /**
   * Generate tags for error categorization
   */
  private generateTags(
    error: Error,
    context: { section: string; component?: string; feature?: string }
  ): string[] {
    const tags = [context.section]

    if (context.component) {
      tags.push(`component:${context.component}`)
    }

    if (context.feature) {
      tags.push(`feature:${context.feature}`)
    }

    // Add error type tags
    if (error.name === 'TypeError') {
      tags.push('type-error')
    } else if (error.name === 'ReferenceError') {
      tags.push('reference-error')
    } else if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      tags.push('network-error')
    } else if (error.name === 'ChunkLoadError') {
      tags.push('chunk-load-error')
    }

    return tags
  }

  /**
   * Store error in memory
   */
  private storeError(report: ErrorReport): void {
    this.errors.push(report)

    // Keep only the most recent errors
    if (this.errors.length > this.maxStoredErrors) {
      this.errors.shift()
    }

    // Also store in localStorage for persistence
    try {
      const storedErrors = JSON.parse(localStorage.getItem('brokeranalysis_errors') || '[]')
      storedErrors.push(report)
      
      // Keep only recent errors in localStorage
      const recentErrors = storedErrors.slice(-20)
      localStorage.setItem('brokeranalysis_errors', JSON.stringify(recentErrors))
    } catch (error) {
      console.warn('Failed to store error in localStorage:', error)
    }
  }

  /**
   * Notify error listeners
   */
  private notifyListeners(report: ErrorReport): void {
    this.listeners.forEach(listener => {
      try {
        listener(report)
      } catch (error) {
        console.error('Error in error reporting listener:', error)
      }
    })
  }

  /**
   * Send error to external service (production only)
   */
  private sendToExternalService(report: ErrorReport): void {
    // In a real implementation, this would send to services like:
    // - Sentry
    // - LogRocket
    // - Bugsnag
    // - Custom analytics endpoint

    // For now, just log that it would be sent
    console.log('Would send error to external service:', {
      id: report.id,
      message: report.error.message,
      section: report.context.section,
      severity: report.severity,
    })
  }

  /**
   * Load stored errors from localStorage
   */
  loadStoredErrors(): void {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('brokeranalysis_errors') || '[]')
      this.errors = storedErrors.map((error: any) => ({
        ...error,
        timestamp: new Date(error.timestamp),
      }))
    } catch (error) {
      console.warn('Failed to load stored errors:', error)
    }
  }
}

// Create singleton instance
export const errorReportingService = new ErrorReportingService()

// Load stored errors on initialization
errorReportingService.loadStoredErrors()

// Set up global error handlers
if (typeof window !== 'undefined') {
  // Handle unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    errorReportingService.reportError(
      new Error(event.message),
      {
        section: 'global',
        component: 'window',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      }
    )
  })

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    errorReportingService.reportError(error, {
      section: 'global',
      component: 'promise',
      feature: 'unhandled-rejection',
    })
  })
}

// Development helper
if (process.env.NODE_ENV === 'development') {
  ;(window as any).errorReporting = errorReportingService
}
