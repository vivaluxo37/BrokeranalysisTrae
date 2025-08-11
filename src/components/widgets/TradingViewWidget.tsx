import React, { useEffect, useRef, useState } from 'react';
import { TradingViewWidgetProps } from './types';
import widgetManager from '../../services/widgetManager';

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ widgetOptions, title, theme = 'light' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const widgetInitStartTime = performance.now();
    const createWidget = () => {
      if (containerRef.current && window.TradingView) {
        const widget = new window.TradingView.widget({
          ...widgetOptions,
          container_id: containerRef.current.id,
          colorTheme: theme,
        });
        widgetRef.current = widget;
        const widgetInitEndTime = performance.now();
        console.log(`TradingView widget initialized in ${widgetInitEndTime - widgetInitStartTime} ms`);
      }
    };

    widgetManager.loadScript()
      .then(() => {
        setIsLoading(false);
        createWidget();
      })
      .catch((error) => {
        console.error("Failed to load TradingView script", error);
        setIsLoading(false);
        setHasError(true);
      });

    return () => {
      if (widgetRef.current && widgetRef.current.remove) {
        widgetRef.current.remove();
      }
    };
  }, [widgetOptions, theme]);

  if (isLoading) {
    return <div>Loading widget...</div>;
  }

  if (hasError) {
    return <div>Failed to load widget</div>;
  }

  return (
    <div
      id={`tradingview-widget-${Math.random()}`}
      ref={containerRef}
      role="region"
      aria-label={title || "TradingView Widget"}
    />
  );
};

export default TradingViewWidget;
