import React from 'react';
import LazyTradingViewWidget from '../LazyTradingViewWidget';

const EconomicCalendar: React.FC = () => {
  const widgetOptions = {
    colorTheme: 'light',
    isTransparent: false,
    width: '100%',
    height: '100%',
    locale: 'en',
    importanceFilter: '-1,0,1',
  };

  return <LazyTradingViewWidget widgetOptions={widgetOptions} />;
};

export default EconomicCalendar;
