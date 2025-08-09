# BrokerAnalysis Platform - Broker Integration Project
## Component Integration Specifications

## Overview

This document provides detailed specifications for integrating real broker data with existing components including BrokerCard, BrokerComparison, BrokerProfile, and homepage components. The integration ensures seamless data flow, proper error handling, and optimal performance.

## Core Integration Principles

### 1. Data Flow Architecture

```typescript
// Data flow: Resources → Processing → Validation → Components
const DATA_FLOW = {
  sources: [
    'img.brokersview.com',
    'frontendapi.brokersview.com', 
    'www.forexbrokers.com'
  ],
  processing: [
    'AssetProcessor',
    'BrokerDataExtractor',
    'DataValidator'
  ],
  storage: [
    'src/data/brokers/',
    'public/assets/brokers/'
  ],
  components: [
    'BrokerCard',
    'BrokerComparison', 
    'BrokerProfile',
    'Homepage Components'
  ]
};
```

### 2. Integration Strategy

- **Progressive Enhancement**: Components work with mock data and gracefully upgrade to real data
- **Fallback Mechanisms**: Robust error handling with fallback to default values
- **Performance Optimization**: Lazy loading, caching, and efficient data fetching
- **Type Safety**: Full TypeScript integration with runtime validation

## Component Integration Specifications

### 1. BrokerCard Component Integration

#### Current Implementation Analysis
```typescript
// Current BrokerCard structure (from examination)
interface CurrentBrokerCardProps {
  broker: {
    id: string;
    name: string;
    logo: string;
    rating: number;
    reviewCount: number;
    averageSpread: number;
    minDeposit: number;
    maxLeverage: number;
    regulation: string[];
  };
}
```

#### Enhanced Integration

```typescript
// src/components/brokeranalysis/BrokerCard.tsx
import React from 'react';
import { BrokerLogo } from '@/components/common/BrokerLogo';
import { RatingDisplay } from '@/components/common/RatingDisplay';
import { RegulationBadges } from '@/components/common/RegulationBadges';
import { TradingConditions } from '@/components/common/TradingConditions';
import { Broker } from '@/types/broker';
import { formatCurrency, formatLeverage } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface EnhancedBrokerCardProps {
  broker: Broker;
  variant?: 'compact' | 'standard' | 'detailed';
  showComparison?: boolean;
  onCompare?: (broker: Broker) => void;
  className?: string;
  priority?: boolean; // For image loading
}

export const BrokerCard: React.FC<EnhancedBrokerCardProps> = ({
  broker,
  variant = 'standard',
  showComparison = false,
  onCompare,
  className,
  priority = false
}) => {
  const handleViewProfile = () => {
    window.location.href = `/brokers/${broker.id}`;
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompare?.(broker);
  };

  return (
    <div 
      className={cn(
        'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300',
        'border border-gray-200 overflow-hidden cursor-pointer',
        className
      )}
      onClick={handleViewProfile}
    >
      {/* Header Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <BrokerLogo 
            broker={broker}
            variant="square"
            size={variant === 'compact' ? 'small' : 'medium'}
            priority={priority}
            className="flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {broker.displayName || broker.name}
            </h3>
            
            <RatingDisplay 
              rating={broker.rating.overall}
              reviewCount={broker.rating.reviewCount}
              trustScore={broker.rating.trustScore}
              variant={variant === 'compact' ? 'minimal' : 'standard'}
            />
          </div>
          
          {showComparison && (
            <button
              onClick={handleCompare}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Add to comparison"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Trading Conditions */}
      {variant !== 'compact' && (
        <div className="p-4">
          <TradingConditions 
            minDeposit={broker.features.trading.minDeposit}
            maxLeverage={broker.features.trading.maxLeverage}
            spreadsFrom={broker.features.trading.spreadsFrom}
            variant="card"
          />
        </div>
      )}

      {/* Regulation Section */}
      <div className="p-4 pt-0">
        <RegulationBadges 
          licenses={broker.regulation.licenses}
          maxDisplay={variant === 'compact' ? 2 : 4}
          verified={broker.regulation.verified}
        />
      </div>

      {/* Footer Actions */}
      <div className="p-4 pt-0 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {broker.features.assetClasses.length} asset classes
        </div>
        
        <button 
          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          onClick={handleViewProfile}
        >
          View Profile →
        </button>
      </div>
    </div>
  );
};

// Supporting components
export const BrokerCardSkeleton: React.FC<{ variant?: 'compact' | 'standard' | 'detailed' }> = ({ 
  variant = 'standard' 
}) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-pulse">
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className={cn(
          'bg-gray-200 rounded',
          variant === 'compact' ? 'w-12 h-12' : 'w-16 h-16'
        )} />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
    
    {variant !== 'compact' && (
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-8 bg-gray-200 rounded" />
          <div className="h-8 bg-gray-200 rounded" />
          <div className="h-8 bg-gray-200 rounded" />
        </div>
      </div>
    )}
    
    <div className="p-4 pt-0">
      <div className="flex space-x-2">
        <div className="h-6 bg-gray-200 rounded w-16" />
        <div className="h-6 bg-gray-200 rounded w-16" />
      </div>
    </div>
  </div>
);
```

### 2. BrokerComparison Component Integration

```typescript
// src/components/brokeranalysis/BrokerComparison.tsx
import React, { useState, useMemo } from 'react';
import { BrokerLogo } from '@/components/common/BrokerLogo';
import { ComparisonTable } from '@/components/common/ComparisonTable';
import { Broker } from '@/types/broker';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface BrokerComparisonProps {
  brokers: Broker[];
  maxBrokers?: number;
  onRemoveBroker?: (brokerId: string) => void;
  className?: string;
}

export const BrokerComparison: React.FC<BrokerComparisonProps> = ({
  brokers,
  maxBrokers = 4,
  onRemoveBroker,
  className
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'overview',
    'trading',
    'regulation',
    'platforms'
  ]);

  const comparisonData = useMemo(() => {
    return generateComparisonData(brokers, selectedCategories);
  }, [brokers, selectedCategories]);

  if (brokers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Brokers Selected</h3>
        <p className="text-gray-500">Add brokers to compare their features side by side</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Broker Headers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: `200px repeat(${brokers.length}, 1fr)` }}>
          {/* Empty corner cell */}
          <div className="p-4 border-r border-gray-200 bg-gray-50" />
          
          {/* Broker header cells */}
          {brokers.map((broker) => (
            <div key={broker.id} className="p-4 border-r border-gray-200 bg-gray-50 last:border-r-0">
              <div className="text-center">
                <BrokerLogo 
                  broker={broker}
                  variant="square"
                  size="medium"
                  className="mx-auto mb-3"
                />
                
                <h3 className="font-semibold text-gray-900 mb-1">
                  {broker.displayName || broker.name}
                </h3>
                
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill={i < Math.floor(broker.rating.overall) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {broker.rating.overall.toFixed(1)}
                  </span>
                </div>
                
                {onRemoveBroker && (
                  <button
                    onClick={() => onRemoveBroker(broker.id)}
                    className="text-red-500 hover:text-red-700 text-sm transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Rows */}
        <ComparisonTable data={comparisonData} brokers={brokers} />
      </div>

      {/* Category Selector */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Comparison Categories</h4>
        <div className="flex flex-wrap gap-2">
          {COMPARISON_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategories(prev => 
                  prev.includes(category.id)
                    ? prev.filter(id => id !== category.id)
                    : [...prev, category.id]
                );
              }}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                selectedCategories.includes(category.id)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const COMPARISON_CATEGORIES = [
  { id: 'overview', label: 'Overview' },
  { id: 'trading', label: 'Trading Conditions' },
  { id: 'regulation', label: 'Regulation' },
  { id: 'platforms', label: 'Platforms' },
  { id: 'assets', label: 'Asset Classes' },
  { id: 'funding', label: 'Funding' },
  { id: 'education', label: 'Education' },
  { id: 'research', label: 'Research' }
];

function generateComparisonData(brokers: Broker[], categories: string[]) {
  const data: ComparisonRow[] = [];

  categories.forEach(categoryId => {
    switch (categoryId) {
      case 'overview':
        data.push(
          {
            category: 'Overview',
            field: 'Trust Score',
            values: brokers.map(b => `${b.rating.trustScore}/100`),
            type: 'score'
          },
          {
            category: 'Overview',
            field: 'Review Count',
            values: brokers.map(b => b.rating.reviewCount.toLocaleString()),
            type: 'number'
          }
        );
        break;
        
      case 'trading':
        data.push(
          {
            category: 'Trading',
            field: 'Min Deposit',
            values: brokers.map(b => formatCurrency(b.features.trading.minDeposit)),
            type: 'currency'
          },
          {
            category: 'Trading',
            field: 'Max Leverage',
            values: brokers.map(b => `1:${b.features.trading.maxLeverage}`),
            type: 'leverage'
          },
          {
            category: 'Trading',
            field: 'Spreads From',
            values: brokers.map(b => `${b.features.trading.spreadsFrom} pips`),
            type: 'spread'
          }
        );
        break;
        
      case 'regulation':
        data.push(
          {
            category: 'Regulation',
            field: 'Verified',
            values: brokers.map(b => b.regulation.verified ? '✓ Verified' : '⚠ Unverified'),
            type: 'status'
          },
          {
            category: 'Regulation',
            field: 'Licenses',
            values: brokers.map(b => b.regulation.licenses.map(l => l.regulator).join(', ')),
            type: 'list'
          }
        );
        break;
        
      case 'platforms':
        data.push(
          {
            category: 'Platforms',
            field: 'Available Platforms',
            values: brokers.map(b => b.features.platforms.join(', ')),
            type: 'list'
          }
        );
        break;
        
      // Add more categories as needed
    }
  });

  return data;
}

interface ComparisonRow {
  category: string;
  field: string;
  values: string[];
  type: 'score' | 'number' | 'currency' | 'leverage' | 'spread' | 'status' | 'list';
}
```

### 3. BrokerProfile Component Integration

```typescript
// src/components/brokeranalysis/BrokerProfile.tsx
import React, { useState } from 'react';
import { BrokerLogo } from '@/components/common/BrokerLogo';
import { RatingDisplay } from '@/components/common/RatingDisplay';
import { RegulationSection } from '@/components/common/RegulationSection';
import { TradingFeaturesSection } from '@/components/common/TradingFeaturesSection';
import { ContactSection } from '@/components/common/ContactSection';
import { ReviewsSection } from '@/components/common/ReviewsSection';
import { Broker } from '@/types/broker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BrokerProfileProps {
  broker: Broker;
  className?: string;
}

export const BrokerProfile: React.FC<BrokerProfileProps> = ({
  broker,
  className
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={className}>
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start space-x-6">
          <BrokerLogo 
            broker={broker}
            variant="square"
            size="large"
            priority
            className="flex-shrink-0"
          />
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {broker.displayName || broker.name}
                </h1>
                
                <p className="text-gray-600 mb-4">
                  {broker.contact.company.legalName}
                </p>
                
                <RatingDisplay 
                  rating={broker.rating.overall}
                  reviewCount={broker.rating.reviewCount}
                  trustScore={broker.rating.trustScore}
                  variant="detailed"
                  showBreakdown
                  breakdown={broker.rating.breakdown}
                />
              </div>
              
              <div className="text-right">
                <a
                  href={broker.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Visit Website
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                
                <div className="mt-3 text-sm text-gray-500">
                  Last updated: {new Date(broker.metadata.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {broker.features.trading.minDeposit === 0 ? 'No' : `$${broker.features.trading.minDeposit}`}
                </div>
                <div className="text-sm text-gray-600">Min Deposit</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  1:{broker.features.trading.maxLeverage}
                </div>
                <div className="text-sm text-gray-600">Max Leverage</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {broker.features.trading.spreadsFrom}
                </div>
                <div className="text-sm text-gray-600">Spreads From (pips)</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {broker.features.assetClasses.length}
                </div>
                <div className="text-sm text-gray-600">Asset Classes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="regulation">Regulation</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Company Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Legal Name</dt>
                  <dd className="text-sm text-gray-900">{broker.contact.company.legalName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Founded</dt>
                  <dd className="text-sm text-gray-900">{broker.contact.company.foundedYear || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Headquarters</dt>
                  <dd className="text-sm text-gray-900">
                    {broker.contact.address.city}, {broker.contact.address.country}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="text-sm text-blue-600">
                    <a href={broker.contact.website} target="_blank" rel="noopener noreferrer">
                      {broker.contact.website}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Key Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Demo Account</span>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    broker.features.trading.demoAccount
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}>
                    {broker.features.trading.demoAccount ? 'Available' : 'Not Available'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Copy Trading</span>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    broker.features.trading.copyTrading
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}>
                    {broker.features.trading.copyTrading ? 'Available' : 'Not Available'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Islamic Account</span>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    broker.features.trading.swapFree
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}>
                    {broker.features.trading.swapFree ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trading" className="mt-6">
          <TradingFeaturesSection broker={broker} />
        </TabsContent>
        
        <TabsContent value="regulation" className="mt-6">
          <RegulationSection broker={broker} />
        </TabsContent>
        
        <TabsContent value="platforms" className="mt-6">
          <PlatformsSection broker={broker} />
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <ReviewsSection broker={broker} />
        </TabsContent>
        
        <TabsContent value="contact" className="mt-6">
          <ContactSection broker={broker} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

### 4. Homepage Components Integration

```typescript
// src/components/brokeranalysis/TopRatedBrokersSection.tsx
import React, { useState, useEffect } from 'react';
import { BrokerCard } from './BrokerCard';
import { BrokerCardSkeleton } from './BrokerCard';
import { Broker } from '@/types/broker';
import { useBrokerData } from '@/hooks/useBrokerData';
import { imagePreloader } from '@/utils/imagePreloader';

interface TopRatedBrokersSectionProps {
  maxBrokers?: number;
  showComparison?: boolean;
  onCompareBroker?: (broker: Broker) => void;
  className?: string;
}

export const TopRatedBrokersSection: React.FC<TopRatedBrokersSectionProps> = ({
  maxBrokers = 6,
  showComparison = false,
  onCompareBroker,
  className
}) => {
  const { brokers, loading, error } = useBrokerData({
    featured: true,
    limit: maxBrokers,
    sortBy: 'rating'
  });
  
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // Preload broker logos for better performance
  useEffect(() => {
    if (brokers.length > 0) {
      imagePreloader.preloadBrokerLogos(brokers, 'square', 'medium')
        .then(() => setImagesPreloaded(true))
        .catch(console.error);
    }
  }, [brokers]);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Brokers</h3>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }

  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Top Rated Brokers
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the highest-rated forex brokers based on real user reviews, 
          regulatory compliance, and trading conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Show skeleton loaders while loading
          Array.from({ length: maxBrokers }).map((_, index) => (
            <BrokerCardSkeleton key={index} variant="standard" />
          ))
        ) : (
          brokers.map((broker, index) => (
            <BrokerCard
              key={broker.id}
              broker={broker}
              variant="standard"
              showComparison={showComparison}
              onCompare={onCompareBroker}
              priority={index < 3} // Prioritize first 3 images
            />
          ))
        )}
      </div>

      {!loading && brokers.length > 0 && (
        <div className="text-center mt-8">
          <a
            href="/brokers"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Brokers
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </section>
  );
};
```

### 5. Data Hooks and Services

```typescript
// src/hooks/useBrokerData.ts
import { useState, useEffect } from 'react';
import { Broker } from '@/types/broker';
import { BrokerService } from '@/services/brokerService';

interface UseBrokerDataOptions {
  featured?: boolean;
  limit?: number;
  sortBy?: 'rating' | 'name' | 'minDeposit';
  filters?: {
    regulation?: string[];
    assetClasses?: string[];
    platforms?: string[];
  };
}

interface UseBrokerDataResult {
  brokers: Broker[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBrokerData(options: UseBrokerDataOptions = {}): UseBrokerDataResult {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrokers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await BrokerService.getBrokers(options);
      setBrokers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brokers');
      console.error('Error fetching brokers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, [JSON.stringify(options)]);

  return {
    brokers,
    loading,
    error,
    refetch: fetchBrokers
  };
}

// src/services/brokerService.ts
import { Broker } from '@/types/broker';
import { validateBroker } from '@/utils/brokerValidation';

export class BrokerService {
  private static cache = new Map<string, { data: Broker[]; timestamp: number }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async getBrokers(options: UseBrokerDataOptions = {}): Promise<Broker[]> {
    const cacheKey = JSON.stringify(options);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Import broker data dynamically
      const { brokers } = await import('@/data/brokers/brokerData');
      
      let filteredBrokers = brokers;

      // Apply filters
      if (options.featured) {
        filteredBrokers = filteredBrokers.filter(b => b.metadata.featured);
      }

      if (options.filters?.regulation) {
        filteredBrokers = filteredBrokers.filter(b => 
          b.regulation.licenses.some(l => 
            options.filters!.regulation!.includes(l.regulator)
          )
        );
      }

      if (options.filters?.assetClasses) {
        filteredBrokers = filteredBrokers.filter(b => 
          options.filters!.assetClasses!.some(ac => 
            b.features.assetClasses.includes(ac as any)
          )
        );
      }

      // Apply sorting
      if (options.sortBy) {
        filteredBrokers.sort((a, b) => {
          switch (options.sortBy) {
            case 'rating':
              return b.rating.overall - a.rating.overall;
            case 'name':
              return a.name.localeCompare(b.name);
            case 'minDeposit':
              return a.features.trading.minDeposit - b.features.trading.minDeposit;
            default:
              return 0;
          }
        });
      }

      // Apply limit
      if (options.limit) {
        filteredBrokers = filteredBrokers.slice(0, options.limit);
      }

      // Validate data
      const validatedBrokers = filteredBrokers.map(broker => {
        const validation = validateBroker(broker);
        if (!validation.success) {
          console.warn(`Invalid broker data for ${broker.id}:`, validation.errors);
          return null;
        }
        return validation.data!;
      }).filter(Boolean) as Broker[];

      // Cache the result
      this.cache.set(cacheKey, {
        data: validatedBrokers,
        timestamp: Date.now()
      });

      return validatedBrokers;
    } catch (error) {
      console.error('Error loading broker data:', error);
      throw new Error('Failed to load broker data');
    }
  }

  static async getBrokerById(id: string): Promise<Broker | null> {
    const brokers = await this.getBrokers();
    return brokers.find(b => b.id === id) || null;
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
```

This comprehensive component integration specification ensures that all existing components are properly updated to work with real broker data while maintaining performance, error handling, and user experience standards.