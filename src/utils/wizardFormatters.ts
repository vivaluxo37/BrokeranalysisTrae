// String formatters for broker recommendation wizard

export const formatStepTitle = (step: number, total: number): string => {
  return `Basic Preferences (${step}/${total})`;
};

export const formatStepNumber = (step: number): string => {
  return `STEP ${step}`;
};

export const formatBrokerRank = (rank: number): string => {
  return rank.toString();
};

export const formatDepositRange = (range: string): string => {
  const ranges = {
    'less_than_50': 'Less than $50',
    '51_200': '$51 - $200',
    '201_500': '$201 - $500',
    '501_1000': '$501 - $1,000',
    '1001_2000': '$1,001 - $2,000',
    'more_than_2000': 'More than $2,000',
    'dont_know': "I don't know"
  };
  return ranges[range] || range;
};

export const formatAssetType = (asset: string): string => {
  const assets = {
    'stocks_etfs': 'Stocks and ETFs (e.g. Apple or Tesla shares)',
    'forex': 'Forex (e.g. EUR/USD or GBP/USD)',
    'options': 'Options (e.g. Apple call option)',
    'futures': 'Futures (e.g. e-mini S&P 500 futures)',
    'funds': 'Funds (e.g. BlackRock Equity Dividend Fund)',
    'bonds': 'Bonds (e.g. US treasuries)',
    'cfds': 'CFDs (e.g. Apple share CFD)',
    'cryptos': 'Cryptos (e.g. Bitcoin or Ethereum)',
    'dont_know': "I don't know"
  };
  return assets[asset] || asset;
};