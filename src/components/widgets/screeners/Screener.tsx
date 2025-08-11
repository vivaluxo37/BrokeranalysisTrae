import React from 'react';
import LazyTradingViewWidget from '../LazyTradingViewWidget';

const Screener: React.FC<{ screenerOptions: any }> = ({ screenerOptions }) => {
  return <LazyTradingViewWidget widgetOptions={screenerOptions} />;
};

export default Screener;