/**
 * Asset Loading Utilities with Fallback Mechanisms
 * Handles loading of broker logos and other assets with error handling
 */

import { useEffect, useState } from 'react';

// Asset loading configuration
interface AssetConfig {
  /** Primary asset URL */
  primary: string;
  /** Fallback asset URLs */
  fallbacks?: string[];
  /** Default fallback when all else fails */
  defaultFallback?: string;
  /** Timeout for loading attempts (ms) */
  timeout?: number;
}

// Asset loading result
interface AssetLoadResult {
  /** Successfully loaded asset URL */
  url: string | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: boolean;
  /** Which source was used (primary, fallback-0, fallback-1, etc.) */
  source: string | null;
}

/**
 * Hook for loading assets with fallback mechanisms
 */
export function useAssetLoader(config: AssetConfig): AssetLoadResult {
  const [result, setResult] = useState<AssetLoadResult>({
    url: null,
    loading: true,
    error: false,
    source: null
  });

  useEffect(() => {
    let isCancelled = false;
    
    const loadAsset = async () => {
      setResult(prev => ({ ...prev, loading: true, error: false }));
      
      // Create list of URLs to try
      const urlsToTry = [
        { url: config.primary, source: 'primary' },
        ...(config.fallbacks || []).map((url, index) => ({ 
          url, 
          source: `fallback-${index}` 
        })),
        ...(config.defaultFallback ? [{ 
          url: config.defaultFallback, 
          source: 'default' 
        }] : [])
      ];
      
      for (const { url, source } of urlsToTry) {
        if (isCancelled) break;
        
        try {
          const success = await testImageLoad(url, config.timeout);
          if (success && !isCancelled) {
            setResult({
              url,
              loading: false,
              error: false,
              source
            });
            return;
          }
        } catch (error) {
          // Continue to next fallback
          console.warn(`Failed to load asset from ${source}:`, url, error);
        }
      }
      
      // All attempts failed
      if (!isCancelled) {
        setResult({
          url: null,
          loading: false,
          error: true,
          source: null
        });
      }
    };
    
    loadAsset();
    
    return () => {
      isCancelled = true;
    };
  }, [config.primary, config.fallbacks, config.defaultFallback, config.timeout]);
  
  return result;
}

/**
 * Test if an image can be loaded
 */
function testImageLoad(url: string, timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    let timeoutId: NodeJS.Timeout;
    
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };
    
    img.onload = () => {
      cleanup();
      resolve(true);
    };
    
    img.onerror = () => {
      cleanup();
      resolve(false);
    };
    
    timeoutId = setTimeout(() => {
      cleanup();
      resolve(false);
    }, timeout);
    
    img.src = url;
  });
}

/**
 * Generate fallback URLs for broker logos
 */
export function generateBrokerLogoFallbacks(broker: {
  id: string;
  name: string;
  logo: string;
}): AssetConfig {
  const fallbacks: string[] = [];
  
  // Try local asset path
  const localAssetPath = `/assets/brokers/logos/square/${broker.name}.png`;
  fallbacks.push(localAssetPath);
  
  // Try alternative local paths
  const sanitizedName = broker.name.replace(/[^a-zA-Z0-9]/g, '_');
  fallbacks.push(`/assets/brokers/logos/square/${sanitizedName}.png`);
  fallbacks.push(`/assets/brokers/logos/${broker.id}.png`);
  
  // Default fallback - generate initials-based placeholder
  const initials = broker.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const defaultFallback = `data:image/svg+xml;base64,${btoa(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#1a1a1a" rx="8"/>
      <text x="32" y="40" font-family="Arial, sans-serif" font-size="20" font-weight="bold" 
            text-anchor="middle" fill="#ffffff">${initials}</text>
    </svg>
  `)}`;
  
  return {
    primary: broker.logo,
    fallbacks,
    defaultFallback,
    timeout: 3000
  };
}

/**
 * Preload assets for better performance
 */
export function preloadAssets(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(url => 
      testImageLoad(url, 2000).catch(() => false)
    )
  ).then(() => []);
}

/**
 * Get optimized image URL based on size requirements
 */
export function getOptimizedImageUrl(
  originalUrl: string, 
  size: { width: number; height: number }
): string {
  // For external URLs, return as-is (could be enhanced with image optimization service)
  if (originalUrl.startsWith('http')) {
    return originalUrl;
  }
  
  // For local assets, could implement size-specific variants
  return originalUrl;
}