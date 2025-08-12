import React from 'react';
import LazyTradingViewWidget from '../LazyTradingViewWidget';

const MarketOverview: React.FC = () => {
  const widgetOptions = {
    colorTheme: 'light',
    dateRange: '12M',
    showChart: true,
    locale: 'en',
    largeChartUrl: '',
    isTransparent: false,
    showSymbolLogo: true,
    showFloatingTooltip: false,
    width: '400',
    height: '660',
    plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
    plotLineColorFalling: 'rgba(41, 98, 255, 1)',
    gridLineColor: 'rgba(240, 243, 250, 0)',
    scaleFontColor: 'rgba(106, 109, 120, 1)',
    belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
    belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
    symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
    tabs: [
      {
        title: 'Indices',
        symbols: [
          {
            s: 'FOREXCOM:SPXUSD',
            d: 'S&P 500',
          },
          {
            s: 'FOREXCOM:NSXUSD',
            d: 'US 100',
          },
          {
            s: 'FOREXCOM:DJI',
            d: 'Dow 30',
          },
          {
            s: 'INDEX:NKY',
            d: 'Nikkei 225',
          },
          {
            s: 'INDEX:DEU40',
            d: 'DAX Index',
          },
          {
            s: 'FOREXCOM:UKXGBP',
            d: 'UK 100',
          },
        ],
        originalTitle: 'Indices',
      },
    ],
  };

  return <LazyTradingViewWidget widgetOptions={widgetOptions} />;
};

export default MarketOverview;
