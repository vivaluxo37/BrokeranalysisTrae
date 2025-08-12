import React from 'react';
import LazyTradingViewWidget from '../LazyTradingViewWidget';

const TopStories: React.FC = () => {
  const widgetOptions = {
    feedMode: "all_symbols",
    isTransparent: false,
    displayMode: "regular",
    width: "100%",
    height: 550,
    colorTheme: "light",
    locale: "en"
  };

  return (
    <div className="top-stories-widget">
      <LazyTradingViewWidget 
        widgetOptions={widgetOptions}
        title="Top Stories"
        theme="light"
      />
    </div>
  );
};

export default TopStories;
