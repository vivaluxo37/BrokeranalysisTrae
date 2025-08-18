// Enums for the BrokerAnalysis platform

// Broker and trading related enums
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
  ESMA = 'esma',
  CFTC = 'cftc'
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

export enum BrokerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export enum BrokerRatingCategory {
  OVERALL = 'overall',
  FEES = 'fees',
  PLATFORM = 'platform',
  RESEARCH = 'research',
  CUSTOMER_SERVICE = 'customer_service',
  MOBILE = 'mobile'
}

export enum TradingExperience {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PROFESSIONAL = 'professional',
  FIRST_TIMER = 'first_timer',
  SIMPLE_TRANSACTIONS = 'simple_transactions',
  EXPERIENCED = 'experienced'
}

export enum RegionAvailability {
  GLOBAL = 'global',
  US = 'us',
  EU = 'eu',
  UK = 'uk',
  ASIA = 'asia',
  AUSTRALIA = 'australia'
}

// Cryptix application enums
export enum CryptoCurrency {
  BITCOIN = 'Bitcoin',
  SOLANA = 'Solana', 
  DASH = 'Dash',
  XRP = 'XRP'
}

export enum FAQCategory {
  GENERAL = 'general',
  SECURITY = 'security',
  TECHNICAL = 'technical',
  SUPPORT = 'support'
}