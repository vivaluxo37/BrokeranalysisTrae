import React from 'react';
import LazyTradingViewWidget from '../LazyTradingViewWidget';

const StockMarketWidget: React.FC = () => {
  const widgetOptions = {
    symbols: [
      ['Apple', 'AAPL|1D'],
      ['Google', 'GOOGL|1D'],
      ['Microsoft', 'MSFT|1D'],
      ['Amazon', 'AMZN|1D'],
      ['Tesla', 'TSLA|1D'],
    ],
    chartOnly: false,
    width: 1000,
    height: 500,
    locale: 'en',
    colorTheme: 'light',
    autosize: false,
    showVolume: false,
    showMA: false,
    hideDateRanges: false,
    hideMarketStatus: false,
    hideSymbolLogo: false,
    scalePosition: 'right',
    scaleMode: 'Normal',
    fontFamily: 'Trebuchet MS, sans-serif',
    fontSize: '10',
    noTimeScale: false,
    valuesTracking: '1',
    changeMode: 'price-and-percent',
    chartType: 'area',
    maLineColor: '#2962FF',
    maLineWidth: 1,
    maLength: 9,
    lineWidth: 2,
    lineType: 0,
    dateRanges: [
      '1d|1',
      '1m|30',
      '3m|60',
      '12m|1D',
      '60m|1W',
      'all|1M',
    ],
  };

  return <LazyTradingViewWidget widgetOptions={widgetOptions} />;
};

export default StockMarketWidget;