import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';
import { AssetClass, BrokerCategory, RegulatorType, TradingPlatform, AccountType, ReviewType, ToolType } from '../src/enums';

// Type definitions for mock data structures
interface MockBroker {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  avgSpread?: number;
  minDeposit: number;
  leverage?: number;
  maxLeverage?: number;
  regulationBadges?: string[];
  regulation?: string[];
  featured?: boolean;
  assetClasses: string[] | AssetClass[];
  platforms?: string[];
  founded?: number;
  headquarters?: string;
  category?: BrokerCategory;
  trustScore?: number;
  isRegulated?: boolean;
  yearEstablished?: number;
  website?: string;
  description?: string;
}

interface MockDataSource {
  brokers: MockBroker[];
  metadata: {
    source: string;
    lastUpdated: string;
    totalBrokers: number;
    dataQuality: 'high' | 'medium' | 'low';
  };
}

// Validation schemas
const MockBrokerSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string().url().optional().or(z.string()),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().min(0),
  avgSpread: z.number().optional(),
  minDeposit: z.number().min(0),
  leverage: z.number().optional(),
  maxLeverage: z.number().optional(),
  regulationBadges: z.array(z.string()).optional(),
  regulation: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  assetClasses: z.array(z.string()),
  platforms: z.array(z.string()).optional(),
  founded: z.number().optional(),
  headquarters: z.string().optional(),
  category: z.nativeEnum(BrokerCategory).optional(),
  trustScore: z.number().optional(),
  isRegulated: z.boolean().optional(),
  yearEstablished: z.number().optional(),
  website: z.string().optional(),
  description: z.string().optional()
});

export class MockDataLoader {
  private mockDataSources: Map<string, MockDataSource> = new Map();
  private logger: (message: string, level?: 'info' | 'warn' | 'error') => void;

  constructor(logger?: (message: string, level?: 'info' | 'warn' | 'error') => void) {
    this.logger = logger || ((msg, level = 'info') => console.log(`[${level.toUpperCase()}] ${msg}`));
  }

  /**
   * Load mock data from TypeScript files
   */
  async loadMockDataFiles(projectRoot: string): Promise<void> {
    const mockDataFiles = [
      'src/brokerAnalysisMockData.ts',
      'src/brokerAnalysisHomepageMockData.ts',
      'src/additionalPagesMockData.ts'
    ];

    for (const filePath of mockDataFiles) {
      const fullPath = path.join(projectRoot, filePath);
      if (fs.existsSync(fullPath)) {
        await this.loadMockDataFile(fullPath);
      } else {
        this.logger(`Mock data file not found: ${fullPath}`, 'warn');
      }
    }
  }

  /**
   * Load and parse a single mock data file
   */
  private async loadMockDataFile(filePath: string): Promise<void> {
    try {
      this.logger(`Loading mock data from: ${filePath}`);
      
      // Read the TypeScript file content
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extract broker data using regex patterns
      const brokers = this.extractBrokersFromContent(content);
      
      if (brokers.length > 0) {
        const source: MockDataSource = {
          brokers,
          metadata: {
            source: path.basename(filePath),
            lastUpdated: new Date().toISOString(),
            totalBrokers: brokers.length,
            dataQuality: 'high'
          }
        };
        
        this.mockDataSources.set(path.basename(filePath), source);
        this.logger(`Loaded ${brokers.length} brokers from ${path.basename(filePath)}`);
      }
    } catch (error) {
      this.logger(`Error loading mock data from ${filePath}: ${error}`, 'error');
    }
  }

  /**
   * Extract broker data from file content
   */
  private extractBrokersFromContent(content: string): MockBroker[] {
    const brokers: MockBroker[] = [];
    
    try {
      // Ensure content is a string
      if (typeof content !== 'string') {
        this.logger(`Content is not a string: ${typeof content}`, 'warn');
        return brokers;
      }
      
      // Extract topRatedBrokers arrays
      const topRatedBrokersRegex = /topRatedBrokers:\s*\[(.*?)\]/gs;
      const matches = content.match(topRatedBrokersRegex);
      
      if (matches) {
        for (const match of matches) {
          const brokersData = this.parseBrokerObjects(match);
          brokers.push(...brokersData);
        }
      }
      
      // Extract individual broker objects
      const brokerObjectRegex = /\{[^{}]*id:\s*['"]([^'"]+)['"][^{}]*name:\s*['"]([^'"]+)['"][^{}]*\}/g;
      let brokerMatch;
      
      while ((brokerMatch = brokerObjectRegex.exec(content)) !== null) {
        const brokerObj = this.parseSingleBrokerObject(brokerMatch[0]);
        if (brokerObj && !brokers.find(b => b.id === brokerObj.id)) {
          brokers.push(brokerObj);
        }
      }
      
    } catch (error) {
      this.logger(`Error extracting brokers from content: ${error}`, 'error');
    }
    
    return brokers;
  }

  /**
   * Parse broker objects from array content
   */
  private parseBrokerObjects(arrayContent: string): MockBroker[] {
    const brokers: MockBroker[] = [];
    
    // Ensure arrayContent is a string
    if (typeof arrayContent !== 'string') {
      this.logger(`Array content is not a string: ${typeof arrayContent}`, 'warn');
      return brokers;
    }
    
    // Split by object boundaries
    const objectRegex = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
    const objects = arrayContent.match(objectRegex) || [];
    
    for (const objStr of objects) {
      const broker = this.parseSingleBrokerObject(objStr);
      if (broker) {
        brokers.push(broker);
      }
    }
    
    return brokers;
  }

  /**
   * Parse a single broker object from string
   */
  private parseSingleBrokerObject(objStr: string): MockBroker | null {
    try {
      // Extract key-value pairs using regex
      const extractValue = (key: string): any => {
        const regex = new RegExp(`${key}:\\s*([^,}]+)`, 'i');
        const match = objStr.match(regex);
        if (!match) return undefined;
        
        let value = match[1].trim();
        
        // Handle different value types
        if (value.startsWith('[') && value.endsWith(']')) {
          // Array value
          return value.slice(1, -1).split(',').map(v => v.trim().replace(/['"`]/g, ''));
        } else if (value.startsWith("'") || value.startsWith('"') || value.startsWith('`')) {
          // String value
          return value.slice(1, -1);
        } else if (value === 'true' || value === 'false') {
          // Boolean value
          return value === 'true';
        } else if (!isNaN(Number(value))) {
          // Number value
          return Number(value);
        }
        
        return value.replace(/['"`]/g, '');
      };
      
      const broker: MockBroker = {
        id: extractValue('id') || '',
        name: extractValue('name') || '',
        logo: extractValue('logo') || '',
        rating: extractValue('rating') || 0,
        reviewCount: extractValue('reviewCount') || 0,
        minDeposit: extractValue('minDeposit') || 0,
        assetClasses: extractValue('assetClasses') || []
      };
      
      // Add optional fields
      const optionalFields = [
        'avgSpread', 'leverage', 'maxLeverage', 'regulationBadges', 'regulation',
        'featured', 'platforms', 'founded', 'headquarters', 'category',
        'trustScore', 'isRegulated', 'yearEstablished', 'website', 'description'
      ];
      
      for (const field of optionalFields) {
        const value = extractValue(field);
        if (value !== undefined) {
          (broker as any)[field] = value;
        }
      }
      
      // Apply data type fixes before validation
      const fixedBroker = this.fixBrokerDataTypes(broker);
      
      // Validate the broker object
      const validationResult = MockBrokerSchema.safeParse(fixedBroker);
      if (validationResult.success) {
        return validationResult.data;
      } else {
        this.logger(`Invalid broker object: ${validationResult.error.message}`, 'warn');
        return null;
      }
      
    } catch (error) {
      this.logger(`Error parsing broker object: ${error}`, 'error');
      return null;
    }
  }

  /**
   * Get all loaded mock brokers
   */
  getAllMockBrokers(): MockBroker[] {
    const allBrokers: MockBroker[] = [];
    
    for (const source of this.mockDataSources.values()) {
      allBrokers.push(...source.brokers);
    }
    
    // Remove duplicates based on ID
    const uniqueBrokers = allBrokers.filter((broker, index, self) => 
      index === self.findIndex(b => b.id === broker.id)
    );
    
    return uniqueBrokers;
  }

  /**
   * Get mock data sources metadata
   */
  getSourcesMetadata(): Array<{ source: string; brokerCount: number; lastUpdated: string }> {
    return Array.from(this.mockDataSources.entries()).map(([key, source]) => ({
      source: key,
      brokerCount: source.brokers.length,
      lastUpdated: source.metadata.lastUpdated
    }));
  }

  /**
   * Fix common data type issues in broker data
   */
  private fixBrokerDataTypes(broker: any): any {
    const fixed = { ...broker };
    
    // Convert enum strings to actual values
    if (typeof fixed.category === 'string') {
      // Handle enum references like 'BrokerCategory.RETAIL'
      if (fixed.category.includes('.')) {
        const enumValue = fixed.category.split('.')[1];
        fixed.category = enumValue.toLowerCase().replace('_', '-');
      }
      // Map common category values
      const categoryMap: { [key: string]: string } = {
        'retail': 'market-maker',
        'ecn': 'ecn',
        'stp': 'stp',
        'market_maker': 'market-maker',
        'dma': 'dma'
      };
      fixed.category = categoryMap[fixed.category.toLowerCase()] || 'market-maker';
    }
    
    // Convert string arrays to actual arrays
    if (typeof fixed.assetClasses === 'string') {
      fixed.assetClasses = fixed.assetClasses.split(',').map((s: string) => s.trim().toLowerCase());
    }
    
    if (typeof fixed.platforms === 'string') {
      fixed.platforms = fixed.platforms.split(',').map((s: string) => s.trim().toLowerCase());
    }
    
    if (typeof fixed.regulators === 'string') {
      fixed.regulators = fixed.regulators.split(',').map((s: string) => s.trim().toLowerCase());
    }
    
    if (typeof fixed.regulationBadges === 'string') {
      fixed.regulationBadges = fixed.regulationBadges.split(',').map((s: string) => s.trim());
    }
    
    if (typeof fixed.regulation === 'string') {
      fixed.regulation = fixed.regulation.split(',').map((s: string) => s.trim());
    }
    
    // Ensure arrays are arrays
    fixed.assetClasses = Array.isArray(fixed.assetClasses) ? fixed.assetClasses : [];
    fixed.platforms = Array.isArray(fixed.platforms) ? fixed.platforms : [];
    fixed.regulators = Array.isArray(fixed.regulators) ? fixed.regulators : [];
    
    return fixed;
  }

  /**
   * Normalize mock broker data to match the Broker interface
   */
  normalizeMockBrokers(): Broker[] {
    const normalizedBrokers: Broker[] = [];
    
    for (const [source, data] of this.mockDataSources) {
      this.logger(`Processing brokers from ${source}...`);
      
      const brokers = this.extractBrokersFromContent(data);
      
      for (const broker of brokers) {
        try {
          // Fix common data type issues before validation
          const fixedBroker = this.fixBrokerDataTypes(broker);
          
          // Validate and normalize the broker data
          const validatedBroker = BrokerValidationSchema.parse(fixedBroker);
          normalizedBrokers.push(validatedBroker as Broker);
        } catch (error) {
          this.logger(`Validation failed for broker ${broker.name}: ${JSON.stringify((error as any).errors, null, 2)}`, 'warn');
          // Skip invalid brokers or attempt to fix them
          const fixedBroker = this.attemptBrokerFix(broker);
          if (fixedBroker) {
            normalizedBrokers.push(fixedBroker);
          }
        }
      }
    }
    
    this.logger(`Normalized ${normalizedBrokers.length} brokers from mock data`);
    return normalizedBrokers;
  }

  /**
   * Get country for regulator
   */
  private getCountryForRegulator(regulator: string): string {
    const regulatorCountries: Record<string, string> = {
      'FCA': 'United Kingdom',
      'ASIC': 'Australia',
      'CySEC': 'Cyprus',
      'SEC': 'United States',
      'CFTC': 'United States',
      'BaFin': 'Germany',
      'AMF': 'France',
      'CONSOB': 'Italy',
      'CNMV': 'Spain',
      'AFM': 'Netherlands'
    };
    
    return regulatorCountries[regulator] || 'Unknown';
  }

  /**
   * Generate quality report for mock data
   */
  generateQualityReport(): any {
    const allBrokers = this.getAllMockBrokers();
    const sourcesMetadata = this.getSourcesMetadata();
    
    return {
      summary: {
        totalSources: this.mockDataSources.size,
        totalBrokers: allBrokers.length,
        uniqueBrokers: new Set(allBrokers.map(b => b.id)).size,
        lastUpdated: new Date().toISOString()
      },
      sources: sourcesMetadata,
      dataQuality: {
        brokersWithLogos: allBrokers.filter(b => b.logo && b.logo.length > 0).length,
        brokersWithRatings: allBrokers.filter(b => b.rating > 0).length,
        brokersWithRegulation: allBrokers.filter(b => 
          (b.regulationBadges?.length || 0) > 0 || (b.regulation?.length || 0) > 0
        ).length,
        averageRating: allBrokers.reduce((sum, b) => sum + b.rating, 0) / allBrokers.length,
        averageReviewCount: allBrokers.reduce((sum, b) => sum + b.reviewCount, 0) / allBrokers.length
      },
      validation: {
        validBrokers: allBrokers.length,
        invalidBrokers: 0,
        missingFields: this.findMissingFields(allBrokers)
      }
    };
  }

  /**
   * Find missing fields in broker data
   */
  private findMissingFields(brokers: MockBroker[]): Record<string, number> {
    const requiredFields = ['id', 'name', 'logo', 'rating', 'reviewCount', 'minDeposit', 'assetClasses'];
    const optionalFields = ['avgSpread', 'leverage', 'regulationBadges', 'platforms', 'headquarters'];
    
    const missingFields: Record<string, number> = {};
    
    for (const field of [...requiredFields, ...optionalFields]) {
      const missingCount = brokers.filter(broker => !(broker as any)[field]).length;
      if (missingCount > 0) {
        missingFields[field] = missingCount;
      }
    }
    
    return missingFields;
  }
}

export default MockDataLoader;