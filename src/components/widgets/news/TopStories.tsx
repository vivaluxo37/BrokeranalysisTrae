import React from 'react';
import LazyTradingViewWidget from '../LazyTradingViewWidget';

const TopStories: React.FC = () => {
  const widgetOptions = {
    displayMode: 'regular',
    feedMode: 'all_symbols',
    colorTheme: 'light',
    isTransparent: false,
    locale: 'en',
    width: 400,
    height: 550,
  };

  return <LazyTradingViewWidget widgetOptions={widgetOptions} />;
};

export default TopStories;
