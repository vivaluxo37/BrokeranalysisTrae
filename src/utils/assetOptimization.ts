/**
 * Asset optimization utilities for broker resources
 * Handles image loading, fallbacks, and performance optimization
 */

export interface AssetConfig {
  baseUrl: string;
  fallbackImage: string;
  supportedFormats: string[];
  sizes: number[];
}

export interface BrokerAssetPaths {
  square: {
    small: string;
    medium: string;
    large: string;
  };
  horizontal: string;
  favicon: string;
}

/**
 * Default asset configuration
 */
export const ASSET_CONFIG: AssetConfig = {
  baseUrl: '/assets/brokers',
  fallbackImage: '/assets/icons/broker-placeholder.webp',
  supportedFormats: ['webp', 'png'],
  sizes: [64, 128, 256]
};

/**
 * Generate broker asset paths for different logo types and sizes
 */
export function getBrokerAssetPaths(brokerId: string): BrokerAssetPaths {
  const baseUrl = ASSET_CONFIG.baseUrl;
  
  return {
    square: {
      small: `${baseUrl}/logos/square/${brokerId}-64.webp`,
      medium: `${baseUrl}/logos/square/${brokerId}-128.webp`,
      large: `${baseUrl}/logos/square/${brokerId}-256.webp`
    },
    horizontal: `${baseUrl}/logos/horizontal/${brokerId}-horizontal.webp`,
    favicon: `${baseUrl}/logos/favicon/${brokerId}-favicon.webp`
  };
}

/**
 * Generate responsive image sources for different screen densities
 */
export function getResponsiveImageSources(brokerId: string, type: 'square' | 'horizontal' | 'favicon') {
  const paths = getBrokerAssetPaths(brokerId);
  
  switch (type) {
    case 'square':
      return {
        srcSet: `
          ${paths.square.small} 1x,
          ${paths.square.medium} 2x,
          ${paths.square.large} 3x
        `.trim(),
        src: paths.square.medium,
        sizes: '(max-width: 768px) 64px, (max-width: 1024px) 128px, 256px'
      };
    
    case 'horizontal':
      return {
        src: paths.horizontal,
        srcSet: `${paths.horizontal} 1x`
      };
    
    case 'favicon':
      return {
        src: paths.favicon,
        srcSet: `${paths.favicon} 1x`
      };
    
    default:
      return {
        src: ASSET_CONFIG.fallbackImage,
        srcSet: `${ASSET_CONFIG.fallbackImage} 1x`
      };
  }
}

/**
 * Check if an image exists and is loadable
 */
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get fallback image URL with format preference
 */
export function getFallbackImageUrl(brokerId: string, type: 'square' | 'horizontal' | 'favicon', format: 'webp' | 'png' = 'webp'): string {
  const baseUrl = ASSET_CONFIG.baseUrl;
  
  switch (type) {
    case 'square':
      return `${baseUrl}/logos/square/${brokerId}-128.${format}`;
    case 'horizontal':
      return `${baseUrl}/logos/horizontal/${brokerId}-horizontal.${format}`;
    case 'favicon':
      return `${baseUrl}/logos/favicon/${brokerId}-favicon.${format}`;
    default:
      return ASSET_CONFIG.fallbackImage;
  }
}

/**
 * Preload critical broker images for performance
 */
export function preloadBrokerImages(brokerIds: string[], type: 'square' | 'horizontal' | 'favicon' = 'square') {
  brokerIds.forEach(brokerId => {
    const sources = getResponsiveImageSources(brokerId, type);
    
    // Create link element for preloading
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = sources.src;
    
    if (sources.srcSet) {
      link.setAttribute('imagesrcset', sources.srcSet);
    }
    
    document.head.appendChild(link);
  });
}

/**
 * Lazy loading intersection observer for broker images
 */
export function createImageLazyLoader(callback: (entries: IntersectionObserverEntry[]) => void) {
  const options = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };
  
  return new IntersectionObserver(callback, options);
}

/**
 * Optimize image loading with progressive enhancement
 */
export interface ImageLoadingOptions {
  brokerId: string;
  type: 'square' | 'horizontal' | 'favicon';
  size?: 'small' | 'medium' | 'large';
  lazy?: boolean;
  fallback?: string;
}

export function getOptimizedImageProps(options: ImageLoadingOptions) {
  const { brokerId, type, size = 'medium', lazy = true, fallback } = options;
  const sources = getResponsiveImageSources(brokerId, type);
  const fallbackUrl = fallback || getFallbackImageUrl(brokerId, type, 'png');
  
  return {
    src: sources.src,
    srcSet: sources.srcSet,
    sizes: sources.sizes,
    loading: lazy ? 'lazy' as const : 'eager' as const,
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (img.src !== fallbackUrl) {
        img.src = fallbackUrl;
      }
    },
    alt: `${brokerId} logo`,
    decoding: 'async' as const
  };
}