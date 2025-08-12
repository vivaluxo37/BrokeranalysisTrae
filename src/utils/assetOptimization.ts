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
  fallbackImage: '/assets/brokers/logos/fallback/broker-placeholder-128.svg',
  supportedFormats: ['webp', 'png', 'svg'],
  sizes: [64, 128, 256]
};

/**
 * Get the correct asset base URL for the current environment
 */
export function getAssetBaseUrl(): string {
  // In production (Vercel), assets are served from the root
  // In development, they're served from the public directory
  return ASSET_CONFIG.baseUrl;
}

/**
 * Generate broker asset paths for different logo types and sizes
 * Updated to handle SVG files for specific broker IDs
 */
export function getBrokerAssetPaths(brokerId: string): BrokerAssetPaths {
  const baseUrl = getAssetBaseUrl();
  
  // For specific broker IDs that have SVG files, use SVG format and correct naming
  const hasSvgFile = ['24', '50', '67'].includes(brokerId);
  const extension = hasSvgFile ? 'svg' : 'webp';
  const filePrefix = hasSvgFile ? 'broker-' : '';
  
  return {
    square: {
      small: `${baseUrl}/logos/square/${filePrefix}${brokerId}-64.${extension}`,
      medium: `${baseUrl}/logos/square/${filePrefix}${brokerId}-128.${extension}`,
      large: `${baseUrl}/logos/square/${filePrefix}${brokerId}-256.${extension}`
    },
    horizontal: `${baseUrl}/logos/horizontal/${filePrefix}${brokerId}-horizontal.${extension}`,
    favicon: `${baseUrl}/logos/favicon/${filePrefix}${brokerId}-favicon.${extension}`
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
 * Validate that all critical assets are accessible
 */
export async function validateAssetAccessibility(): Promise<{
  success: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Test fallback image
  const fallbackExists = await checkImageExists(ASSET_CONFIG.fallbackImage);
  if (!fallbackExists) {
    errors.push(`Fallback image not accessible: ${ASSET_CONFIG.fallbackImage}`);
  }
  
  // Test placeholder icon
  const placeholderSvg = '/assets/brokers/logos/fallback/broker-placeholder-128.svg';
  const placeholderExists = await checkImageExists(placeholderSvg);
  if (!placeholderExists) {
    warnings.push(`Placeholder SVG not accessible: ${placeholderSvg}`);
  }
  
  // Test a sample broker asset path structure
  const sampleBrokerId = 'test-broker';
  const samplePaths = getBrokerAssetPaths(sampleBrokerId);
  
  // We don't expect these to exist, but we test the path structure
  const pathTests = [
    samplePaths.square.small,
    samplePaths.square.medium,
    samplePaths.square.large,
    samplePaths.horizontal,
    samplePaths.favicon
  ];
  
  // Validate path structure (should not contain double slashes, etc.)
  pathTests.forEach(path => {
    if (path.includes('//')) {
      errors.push(`Invalid path structure (double slashes): ${path}`);
    }
    if (!path.startsWith('/')) {
      errors.push(`Path should be absolute: ${path}`);
    }
  });
  
  return {
    success: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get fallback image URL with format preference
 */
export function getFallbackImageUrl(brokerId: string, type: 'square' | 'horizontal' | 'favicon', format: 'webp' | 'png' | 'svg' = 'webp'): string {
  const baseUrl = getAssetBaseUrl();
  
  // For specific broker IDs that have SVG files, use SVG format and correct naming
  const hasSvgFile = ['24', '50', '67'].includes(brokerId);
  const actualFormat = hasSvgFile ? 'svg' : format;
  const filePrefix = hasSvgFile ? 'broker-' : '';
  
  switch (type) {
    case 'square':
      return `${baseUrl}/logos/square/${filePrefix}${brokerId}-128.${actualFormat}`;
    case 'horizontal':
      return `${baseUrl}/logos/horizontal/${filePrefix}${brokerId}-horizontal.${actualFormat}`;
    case 'favicon':
      return `${baseUrl}/logos/favicon/${filePrefix}${brokerId}-favicon.${actualFormat}`;
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
