import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { 
  ArticleErrorFallback, 
  CourseErrorFallback, 
  EducationContentFallback, 
  EducationLinkErrorFallback,
  EducationPageErrorBoundary,
  withEducationErrorBoundary 
} from '../EducationPageErrorBoundary'
import { errorReportingService } from '@/services/ErrorReportingService'

// Mock the error reporting service
vi.mock('@/services/ErrorReportingService', () => ({
  errorReportingService: {
    reportError: vi.fn(() => 'mock-error-id'),
  },
}))

// Mock component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean; errorMessage?: string }> = ({ 
  shouldThrow = true, 
  errorMessage = 'Test error' 
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage)
  }
  return <div>No error</div>
}

// Mock component for testing HOC
const MockEducationComponent: React.FC<{ contentId: string }> = ({ contentId }) => (
  <div>Education component for {contentId}</div>
)

describe('EducationPageErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <EducationPageErrorBoundary>
        <ThrowError shouldThrow={false} />
      </EducationPageErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders error UI when child component throws', () => {
    render(
      <EducationPageErrorBoundary contentTitle="Trading Basics" contentType="course">
        <ThrowError errorMessage="Cannot read properties of undefined" />
      </EducationPageErrorBoundary>
    )

    expect(screen.getByText('Educational Content Unavailable')).toBeInTheDocument()
    expect(screen.getByText('Trading Basics')).toBeInTheDocument()
  })

  it('reports error to error reporting service', () => {
    render(
      <EducationPageErrorBoundary contentTitle="Trading Basics" contentType="course">
        <ThrowError errorMessage="Cannot read properties of undefined" />
      </EducationPageErrorBoundary>
    )

    expect(errorReportingService.reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        section: 'education-page',
        component: 'EducationPageErrorBoundary',
        feature: 'education-content',
        metadata: expect.objectContaining({
          contentTitle: 'Trading Basics',
          contentType: 'course',
          errorType: 'content-property-access',
        }),
      })
    )
  })

  it('classifies different error types correctly', () => {
    const testCases = [
      { message: 'Cannot read properties of undefined', expectedType: 'content-property-access' },
      { message: 'content not found', expectedType: 'content-not-found' },
      { message: 'fetch failed', expectedType: 'content-fetch-error' },
      { message: 'network error', expectedType: 'content-fetch-error' },
      { message: 'undefined link error', expectedType: 'content-link-error' },
      { message: 'unknown error', expectedType: 'education-unknown' },
    ]

    testCases.forEach(({ message, expectedType }) => {
      vi.clearAllMocks()
      
      render(
        <EducationPageErrorBoundary contentTitle="Test Content">
          <ThrowError errorMessage={message} />
        </EducationPageErrorBoundary>
      )

      expect(errorReportingService.reportError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          metadata: expect.objectContaining({
            errorType: expectedType,
          }),
        })
      )
    })
  })

  it('shows appropriate icon based on content type', () => {
    const { rerender } = render(
      <EducationPageErrorBoundary contentType="course">
        <ThrowError />
      </EducationPageErrorBoundary>
    )

    // Course icon should be present (we can't easily test the specific icon, but we can test the structure)
    expect(screen.getByText('Educational Content Unavailable')).toBeInTheDocument()

    rerender(
      <EducationPageErrorBoundary contentType="article">
        <ThrowError />
      </EducationPageErrorBoundary>
    )

    expect(screen.getByText('Educational Content Unavailable')).toBeInTheDocument()

    rerender(
      <EducationPageErrorBoundary contentType="community">
        <ThrowError />
      </EducationPageErrorBoundary>
    )

    expect(screen.getByText('Educational Content Unavailable')).toBeInTheDocument()
  })

  it('provides retry functionality', async () => {
    const { rerender } = render(
      <EducationPageErrorBoundary>
        <ThrowError shouldThrow={true} />
      </EducationPageErrorBoundary>
    )

    expect(screen.getByText('Educational Content Unavailable')).toBeInTheDocument()

    const retryButton = screen.getByText('Try Loading Again')
    fireEvent.click(retryButton)

    // Rerender with no error to simulate successful retry
    rerender(
      <EducationPageErrorBoundary>
        <ThrowError shouldThrow={false} />
      </EducationPageErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('auto-retries for recoverable errors', async () => {
    vi.useFakeTimers()

    const { rerender } = render(
      <EducationPageErrorBoundary maxRetries={2}>
        <ThrowError errorMessage="Cannot read properties of undefined" />
      </EducationPageErrorBoundary>
    )

    expect(screen.getByText('Reloading content...')).toBeInTheDocument()

    // Fast-forward time to trigger retry
    vi.advanceTimersByTime(2000)

    // Rerender with no error to simulate successful retry
    rerender(
      <EducationPageErrorBoundary maxRetries={2}>
        <ThrowError shouldThrow={false} />
      </EducationPageErrorBoundary>
    )

    await waitFor(() => {
      expect(screen.getByText('No error')).toBeInTheDocument()
    })

    vi.useRealTimers()
  })

  it('shows custom fallback when provided', () => {
    const customFallback = <div>Custom education error fallback</div>

    render(
      <EducationPageErrorBoundary fallback={customFallback}>
        <ThrowError />
      </EducationPageErrorBoundary>
    )

    expect(screen.getByText('Custom education error fallback')).toBeInTheDocument()
  })

  it('calls custom error handler when provided', () => {
    const onError = vi.fn()

    render(
      <EducationPageErrorBoundary onError={onError}>
        <ThrowError />
      </EducationPageErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    )
  })

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <EducationPageErrorBoundary contentTitle="Test Content">
        <ThrowError errorMessage="Test error for development" />
      </EducationPageErrorBoundary>
    )

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })

  it('provides alternative educational resources when error occurs', () => {
    render(
      <EducationPageErrorBoundary>
        <ThrowError />
      </EducationPageErrorBoundary>
    )

    expect(screen.getByText('Beginner Guides')).toBeInTheDocument()
    expect(screen.getByText('Trading Basics')).toBeInTheDocument()
    expect(screen.getByText('Trading Glossary')).toBeInTheDocument()
  })

  it('tracks retry attempts correctly', () => {
    vi.useFakeTimers()

    render(
      <EducationPageErrorBoundary maxRetries={2}>
        <ThrowError errorMessage="Cannot read properties of undefined" />
      </EducationPageErrorBoundary>
    )

    // Should show retry count
    expect(screen.getByText('Retry attempts: 0/2')).toBeInTheDocument()

    vi.useRealTimers()
  })
})

describe('withEducationErrorBoundary HOC', () => {
  it('wraps component with education error boundary', () => {
    const WrappedComponent = withEducationErrorBoundary(
      MockEducationComponent,
      'course',
      'Trading Basics'
    )

    render(<WrappedComponent contentId="test-content" />)

    expect(screen.getByText('Education component for test-content')).toBeInTheDocument()
  })

  it('handles errors in wrapped component', () => {
    const ErrorComponent: React.FC = () => {
      throw new Error('Wrapped component error')
    }

    const WrappedComponent = withEducationErrorBoundary(
      ErrorComponent,
      'course',
      'Trading Basics'
    )

    render(<WrappedComponent />)

    expect(screen.getByText('Educational Content Unavailable')).toBeInTheDocument()
  })
})

describe('EducationContentFallback', () => {
  it('renders education content fallback correctly', () => {
    render(
      <EducationContentFallback 
        contentTitle="Trading Basics" 
        contentType="course" 
      />
    )

    expect(screen.getByText('Content Unavailable')).toBeInTheDocument()
    expect(screen.getByText(/Trading Basics/)).toBeInTheDocument()
    expect(screen.getByText('Content Type: course')).toBeInTheDocument()
  })

  it('shows retry button when onRetry is provided', () => {
    const onRetry = vi.fn()

    render(
      <EducationContentFallback 
        contentTitle="Trading Basics" 
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    expect(onRetry).toHaveBeenCalled()
  })

  it('shows retrying state', () => {
    render(
      <EducationContentFallback 
        contentTitle="Trading Basics" 
        onRetry={vi.fn()}
        isRetrying={true}
      />
    )

    expect(screen.getByText('Retrying...')).toBeInTheDocument()
  })
})

describe('CourseErrorFallback', () => {
  it('renders course error fallback correctly', () => {
    render(
      <CourseErrorFallback 
        courseName="Advanced Trading Strategies" 
      />
    )

    expect(screen.getByText('Course Unavailable')).toBeInTheDocument()
    expect(screen.getByText(/Advanced Trading Strategies/)).toBeInTheDocument()
  })

  it('shows retry button when onRetry is provided', () => {
    const onRetry = vi.fn()

    render(
      <CourseErrorFallback 
        courseName="Test Course" 
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    expect(onRetry).toHaveBeenCalled()
  })

  it('provides navigation to all courses', () => {
    render(<CourseErrorFallback courseName="Test Course" />)

    expect(screen.getByText('Browse All Courses')).toBeInTheDocument()
  })
})

describe('ArticleErrorFallback', () => {
  it('renders article error fallback correctly', () => {
    render(
      <ArticleErrorFallback 
        articleTitle="Understanding Forex Markets" 
      />
    )

    expect(screen.getByText('Article Unavailable')).toBeInTheDocument()
    expect(screen.getByText(/Understanding Forex Markets/)).toBeInTheDocument()
  })

  it('shows retry button when onRetry is provided', () => {
    const onRetry = vi.fn()

    render(
      <ArticleErrorFallback 
        articleTitle="Test Article" 
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    expect(onRetry).toHaveBeenCalled()
  })

  it('provides navigation to all articles', () => {
    render(<ArticleErrorFallback articleTitle="Test Article" />)

    expect(screen.getByText('Browse All Articles')).toBeInTheDocument()
  })
})

describe('EducationLinkErrorFallback', () => {
  it('renders link error fallback correctly', () => {
    render(
      <EducationLinkErrorFallback 
        linkText="Advanced Trading Guide" 
      />
    )

    expect(screen.getByText('Link Error')).toBeInTheDocument()
    expect(screen.getByText(/"Advanced Trading Guide"/)).toBeInTheDocument()
  })

  it('shows retry button when onRetry is provided', () => {
    const onRetry = vi.fn()

    render(
      <EducationLinkErrorFallback 
        linkText="Test Link" 
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    expect(onRetry).toHaveBeenCalled()
  })

  it('provides navigation back to education', () => {
    render(<EducationLinkErrorFallback linkText="Test Link" />)

    expect(screen.getByText('Back to Education')).toBeInTheDocument()
  })

  it('handles missing link text gracefully', () => {
    render(<EducationLinkErrorFallback />)

    expect(screen.getByText('Link Error')).toBeInTheDocument()
    expect(screen.getByText(/you clicked/)).toBeInTheDocument()
  })
})