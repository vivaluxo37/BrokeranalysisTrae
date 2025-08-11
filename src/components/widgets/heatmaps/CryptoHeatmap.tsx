import React from 'react';
import LazyTradingViewWidget from '../LazyTradingViewWidget';

const CryptoHeatmap: React.FC = () => {
  const widgetOptions = {
    dataSource: 'Crypto',
    blockSize: 'market_cap_calc',
    blockColor: '24h_close_change|5',
    locale: 'en',
    symbolUrl: '',
    colorTheme: 'light',
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

export default CryptoHeatmap;