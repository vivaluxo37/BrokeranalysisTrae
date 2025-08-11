import React from 'react';
import LazyTradingViewWidget from '../LazyTradingViewWidget';

const AdvancedChart: React.FC<{ symbol: string }> = ({ symbol }) => {
  const widgetOptions = {
    symbol,
    theme: 'light',
    // Add other advanced chart options here
  };

  return <LazyTradingViewWidget widgetOptions={widgetOptions} />;
};

export default AdvancedChart;
