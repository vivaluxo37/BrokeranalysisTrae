import React from 'react';
import LazyTradingViewWidget from '../LazyTradingViewWidget';

const StockHeatmap: React.FC = () => {
  const widgetOptions = {
    dataSource: 'SPX500',
    blockSize: 'market_cap_basic',
    blockColor: 'change',
    grouping: 'sector',
    locale: 'en',
    symbolUrl: '',
    colorTheme: 'light',
    exchanges: [],
    hasTopBar: false,
    isDataSetEnabled: false,
    isZoomEnabled: true,
    hasSymbolTooltip: true,
    isMonoSize: false,
    width: '100%',
    height: '100%',
  };

  return <LazyTradingViewWidget widgetOptions={widgetOptions} />;
};

export default StockHeatmap;
