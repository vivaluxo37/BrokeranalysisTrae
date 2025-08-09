// Asset management utilities for broker logos and images

export interface BrokerAsset {
  id: string;
  name: string;
  originalName: string;
  assets: {
    original: string;
    sizes: {
      [size: string]: {
        png: string;
        webp: string;
      };
    };
  };
}

export interface AssetMapping {
  version: string;
  generated: string;
  fallback: {
    original: string;
    sizes: {
      [size: string]: {
        png: string;
        webp: string;
      };
    };
  };
  brokers: BrokerAsset[];
}

export type ImageFormat = 'png' | 'webp';
export type ImageSize = '64' | '128' | '256' | 'original';

// Fallback asset mapping for when the JSON file is not available
const fallbackMapping: AssetMapping = {
  version: '1.0.0',
  generated: new Date().toISOString(),
  fallback: {
    original: 'logos/fallback/broker-placeholder.svg',
    sizes: {
      '64': { png: 'logos/fallback/broker-placeholder-64.png', webp: 'logos/fallback/broker-placeholder-64.webp' },
      '128': { png: 'logos/fallback/broker-placeholder-128.png', webp: 'logos/fallback/broker-placeholder-128.webp' },
      '256': { png: 'logos/fallback/broker-placeholder-256.png', webp: 'logos/fallback/broker-placeholder-256.webp' }
    }
  },
  brokers: []
};

class AssetManager {
  private mapping: AssetMapping;
  private baseUrl: string;

  constructor() {
    this.mapping = fallbackMapping;
    this.baseUrl = '/assets/brokers/';
    
    // Try to load the real mapping in the background
    this.loadRealMapping();
  }

  private async loadRealMapping() {
    try {
      const response = await fetch('/assets/brokers/logos/asset-mapping.json');
      const realMapping = await response.json();
      this.mapping = realMapping;
    } catch (error) {
      console.warn('Failed to load real asset mapping, using fallback');
    }
  }

  /**
   * Get broker logo URL with fallback support
   */
  getBrokerLogo(
    brokerId: string,
    size: ImageSize = 'original',
    format: ImageFormat = 'png'
  ): string {
    const broker = this.mapping.brokers.find(b => b.id === brokerId);
    
    if (!broker) {
      return this.getFallbackLogo(size, format);
    }

    if (size === 'original') {
      return this.baseUrl + broker.assets.original;
    }

    const sizedAsset = broker.assets.sizes[size];
    if (!sizedAsset || !sizedAsset[format]) {
      return this.getFallbackLogo(size, format);
    }

    return this.baseUrl + sizedAsset[format];
  }

  /**
   * Get fallback logo URL
   */
  getFallbackLogo(size: ImageSize = 'original', format: ImageFormat = 'png'): string {
    if (size === 'original') {
      return this.baseUrl + this.mapping.fallback.original;
    }

    const fallbackAsset = this.mapping.fallback.sizes[size];
    if (!fallbackAsset || !fallbackAsset[format]) {
      return this.baseUrl + this.mapping.fallback.original;
    }

    return this.baseUrl + fallbackAsset[format];
  }

  /**
   * Get all available broker IDs
   */
  getAvailableBrokers(): string[] {
    return this.mapping.brokers.map(broker => broker.id);
  }

  /**
   * Get broker info by ID
   */
  getBrokerInfo(brokerId: string): BrokerAsset | null {
    return this.mapping.brokers.find(b => b.id === brokerId) || null;
  }

  /**
   * Check if broker logo exists
   */
  hasBrokerLogo(brokerId: string): boolean {
    return this.mapping.brokers.some(b => b.id === brokerId);
  }

  /**
   * Get responsive image sources for different formats
   */
  getResponsiveImageSources(brokerId: string): {
    webp: { [size: string]: string };
    png: { [size: string]: string };
  } {
    const broker = this.mapping.brokers.find(b => b.id === brokerId);
    
    if (!broker) {
      return {
        webp: {
          '64': this.getFallbackLogo('64', 'webp'),
          '128': this.getFallbackLogo('128', 'webp'),
          '256': this.getFallbackLogo('256', 'webp')
        },
        png: {
          '64': this.getFallbackLogo('64', 'png'),
          '128': this.getFallbackLogo('128', 'png'),
          '256': this.getFallbackLogo('256', 'png')
        }
      };
    }

    return {
      webp: {
        '64': this.baseUrl + broker.assets.sizes['64'].webp,
        '128': this.baseUrl + broker.assets.sizes['128'].webp,
        '256': this.baseUrl + broker.assets.sizes['256'].webp
      },
      png: {
        '64': this.baseUrl + broker.assets.sizes['64'].png,
        '128': this.baseUrl + broker.assets.sizes['128'].png,
        '256': this.baseUrl + broker.assets.sizes['256'].png
      }
    };
  }

  /**
   * Generate srcSet for responsive images
   */
  generateSrcSet(brokerId: string, format: ImageFormat = 'webp'): string {
    const sources = this.getResponsiveImageSources(brokerId);
    const formatSources = sources[format];
    
    return [
      `${formatSources['64']} 64w`,
      `${formatSources['128']} 128w`,
      `${formatSources['256']} 256w`
    ].join(', ');
  }
}

// Export singleton instance
export const assetManager = new AssetManager();

// Export utility functions
export const getBrokerLogo = (brokerId: string, size?: ImageSize, format?: ImageFormat) => 
  assetManager.getBrokerLogo(brokerId, size, format);

export const getFallbackLogo = (size?: ImageSize, format?: ImageFormat) => 
  assetManager.getFallbackLogo(size, format);

export const hasBrokerLogo = (brokerId: string) => 
  assetManager.hasBrokerLogo(brokerId);

export const getResponsiveImageSources = (brokerId: string) => 
  assetManager.getResponsiveImageSources(brokerId);

export const generateSrcSet = (brokerId: string, format?: ImageFormat) => 
  assetManager.generateSrcSet(brokerId, format);

export const getBrokerInfo = (brokerId: string) => 
  assetManager.getBrokerInfo(brokerId);

export const getAvailableBrokers = () => 
  assetManager.getAvailableBrokers();