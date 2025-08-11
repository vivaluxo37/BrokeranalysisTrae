# TradingView Widget Integration Guide

This document outlines the integration of TradingView widgets into the BrokerAnalysis platform.

## 1. Core Infrastructure

### Base TradingView Widget Component (`src/components/widgets/TradingViewWidget.tsx`)
This component acts as a generic wrapper for all TradingView widgets. It handles the dynamic loading of the TradingView script and the creation of the widget instance.

**Props:**
- `widgetOptions`: An object containing the specific options for the TradingView widget (e.g., `symbol`, `interval`, `theme`).
- `title`: (Optional) A string to provide an accessible title for the widget container.
- `theme`: (Optional) 'light' or 'dark' to control the widget's color theme. Defaults to 'light'.

### Widget Manager Service (`src/services/widgetManager.ts`)
This singleton service ensures that the TradingView script (`tv.js`) is loaded only once across the application. It includes retry logic for failed script loads and logs performance metrics.

### Error Boundary (`src/components/ErrorBoundary.tsx`)
A React Error Boundary component that catches JavaScript errors anywhere in its child component tree, logs those errors, and displays a fallback UI instead of crashing the entire application. It includes a basic retry mechanism.

### Responsive Widget Container (`src/components/widgets/ResponsiveWidgetContainer.tsx` and `.css`)
This component provides a responsive container for the TradingView widgets, adapting their size based on screen dimensions using CSS media queries.

## 2. Widget Loading and Performance Optimization

### Lazy Loading (`src/components/widgets/LazyTradingViewWidget.tsx`)
The `LazyTradingViewWidget` component uses `React.lazy` and `Suspense` to lazy load the `TradingViewWidget`. This improves initial page load performance by only loading the widget's code when it's needed. It also wraps the widget in an `ErrorBoundary`.

### Widget State Management (`src/hooks/useWidgetState.ts`)
A custom React hook (`useWidgetState`) for managing the loading, error, and success states of individual widgets.

## 3. Chart Widget Components

- **Advanced Chart (`src/components/widgets/charts/AdvancedChart.tsx`)**: Displays a comprehensive, real-time chart for a given symbol.
- **Symbol Overview (`src/components/widgets/charts/SymbolOverview.tsx`)**: Provides a compact overview of a financial instrument, including price and a mini-chart.
- **Mini Chart (`src/components/widgets/charts/MiniChart.tsx`)**: A very compact chart for displaying price trends of a single symbol.
- **Market Overview (`src/components/widgets/charts/MarketOverview.tsx`)**: Offers a broad overview of various market indices.
- **Stock Market Widget (`src/components/widgets/charts/StockMarketWidget.tsx`)**: Displays a list of popular stocks with their performance.

## 4. Heatmap and Screener Widgets

- **Stock Heatmap (`src/components/widgets/heatmaps/StockHeatmap.tsx`)**: Visualizes the stock market performance by sector or industry.
- **Crypto Heatmap (`src/components/widgets/heatmaps/CryptoHeatmap.tsx`)**: Visualizes the cryptocurrency market performance.
- **Forex Heatmap (`src/components/widgets/heatmaps/ForexHeatmap.tsx`)**: Visualizes the strength and weakness of major currency pairs.
- **Forex Cross Rates (`src/components/widgets/heatmaps/ForexCrossRates.tsx`)**: Displays a table of forex cross rates.
- **Screener (`src/components/widgets/screeners/Screener.tsx`)**: A generic component for various screeners.
- **Stock Screener (`src/components/widgets/screeners/StockScreener.tsx`)**: Pre-configured screener for stocks.
- **Crypto Screener (`src/components/widgets/screeners/CryptoScreener.tsx`)**: Pre-configured screener for cryptocurrencies.

## 5. News and Calendar Widgets

- **Economic Calendar (`src/components/widgets/calendar/EconomicCalendar.tsx`)**: Displays important economic events and their impact.
- **Top Stories (`src/components/widgets/news/TopStories.tsx`)**: Displays top news headlines.

## 6. Integration Points

- **Homepage (`src/pages/HomePage.tsx`)**:
    - Market Overview widget added to the hero section.
    - Stock Market widget integrated into the market summary section.
    - Mini Chart widgets for major indices placed below the "Top-Rated Brokers Showcase".
- **Tools Landing Page (`src/pages/ToolsLandingPage.tsx`)**:
    - Heatmap and Screener widgets added with a tabbed interface.
    - Economic Calendar tool card replaced with the actual `EconomicCalendar` widget.
- **Broker Profile Page (`src/pages/BrokerProfilePage.tsx`)**:
    - Advanced Chart widget added to the "Overview" tab.
- **News Hub (`src/pages/news/NewsHub.tsx`)**:
    - "Live Market Data" section replaced with `MarketOverview` widget.
    - "Featured Articles" and "All Articles" sections replaced with `TopStories` widget.
- **Leverage Calculator (`src/pages/tools/leverage-calculator.tsx`)**:
    - Added a "Symbol" input field and an `AdvancedChart` widget.
- **Brokerage Fee Calculator (`src/pages/tools/brokerage-fee-calculator.tsx`)**:
    - Conditionally displays heatmaps based on the selected asset type.
- **Spread Comparison Tool (`src/pages/tools/spread-comparison.tsx`)**:
    - Added `ForexCrossRates` widget.

## 7. Accessibility and Performance

- **Accessibility**: Basic ARIA attributes (`role="region"`, `aria-label`) have been added to the `TradingViewWidget` container. Further accessibility enhancements should be considered within the TradingView widget options if available.
- **Performance Monitoring**: Basic console logging for script loading and widget initialization times has been implemented in `widgetManager.ts` and `TradingViewWidget.tsx`.

## 8. Deployment Considerations

- Ensure all new components and services are correctly bundled during the build process.
- Monitor the performance of the integrated widgets in production environments using dedicated monitoring tools.
- Regularly check for updates to TradingView widgets and their documentation.
