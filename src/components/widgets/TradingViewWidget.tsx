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
    
    // Determine widget type
    const isTopStoriesWidget = widgetOptions.feedMode !== undefined;

    const createWidget = () => {
      if (containerRef.current) {
        if (isTopStoriesWidget) {
          // For Top Stories widget, create the proper HTML structure
          const widgetContainer = document.createElement('div');
          widgetContainer.className = 'tradingview-widget-container';
          widgetContainer.style.height = '100%';
          widgetContainer.style.width = '100%';
          
          const widgetDiv = document.createElement('div');
          widgetDiv.className = 'tradingview-widget-container__widget';
          
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
          script.async = true;
          script.innerHTML = JSON.stringify({
            ...widgetOptions,
            colorTheme: theme,
          });
          
          const copyrightDiv = document.createElement('div');
          copyrightDiv.className = 'tradingview-widget-copyright';
          copyrightDiv.innerHTML = '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>';
          
          widgetContainer.appendChild(widgetDiv);
          widgetContainer.appendChild(script);
          widgetContainer.appendChild(copyrightDiv);
          
          // Clear container and add widget
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(widgetContainer);
        } else if (window.TradingView) {
          // For other widgets, use the TradingView.widget constructor
          const widget = new window.TradingView.widget({
            ...widgetOptions,
            container_id: containerRef.current.id,
            colorTheme: theme,
          });
          widgetRef.current = widget;
        }
        const widgetInitEndTime = performance.now();
        console.log(`TradingView widget initialized in ${widgetInitEndTime - widgetInitStartTime} ms`);
        setIsLoading(false);
      }
    };

    if (isTopStoriesWidget) {
      // For Top Stories, we don't need to load the main TradingView script
      createWidget();
    } else {
      // For other widgets, load the main TradingView script
      widgetManager.loadScript()
        .then(() => {
          createWidget();
        })
        .catch((error) => {
          console.error("Failed to load TradingView script", error);
          setIsLoading(false);
          setHasError(true);
        });
    }

    return () => {
      if (widgetRef.current && widgetRef.current.remove) {
        widgetRef.current.remove();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
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
