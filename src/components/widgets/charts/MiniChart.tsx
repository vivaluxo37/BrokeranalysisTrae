import React from 'react';
import LazyTradingViewWidget from '../LazyTradingViewWidget';

const MiniChart: React.FC<{ symbol: string }> = ({ symbol }) => {
  const widgetOptions = {
    symbol,
    width: '100%',
    height: '100%',
    locale: 'en',
    dateRange: '12M',
    colorTheme: 'light',
    isTransparent: false,
    autosize: true,
    largeChartUrl: ''
  };

  return <LazyTradingViewWidget widgetOptions={widgetOptions} />;
};

export default MiniChart;
