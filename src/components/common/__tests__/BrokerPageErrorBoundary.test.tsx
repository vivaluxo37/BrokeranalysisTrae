import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { BrokerPageErrorBoundary, withBrokerErrorBoundary, BrokerDataFallback, BrokerNotFoundFallback } from '../BrokerPageErrorBoundary'
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
const MockBrokerComponent: React.FC<{ brokerId: string }> = ({ brokerId }) => (
  <div>Broker component for {brokerId}</div>
)

describe('BrokerPageErrorBoundary', () => {
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
      <BrokerPageErrorBoundary>
        <ThrowError shouldThrow={false} />
      </BrokerPageErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders error UI when child component throws', () => {
    render(
      <BrokerPageErrorBoundary brokerId="test-broker" brokerName="Test Broker">
        <ThrowError errorMessage="broker is not defined" />
      </BrokerPageErrorBoundary>
    )

    expect(screen.getByText('Broker Information Unavailable')).toBeInTheDocument()
    expect(screen.getByText(/Test Broker/)).toBeInTheDocument()
  })

  it('reports error to error reporting service', () => {
    render(
      <BrokerPageErrorBoundary brokerId="test-broker" brokerName="Test Broker">
        <ThrowError errorMessage="broker is not defined" />
      </BrokerPageErrorBoundary>
    )

    expect(errorReportingService.reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        section: 'broker-page',
        component: 'BrokerPageErrorBoundary',
        feature: 'broker-data-loading',
        metadata: expect.objectContaining({
          brokerId: 'test-broker',
          brokerName: 'Test Broker',
          errorType: 'broker-data-missing',
        }),
      })
    )
  })

  it('classifies different error types correctly', () => {
    const testCases = [
      { message: 'broker is not defined', expectedType: 'broker-data-missing' },
      { message: 'Cannot read properties of undefined', expectedType: 'broker-property-access' },
      { message: 'fetch failed', expectedType: 'broker-data-fetch' },
      { message: 'network error', expectedType: 'broker-data-fetch' },
      { message: 'unknown error', expectedType: 'broker-unknown' },
    ]

    testCases.forEach(({ message, expectedType }) => {
      vi.clearAllMocks()
      
      render(
        <BrokerPageErrorBoundary brokerId="test-broker">
          <ThrowError errorMessage={message} />
        </BrokerPageErrorBoundary>
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

  it('provides retry functionality', async () => {
    const { rerender } = render(
      <BrokerPageErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BrokerPageErrorBoundary>
    )

    expect(screen.getByText('Broker Information Unavailable')).toBeInTheDocument()

    const retryButton = screen.getByText('Try Loading Again')
    fireEvent.click(retryButton)

    // Rerender with no error to simulate successful retry
    rerender(
      <BrokerPageErrorBoundary>
        <ThrowError shouldThrow={false} />
      </BrokerPageErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('auto-retries for recoverable errors', async () => {
    vi.useFakeTimers()

    const { rerender } = render(
      <BrokerPageErrorBoundary maxRetries={2}>
        <ThrowError errorMessage="broker is not defined" />
      </BrokerPageErrorBoundary>
    )

    expect(screen.getByText('Reloading broker information...')).toBeInTheDocument()

    // Fast-forward time to trigger retry
    vi.advanceTimersByTime(3000)

    // Rerender with no error to simulate successful retry
    rerender(
      <BrokerPageErrorBoundary maxRetries={2}>
        <ThrowError shouldThrow={false} />
      </BrokerPageErrorBoundary>
    )

    await waitFor(() => {
      expect(screen.getByText('No error')).toBeInTheDocument()
    })

    vi.useRealTimers()
  })

  it('shows custom fallback when provided', () => {
    const customFallback = <div>Custom broker error fallback</div>

    render(
      <BrokerPageErrorBoundary fallback={customFallback}>
        <ThrowError />
      </BrokerPageErrorBoundary>
    )

    expect(screen.getByText('Custom broker error fallback')).toBeInTheDocument()
  })

  it('calls custom error handler when provided', () => {
    const onError = vi.fn()

    render(
      <BrokerPageErrorBoundary onError={onError}>
        <ThrowError />
      </BrokerPageErrorBoundary>
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
      <BrokerPageErrorBoundary brokerId="test-broker">
        <ThrowError errorMessage="Test error for development" />
      </BrokerPageErrorBoundary>
    )

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })

  it('provides alternative actions when error occurs', () => {
    render(
      <BrokerPageErrorBoundary>
        <ThrowError />
      </BrokerPageErrorBoundary>
    )

    expect(screen.getByText('Browse All Brokers')).toBeInTheDocument()
    expect(screen.getByText('Find My Broker')).toBeInTheDocument()
    expect(screen.getByText('Compare Brokers')).toBeInTheDocument()
  })

  it('tracks retry attempts correctly', () => {
    vi.useFakeTimers()

    render(
      <BrokerPageErrorBoundary maxRetries={2}>
        <ThrowError errorMessage="broker is not defined" />
      </BrokerPageErrorBoundary>
    )

    // Should show retry count
    expect(screen.getByText('Retry attempts: 0/2')).toBeInTheDocument()

    vi.useRealTimers()
  })
})

describe('withBrokerErrorBoundary HOC', () => {
  it('wraps component with broker error boundary', () => {
    const WrappedComponent = withBrokerErrorBoundary(
      MockBrokerComponent,
      'test-broker',
      'Test Broker'
    )

    render(<WrappedComponent brokerId="test-broker" />)

    expect(screen.getByText('Broker component for test-broker')).toBeInTheDocument()
  })

  it('handles errors in wrapped component', () => {
    const ErrorComponent: React.FC = () => {
      throw new Error('Wrapped component error')
    }

    const WrappedComponent = withBrokerErrorBoundary(
      ErrorComponent,
      'test-broker',
      'Test Broker'
    )

    render(<WrappedComponent />)

    expect(screen.getByText('Broker Information Unavailable')).toBeInTheDocument()
  })
})

describe('BrokerDataFallback', () => {
  it('renders broker data fallback correctly', () => {
    render(
      <BrokerDataFallback 
        brokerId="test-broker" 
        brokerName="Test Broker" 
      />
    )

    expect(screen.getByText('Broker Data Unavailable')).toBeInTheDocument()
    expect(screen.getByText(/Test Broker/)).toBeInTheDocument()
    expect(screen.getByText('Broker ID: test-broker')).toBeInTheDocument()
  })

  it('shows retry button when onRetry is provided', () => {
    const onRetry = vi.fn()

    render(
      <BrokerDataFallback 
        brokerId="test-broker" 
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    expect(onRetry).toHaveBeenCalled()
  })

  it('shows retrying state', () => {
    render(
      <BrokerDataFallback 
        brokerId="test-broker" 
        onRetry={vi.fn()}
        isRetrying={true}
      />
    )

    expect(screen.getByText('Retrying...')).toBeInTheDocument()
  })
})

describe('BrokerNotFoundFallback', () => {
  it('renders broker not found fallback correctly', () => {
    render(
      <BrokerNotFoundFallback 
        brokerId="test-broker" 
        brokerName="Test Broker" 
      />
    )

    expect(screen.getByText('Broker Not Found')).toBeInTheDocument()
    expect(screen.getByText(/Test Broker/)).toBeInTheDocument()
  })

  it('provides navigation options', () => {
    render(<BrokerNotFoundFallback brokerId="test-broker" />)

    expect(screen.getByText('Browse All Brokers')).toBeInTheDocument()
    expect(screen.getByText('Find My Broker')).toBeInTheDocument()
  })
})