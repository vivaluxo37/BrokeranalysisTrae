// Enums for broker recommendation wizard

export enum WizardStep {
  COUNTRY = 1,
  ASSETS = 2,
  EXPERIENCE = 3,
  FEES = 4,
  FREQUENCY = 5,
  DEPOSIT = 6,
  RESULTS = 7
}

export enum AssetType {
  STOCKS_ETFS = 'stocks_etfs',
  FOREX = 'forex',
  OPTIONS = 'options',
  FUTURES = 'futures',
  FUNDS = 'funds',
  BONDS = 'bonds',
  CFDS = 'cfds',
  CRYPTOS = 'cryptos',
  DONT_KNOW = 'dont_know'
}

export enum TradingExperience {
  FIRST_TIMER = 'first_timer',
  SIMPLE_TRANSACTIONS = 'simple_transactions',
  EXPERIENCED = 'experienced',
  PROFESSIONAL = 'professional'
}

export enum FeePreference {
  REASONABLE_FEES = 'reasonable_fees',
  LOW_COST = 'low_cost',
  ZERO_COMMISSION = 'zero_commission',
  DONT_KNOW = 'dont_know'
}

export enum TradingFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  DONT_KNOW = 'dont_know'
}

export enum DepositAmount {
  LESS_THAN_50 = 'less_than_50',
  RANGE_51_200 = '51_200',
  RANGE_201_500 = '201_500',
  RANGE_501_1000 = '501_1000',
  RANGE_1001_2000 = '1001_2000',
  MORE_THAN_2000 = 'more_than_2000',
  DONT_KNOW = 'dont_know'
}

// Props types (data passed to components)
export interface BrokerRecommendationWizardProps {
  onComplete: () => void;
  onSaveResults: () => void;
  initialStep?: number;
}

export interface WizardStepProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onStepChange: (step: number) => void;
}

export interface UserPreferences {
  country: string;
  assets: string[];
  experience: string;
  feePreference: string;
  frequency: string;
  depositAmount: string;
}

export interface BrokerRecommendation {
  id: string;
  name: string;
  logo: string;
  rank: number;
  score: number;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

// Store types (global state data)
export interface WizardStoreTypes {
  currentStep: number;
  totalSteps: number;
  userPreferences: UserPreferences;
  isWizardCompleted: boolean;
  setCurrentStep: (step: number) => void;
  setUserPreferences: (preferences: Partial<UserPreferences>) => void;
  completeWizard: () => void;
  resetWizard: () => void;
}

// Query types (API response data)
export interface WizardQueryTypes {
  countries: Country[];
  brokerRecommendations: BrokerRecommendation[];
}