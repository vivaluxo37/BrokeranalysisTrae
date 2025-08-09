/**
 * Broker Data Service
 * 
 * This service handles broker data retrieval, management, and integration
 * with the existing broker data from the BrokerAnalysis platform.
 */

import { BrokerData } from '../types';
import fs from 'fs';
import path from 'path';

export class BrokerDataService {
  private brokers: Map<string, BrokerData> = new Map();
  private brokerLogosPath: string;
  private dataPath: string;

  constructor(brokerLogosPath: string, dataPath?: string) {
    this.brokerLogosPath = brokerLogosPath;
    this.dataPath = dataPath || './src/data/compiled/compiledBrokers.json';
    this.loadBrokerData();
  }

  /**
   * Load broker data from the existing compiled data
   */
  private async loadBrokerData(): Promise<void> {
    try {
      // Try to load from compiled data first
      if (fs.existsSync(this.dataPath)) {
        const data = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
        this.processBrokerData(data);
      } else {
        // Fallback to mock data if compiled data doesn't exist
        this.loadMockBrokerData();
      }
    } catch (error) {
      console.warn('Failed to load broker data, using mock data:', error);
      this.loadMockBrokerData();
    }
  }

  /**
   * Process and normalize broker data
   */
  private processBrokerData(data: any): void {
    if (Array.isArray(data)) {
      data.forEach(broker => this.addBroker(this.normalizeBrokerData(broker)));
    } else if (data.brokers && Array.isArray(data.brokers)) {
      data.brokers.forEach(broker => this.addBroker(this.normalizeBrokerData(broker)));
    } else {
      // Handle object format
      Object.values(data).forEach(broker => {
        if (typeof broker === 'object') {
          this.addBroker(this.normalizeBrokerData(broker));
        }
      });
    }
  }

  /**
   * Normalize broker data to match our BrokerData interface
   */
  private normalizeBrokerData(rawBroker: any): BrokerData {
    const broker: BrokerData = {
      id: rawBroker.id || rawBroker.slug || this.generateBrokerId(rawBroker.name),
      name: rawBroker.name || rawBroker.brokerName || 'Unknown Broker',
      slug: rawBroker.slug || this.generateSlug(rawBroker.name || 'unknown'),
      logoUrl: this.getBrokerLogoUrl(rawBroker.name || rawBroker.brokerName),
      website: rawBroker.website || rawBroker.url || '',
      description: rawBroker.description || rawBroker.summary || `${rawBroker.name} is an online broker offering trading services.`,
      founded: rawBroker.founded || rawBroker.establishedYear || new Date().getFullYear(),
      headquarters: rawBroker.headquarters || rawBroker.location || 'Unknown',
      regulation: this.normalizeRegulation(rawBroker.regulation || rawBroker.regulators || []),
      minDeposit: this.normalizeMinDeposit(rawBroker.minDeposit || rawBroker.minimumDeposit),
      spreads: this.normalizeSpreads(rawBroker.spreads || rawBroker.pricing),
      platforms: this.normalizePlatforms(rawBroker.platforms || rawBroker.tradingPlatforms || []),
      assets: this.normalizeAssets(rawBroker.assets || rawBroker.instruments || []),
      features: this.normalizeFeatures(rawBroker.features || []),
      pros: this.normalizeProsAndCons(rawBroker.pros || rawBroker.advantages || []),
      cons: this.normalizeProsAndCons(rawBroker.cons || rawBroker.disadvantages || []),
      rating: this.normalizeRating(rawBroker.rating || rawBroker.score),
      countries: this.normalizeCountries(rawBroker.countries || rawBroker.availability),
      lastUpdated: new Date(rawBroker.lastUpdated || Date.now())
    };

    return broker;
  }

  /**
   * Get broker logo URL from the logos directory
   */
  private getBrokerLogoUrl(brokerName: string): string {
    if (!brokerName) return '';
    
    const normalizedName = brokerName.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/\s+/g, '');
    
    // Common logo file extensions
    const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
    
    for (const ext of extensions) {
      const logoPath = path.join(this.brokerLogosPath, `${normalizedName}.${ext}`);
      if (fs.existsSync(logoPath)) {
        return logoPath;
      }
      
      // Try with broker name variations
      const variations = [
        brokerName.toLowerCase().replace(/\s+/g, '-'),
        brokerName.toLowerCase().replace(/\s+/g, '_'),
        brokerName.toLowerCase().replace(/[^a-z0-9]/g, ''),
        normalizedName
      ];
      
      for (const variation of variations) {
        const variationPath = path.join(this.brokerLogosPath, `${variation}.${ext}`);
        if (fs.existsSync(variationPath)) {
          return variationPath;
        }
      }
    }
    
    return ''; // No logo found
  }

  /**
   * Load mock broker data for development/testing
   */
  private loadMockBrokerData(): void {
    const mockBrokers: Partial<BrokerData>[] = [
      {
        name: 'Interactive Brokers',
        founded: 1978,
        headquarters: 'Greenwich, CT, USA',
        regulation: ['SEC', 'FINRA', 'CFTC'],
        minDeposit: 0,
        platforms: ['TWS', 'IBKR Mobile', 'WebTrader'],
        assets: ['Stocks', 'Options', 'Futures', 'Forex', 'Bonds', 'ETFs'],
        rating: { overall: 4.5, trustScore: 4.8, costScore: 4.7, platformScore: 4.3 }
      },
      {
        name: 'eToro',
        founded: 2007,
        headquarters: 'Tel Aviv, Israel',
        regulation: ['CySEC', 'FCA', 'ASIC'],
        minDeposit: 200,
        platforms: ['eToro Platform', 'eToro Mobile'],
        assets: ['Stocks', 'Crypto', 'ETFs', 'Forex', 'Commodities'],
        rating: { overall: 4.2, trustScore: 4.3, costScore: 3.8, platformScore: 4.5 }
      },
      {
        name: 'Charles Schwab',
        founded: 1971,
        headquarters: 'San Francisco, CA, USA',
        regulation: ['SEC', 'FINRA', 'SIPC'],
        minDeposit: 0,
        platforms: ['Schwab.com', 'StreetSmart Edge', 'Schwab Mobile'],
        assets: ['Stocks', 'ETFs', 'Mutual Funds', 'Options', 'Futures'],
        rating: { overall: 4.4, trustScore: 4.7, costScore: 4.6, platformScore: 4.1 }
      },
      {
        name: 'TD Ameritrade',
        founded: 1975,
        headquarters: 'Omaha, NE, USA',
        regulation: ['SEC', 'FINRA', 'SIPC'],
        minDeposit: 0,
        platforms: ['thinkorswim', 'TD Ameritrade Mobile', 'Web Platform'],
        assets: ['Stocks', 'Options', 'ETFs', 'Mutual Funds', 'Futures', 'Forex'],
        rating: { overall: 4.3, trustScore: 4.6, costScore: 4.2, platformScore: 4.4 }
      },
      {
        name: 'Fidelity',
        founded: 1946,
        headquarters: 'Boston, MA, USA',
        regulation: ['SEC', 'FINRA', 'SIPC'],
        minDeposit: 0,
        platforms: ['Fidelity.com', 'Active Trader Pro', 'Fidelity Mobile'],
        assets: ['Stocks', 'ETFs', 'Mutual Funds', 'Options', 'Bonds'],
        rating: { overall: 4.4, trustScore: 4.8, costScore: 4.5, platformScore: 4.2 }
      }
    ];

    mockBrokers.forEach(broker => {
      this.addBroker(this.normalizeBrokerData(broker));
    });
  }

  /**
   * Add a broker to the data store
   */
  private addBroker(broker: BrokerData): void {
    this.brokers.set(broker.id, broker);
  }

  /**
   * Get broker by ID
   */
  async getBrokerById(id: string): Promise<BrokerData | null> {
    return this.brokers.get(id) || null;
  }

  /**
   * Get multiple brokers by IDs
   */
  async getBrokersByIds(ids: string[]): Promise<BrokerData[]> {
    const brokers: BrokerData[] = [];
    for (const id of ids) {
      const broker = this.brokers.get(id);
      if (broker) {
        brokers.push(broker);
      }
    }
    return brokers;
  }

  /**
   * Get all brokers
   */
  async getAllBrokers(): Promise<BrokerData[]> {
    return Array.from(this.brokers.values());
  }

  /**
   * Search brokers by name
   */
  async searchBrokers(query: string): Promise<BrokerData[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.brokers.values()).filter(broker =>
      broker.name.toLowerCase().includes(lowercaseQuery) ||
      broker.slug.includes(lowercaseQuery)
    );
  }

  /**
   * Get brokers by country
   */
  async getBrokersByCountry(countryCode: string): Promise<BrokerData[]> {
    return Array.from(this.brokers.values()).filter(broker =>
      broker.countries.allowed.includes(countryCode)
    );
  }

  /**
   * Get top-rated brokers
   */
  async getTopRatedBrokers(limit: number = 10): Promise<BrokerData[]> {
    return Array.from(this.brokers.values())
      .sort((a, b) => b.rating.overall - a.rating.overall)
      .slice(0, limit);
  }

  /**
   * Utility methods for data normalization
   */
  private generateBrokerId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  private generateSlug(name: string): string {
    return this.generateBrokerId(name);
  }

  private normalizeRegulation(regulation: any): string[] {
    if (Array.isArray(regulation)) {
      return regulation.map(r => String(r));
    }
    if (typeof regulation === 'string') {
      return regulation.split(',').map(r => r.trim());
    }
    return [];
  }

  private normalizeMinDeposit(minDeposit: any): number {
    if (typeof minDeposit === 'number') {
      return minDeposit;
    }
    if (typeof minDeposit === 'string') {
      const parsed = parseFloat(minDeposit.replace(/[^0-9.]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  private normalizeSpreads(spreads: any): { eurusd: number; gbpusd: number; usdjpy: number } {
    const defaultSpreads = { eurusd: 1.0, gbpusd: 1.2, usdjpy: 1.1 };
    
    if (typeof spreads === 'object' && spreads !== null) {
      return {
        eurusd: spreads.eurusd || spreads['EUR/USD'] || defaultSpreads.eurusd,
        gbpusd: spreads.gbpusd || spreads['GBP/USD'] || defaultSpreads.gbpusd,
        usdjpy: spreads.usdjpy || spreads['USD/JPY'] || defaultSpreads.usdjpy
      };
    }
    
    return defaultSpreads;
  }

  private normalizePlatforms(platforms: any): string[] {
    if (Array.isArray(platforms)) {
      return platforms.map(p => String(p));
    }
    if (typeof platforms === 'string') {
      return platforms.split(',').map(p => p.trim());
    }
    return ['Web Platform'];
  }

  private normalizeAssets(assets: any): string[] {
    if (Array.isArray(assets)) {
      return assets.map(a => String(a));
    }
    if (typeof assets === 'string') {
      return assets.split(',').map(a => a.trim());
    }
    return ['Stocks', 'Forex'];
  }

  private normalizeFeatures(features: any): string[] {
    if (Array.isArray(features)) {
      return features.map(f => String(f));
    }
    if (typeof features === 'string') {
      return features.split(',').map(f => f.trim());
    }
    return [];
  }

  private normalizeProsAndCons(items: any): string[] {
    if (Array.isArray(items)) {
      return items.map(item => String(item));
    }
    if (typeof items === 'string') {
      return items.split(',').map(item => item.trim());
    }
    return [];
  }

  private normalizeRating(rating: any): { overall: number; trustScore: number; costScore: number; platformScore: number } {
    const defaultRating = { overall: 3.5, trustScore: 3.5, costScore: 3.5, platformScore: 3.5 };
    
    if (typeof rating === 'number') {
      return {
        overall: rating,
        trustScore: rating,
        costScore: rating,
        platformScore: rating
      };
    }
    
    if (typeof rating === 'object' && rating !== null) {
      return {
        overall: rating.overall || rating.total || defaultRating.overall,
        trustScore: rating.trustScore || rating.trust || rating.safety || defaultRating.trustScore,
        costScore: rating.costScore || rating.cost || rating.fees || defaultRating.costScore,
        platformScore: rating.platformScore || rating.platform || rating.usability || defaultRating.platformScore
      };
    }
    
    return defaultRating;
  }

  private normalizeCountries(countries: any): { allowed: string[]; restricted: string[] } {
    const defaultCountries = { allowed: ['US', 'UK', 'EU'], restricted: [] };
    
    if (typeof countries === 'object' && countries !== null) {
      return {
        allowed: Array.isArray(countries.allowed) ? countries.allowed : defaultCountries.allowed,
        restricted: Array.isArray(countries.restricted) ? countries.restricted : defaultCountries.restricted
      };
    }
    
    if (Array.isArray(countries)) {
      return {
        allowed: countries,
        restricted: []
      };
    }
    
    return defaultCountries;
  }

  /**
   * Refresh broker data from source
   */
  async refreshBrokerData(): Promise<void> {
    this.brokers.clear();
    await this.loadBrokerData();
  }

  /**
   * Get broker statistics
   */
  async getBrokerStats(): Promise<any> {
    const brokers = Array.from(this.brokers.values());
    
    return {
      totalBrokers: brokers.length,
      averageRating: brokers.reduce((sum, b) => sum + b.rating.overall, 0) / brokers.length,
      regulationDistribution: this.getRegulationDistribution(brokers),
      assetDistribution: this.getAssetDistribution(brokers),
      countryDistribution: this.getCountryDistribution(brokers)
    };
  }

  private getRegulationDistribution(brokers: BrokerData[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    brokers.forEach(broker => {
      broker.regulation.forEach(reg => {
        distribution[reg] = (distribution[reg] || 0) + 1;
      });
    });
    return distribution;
  }

  private getAssetDistribution(brokers: BrokerData[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    brokers.forEach(broker => {
      broker.assets.forEach(asset => {
        distribution[asset] = (distribution[asset] || 0) + 1;
      });
    });
    return distribution;
  }

  private getCountryDistribution(brokers: BrokerData[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    brokers.forEach(broker => {
      broker.countries.allowed.forEach(country => {
        distribution[country] = (distribution[country] || 0) + 1;
      });
    });
    return distribution;
  }
}