import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { 
  CalculatorErrorFallback, 
  CollectionErrorFallback, 
  ToolDataFallback, 
  ToolPageErrorBoundary,
  withToolErrorBoundary 
} from '../ToolPageErrorBoundary'
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
const MockToolComponent: React.FC<{ toolId: string }> = ({ toolId }) => (
  <div>Tool component for {toolId}</div>
)

describe('ToolPageErrorBoundary', () => {
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
      <ToolPageErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ToolPageErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders error UI when child component throws', () => {
    render(
      <ToolPageErrorBoundary toolName="Test Tool" toolType="calculator">
        <ThrowError errorMessage="Cannot read properties of undefined (reading 'add')" />
      </ToolPageErrorBoundary>
    )

    expect(screen.getByText('Tool Temporarily Unavailable')).toBeInTheDocument()
    expect(screen.getByText('Test Tool')).toBeInTheDocument()
  })

  it('reports error to error reporting service', () => {
    render(
      <ToolPageErrorBoundary toolName="Test Tool" toolType="calculator">
        <ThrowError errorMessage="Cannot read properties of undefined (reading 'add')" />
      </ToolPageErrorBoundary>
    )

    expect(errorReportingService.reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        section: 'tool-page',
        component: 'ToolPageErrorBoundary',
        feature: 'tool-functionality',
        metadata: expect.objectContaining({
          toolName: 'Test Tool',
          toolType: 'calculator',
          errorType: 'collection-method-access',
        }),
      })
    )
  })

  it('classifies different error types correctly', () => {
    const testCases = [
      { message: 'Cannot read properties of undefined (reading \'add\')', expectedType: 'collection-method-access' },
      { message: 'Cannot read properties of undefined', expectedType: 'undefined-property-access' },
      { message: 'collection error', expectedType: 'collection-error' },
      { message: 'fetch failed', expectedType: 'tool-data-fetch' },
      { message: 'network error', expectedType: 'tool-data-fetch' },
      { message: 'calculation failed', expectedType: 'tool-calculation' },
      { message: 'unknown error', expectedType: 'tool-unknown' },
    ]

    testCases.forEach(({ message, expectedType }) => {
      vi.clearAllMocks()
      
      render(
        <ToolPageErrorBoundary toolName="Test Tool">
          <ThrowError errorMessage={message} />
        </ToolPageErrorBoundary>
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

  it('shows appropriate icon based on tool type', () => {
    const { rerender } = render(
      <ToolPageErrorBoundary toolType="calculator">
        <ThrowError />
      </ToolPageErrorBoundary>
    )

    // Calculator icon should be present (we can't easily test the specific icon, but we can test the structure)
    expect(screen.getByText('Tool Temporarily Unavailable')).toBeInTheDocument()

    rerender(
      <ToolPageErrorBoundary toolType="comparison">
        <ThrowError />
      </ToolPageErrorBoundary>
    )

    expect(screen.getByText('Tool Temporarily Unavailable')).toBeInTheDocument()
  })

  it('provides retry functionality', async () => {
    const { rerender } = render(
      <ToolPageErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ToolPageErrorBoundary>
    )

    expect(screen.getByText('Tool Temporarily Unavailable')).toBeInTheDocument()

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    // Rerender with no error to simulate successful retry
    rerender(
      <ToolPageErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ToolPageErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('auto-retries for recoverable errors', async () => {
    vi.useFakeTimers()

    const { rerender } = render(
      <ToolPageErrorBoundary maxRetries={2}>
        <ThrowError errorMessage="Cannot read properties of undefined (reading 'add')" />
      </ToolPageErrorBoundary>
    )

    expect(screen.getByText('Reloading tool...')).toBeInTheDocument()

    // Fast-forward time to trigger retry
    vi.advanceTimersByTime(2000)

    // Rerender with no error to simulate successful retry
    rerender(
      <ToolPageErrorBoundary maxRetries={2}>
        <ThrowError shouldThrow={false} />
      </ToolPageErrorBoundary>
    )

    await waitFor(() => {
      expect(screen.getByText('No error')).toBeInTheDocument()
    })

    vi.useRealTimers()
  })

  it('shows custom fallback when provided', () => {
    const customFallback = <div>Custom tool error fallback</div>

    render(
      <ToolPageErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ToolPageErrorBoundary>
    )

    expect(screen.getByText('Custom tool error fallback')).toBeInTheDocument()
  })

  it('calls custom error handler when provided', () => {
    const onError = vi.fn()

    render(
      <ToolPageErrorBoundary onError={onError}>
        <ThrowError />
      </ToolPageErrorBoundary>
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
      <ToolPageErrorBoundary toolName="Test Tool">
        <ThrowError errorMessage="Test error for development" />
      </ToolPageErrorBoundary>
    )

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })

  it('provides alternative tool suggestions when error occurs', () => {
    render(
      <ToolPageErrorBoundary>
        <ThrowError />
      </ToolPageErrorBoundary>
    )

    expect(screen.getByText('Find My Broker')).toBeInTheDocument()
    expect(screen.getByText('Spread Comparison')).toBeInTheDocument()
    expect(screen.getByText('Leverage Calculator')).toBeInTheDocument()
  })

  it('tracks retry attempts correctly', () => {
    vi.useFakeTimers()

    render(
      <ToolPageErrorBoundary maxRetries={2}>
        <ThrowError errorMessage="Cannot read properties of undefined (reading 'add')" />
      </ToolPageErrorBoundary>
    )

    // Should show retry count
    expect(screen.getByText('Retry attempts: 0/2')).toBeInTheDocument()

    vi.useRealTimers()
  })
})

describe('withToolErrorBoundary HOC', () => {
  it('wraps component with tool error boundary', () => {
    const WrappedComponent = withToolErrorBoundary(
      MockToolComponent,
      'Test Tool',
      'calculator'
    )

    render(<WrappedComponent toolId="test-tool" />)

    expect(screen.getByText('Tool component for test-tool')).toBeInTheDocument()
  })

  it('handles errors in wrapped component', () => {
    const ErrorComponent: React.FC = () => {
      throw new Error('Wrapped component error')
    }

    const WrappedComponent = withToolErrorBoundary(
      ErrorComponent,
      'Test Tool',
      'calculator'
    )

    render(<WrappedComponent />)

    expect(screen.getByText('Tool Temporarily Unavailable')).toBeInTheDocument()
  })
})

describe('ToolDataFallback', () => {
  it('renders tool data fallback correctly', () => {
    render(
      <ToolDataFallback 
        toolName="Test Tool" 
        toolType="calculator" 
      />
    )

    expect(screen.getByText('Tool Data Unavailable')).toBeInTheDocument()
    expect(screen.getByText(/Test Tool/)).toBeInTheDocument()
    expect(screen.getByText('Tool Type: calculator')).toBeInTheDocument()
  })

  it('shows retry button when onRetry is provided', () => {
    const onRetry = vi.fn()

    render(
      <ToolDataFallback 
        toolName="Test Tool" 
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    expect(onRetry).toHaveBeenCalled()
  })

  it('shows retrying state', () => {
    render(
      <ToolDataFallback 
        toolName="Test Tool" 
        onRetry={vi.fn()}
        isRetrying={true}
      />
    )

    expect(screen.getByText('Retrying...')).toBeInTheDocument()
  })
})

describe('CalculatorErrorFallback', () => {
  it('renders calculator error fallback correctly', () => {
    render(
      <CalculatorErrorFallback 
        calculatorName="Leverage Calculator" 
      />
    )

    expect(screen.getByText('Calculator Error')).toBeInTheDocument()
    expect(screen.getByText(/Leverage Calculator/)).toBeInTheDocument()
  })

  it('shows retry and reset options', () => {
    const onRetry = vi.fn()

    render(
      <CalculatorErrorFallback 
        calculatorName="Test Calculator" 
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByText('Try Again')
    const resetButton = screen.getByText('Reset Calculator')

    fireEvent.click(retryButton)
    expect(onRetry).toHaveBeenCalled()

    expect(resetButton).toBeInTheDocument()
  })

  it('shows recalculating state', () => {
    render(
      <CalculatorErrorFallback 
        calculatorName="Test Calculator" 
        onRetry={vi.fn()}
        isRetrying={true}
      />
    )

    expect(screen.getByText('Recalculating...')).toBeInTheDocument()
  })
})

describe('CollectionErrorFallback', () => {
  it('renders collection error fallback correctly', () => {
    render(
      <CollectionErrorFallback 
        collectionName="broker list" 
      />
    )

    expect(screen.getByText('Collection Access Error')).toBeInTheDocument()
    expect(screen.getByText(/broker list/)).toBeInTheDocument()
  })

  it('shows retry button when onRetry is provided', () => {
    const onRetry = vi.fn()

    render(
      <CollectionErrorFallback 
        collectionName="test collection" 
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    expect(onRetry).toHaveBeenCalled()
  })

  it('provides navigation to other tools', () => {
    render(<CollectionErrorFallback collectionName="test collection" />)

    expect(screen.getByText('Browse Other Tools')).toBeInTheDocument()
  })
})
