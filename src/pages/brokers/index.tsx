import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Shield, Star, TrendingUp } from 'lucide-react';

const BrokersIndex: React.FC = () => {
  const brokers = [
    {
      slug: 'interactive-brokers',
      name: 'Interactive Brokers',
      rating: 3.1,
      reviewCount: 3617,
      minDeposit: '$250',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'etoro',
      name: 'eToro',
      rating: 3.6,
      reviewCount: 139,
      minDeposit: '$250',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'xtb',
      name: 'XTB',
      rating: 4.6,
      reviewCount: 2155,
      minDeposit: '$500',
      regulators: ["FCA"]
    },
    {
      slug: 'saxo-bank',
      name: 'Saxo Bank',
      rating: 3.2,
      reviewCount: 3771,
      minDeposit: '$0',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'admirals-admiral-markets',
      name: 'Admiral Markets',
      rating: 3.9,
      reviewCount: 3714,
      minDeposit: '$250',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'charles-schwab',
      name: 'Charles Schwab',
      rating: 4.1,
      reviewCount: 1079,
      minDeposit: '$100',
      regulators: ["FCA"]
    },
    {
      slug: 'moomoo',
      name: 'Moomoo',
      rating: 3.9,
      reviewCount: 2618,
      minDeposit: '$100',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'trading-212',
      name: 'Trading 212',
      rating: 4.7,
      reviewCount: 764,
      minDeposit: '$0',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'swissquote',
      name: 'Swissquote',
      rating: 4.3,
      reviewCount: 2868,
      minDeposit: '$500',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'oanda',
      name: 'OANDA',
      rating: 4.9,
      reviewCount: 1733,
      minDeposit: '$500',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'mexem',
      name: 'Mexem',
      rating: 3.7,
      reviewCount: 4311,
      minDeposit: '$100',
      regulators: ["FCA"]
    },
    {
      slug: 'fidelity',
      name: 'Fidelity',
      rating: 4.7,
      reviewCount: 417,
      minDeposit: '$250',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'ninjatrader',
      name: 'NinjaTrader',
      rating: 4.6,
      reviewCount: 1498,
      minDeposit: '$1,000',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'plus500',
      name: 'Plus500',
      rating: 4.8,
      reviewCount: 2249,
      minDeposit: '$1,000',
      regulators: ["FCA"]
    },
    {
      slug: 'pepperstone',
      name: 'Pepperstone',
      rating: 4.4,
      reviewCount: 4777,
      minDeposit: '$100',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'degiro',
      name: 'DEGIRO',
      rating: 4.3,
      reviewCount: 1998,
      minDeposit: '$500',
      regulators: ["FCA"]
    },
    {
      slug: 'merrill-edge',
      name: 'Merrill Edge',
      rating: 3.3,
      reviewCount: 728,
      minDeposit: '$0',
      regulators: ["FCA"]
    },
    {
      slug: 'tastytrade',
      name: 'Tastytrade',
      rating: 3.7,
      reviewCount: 1660,
      minDeposit: '$250',
      regulators: ["FCA"]
    },
    {
      slug: 'lightyear',
      name: 'Lightyear',
      rating: 3.8,
      reviewCount: 3968,
      minDeposit: '$500',
      regulators: ["FCA"]
    },
    {
      slug: 'interactive-investor',
      name: 'Interactive Investor',
      rating: 4.3,
      reviewCount: 2217,
      minDeposit: '$0',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'webull',
      name: 'Webull',
      rating: 3.8,
      reviewCount: 2543,
      minDeposit: '$500',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'e-trade',
      name: 'E*TRADE',
      rating: 4.9,
      reviewCount: 2257,
      minDeposit: '$0',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'fusion-markets',
      name: 'Fusion Markets',
      rating: 4.8,
      reviewCount: 757,
      minDeposit: '$1,000',
      regulators: ["FCA"]
    },
    {
      slug: 'spreadex',
      name: 'Spreadex',
      rating: 3.8,
      reviewCount: 1085,
      minDeposit: '$500',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'vantage-markets',
      name: 'Vantage Markets',
      rating: 5,
      reviewCount: 3458,
      minDeposit: '$1,000',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'tickmill',
      name: 'Tickmill',
      rating: 3.5,
      reviewCount: 1063,
      minDeposit: '$250',
      regulators: ["FCA"]
    },
    {
      slug: 'amp-futures',
      name: 'AMP Futures',
      rating: 3.4,
      reviewCount: 5047,
      minDeposit: '$500',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'axitrader',
      name: 'AxiTrader',
      rating: 3.8,
      reviewCount: 2995,
      minDeposit: '$1,000',
      regulators: ["FCA"]
    },
    {
      slug: 'forex.com',
      name: 'Forex.com',
      rating: 4,
      reviewCount: 4633,
      minDeposit: '$100',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'capitalcom',
      name: 'Capital.com',
      rating: 4.9,
      reviewCount: 2712,
      minDeposit: '$250',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'multibank',
      name: 'Multibank',
      rating: 3.8,
      reviewCount: 2990,
      minDeposit: '$500',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'optimus-futures',
      name: 'Optimus Futures',
      rating: 4,
      reviewCount: 4726,
      minDeposit: '$250',
      regulators: ["FCA"]
    },
    {
      slug: 'trade-republic',
      name: 'Trade Republic',
      rating: 4.7,
      reviewCount: 3884,
      minDeposit: '$1,000',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'avatrade',
      name: 'AvaTrade',
      rating: 3.7,
      reviewCount: 1652,
      minDeposit: '$100',
      regulators: ["FCA"]
    },
    {
      slug: 'eightcap',
      name: 'Eightcap',
      rating: 3.7,
      reviewCount: 705,
      minDeposit: '$0',
      regulators: ["FCA"]
    },
    {
      slug: 'fp-markets',
      name: 'FP Markets',
      rating: 3.3,
      reviewCount: 4448,
      minDeposit: '$1,000',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'publiccom',
      name: 'Public.com',
      rating: 3.8,
      reviewCount: 502,
      minDeposit: '$1,000',
      regulators: ["FCA"]
    },
    {
      slug: 'tradestation',
      name: 'TradeStation',
      rating: 3.1,
      reviewCount: 1362,
      minDeposit: '$500',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'ally-invest',
      name: 'Ally Invest',
      rating: 4.4,
      reviewCount: 3597,
      minDeposit: '$500',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'alpaca-trading',
      name: 'Alpaca Trading',
      rating: 3.2,
      reviewCount: 2346,
      minDeposit: '$500',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'aj-bell-youinvest',
      name: 'AJ Bell YouInvest',
      rating: 3.6,
      reviewCount: 1762,
      minDeposit: '$500',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'firstrade',
      name: 'Firstrade',
      rating: 4.8,
      reviewCount: 164,
      minDeposit: '$250',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'fxcm',
      name: 'FXCM',
      rating: 3.9,
      reviewCount: 185,
      minDeposit: '$1,000',
      regulators: ["FCA"]
    },
    {
      slug: 'sofi-invest',
      name: 'SoFi Invest',
      rating: 5,
      reviewCount: 4131,
      minDeposit: '$250',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'activtrades',
      name: 'ActivTrades',
      rating: 4.7,
      reviewCount: 4214,
      minDeposit: '$1,000',
      regulators: ["FCA"]
    },
    {
      slug: 'global-prime',
      name: 'Global Prime',
      rating: 3.7,
      reviewCount: 4965,
      minDeposit: '$250',
      regulators: ["FCA"]
    },
    {
      slug: 'freetrade',
      name: 'Freetrade',
      rating: 3,
      reviewCount: 2274,
      minDeposit: '$250',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'hantec-markets',
      name: 'Hantec Markets',
      rating: 4.9,
      reviewCount: 1017,
      minDeposit: '$1,000',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'city-index',
      name: 'City Index',
      rating: 4.3,
      reviewCount: 3838,
      minDeposit: '$0',
      regulators: ["FCA"]
    },
    {
      slug: 'fxpro',
      name: 'FXPro',
      rating: 4.1,
      reviewCount: 3986,
      minDeposit: '$0',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'robinhood',
      name: 'Robinhood',
      rating: 4.7,
      reviewCount: 966,
      minDeposit: '$100',
      regulators: ["FCA"]
    },
    {
      slug: 'go-markets',
      name: 'Go Markets',
      rating: 4.3,
      reviewCount: 624,
      minDeposit: '$250',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'fxtradingcom',
      name: 'FXTrading.com',
      rating: 4.3,
      reviewCount: 1114,
      minDeposit: '$500',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'hycm',
      name: 'HYCM',
      rating: 3.3,
      reviewCount: 590,
      minDeposit: '$100',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'fbs',
      name: 'FBS',
      rating: 3.7,
      reviewCount: 783,
      minDeposit: '$500',
      regulators: ["FCA"]
    },
    {
      slug: 'trade-nation',
      name: 'Trade Nation',
      rating: 4.4,
      reviewCount: 1611,
      minDeposit: '$1,000',
      regulators: ["FCA"]
    },
    {
      slug: 'vanguard',
      name: 'Vanguard',
      rating: 3.7,
      reviewCount: 2027,
      minDeposit: '$100',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'xm',
      name: 'XM',
      rating: 3,
      reviewCount: 1757,
      minDeposit: '$500',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'moneta-markets',
      name: 'Moneta Markets',
      rating: 4.5,
      reviewCount: 4747,
      minDeposit: '$0',
      regulators: ["FCA"]
    },
    {
      slug: 'tradier',
      name: 'Tradier',
      rating: 3.9,
      reviewCount: 3364,
      minDeposit: '$100',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'vt-markets',
      name: 'VT Markets',
      rating: 3.4,
      reviewCount: 4105,
      minDeposit: '$250',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'tmgm',
      name: 'TMGM',
      rating: 4.5,
      reviewCount: 1033,
      minDeposit: '$250',
      regulators: ["FCA"]
    },
    {
      slug: 'tradezero',
      name: 'TradeZero',
      rating: 3.6,
      reviewCount: 2856,
      minDeposit: '$0',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'royal',
      name: 'Royal',
      rating: 3,
      reviewCount: 2759,
      minDeposit: '$0',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'sogotrade',
      name: 'SogoTrade',
      rating: 4.1,
      reviewCount: 3066,
      minDeposit: '$100',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'zacks-trade',
      name: 'Zacks Trade',
      rating: 3.7,
      reviewCount: 4423,
      minDeposit: '$100',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'captrader',
      name: 'CapTrader',
      rating: 4.7,
      reviewCount: 4649,
      minDeposit: '$250',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'easyequities',
      name: 'EasyEquities',
      rating: 4.5,
      reviewCount: 3932,
      minDeposit: '$500',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'choicetrade',
      name: 'ChoiceTrade',
      rating: 4.5,
      reviewCount: 4531,
      minDeposit: '$0',
      regulators: ["FCA"]
    },
    {
      slug: 'blackbull-markets',
      name: 'Blackbull Markets',
      rating: 3.5,
      reviewCount: 105,
      minDeposit: '$500',
      regulators: ["FCA"]
    },
    {
      slug: 'exness',
      name: 'Exness',
      rating: 3.1,
      reviewCount: 689,
      minDeposit: '$500',
      regulators: ["FCA"]
    },
    {
      slug: 'stake',
      name: 'Stake',
      rating: 3.5,
      reviewCount: 3837,
      minDeposit: '$1,000',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'fxtm',
      name: 'FXTM',
      rating: 4.6,
      reviewCount: 2420,
      minDeposit: '$250',
      regulators: ["FCA"]
    },
    {
      slug: 'marketsx',
      name: 'MarketsX',
      rating: 4.7,
      reviewCount: 3322,
      minDeposit: '$100',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'revolut',
      name: 'Revolut',
      rating: 3.4,
      reviewCount: 2346,
      minDeposit: '$500',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'skilling',
      name: 'Skilling',
      rating: 3.7,
      reviewCount: 108,
      minDeposit: '$0',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'citic-securities',
      name: 'CITIC Securities',
      rating: 4.6,
      reviewCount: 1804,
      minDeposit: '$100',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'halifax',
      name: 'Halifax',
      rating: 3.1,
      reviewCount: 3825,
      minDeposit: '$0',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'lynx',
      name: 'Lynx',
      rating: 3.9,
      reviewCount: 4475,
      minDeposit: '$100',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'flatex',
      name: 'Flatex',
      rating: 4.1,
      reviewCount: 1759,
      minDeposit: '$100',
      regulators: ["FCA"]
    },
    {
      slug: 'hargreaves-lansdown',
      name: 'Hargreaves Lansdown',
      rating: 3.2,
      reviewCount: 2348,
      minDeposit: '$100',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'charles-stanley-direct',
      name: 'Charles Stanley Direct',
      rating: 3.8,
      reviewCount: 1818,
      minDeposit: '$500',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'comdirect',
      name: 'Comdirect',
      rating: 3.9,
      reviewCount: 4586,
      minDeposit: '$500',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'bnp-paribas',
      name: 'BNP Paribas',
      rating: 5,
      reviewCount: 1332,
      minDeposit: '$250',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'davy-select',
      name: 'Davy Select',
      rating: 3.3,
      reviewCount: 104,
      minDeposit: '$100',
      regulators: ["FCA"]
    },
    {
      slug: 'fidelity-international',
      name: 'Fidelity International',
      rating: 5,
      reviewCount: 4439,
      minDeposit: '$1,000',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'barclays',
      name: 'Barclays',
      rating: 3.7,
      reviewCount: 1974,
      minDeposit: '$250',
      regulators: ["FCA","CySEC","ASIC"]
    },
    {
      slug: 'zerodha',
      name: 'Zerodha',
      rating: 3.9,
      reviewCount: 1634,
      minDeposit: '$250',
      regulators: ["FCA"]
    },
    {
      slug: 'sharekhan',
      name: 'Sharekhan',
      rating: 4.5,
      reviewCount: 101,
      minDeposit: '$500',
      regulators: ["FCA","CySEC"]
    },
    {
      slug: 'questrade',
      name: 'Questrade',
      rating: 4,
      reviewCount: 4097,
      minDeposit: '$250',
      regulators: ["FCA"]
    },
    {
      slug: 'jp-morgan-self-directed-investing',
      name: 'J.P. Morgan Self-Directed Investing',
      rating: 3.1,
      reviewCount: 1485,
      minDeposit: '$100',
      regulators: ["FCA","CySEC","ASIC"]
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <>
      <Helmet>
        <title>Best Online Brokers 2025 - Comprehensive Broker Reviews | BrokerAnalysis</title>
        <meta 
          name="description" 
          content="Compare the best online brokers of 2025. Expert reviews, ratings, and analysis of top trading platforms. Find your perfect broker today." 
        />
        <meta name="keywords" content="best online brokers 2025, broker reviews, trading platforms, stock brokers, forex brokers" />
        <link rel="canonical" href="https://brokeranalysis.com/brokers" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Best Online Brokers 2025
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive reviews and analysis of the top online brokers. 
              Compare fees, platforms, and features to find your perfect trading partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokers.map((broker) => (
              <Link
                key={broker.slug}
                to={`/brokers/${broker.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{broker.name}</h3>
                  <div className="flex items-center space-x-1">
                    <div className="flex">{renderStars(brokerData.rating)}</div>
                    <span className="text-sm text-gray-600 ml-1">{broker.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Min Deposit:</span>
                    <span className="font-semibold text-green-600">{broker.minDeposit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Regulation:</span>
                    <span className="font-semibold">{broker.regulators[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reviews:</span>
                    <span className="font-semibold">{broker.reviewCount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-blue-600 font-medium hover:text-blue-700">
                    Read Full Review →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrokersIndex;
