
import type { Broker } from '@/types/brokerTypes'
import { AssetType, TradingExperience, FeePreference, TradingFrequency, DepositAmount } from '@/types/wizard'
import type { UserPreferences } from '@/types/wizard'

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Broker scoring interface
interface BrokerScore {
  broker: Broker
  score: number
  matchReasons: string[]
}

// Filter criteria interface
interface FilterCriteria {
  country?: string
  assets?: AssetType[]
  experience?: TradingExperience
  feePreference?: FeePreference
  frequency?: TradingFrequency
  depositAmount?: DepositAmount
}

class BrokerFilterService {
  private static instance: BrokerFilterService
  private brokers: Broker[] = []
  private debouncedFilter: (criteria: FilterCriteria, callback: (results: Broker[]) => void) => void

  constructor() {
    // Create debounced filter function with 500ms delay as required
    this.debouncedFilter = debounce(this.performFiltering.bind(this), 500)
  }

  public static getInstance(): BrokerFilterService {
    if (!BrokerFilterService.instance) {
      BrokerFilterService.instance = new BrokerFilterService()
    }
    return BrokerFilterService.instance
  }

  // Initialize with broker data
  public setBrokers(brokers: Broker[]): void {
    this.brokers = brokers
  }

  // Main filtering method with debouncing
  public filterBrokers(
    preferences: UserPreferences,
    callback: (results: Broker[]) => void
  ): void {
    const criteria: FilterCriteria = {
      country: preferences.country,
      assets: preferences.assets,
      experience: preferences.experience,
      feePreference: preferences.feePreference,
      frequency: preferences.frequency,
      depositAmount: preferences.depositAmount
    }

    this.debouncedFilter(criteria, callback)
  }

  // Immediate filtering without debouncing (for final results)
  public filterBrokersImmediate(preferences: UserPreferences): Broker[] {
    const criteria: FilterCriteria = {
      country: preferences.country,
      assets: preferences.assets,
      experience: preferences.experience,
      feePreference: preferences.feePreference,
      frequency: preferences.frequency,
      depositAmount: preferences.depositAmount
    }

    return this.performFilteringSync(criteria)
  }

  // Perform the actual filtering logic
  private performFiltering(
    criteria: FilterCriteria,
    callback: (results: Broker[]) => void
  ): void {
    try {
      const results = this.performFilteringSync(criteria)
      callback(results)
    } catch (error) {
      console.error('Error filtering brokers:', error)
      callback([])
    }
  }

  // Synchronous filtering logic
  private performFilteringSync(criteria: FilterCriteria): Broker[] {
    if (this.brokers.length === 0) {
      return []
    }

    // Score and filter brokers based on criteria
    const scoredBrokers: BrokerScore[] = this.brokers
      .map(broker => this.scoreBroker(broker, criteria))
      .filter(scored => scored.score > 0)
      .sort((a, b) => b.score - a.score)

    // Return top matches (limit to 20 for performance)
    return scoredBrokers.slice(0, 20).map(scored => scored.broker)
  }

  // Score a broker based on user preferences
  private scoreBroker(broker: Broker, criteria: FilterCriteria): BrokerScore {
    let score = 0
    const matchReasons: string[] = []

    // Country filtering (mandatory)
    if (criteria.country && !this.brokerSupportsCountry(broker, criteria.country)) {
      return { broker, score: 0, matchReasons: [] }
    }

    // Base score from broker rating and trust indicators
    score += broker.rating * 10
    if (broker.trustScore) {
      score += broker.trustScore * 5
    }
    if (broker.verified) {
      score += 20
      matchReasons.push('Verified broker')
    }
    if (broker.featured) {
      score += 10
    }

    // Asset class matching
    if (criteria.assets && criteria.assets.length > 0) {
      const assetScore = this.scoreAssetMatch(broker, criteria.assets)
      score += assetScore.score
      matchReasons.push(...assetScore.reasons)
    }

    // Experience level matching
    if (criteria.experience) {
      const expScore = this.scoreExperienceMatch(broker, criteria.experience)
      score += expScore.score
      matchReasons.push(...expScore.reasons)
    }

    // Fee preference matching
    if (criteria.feePreference) {
      const feeScore = this.scoreFeeMatch(broker, criteria.feePreference)
      score += feeScore.score
      matchReasons.push(...feeScore.reasons)
    }

    // Trading frequency matching
    if (criteria.frequency) {
      const freqScore = this.scoreFrequencyMatch(broker, criteria.frequency)
      score += freqScore.score
      matchReasons.push(...freqScore.reasons)
    }

    // Deposit amount matching
    if (criteria.depositAmount) {
      const depositScore = this.scoreDepositMatch(broker, criteria.depositAmount)
      score += depositScore.score
      matchReasons.push(...depositScore.reasons)
    }

    return { broker, score, matchReasons }
  }

  // Check if broker supports the selected country
  private brokerSupportsCountry(broker: Broker, country: string): boolean {
    // This would typically check against a country support database
    // For now, we'll assume most brokers support most countries except restricted ones
    const restrictedCountries = ['KP'] // North Korea
    return !restrictedCountries.includes(country)
  }

  // Score asset class matching
  private scoreAssetMatch(broker: Broker, assets: AssetType[]): { score: number; reasons: string[] } {
    let score = 0
    const reasons: string[] = []

    // This would typically check broker's supported asset classes
    // For now, we'll use platform information as a proxy
    const platforms = broker.platforms.join(' ').toLowerCase()
    
    assets.forEach(asset => {
      switch (asset) {
        case AssetType.FOREX:
          if (platforms.includes('forex') || platforms.includes('mt4') || platforms.includes('mt5')) {
            score += 15
            reasons.push('Supports Forex trading')
          }
          break
        case AssetType.STOCKS_ETFS:
          if (platforms.includes('stock') || platforms.includes('equity')) {
            score += 15
            reasons.push('Supports Stock/ETF trading')
          }
          break
        case AssetType.CFDS:
          if (platforms.includes('cfd')) {
            score += 15
            reasons.push('Supports CFD trading')
          }
          break
        case AssetType.CRYPTOS:
          if (platforms.includes('crypto') || platforms.includes('bitcoin')) {
            score += 15
            reasons.push('Supports Cryptocurrency trading')
          }
          break
        default:
          score += 5 // Generic asset support
      }
    })

    return { score, reasons }
  }

  // Score experience level matching
  private scoreExperienceMatch(broker: Broker, experience: TradingExperience): { score: number; reasons: string[] } {
    let score = 0
    const reasons: string[] = []

    switch (experience) {
      case TradingExperience.FIRST_TIMER:
        // Prefer brokers with educational resources and lower minimum deposits
        if (broker.minDeposit <= 100) {
          score += 20
          reasons.push('Low minimum deposit for beginners')
        }
        if (broker.platforms.some(p => p.toLowerCase().includes('web'))) {
          score += 10
          reasons.push('User-friendly web platform')
        }
        break
      case TradingExperience.PROFESSIONAL:
        // Prefer brokers with advanced platforms and higher leverage
        if (broker.maxLeverage >= 100) {
          score += 15
          reasons.push('High leverage available')
        }
        if (broker.platforms.some(p => p.toLowerCase().includes('mt4') || p.toLowerCase().includes('mt5'))) {
          score += 15
          reasons.push('Professional trading platforms')
        }
        break
      default:
        score += 5 // Neutral scoring for other experience levels
    }

    return { score, reasons }
  }

  // Score fee preference matching
  private scoreFeeMatch(broker: Broker, feePreference: FeePreference): { score: number; reasons: string[] } {
    let score = 0
    const reasons: string[] = []

    switch (feePreference) {
      case FeePreference.ZERO_COMMISSION:
        if (broker.spreadsFrom === 0) {
          score += 25
          reasons.push('Zero commission trading')
        }
        break
      case FeePreference.LOW_COST:
        if (broker.spreadsFrom <= 1) {
          score += 20
          reasons.push('Low cost trading')
        }
        break
      case FeePreference.REASONABLE_FEES:
        if (broker.spreadsFrom <= 3) {
          score += 15
          reasons.push('Reasonable trading fees')
        }
        break
      default:
        score += 5
    }

    return { score, reasons }
  }

  // Score trading frequency matching
  private scoreFrequencyMatch(broker: Broker, frequency: TradingFrequency): { score: number; reasons: string[] } {
    let score = 0
    const reasons: string[] = []

    switch (frequency) {
      case TradingFrequency.DAILY:
        // Prefer brokers with tight spreads and fast execution
        if (broker.spreadsFrom <= 1) {
          score += 20
          reasons.push('Tight spreads for frequent trading')
        }
        break
      case TradingFrequency.YEARLY:
        // Prefer brokers with good research and lower fees
        if (broker.minDeposit <= 500) {
          score += 15
          reasons.push('Suitable for long-term investing')
        }
        break
      default:
        score += 5
    }

    return { score, reasons }
  }

  // Score deposit amount matching
  private scoreDepositMatch(broker: Broker, depositAmount: DepositAmount): { score: number; reasons: string[] } {
    let score = 0
    const reasons: string[] = []

    const getDepositRange = (amount: DepositAmount): { min: number; max: number } => {
      switch (amount) {
        case DepositAmount.LESS_THAN_50:
          return { min: 0, max: 50 }
        case DepositAmount.RANGE_51_200:
          return { min: 51, max: 200 }
        case DepositAmount.RANGE_201_500:
          return { min: 201, max: 500 }
        default:
          return { min: 0, max: Infinity }
      }
    }

    const range = getDepositRange(depositAmount)
    
    if (broker.minDeposit <= range.max) {
      score += 20
      reasons.push(`Minimum deposit fits your budget ($${broker.minDeposit})`)
    }

    return { score, reasons }
  }

  // Get broker recommendations with explanations
  public getBrokerRecommendations(
    preferences: UserPreferences,
    limit: number = 10
  ): { broker: Broker; matchReasons: string[] }[] {
    const criteria: FilterCriteria = {
      country: preferences.country,
      assets: preferences.assets,
      experience: preferences.experience,
      feePreference: preferences.feePreference,
      frequency: preferences.frequency,
      depositAmount: preferences.depositAmount
    }

    const scoredBrokers = this.brokers
      .map(broker => this.scoreBroker(broker, criteria))
      .filter(scored => scored.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return scoredBrokers.map(scored => ({
      broker: scored.broker,
      matchReasons: scored.matchReasons
    }))
  }
}

export default BrokerFilterService
export { BrokerFilterService }
export type { FilterCriteria, BrokerScore }