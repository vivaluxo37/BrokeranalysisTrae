import { ArrowRight, ExternalLink, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { dataIntegrationService } from '@/services/dataIntegrationService'
import type { Broker } from '@/types/broker'
import { RegulatorType } from '@/enums'

// Interface for component-specific broker data
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
}

export function BrokerComparisonTable() {
  const [brokers, setBrokers] = useState<ComparisonBroker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate performance scores based on real broker data
  const calculatePerformanceScores = (broker: Broker) => {
    // Trading Costs: Based on spreads and minimum deposit
    const tradingCosts = Math.max(0, Math.min(100, 
      100 - (broker.spreadsFrom * 10) - (broker.minDeposit / 1000)
    ));
    
    // Platform Quality: Based on number of platforms and features
    const platformQuality = Math.min(100, 
      (broker.platforms.length * 20) + (broker.trustScore || 0) * 8
    );
    
    // Customer Support: Based on trust score and review count
    const customerSupport = Math.min(100, 
      (broker.trustScore || 0) * 8 + Math.min(20, broker.reviewCount / 50)
    );
    
    // Regulation: Based on number of regulators and regulation status
    const regulation = Math.min(100, 
      broker.regulators.length * 25 + (broker.isRegulated ? 25 : 0)
    );
    
    // Education: Based on asset classes and features availability
    const education = Math.min(100, 
      broker.assetClasses.length * 15 + (broker.features ? 30 : 0)
    );
    
    return {
      tradingCosts: Math.round(tradingCosts),
      platformQuality: Math.round(platformQuality),
      customerSupport: Math.round(customerSupport),
      regulation: Math.round(regulation),
      education: Math.round(education)
    };
  };

  // Format minimum deposit for display
  const formatMinDeposit = (minDeposit: number): string => {
    if (minDeposit === 0) return '$0';
    if (minDeposit >= 1000) return `$${(minDeposit / 1000).toFixed(0)}k`;
    return `$${minDeposit}`;
  };

  // Determine trading fees category based on spreads
  const getTradingFeesCategory = (spreadsFrom: number): string => {
    if (spreadsFrom <= 0.5) return 'Very Low';
    if (spreadsFrom <= 1.0) return 'Low';
    if (spreadsFrom <= 2.0) return 'Medium';
    return 'High';
  };

  // Convert RegulatorType enum to display strings
  const formatRegulators = (regulators: RegulatorType[]): string[] => {
    return regulators.map(reg => {
      switch (reg) {
        case RegulatorType.FCA: return 'FCA';
        case RegulatorType.CYSEC: return 'CySEC';
        case RegulatorType.ASIC: return 'ASIC';
        case RegulatorType.SEC: return 'SEC';
        case RegulatorType.CFTC: return 'CFTC';
        case RegulatorType.FINRA: return 'FINRA';
        default: return reg.toString();
      }
    });
  };

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      // Get top-rated brokers from data integration service
      const { topRatedBrokers } = dataIntegrationService.getIntegratedBrokerData();
      
      // Convert to component format and limit to top 3
      const comparisonBrokers: ComparisonBroker[] = topRatedBrokers
        .slice(0, 3)
        .map(broker => ({
          id: broker.id,
          name: broker.name,
          rating: broker.rating,
          reviews: broker.reviewCount,
          minDeposit: formatMinDeposit(broker.minDeposit),
          tradingFees: getTradingFeesCategory(broker.spreadsFrom),
          regulatedBy: formatRegulators(broker.regulators),
          performanceScores: calculatePerformanceScores(broker),
          website: broker.website
        }));
      
      // Fallback to mock data if no real data available
      if (comparisonBrokers.length === 0) {
        const fallbackBrokers: ComparisonBroker[] = [
          {
            id: '1',
            name: 'IG',
            rating: 4.8,
            reviews: 1250,
            minDeposit: '$0',
            tradingFees: 'Low',
            regulatedBy: ['FCA', 'ASIC'],
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
            performanceScores: {
              tradingCosts: 90,
              platformQuality: 87,
              customerSupport: 85,
              regulation: 92,
              education: 88
            }
          }
        ];
        setBrokers(fallbackBrokers);
      } else {
        setBrokers(comparisonBrokers);
      }
    } catch (err) {
      console.error('Error loading broker comparison data:', err);
      setError('Failed to load broker data');
      // Set fallback data on error
      setBrokers([
        {
          id: '1',
          name: 'IG',
          rating: 4.8,
          reviews: 1250,
          minDeposit: '$0',
          tradingFees: 'Low',
          regulatedBy: ['FCA', 'ASIC'],
          performanceScores: {
            tradingCosts: 95,
            platformQuality: 92,
            customerSupport: 88,
            regulation: 98,
            education: 85
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const performanceCategories = [
    { key: 'tradingCosts', label: 'Trading Costs' },
    { key: 'platformQuality', label: 'Platform Quality' },
    { key: 'customerSupport', label: 'Customer Support' },
    { key: 'regulation', label: 'Regulation' },
    { key: 'education', label: 'Education' }
  ]

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
  if (error && brokers.length === 0) {
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
          <h2 id="comparison-heading" className="text-section-title cosmic-text mb-6 text-glow">
            Compare Top-Rated Brokers
          </h2>
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

        {/* Semantic table markup */}
        <div className="overflow-x-auto mb-12">
          <table className="w-full min-w-[800px] topforex-card" role="table" aria-label="Broker comparison table">
            <caption className="sr-only">
              Comparison of top 3 brokers showing ratings, fees, and performance metrics
            </caption>
            
            <thead>
              <tr className="border-b border-white/10">
                <th scope="col" className="text-left p-6 cosmic-text font-semibold">Broker</th>
                <th scope="col" className="text-center p-6 cosmic-text font-semibold">Rating</th>
                <th scope="col" className="text-center p-6 cosmic-text font-semibold">Min Deposit</th>
                <th scope="col" className="text-center p-6 cosmic-text font-semibold">Trading Fees</th>
                <th scope="col" className="text-center p-6 cosmic-text font-semibold">Performance Analysis</th>
                <th scope="col" className="text-center p-6 cosmic-text font-semibold">Action</th>
              </tr>
            </thead>
            
            <tbody>
              {brokers.map((broker, index) => (
                <tr key={broker.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <span className="text-topforex-accent font-bold">{broker.name.charAt(0)}</span>
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
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                      {broker.tradingFees}
                    </span>
                  </td>
                  
                  <td className="p-6">
                    <div className="space-y-2 min-w-[200px]">
                      {performanceCategories.map((category) => (
                        <div key={category.key} className="flex items-center gap-3">
                          <span className="neural-text text-sm w-24 text-left">{category.label}</span>
                          <div className="flex-1">
                            <Progress 
                              value={broker.performanceScores[category.key as keyof typeof broker.performanceScores]} 
                              className="h-2 bg-white/10"
                            />
                          </div>
                          <span className="neural-text text-sm w-8 text-right">
                            {broker.performanceScores[category.key as keyof typeof broker.performanceScores]}%
                          </span>
                        </div>
                      ))}
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
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}