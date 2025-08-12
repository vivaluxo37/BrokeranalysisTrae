// Broker and trading related enums for BrokerAnalysis platform

export enum AssetClass {
  FOREX = 'forex',
  STOCKS = 'stocks', 
  CRYPTO = 'crypto',
  CFD = 'cfd',
  COMMODITIES = 'commodities',
  INDICES = 'indices',
  ETFS = 'etfs',
  FUTURES = 'futures'
}

export enum BrokerCategory {
  TOP_RATED = 'top-rated',
  LOW_COST = 'low-cost',
  REGULATED = 'regulated',
  BEGINNER_FRIENDLY = 'beginner-friendly',
  PROFESSIONAL = 'professional',
  CRYPTO_SPECIALIST = 'crypto-specialist',
  ECN = 'ecn',
  MARKET_MAKER = 'market-maker',
  DMA = 'dma',
  STP = 'stp'
}

export enum RegulatorType {
  FCA = 'fca',
  CYSEC = 'cysec', 
  ASIC = 'asic',
  SEC = 'sec',
  FINRA = 'finra',
  ESMA = 'esma'
}

export enum TradingPlatform {
  METATRADER_4 = 'mt4',
  METATRADER_5 = 'mt5',
  CTRADER = 'ctrader',
  PROPRIETARY = 'proprietary',
  WEB_BASED = 'web-based',
  MOBILE_APP = 'mobile-app'
}

export enum AccountType {
  DEMO = 'demo',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  VIP = 'vip',
  ISLAMIC = 'islamic',
  PROFESSIONAL = 'professional'
}

export enum ReviewType {
  EXPERT = 'expert',
  USER = 'user',
  VERIFIED = 'verified',
  RECENT = 'recent'
}

export enum ToolType {
  COMPARISON = 'comparison',
  CALCULATOR = 'calculator',
  SCANNER = 'scanner',
  CALENDAR = 'calendar',
  ANALYZER = 'analyzer'
}
