import React from 'react';
import LazyTradingViewWidget from '../LazyTradingViewWidget';

const ForexCrossRates: React.FC = () => {
  const widgetOptions = {
    colorTheme: 'light',
    isTransparent: false,
    locale: 'en',
    currencies: [
      'EUR',
      'USD',
      'JPY',
      'GBP',
      'CHF',
      'AUD',
      'CAD',
      'NZD',
      'CNY',
    ],
    backgroundColor: '#ffffff',
    width: 550,
    height: 400,
  };

  return <LazyTradingViewWidget widgetOptions={widgetOptions} />;
};

export default ForexCrossRates;
