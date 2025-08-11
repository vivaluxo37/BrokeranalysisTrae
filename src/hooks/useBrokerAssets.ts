/**
 * React hook for managing broker assets with loading states and fallbacks
 */

import { useCallback, useEffect, useState } from 'react';
import { 
  type ImageLoadingOptions, 
  checkImageExists, 
  getBrokerAssetPaths,
  getFallbackImageUrl,
  getOptimizedImageProps 
} from '@/utils/assetOptimization';

export interface BrokerAssetState {
  isLoading: boolean;
  isError: boolean;
  imageUrl: string;
  fallbackUrl: string;
}

export interface UseBrokerAssetsOptions {
  brokerId: string;
  type: 'square' | 'horizontal' | 'favicon';
  size?: 'small' | 'medium' | 'large';
  preload?: boolean;
}

/**
 * Hook for managing individual broker asset loading
 */
export function useBrokerAsset(options: UseBrokerAssetsOptions): BrokerAssetState {
  const { brokerId, type, size = 'medium', preload = false } = options;
  
  const [state, setState] = useState<BrokerAssetState>({
    isLoading: true,
    isError: false,
    imageUrl: '',
    fallbackUrl: getFallbackImageUrl(brokerId, type)
  });

  const loadImage = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false }));
    
    try {
      const paths = getBrokerAssetPaths(brokerId);
      let imageUrl: string;
      
      // Select appropriate image URL based on type and size
      switch (type) {
        case 'square':
          imageUrl = size === 'small' ? paths.square.small : 
                    size === 'large' ? paths.square.large : 
                    paths.square.medium;
          break;
        case 'horizontal':
          imageUrl = paths.horizontal;
          break;
        case 'favicon':
          imageUrl = paths.favicon;
          break;
        default:
          imageUrl = paths.square.medium;
      }
      
      // Check if primary image exists
      const exists = await checkImageExists(imageUrl);
      
      if (exists) {
        setState({
          isLoading: false,
          isError: false,
          imageUrl,
          fallbackUrl: getFallbackImageUrl(brokerId, type)
        });
      } else {
        // Try PNG fallback
        const pngFallback = getFallbackImageUrl(brokerId, type, 'png');
        const pngExists = await checkImageExists(pngFallback);
        
        setState({
          isLoading: false,
          isError: !pngExists,
          imageUrl: pngExists ? pngFallback : getFallbackImageUrl(brokerId, type),
          fallbackUrl: getFallbackImageUrl(brokerId, type)
        });
      }
    } catch (error) {
      setState({
        isLoading: false,
        isError: true,
        imageUrl: getFallbackImageUrl(brokerId, type),
        fallbackUrl: getFallbackImageUrl(brokerId, type)
      });
    }
  }, [brokerId, type, size]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  // Preload image if requested
  useEffect(() => {
    if (preload && state.imageUrl) {
      const img = new Image();
      img.src = state.imageUrl;
    }
  }, [preload, state.imageUrl]);

  return state;
}

/**
 * Hook for managing multiple broker assets
 */
export function useBrokerAssets(brokerIds: string[], type: 'square' | 'horizontal' | 'favicon' = 'square') {
  const [assetsState, setAssetsState] = useState<Record<string, BrokerAssetState>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadAssets = useCallback(async () => {
    setIsLoading(true);
    const newState: Record<string, BrokerAssetState> = {};

    await Promise.all(
      brokerIds.map(async (brokerId) => {
        try {
          const paths = getBrokerAssetPaths(brokerId);
          const imageUrl = type === 'square' ? paths.square.medium :
                          type === 'horizontal' ? paths.horizontal :
                          paths.favicon;
          
          const exists = await checkImageExists(imageUrl);
          
          newState[brokerId] = {
            isLoading: false,
            isError: !exists,
            imageUrl: exists ? imageUrl : getFallbackImageUrl(brokerId, type),
            fallbackUrl: getFallbackImageUrl(brokerId, type)
          };
        } catch {
          newState[brokerId] = {
            isLoading: false,
            isError: true,
            imageUrl: getFallbackImageUrl(brokerId, type),
            fallbackUrl: getFallbackImageUrl(brokerId, type)
          };
        }
      })
    );

    setAssetsState(newState);
    setIsLoading(false);
  }, [brokerIds, type]);

  useEffect(() => {
    if (brokerIds.length > 0) {
      loadAssets();
    }
  }, [loadAssets]);

  return {
    assets: assetsState,
    isLoading,
    refetch: loadAssets
  };
}

/**
 * Hook for getting optimized image props for React components
 */
export function useOptimizedImageProps(options: ImageLoadingOptions) {
  return getOptimizedImageProps(options);
}
