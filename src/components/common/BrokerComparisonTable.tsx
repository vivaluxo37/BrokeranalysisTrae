import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Filter, RefreshCw, SortAsc, SortDesc, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CollectionManager } from '@/utils/SafeCollection';
import {
  getBrokerWithRating,
  getTopRatedBrokers,
  queryBrokers
} from '@/utils/brokerDataAccess';
import type { 
  BrokerSearchOptions, 
  BrokerSortOptions, 
  PaginationOptions
} from '@/utils/brokerDataAccess';
import { getBrokerRating } from '@/data/brokers/brokerRatings';
import type { Broker, BrokerRating } from '@/types/brokerTypes';
import { RegulatorType } from '@/enums';

// Enhanced interface for comparison broker data with real data integration
interface ComparisonBroker {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  minDeposit: string;
  tradingFees: string;
  regulatedBy: string[];
  performanceScores: {
    tradingCosts: number;
    platformQuality: number;
    customerSupport: number;
    regulation: number;
    education: number;
  };
  website?: string;
  logo?: string;
  trustScore: number;
  assetClasses: string[];
  platforms: string[];
  maxLeverage: number;
  spreads: {
    eurusd: number;
    gbpusd: number;
    usdjpy: number;
  };
  ratingData?: BrokerRating;
}

// Enhanced props interface with filtering and sorting options
interface BrokerComparisonTableProps {
  maxBrokers?: number;
  showFilters?: boolean;
  allowSorting?: boolean;
  defaultSortBy?: 'rating' | 'trustScore' | 'minDeposit' | 'name';
  defaultSortOrder?: 'asc' | 'desc';
  searchOptions?: BrokerSearchOptions;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  onDataUpdate?: (brokers: ComparisonBroker[]) => void;
}

export const BrokerComparisonTable = React.memo(function BrokerComparisonTable({ 
  maxBrokers = 3,
  showFilters = false,
  allowSorting = true,
  defaultSortBy = 'rating',
  defaultSortOrder = 'desc',
  searchOptions = {},
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds default
  onDataUpdate
}: BrokerComparisonTableProps) {
  const [displayBrokers, setDisplayBrokers] = useState<ComparisonBroker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'trustScore' | 'minDeposit' | 'name'>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);
  const [filters, setFilters] = useState<BrokerSearchOptions>(searchOptions);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Enhanced data transformation functions
  const transformBrokerToComparison = useCallback((broker: Broker): ComparisonBroker => {
    const ratingData = getBrokerRating(broker.id);
    
    return {
      id: broker.id,
      name: broker.name,
      rating: broker.rating,
      reviews: broker.reviewCount,
      minDeposit: formatMinDeposit(broker.minDeposit),
      tradingFees: getTradingFeesCategory(broker),
      regulatedBy: formatRegulators(extractRegulatoryInfo(broker).authorities),
      trustScore: broker.trustScore,
      assetClasses: broker.assetClasses || [],
      platforms: broker.platforms || [],
      maxLeverage: broker.maxLeverage || 0,
      spreads: {
        eurusd: broker.costs?.spreads?.eurusd || 0,
        gbpusd: broker.costs?.spreads?.gbpusd || 0,
        usdjpy: broker.costs?.spreads?.usdjpy || 0
      },
      logo: broker.logo,
      website: broker.website,
      ratingData,
      performanceScores: calculatePerformanceScores(broker)
    };
  }, []);

  // Calculate performance scores based on real broker data
  const calculatePerformanceScores = useCallback((broker: Broker) => {
    const ratingData = getBrokerRating(broker.id);
    
    // Calculate scores based on actual broker data and ratings
    const tradingCosts = ratingData ? (ratingData.costs / 5) * 100 : Math.max(0, 100 - (broker.spreadsFrom * 20));
    const platformQuality = ratingData ? (ratingData.platform / 5) * 100 : (broker.rating / 5) * 100;
    const customerSupport = ratingData ? (ratingData.customerService / 5) * 100 : broker.trustScore;
    const regulation = broker.isRegulated ? 95 : 30;
    const education = ratingData ? (ratingData.research / 5) * 100 : (broker.features?.education ? 85 : 50);
    
    return {
      tradingCosts: Math.round(tradingCosts),
      platformQuality: Math.round(platformQuality),
      customerSupport: Math.round(customerSupport),
      regulation: Math.round(regulation),
      education: Math.round(education)
    };
  }, []);

  // Enhanced formatting functions for real broker data
  const formatMinDeposit = useCallback((amount: number) => {
    if (amount === 0) return 'No minimum';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    return `$${amount.toLocaleString()}`;
  }, []);

  // Determine trading fees category based on spreads and costs
  const getTradingFeesCategory = useCallback((broker: Broker) => {
    const spreadsFrom = broker.spreadsFrom || 0;
    const commission = broker.costs?.commission || 0;
    
    // Calculate combined cost score
    const costScore = spreadsFrom + (commission * 0.1);
    
    if (costScore <= 0.5) return 'Very Low';
    if (costScore <= 1.0) return 'Low';
    if (costScore <= 2.0) return 'Medium';
    return 'High';
  }, []);

  // Format regulators list with proper names from regulation array
  const formatRegulators = useCallback((regulators: string[]) => {
    return regulators.map(reg => {
      const regUpper = reg.toUpperCase();
      switch (regUpper) {
        case 'FCA': return 'FCA';
        case 'CYSEC': return 'CySEC';
        case 'ASIC': return 'ASIC';
        case 'CFTC': return 'CFTC';
        case 'FSA': return 'FSA';
        case 'FINMA': return 'FINMA';
        case 'BaFin': return 'BaFin';
        case 'CONSOB': return 'CONSOB';
        default: return reg;
      }
    });
  }, []);

  // Extract regulatory information from broker regulation array
  const extractRegulatoryInfo = useCallback((broker: Broker) => {
    if (!broker.regulation || !Array.isArray(broker.regulation) || broker.regulation.length === 0) {
      // Fallback to regulators array if regulation array is not available
      return {
        authorities: broker.regulators || [],
        status: broker.isRegulated ? 'active' : 'unknown',
        details: []
      };
    }

    const authorities = broker.regulation.map(reg => reg.authority);
    const activeRegulations = broker.regulation.filter(reg => reg.status === 'active');
    
    return {
      authorities,
      status: activeRegulations.length > 0 ? 'active' : 'pending',
      details: broker.regulation.map(reg => ({
        authority: reg.authority,
        licenseNumber: reg.licenseNumber,
        status: reg.status,
        jurisdiction: reg.jurisdiction
      }))
    };
  }, []);

  // Manual refresh function
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Trigger data reload by updating lastUpdated
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error during manual refresh:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Load broker data function
  const loadBrokerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get top-rated brokers using real data access functions with filtering
      const queryResult = queryBrokers(
        filters,
        { sortBy, sortOrder },
        { page: 1, limit: maxBrokers }
      );
      
      // Convert to comparison format
      const comparisonBrokers: ComparisonBroker[] = queryResult.brokers.map(transformBrokerToComparison);
      
      // Create safe collection wrapper for brokers
      const safeBrokers = CollectionManager.validateCollection<ComparisonBroker>(
        comparisonBrokers,
        'brokers'
      );
      
      // Fallback to mock data if no real data available
      if (safeBrokers.isEmpty()) {
        const safeFallbackBrokers = CollectionManager.validateCollection<ComparisonBroker>(
          fallbackBrokers,
          'fallbackBrokers'
        );
        const finalBrokers = safeFallbackBrokers.toArray();
        const displayData = maxBrokers ? finalBrokers.slice(0, maxBrokers) : finalBrokers;
        setDisplayBrokers(displayData);
        onDataUpdate?.(displayData);
      } else {
        const finalBrokers = safeBrokers.toArray();
        setDisplayBrokers(finalBrokers);
        onDataUpdate?.(finalBrokers);
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading broker comparison data:', err);
      setError('Failed to load broker data');
      // Set fallback data on error
      const errorFallback = fallbackBrokers.slice(0, 1);
      const displayData = maxBrokers ? errorFallback.slice(0, maxBrokers) : errorFallback;
      setDisplayBrokers(displayData);
      onDataUpdate?.(displayData);
    } finally {
      setLoading(false);
    }
  }, [maxBrokers, filters, sortBy, sortOrder, transformBrokerToComparison, onDataUpdate]);

  // Setup auto-refresh interval
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        loadBrokerData();
      }, refreshInterval);
      
      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, loadBrokerData]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // Memoize fallback brokers to prevent recreation on every render
  const fallbackBrokers = useMemo((): ComparisonBroker[] => [
    {
      id: '1',
      name: 'IG',
      rating: 4.8,
      reviews: 1250,
      minDeposit: '$0',
      tradingFees: 'Low',
      regulatedBy: ['FCA', 'ASIC'],
      trustScore: 95,
      assetClasses: ['Forex', 'CFDs', 'Stocks'],
      platforms: ['MetaTrader 4', 'IG Platform'],
      maxLeverage: 200,
      spreads: {
        eurusd: 0.6,
        gbpusd: 0.9,
        usdjpy: 0.7
      },
      website: 'https://www.ig.com',
      performanceScores: {
        tradingCosts: 95,
        platformQuality: 92,
        customerSupport: 88,
        regulation: 98,
        education: 85
      }
    },
    {
      id: '2',
      name: 'Saxo Bank',
      rating: 4.7,
      reviews: 980,
      minDeposit: '$0',
      tradingFees: 'Low',
      regulatedBy: ['FCA', 'CySEC'],
      trustScore: 92,
      assetClasses: ['Forex', 'CFDs', 'Stocks', 'Bonds'],
      platforms: ['SaxoTraderGO', 'SaxoTraderPRO'],
      maxLeverage: 200,
      spreads: {
        eurusd: 0.4,
        gbpusd: 0.8,
        usdjpy: 0.5
      },
      website: 'https://www.saxobank.com',
      performanceScores: {
        tradingCosts: 88,
        platformQuality: 94,
        customerSupport: 91,
        regulation: 96,
        education: 89
      }
    },
    {
      id: '3',
      name: 'BlackBull',
      rating: 4.6,
      reviews: 756,
      minDeposit: '$0',
      tradingFees: 'Low',
      regulatedBy: ['FMA', 'FSA'],
      trustScore: 88,
      assetClasses: ['Forex', 'CFDs', 'Commodities'],
      platforms: ['MetaTrader 4', 'MetaTrader 5'],
      maxLeverage: 500,
      spreads: {
        eurusd: 0.8,
        gbpusd: 1.0,
        usdjpy: 0.9
      },
      website: 'https://www.blackbull.com',
      performanceScores: {
        tradingCosts: 90,
        platformQuality: 87,
        customerSupport: 85,
        regulation: 92,
        education: 88
      }
    }
  ], []);

  // Initial data load and dependency-based reloads
  useEffect(() => {
    loadBrokerData();
  }, [loadBrokerData, lastUpdated]);

  const performanceCategories = useMemo(() => [
    { key: 'tradingCosts', label: 'Trading Costs' },
    { key: 'platformQuality', label: 'Platform Quality' },
    { key: 'customerSupport', label: 'Customer Support' },
    { key: 'regulation', label: 'Regulation' },
    { key: 'education', label: 'Education' }
  ], [])

  // Memoized broker row component for performance
  const BrokerRow = React.memo(({ broker, index }: { broker: ComparisonBroker; index: number }) => (
    <tr key={broker.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-topforex-accent/20 to-topforex-accent/10 flex items-center justify-center overflow-hidden">
            {broker.logo ? (
              <img 
                src={broker.logo} 
                alt={`${broker.name} logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-topforex-accent font-bold text-lg">
                {broker.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="cosmic-text font-semibold text-lg">{broker.name}</h3>
            <div className="flex gap-1 mt-1">
              {broker.regulatedBy.map((reg) => (
                <span key={reg} className="text-xs px-2 py-1 bg-topforex-accent/20 text-topforex-accent rounded">
                  {reg}
                </span>
              ))}
            </div>
            {broker.assetClasses && broker.assetClasses.length > 0 && (
              <p className="text-cosmic-muted text-xs mt-1">
                {broker.assetClasses.slice(0, 3).join(', ')}
                {broker.assetClasses.length > 3 && ` +${broker.assetClasses.length - 3} more`}
              </p>
            )}
          </div>
        </div>
      </td>
      
      <td className="p-6 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="cosmic-text font-semibold">{broker.rating}</span>
        </div>
        <div className="neural-text text-sm">{broker.reviews} reviews</div>
      </td>
      
      <td className="p-6 text-center">
        <div className="cosmic-text font-semibold">{broker.minDeposit}</div>
      </td>
      
      <td className="p-6 text-center">
        <div className="space-y-1">
          <span className="bg-accent-blue/20 text-accent-blue px-3 py-1 rounded-full text-sm font-medium">
            {broker.tradingFees}
          </span>
          {broker.spreads && (
            <p className="text-xs text-cosmic-muted">
              EUR/USD: {broker.spreads.eurusd} pips
            </p>
          )}
        </div>
      </td>
      
      <td className="p-6 text-center">
        <div className="space-y-1">
          <div className="text-lg font-bold cosmic-text">
            {broker.trustScore}/100
          </div>
          <div className="w-16 h-2 bg-white/10 rounded-full mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-topforex-accent to-green-400 rounded-full transition-all duration-300"
              style={{ width: `${broker.trustScore}%` }}
            />
          </div>
        </div>
      </td>
      
      <td className="p-6">
        <div className="space-y-3">
          {/* Performance Scores */}
          <div className="grid grid-cols-2 gap-2">
            {performanceCategories.slice(0, 4).map((category) => {
              const score = broker.performanceScores[category.key as keyof typeof broker.performanceScores];
              return (
                <div key={category.key} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs cosmic-text">{category.label}</span>
                    <span className="text-xs font-medium cosmic-text">{score}%</span>
                  </div>
                  <Progress value={score} className="h-1" />
                </div>
              );
            })}
          </div>
          
          {/* Key Features */}
          <div className="pt-2 border-t border-white/10">
            <div className="grid grid-cols-1 gap-1 text-xs">
              {broker.platforms && broker.platforms.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-cosmic-muted">Platforms:</span>
                  <span className="cosmic-text">{broker.platforms.slice(0, 2).join(', ')}</span>
                  {broker.platforms.length > 2 && <span className="text-cosmic-muted">+{broker.platforms.length - 2}</span>}
                </div>
              )}
              {broker.maxLeverage && (
                <div className="flex items-center gap-1">
                  <span className="text-cosmic-muted">Max Leverage:</span>
                  <span className="cosmic-text">{broker.maxLeverage}</span>
                </div>
              )}
              {broker.spreads && broker.spreads.eurusd && (
                <div className="flex items-center gap-1">
                  <span className="text-cosmic-muted">EUR/USD:</span>
                  <span className="cosmic-text">{broker.spreads.eurusd} pips</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </td>
      
      <td className="p-6 text-center">
        <div className="space-y-2">
          {broker.website ? (
            <a 
              href={broker.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Broker
              </Button>
            </a>
          ) : (
            <Link to={`/broker/${broker.id}`} className="block w-full">
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          )}
          <Button 
            variant="outline" 
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 w-full"
            asChild
          >
            <Link to={`/brokers/${broker.id}`}>
              Read Review
            </Link>
          </Button>
        </div>
      </td>
    </tr>
  ));

  // Memoize filtered and sorted brokers for performance
  const filteredBrokers = useMemo(() => {
    const filtered = [...displayBrokers];
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'trustScore':
          aValue = a.trustScore;
          bValue = b.trustScore;
          break;
        case 'minDeposit':
          // Convert deposit strings to numbers for sorting
          aValue = parseFloat(a.minDeposit.replace(/[^0-9.]/g, '')) || 0;
          bValue = parseFloat(b.minDeposit.replace(/[^0-9.]/g, '')) || 0;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [displayBrokers, sortBy, sortOrder]);

   // Handle sorting with useCallback for performance
   const handleSort = useCallback((column: 'rating' | 'trustScore' | 'minDeposit' | 'name') => {
     if (sortBy === column) {
       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
     } else {
       setSortBy(column);
       setSortOrder('desc');
     }
   }, [sortBy, sortOrder]);
 
   // Handle filter changes with useCallback for performance
   const handleFilterChange = useCallback((key: string, value: any) => {
     setFilters(prev => ({
       ...prev,
       [key]: value
     }));
   }, []);

   // Show loading state
  if (loading) {
    return (
      <section className="section-padding cosmic-void" aria-labelledby="comparison-heading">
        <div className="container mx-auto container-padding">
          <header className="text-center mb-16 animate-fade-in">
            <h2 id="comparison-heading" className="text-section-title cosmic-text mb-6 text-glow">
              Compare Top-Rated Brokers
            </h2>
            <p className="text-xl neural-text max-w-3xl mx-auto leading-relaxed">
              Our AI-powered analysis evaluates brokers across 5 key criteria to help you make 
              informed decisions. Compare performance metrics, fees, and features side by side.
            </p>
          </header>
          <div className="flex items-center justify-center py-12">
            <div className="neural-text">Loading broker comparison data...</div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state with fallback
  if (error && displayBrokers.length === 0) {
    return (
      <section className="section-padding cosmic-void" aria-labelledby="comparison-heading">
        <div className="container mx-auto container-padding">
          <header className="text-center mb-16 animate-fade-in">
            <h2 id="comparison-heading" className="text-section-title cosmic-text mb-6 text-glow">
              Compare Top-Rated Brokers
            </h2>
            <p className="text-xl neural-text max-w-3xl mx-auto leading-relaxed">
              Our AI-powered analysis evaluates brokers across 5 key criteria to help you make 
              informed decisions. Compare performance metrics, fees, and features side by side.
            </p>
          </header>
          <div className="flex items-center justify-center py-12">
            <div className="text-red-400">Failed to load broker data. Please try again later.</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding cosmic-void" aria-labelledby="comparison-heading">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <h2 id="comparison-heading" className="text-section-title cosmic-text text-glow">
              Compare Top-Rated Brokers
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-cosmic-muted">
                <span className="text-sm">Updated {lastUpdated.toLocaleTimeString()}</span>
                {autoRefresh && (
                  <span className="text-xs bg-accent-blue/20 text-accent-blue px-2 py-1 rounded-full">
                    Auto-refresh: {Math.round(refreshInterval / 1000)}s
                  </span>
                )}
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
          <p className="text-xl neural-text max-w-3xl mx-auto leading-relaxed">
            Our AI-powered analysis evaluates brokers across 5 key criteria to help you make 
            informed decisions. Compare performance metrics, fees, and features side by side.
          </p>
        </header>
        {error && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-md">
            <p className="text-sm text-yellow-300">Using fallback data due to loading issues.</p>
          </div>
        )}

        {showFilters && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-topforex-accent" />
              <h3 className="text-lg font-semibold cosmic-text">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium cosmic-text mb-2">Min Deposit</label>
                <select 
                  value={filters.minDeposit || ''}
                  onChange={(e) => handleFilterChange('minDeposit', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg cosmic-text"
                >
                  <option value="">Any Amount</option>
                  <option value="0">$0</option>
                  <option value="100">$100+</option>
                  <option value="500">$500+</option>
                  <option value="1000">$1,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium cosmic-text mb-2">Asset Class</label>
                <select 
                  value={filters.assetClass || ''}
                  onChange={(e) => handleFilterChange('assetClass', e.target.value || undefined)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg cosmic-text"
                >
                  <option value="">All Assets</option>
                  <option value="forex">Forex</option>
                  <option value="stocks">Stocks</option>
                  <option value="crypto">Crypto</option>
                  <option value="commodities">Commodities</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium cosmic-text mb-2">Regulation</label>
                <select 
                  value={filters.jurisdiction || ''}
                  onChange={(e) => handleFilterChange('jurisdiction', e.target.value || undefined)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg cosmic-text"
                >
                  <option value="">Any Jurisdiction</option>
                  <option value="FCA">FCA (UK)</option>
                  <option value="CySEC">CySEC (Cyprus)</option>
                  <option value="ASIC">ASIC (Australia)</option>
                  <option value="SEC">SEC (USA)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Semantic table markup */}
        <div className="overflow-x-auto mb-12">
          <table className="w-full min-w-[800px] topforex-card" role="table" aria-label="Broker comparison table">
            <caption className="sr-only">
              Comparison of top 3 brokers showing ratings, fees, and performance metrics
            </caption>
            
            <thead>
              <tr className="border-b border-white/10">
                <th scope="col" className="text-left p-6 cosmic-text font-semibold">Broker</th>
                <th scope="col" className="text-center p-6 cosmic-text font-semibold">
                  {allowSorting ? (
                    <button 
                      onClick={() => handleSort('rating')}
                      className="flex items-center gap-1 hover:text-topforex-accent transition-colors"
                    >
                      Rating
                      {sortBy === 'rating' && (
                        sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />
                      )}
                    </button>
                  ) : 'Rating'}
                </th>
                <th scope="col" className="text-center p-6 cosmic-text font-semibold">
                  {allowSorting ? (
                    <button 
                      onClick={() => handleSort('minDeposit')}
                      className="flex items-center gap-1 hover:text-topforex-accent transition-colors"
                    >
                      Min Deposit
                      {sortBy === 'minDeposit' && (
                        sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />
                      )}
                    </button>
                  ) : 'Min Deposit'}
                </th>
                <th scope="col" className="text-center p-6 cosmic-text font-semibold">Trading Fees</th>
                <th scope="col" className="text-center p-6 cosmic-text font-semibold">
                  {allowSorting ? (
                    <button 
                      onClick={() => handleSort('trustScore')}
                      className="flex items-center gap-1 hover:text-topforex-accent transition-colors"
                    >
                      Trust Score
                      {sortBy === 'trustScore' && (
                        sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />
                      )}
                    </button>
                  ) : 'Trust Score'}
                </th>
                <th scope="col" className="text-center p-6 cosmic-text font-semibold">Performance Analysis</th>
                <th scope="col" className="text-center p-6 cosmic-text font-semibold">Action</th>
              </tr>
            </thead>
            
            <tbody>
              {CollectionManager.validateCollection(filteredBrokers, 'filteredBrokers').map((broker, index) => (
                <BrokerRow key={broker.id} broker={broker} index={index} />
              ))}
            </tbody>
          </table>
        </div>

        {/* View all brokers CTA with internal link */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-topforex-accent hover:bg-topforex-accent/80 text-white px-8 rounded-full"
            asChild
          >
            <Link to="/best-brokers">
              View All Brokers
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
});
