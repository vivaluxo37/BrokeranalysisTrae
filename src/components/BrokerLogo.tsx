import React, { useState, useCallback } from 'react';
import { getBrokerLogo, getFallbackLogo, generateSrcSet } from '../utils/assetUtils';

// Define types locally to avoid import issues
type ImageFormat = 'png' | 'webp';
type ImageSize = '64' | '128' | '256' | 'original';

export interface BrokerLogoProps {
  brokerId: string;
  brokerName?: string;
  size?: ImageSize;
  format?: ImageFormat;
  className?: string;
  alt?: string;
  responsive?: boolean;
  fallbackToInitials?: boolean;
  onClick?: () => void;
}

const BrokerLogo: React.FC<BrokerLogoProps> = ({
  brokerId,
  brokerName,
  size = '128',
  format = 'webp',
  className = '',
  alt,
  responsive = true,
  fallbackToInitials = true,
  onClick
}) => {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleFallbackError = useCallback(() => {
    setFallbackError(true);
  }, []);

  const getImageSrc = useCallback(() => {
    if (imageError) {
      return getFallbackLogo(size, format);
    }
    return getBrokerLogo(brokerId, size, format);
  }, [brokerId, size, format, imageError]);

  const getSrcSet = useCallback(() => {
    if (!responsive || imageError) {
      return undefined;
    }
    return generateSrcSet(brokerId, format);
  }, [brokerId, format, responsive, imageError]);

  const getAltText = useCallback(() => {
    if (alt) return alt;
    if (brokerName) return `${brokerName} logo`;
    return `Broker ${brokerId} logo`;
  }, [alt, brokerName, brokerId]);

  const getSizeClass = useCallback(() => {
    switch (size) {
      case '64':
        return 'w-16 h-16';
      case '128':
        return 'w-32 h-32';
      case '256':
        return 'w-64 h-64';
      case 'original':
        return 'w-auto h-auto max-w-full max-h-full';
      default:
        return 'w-32 h-32';
    }
  }, [size]);

  const getInitials = useCallback(() => {
    if (!brokerName) return brokerId.substring(0, 2).toUpperCase();
    return brokerName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }, [brokerName, brokerId]);

  // If both image and fallback failed, show initials
  if (imageError && fallbackError && fallbackToInitials) {
    return (
      <div
        className={`
          ${getSizeClass()}
          ${className}
          bg-gradient-to-br from-blue-500 to-purple-600
          flex items-center justify-center
          text-white font-bold
          rounded-lg
          ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        `}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        } : undefined}
      >
        <span className={`
          ${size === '64' ? 'text-sm' : size === '128' ? 'text-lg' : 'text-2xl'}
        `}>
          {getInitials()}
        </span>
      </div>
    );
  }

  return (
    <div className={`${getSizeClass()} ${className} relative`}>
      {!imageError ? (
        <img
          src={getImageSrc()}
          srcSet={getSrcSet()}
          sizes={responsive ? `(max-width: 768px) ${size}px, ${size}px` : undefined}
          alt={getAltText()}
          className={`
            w-full h-full object-contain rounded-lg
            ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
          `}
          onError={handleImageError}
          onClick={onClick}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          onKeyDown={onClick ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          } : undefined}
          loading="lazy"
        />
      ) : (
        <img
          src={getFallbackLogo(size, 'png')}
          alt={`Fallback logo for ${getAltText()}`}
          className={`
            w-full h-full object-contain rounded-lg opacity-60
            ${onClick ? 'cursor-pointer hover:opacity-40 transition-opacity' : ''}
          `}
          onError={handleFallbackError}
          onClick={onClick}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          onKeyDown={onClick ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          } : undefined}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default BrokerLogo;