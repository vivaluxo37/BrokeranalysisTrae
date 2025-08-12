import React, { Suspense } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import ResponsiveWidgetContainer from './ResponsiveWidgetContainer';

const TradingViewWidget = React.lazy(() => import('./TradingViewWidget'));

const LazyTradingViewWidget: React.FC<any> = (props) => {
  return (
    <ErrorBoundary fallback={<div>Failed to load widget.</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <ResponsiveWidgetContainer>
          <TradingViewWidget {...props} />
        </ResponsiveWidgetContainer>
      </Suspense>
    </ErrorBoundary>
  );
};

export default LazyTradingViewWidget;
