import type { Broker } from '@/types/broker';
import { mockQuery, mockRootProps } from '@/brokerAnalysisMockData';
import extractedBrokers from '@/data/extractedBrokers.json';
import { AssetClass, BrokerCategory, RegulatorType, TradingPlatform } from '@/enums';

// Type for the extracted broker data structure
interface ExtractedBroker {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  regulators: string[];
  minDeposit: number;
  maxLeverage: number;
  spreadsFrom: number;
  assetClasses: string[];
  platforms: string[];
  category: string;
  trustScore: number;
  isRegulated: boolean;
  yearEstablished: number;
  headquarters: string;
  website: string;
  description: string;
  keyFeatures: string[];
  featured: boolean;
  details: any;
  costs: any;
  regulation: any[];
  features: any;
  contact: any;
}

// Mapping functions to convert extracted data to internal format
function mapRegulators(regulators: string[]): RegulatorType[] {
  const regulatorMap: Record<string, RegulatorType> = {
    'fca': RegulatorType.FCA,
    'cysec': RegulatorType.CYSEC,
    'asic': RegulatorType.ASIC,
    'sec': RegulatorType.SEC,
    'cftc': RegulatorType.CFTC,
    'finra': RegulatorType.FINRA
  };
  
  return regulators.map(reg => regulatorMap[reg.toLowerCase()] || RegulatorType.FCA);
}

function mapAssetClasses(assetClasses: string[]): AssetClass[] {
  const assetMap: Record<string, AssetClass> = {
    'forex': AssetClass.FOREX,
    'cfd': AssetClass.CFD,
    'stocks': AssetClass.STOCKS,
    'crypto': AssetClass.CRYPTO,
    'commodities': AssetClass.COMMODITIES,
    'indices': AssetClass.INDICES
  };
  
  return assetClasses.map(asset => assetMap[asset.toLowerCase()] || AssetClass.FOREX);
}

function mapPlatforms(platforms: string[]): TradingPlatform[] {
  const platformMap: Record<string, TradingPlatform> = {
    'mt4': TradingPlatform.METATRADER_4,
    'mt5': TradingPlatform.METATRADER_5,
    'ctrader': TradingPlatform.CTRADER,
    'proprietary': TradingPlatform.PROPRIETARY,
    'web-based': TradingPlatform.WEB_BASED,
    'mobile-app': TradingPlatform.MOBILE_APP
  };
  
  return platforms.map(platform => platformMap[platform.toLowerCase()] || TradingPlatform.METATRADER_4);
}

function mapBrokerCategory(category: string): BrokerCategory {
  const categoryMap: Record<string, BrokerCategory> = {
    'ecn': BrokerCategory.ECN,
    'stp': BrokerCategory.STP,
    'market_maker': BrokerCategory.MARKET_MAKER,
    'dma': BrokerCategory.DMA
  };
  
  return categoryMap[category.toLowerCase()] || BrokerCategory.ECN;
}

// Convert extracted broker to internal Broker format
function convertExtractedBroker(extracted: ExtractedBroker): Broker {
  return {
    id: extracted.id,
    name: extracted.name,
    logo: extracted.logo,
    rating: extracted.rating,
    reviewCount: extracted.reviewCount,
    regulators: mapRegulators(extracted.regulators),
    minDeposit: extracted.minDeposit,
    maxLeverage: extracted.maxLeverage,
    spreadsFrom: extracted.spreadsFrom,
    assetClasses: mapAssetClasses(extracted.assetClasses),
    platforms: mapPlatforms(extracted.platforms),
    category: mapBrokerCategory(extracted.category),
    featured: extracted.featured,
    trustScore: extracted.trustScore,
    isRegulated: extracted.isRegulated,
    yearEstablished: extracted.yearEstablished,
    headquarters: extracted.headquarters,
    website: extracted.website,
    description: extracted.description,
    keyFeatures: extracted.keyFeatures
  };
}

// Data Integration Service
export class DataIntegrationService {
  private static _instance: DataIntegrationService;
  private _integratedData: any = null;

  private constructor() {}

  static getInstance(): DataIntegrationService {
    if (!DataIntegrationService._instance) {
      DataIntegrationService._instance = new DataIntegrationService();
    }
    return DataIntegrationService._instance;
  }

  // Get integrated broker data combining extracted and mock data
  getIntegratedBrokerData(): {
    featuredBrokers: Broker[];
    topRatedBrokers: Broker[];
    allBrokers: Broker[];
  } {
    if (this._integratedData) {
      return this._integratedData;
    }

    // Convert extracted brokers to internal format
    const convertedBrokers = (extractedBrokers as ExtractedBroker[]).map(convertExtractedBroker);
    
    // Mark top-rated brokers as featured (rating >= 4.5)
    const featuredBrokers = convertedBrokers
      .filter(broker => broker.rating >= 4.5)
      .map(broker => ({ ...broker, featured: true }))
      .slice(0, 6); // Limit to 6 featured brokers
    
    // Get top-rated brokers (sorted by rating and review count)
    const topRatedBrokers = [...convertedBrokers]
      .sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      })
      .slice(0, 8); // Limit to 8 top-rated brokers

    // Combine with existing mock brokers for fallback
    const allBrokers = [
      ...convertedBrokers,
      ...mockRootProps.featuredBrokers.filter(
        mockBroker => !convertedBrokers.some(extracted => extracted.name === mockBroker.name)
      )
    ];

    this._integratedData = {
      featuredBrokers,
      topRatedBrokers,
      allBrokers
    };

    return this._integratedData;
  }

  // Get integrated data for homepage sections
  getHomepageData() {
    const brokerData = this.getIntegratedBrokerData();
    
    return {
      // Keep existing mock data structure but replace broker arrays
      ...mockRootProps,
      featuredBrokers: brokerData.featuredBrokers,
      
      // Update mockQuery with real broker data
      mockQuery: {
        ...mockQuery,
        topRatedBrokers: brokerData.topRatedBrokers,
        brokerProfile: brokerData.allBrokers[0] // Use first broker as default profile
      }
    };
  }

  // Get broker by ID (for profile pages)
  getBrokerById(id: string): Broker | null {
    const { allBrokers } = this.getIntegratedBrokerData();
    return allBrokers.find(broker => broker.id === id) || null;
  }

  // Search brokers by criteria
  searchBrokers(criteria: {
    assetClass?: AssetClass;
    minRating?: number;
    maxMinDeposit?: number;
    regulators?: RegulatorType[];
    platforms?: TradingPlatform[];
  }): Broker[] {
    const { allBrokers } = this.getIntegratedBrokerData();
    
    return allBrokers.filter(broker => {
      if (criteria.assetClass && !broker.assetClasses.includes(criteria.assetClass)) {
        return false;
      }
      if (criteria.minRating && broker.rating < criteria.minRating) {
        return false;
      }
      if (criteria.maxMinDeposit && broker.minDeposit > criteria.maxMinDeposit) {
        return false;
      }
      if (criteria.regulators && !criteria.regulators.some(reg => broker.regulators.includes(reg))) {
        return false;
      }
      if (criteria.platforms && !criteria.platforms.some(platform => broker.platforms.includes(platform))) {
        return false;
      }
      return true;
    });
  }

  // Get statistics about the integrated data
  getDataStatistics() {
    const { allBrokers } = this.getIntegratedBrokerData();
    
    return {
      totalBrokers: allBrokers.length,
      extractedBrokers: extractedBrokers.length,
      mockBrokers: mockRootProps.featuredBrokers.length,
      averageRating: allBrokers.reduce((sum, broker) => sum + broker.rating, 0) / allBrokers.length,
      regulatedBrokers: allBrokers.filter(broker => broker.isRegulated).length,
      assetClassDistribution: this.getAssetClassDistribution(allBrokers),
      platformDistribution: this.getPlatformDistribution(allBrokers)
    };
  }

  private getAssetClassDistribution(brokers: Broker[]) {
    const distribution: Record<string, number> = {};
    brokers.forEach(broker => {
      broker.assetClasses.forEach(assetClass => {
        distribution[assetClass] = (distribution[assetClass] || 0) + 1;
      });
    });
    return distribution;
  }

  private getPlatformDistribution(brokers: Broker[]) {
    const distribution: Record<string, number> = {};
    brokers.forEach(broker => {
      broker.platforms.forEach(platform => {
        distribution[platform] = (distribution[platform] || 0) + 1;
      });
    });
    return distribution;
  }

  // Clear cache to force data refresh
  clearCache() {
    this._integratedData = null;
  }
}

// Export singleton instance
export const dataIntegrationService = DataIntegrationService.getInstance();

// Export integrated data for easy import
export const integratedData = dataIntegrationService.getHomepageData();
export const integratedBrokers = dataIntegrationService.getIntegratedBrokerData();