import React from 'react';
import { cn } from '@/lib/utils';

interface BrokerLogoProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

export const BrokerLogo: React.FC<BrokerLogoProps> = ({
  src,
  alt,
  size = 'md',
  className
}) => {
  return (
    <div className={cn(
      'flex items-center justify-center rounded-lg bg-white border border-gray-200 overflow-hidden',
      sizeClasses[size],
      className
    )}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain p-1"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};