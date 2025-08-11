import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HomepageErrorBoundary, withErrorBoundary } from '../HomepageErrorBoundary'
import { errorReportingService } from '@/services/ErrorReportingService'

// Mock the error reporting service
jest.mock('@/services/ErrorReportingService', () => ({
  errorReportingService: {
    reportError: jest.fn().mockReturnValue('test-error-id'),
  },
}))

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean; errorType?: string }> = ({ 
  shouldThrow = false, 
  errorType = 'Error' 
}) => {
  if (shouldThrow) {
    if (errorType === 'ChunkLoadError') {
      const error = new Error('Loading chunk 1 failed')
      error.name = 'ChunkLoadError'
      throw error
    }
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('HomepageErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Suppress console.error for these tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <HomepageErrorBoundary section="test">
        <ThrowError shouldThrow={false} />
      </HomepageErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders error UI when child component throws', () => {
    render(
      <HomepageErrorBoundary section="test">
        <ThrowError shouldThrow={true} />
      </HomepageErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/test section encountered an error/)).toBeInTheDocument()
  })

  it('reports error to error reporting service', () => {
    render(
      <HomepageErrorBoundary section="test" component="TestComponent" feature="testFeature">
        <ThrowError shouldThrow={true} />
      </HomepageErrorBoundary>
    )

    expect(errorReportingService.reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        section: 'test',
        component: 'TestComponent',
        feature: 'testFeature',
        metadata: expect.objectContaining({
          componentStack: expect.any(String),
          retryCount: 0,
        }),
      })
    )
  })

  it('displays error ID when available', () => {
    render(
      <HomepageErrorBoundary section="test">
        <ThrowError shouldThrow={true} />
      </HomepageErrorBoundary>
    )

    expect(screen.getByText('Error ID: test-error-id')).toBeInTheDocument()
  })

  it('allows retry functionality', () => {
    const { rerender } = render(
      <HomepageErrorBoundary section="test">
        <ThrowError shouldThrow={true} />
      </HomepageErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    // Re-render with no error
    rerender(
      <HomepageErrorBoundary section="test">
        <ThrowError shouldThrow={false} />
      </HomepageErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('shows retry count', () => {
    const { rerender } = render(
      <HomepageErrorBoundary section="test" maxRetries={3}>
        <ThrowError shouldThrow={true} />
      </HomepageErrorBoundary>
    )

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    // Re-render with error again to trigger retry count
    rerender(
      <HomepageErrorBoundary section="test" maxRetries={3}>
        <ThrowError shouldThrow={true} />
      </HomepageErrorBoundary>
    )

    expect(screen.getByText('Retry attempts: 1/3')).toBeInTheDocument()
  })

  it('shows report issue button', () => {
    // Mock window.open
    const mockOpen = jest.fn()
    Object.defineProperty(window, 'open', { value: mockOpen })

    render(
      <HomepageErrorBoundary section="test">
        <ThrowError shouldThrow={true} />
      </HomepageErrorBoundary>
    )

    const reportButton = screen.getByText('Report Issue')
    fireEvent.click(reportButton)

    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('mailto:support@brokeranalysis.com')
    )
  })

  it('auto-retries for chunk load errors', async () => {
    jest.useFakeTimers()

    render(
      <HomepageErrorBoundary section="test">
        <ThrowError shouldThrow={true} errorType="ChunkLoadError" />
      </HomepageErrorBoundary>
    )

    expect(screen.getByText('Retrying...')).toBeInTheDocument()

    // Fast-forward time to trigger retry
    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      // The component should attempt to retry
      expect(screen.queryByText('Retrying...')).not.toBeInTheDocument()
    })

    jest.useRealTimers()
  })

  it('uses custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <HomepageErrorBoundary section="test" fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </HomepageErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('calls custom error handler when provided', () => {
    const mockErrorHandler = jest.fn()

    render(
      <HomepageErrorBoundary section="test" onError={mockErrorHandler}>
        <ThrowError shouldThrow={true} />
      </HomepageErrorBoundary>
    )

    expect(mockErrorHandler).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    )
  })

  it('can disable retry functionality', () => {
    render(
      <HomepageErrorBoundary section="test" enableRetry={false}>
        <ThrowError shouldThrow={true} />
      </HomepageErrorBoundary>
    )

    expect(screen.queryByText('Try Again')).not.toBeInTheDocument()
  })

  it('shows development error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <HomepageErrorBoundary section="test">
        <ThrowError shouldThrow={true} />
      </HomepageErrorBoundary>
    )

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })
})

describe('withErrorBoundary HOC', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('wraps component with error boundary', () => {
    const TestComponent = () => <div>Test Component</div>
    const WrappedComponent = withErrorBoundary(TestComponent, 'test-section')

    render(<WrappedComponent />)

    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })

  it('catches errors in wrapped component', () => {
    const WrappedComponent = withErrorBoundary(ThrowError, 'test-section')

    render(<WrappedComponent shouldThrow={true} />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/test-section section encountered an error/)).toBeInTheDocument()
  })

  it('uses custom fallback in HOC', () => {
    const customFallback = <div>HOC Custom Fallback</div>
    const WrappedComponent = withErrorBoundary(ThrowError, 'test-section', customFallback)

    render(<WrappedComponent shouldThrow={true} />)

    expect(screen.getByText('HOC Custom Fallback')).toBeInTheDocument()
  })

  it('sets correct display name', () => {
    const TestComponent = () => <div>Test</div>
    TestComponent.displayName = 'TestComponent'
    
    const WrappedComponent = withErrorBoundary(TestComponent, 'test-section')

    expect(WrappedComponent.displayName).toBe('withErrorBoundary(TestComponent)')
  })
})
