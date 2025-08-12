import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TradingViewWidget from './TradingViewWidget';
import widgetManager from '../../services/widgetManager';

// Mock the TradingView global object
const mockTradingViewWidget = vi.fn();
window.TradingView = {
  widget: mockTradingViewWidget,
};

describe('TradingViewWidget', () => {
  beforeEach(() => {
    vi.spyOn(widgetManager, 'loadScript').mockResolvedValue(undefined);
    mockTradingViewWidget.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should load the TradingView script and create a widget', async () => {
    const mockWidgetOptions = {
      symbol: 'NASDAQ:AAPL',
      interval: 'D',
      theme: 'light',
    };

    render(<TradingViewWidget widgetOptions={mockWidgetOptions} />);

    // Expect script to be loaded
    expect(widgetManager.loadScript).toHaveBeenCalledTimes(1);

    // Wait for the widget to be created
    await waitFor(() => {
      expect(mockTradingViewWidget).toHaveBeenCalledTimes(1);
      expect(mockTradingViewWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockWidgetOptions,
          container_id: expect.any(String), // container_id is dynamically generated
        })
      );
    });
  });

  it('should pass the correct theme to the widget', async () => {
    const mockWidgetOptions = {
      symbol: 'NASDAQ:GOOGL',
    };

    render(<TradingViewWidget widgetOptions={mockWidgetOptions} theme="dark" />);

    await waitFor(() => {
      expect(mockTradingViewWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          colorTheme: 'dark',
        })
      );
    });
  });

  it('should set the correct ARIA attributes', () => {
    const mockWidgetOptions = {
      symbol: 'NASDAQ:MSFT',
    };
    const testTitle = 'Microsoft Stock Chart';

    render(<TradingViewWidget widgetOptions={mockWidgetOptions} title={testTitle} />);

    const widgetContainer = screen.getByRole('region');
    expect(widgetContainer).toHaveAttribute('aria-label', testTitle);
  });

  it('should remove the widget on unmount', async () => {
    const mockRemove = vi.fn();
    mockTradingViewWidget.mockImplementation((options) => {
      return {
        ...options,
        remove: mockRemove,
      };
    });

    const { unmount } = render(<TradingViewWidget widgetOptions={{ symbol: 'NASDAQ:AMZN' }} />);

    await waitFor(() => {
      expect(mockTradingViewWidget).toHaveBeenCalledTimes(1);
    });

    unmount();

    expect(mockRemove).toHaveBeenCalledTimes(1);
  });
});
