import React from 'react';
import Screener from './Screener';

const CryptoScreener: React.FC = () => {
  const widgetOptions = {
    width: '100%',
    height: '100%',
    defaultColumn: 'overview',
    screener_type: 'crypto_mkt',
    displayCurrency: 'USD',
    colorTheme: 'light',
    locale: 'en',
  };

  return <Screener screenerOptions={widgetOptions} />;
};

export default CryptoScreener;
