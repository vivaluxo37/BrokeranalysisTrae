// Cryptix Types - Clean recreation to resolve import issues

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  last_updated: string;
}

export type CryptoPriceStatus = 'loading' | 'success' | 'error';

export interface CryptoPriceState {
  prices: CryptoPrice[];
  status: CryptoPriceStatus;
  error: string | null;
  lastUpdated: string | null;
}

export interface CryptoPriceAction {
  type: 'FETCH_START' | 'FETCH_SUCCESS' | 'FETCH_ERROR';
  payload?: CryptoPrice[] | string;
}

export interface CryptoPlatformSection {
  id: string;
  title: string;
  description: string;
  features: string[];
  supported_cryptos: string[];
  trading_fees: {
    maker: number;
    taker: number;
  };
  min_deposit: number;
  security_features: string[];
}

export interface CryptoTradingPlatform {
  id: string;
  name: string;
  logo: string;
  rating: number;
  sections: CryptoPlatformSection[];
  overall_score: number;
  pros: string[];
  cons: string[];
  supported_countries: string[];
  regulation: string[];
}

export interface CryptoMarketData {
  total_market_cap: number;
  total_volume_24h: number;
  market_cap_change_percentage_24h: number;
  active_cryptocurrencies: number;
  market_cap_percentage: Record<string, number>;
}

export interface CryptoNewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  published_at: string;
  source: string;
  image_url?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface CryptoAnalysis {
  symbol: string;
  technical_indicators: {
    rsi: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
    moving_averages: {
      sma_20: number;
      sma_50: number;
      ema_12: number;
      ema_26: number;
    };
  };
  support_resistance: {
    support_levels: number[];
    resistance_levels: number[];
  };
  trend_analysis: {
    short_term: 'bullish' | 'bearish' | 'neutral';
    medium_term: 'bullish' | 'bearish' | 'neutral';
    long_term: 'bullish' | 'bearish' | 'neutral';
  };
  price_prediction: {
    next_24h: {
      min: number;
      max: number;
      confidence: number;
    };
    next_7d: {
      min: number;
      max: number;
      confidence: number;
    };
  };
}