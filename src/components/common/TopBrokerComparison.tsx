import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award, Shield, Star, TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { dataIntegrationService } from '@/services/dataIntegrationService'
import type { Broker } from '@/types/brokerTypes'
import { RegulatorType } from '@/enums'
import { CollectionManager } from '@/utils/SafeCollection'



export function TopBrokerComparison() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Memoize fallback data to prevent recreation on every render
  const fallbackBrokers = useMemo(() => [
    {
      id: '1',
      name: 'Interactive Brokers',
      rating: 4.8,
      spreadsFrom: 0.1,
      regulators: [RegulatorType.SEC, RegulatorType.FCA, RegulatorType.CFTC],
      minDeposit: 0,
      keyFeatures: ['Low Costs', 'Global Markets', 'Advanced Tools']
    },
    {
      id: '2',
      name: 'eToro',
      rating: 4.6,
      spreadsFrom: 1.0,
      regulators: [RegulatorType.FCA, RegulatorType.CYSEC, RegulatorType.ASIC],
      minDeposit: 200,
      keyFeatures: ['Social Trading', 'Copy Trading', 'Crypto']
    },
    {
      id: '3',
      name: 'XM Group',
      rating: 4.5,
      spreadsFrom: 0.6,
      regulators: [RegulatorType.FCA, RegulatorType.CYSEC, RegulatorType.ASIC],
      minDeposit: 5,
      keyFeatures: ['No Deposit Fees', 'Education', 'Micro Accounts']
    }
  ], []);
  
  // Create safe collection wrapper for brokers
  const safeBrokers = CollectionManager.validateCollection<Broker>(
    brokers,
    'topBrokers'
  )

  useEffect(() => {
    try {
      const { topRatedBrokers } = dataIntegrationService.getIntegratedBrokerData();
      if (topRatedBrokers && topRatedBrokers.length > 0) {
        setBrokers(topRatedBrokers.slice(0, 3)); // Take top 3 brokers
      } else {
        setBrokers(fallbackBrokers as Broker[]);
      }
    } catch (err) {
      console.error('Error loading broker data:', err);
      setError('Failed to load broker data');
      setBrokers(fallbackBrokers as Broker[]);
    } finally {
      setLoading(false);
    }
  }, [fallbackBrokers]);

  const formatMinDeposit = useCallback((amount: number): string => {
    if (amount === 0) return '$0';
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
    return `$${amount}`;
  }, []);

  const formatSpread = useCallback((spread: number): string => {
    return `${spread} pips`;
  }, []);

  const getRegulationDisplay = useCallback((regulators: RegulatorType[]): string => {
    return regulators.slice(0, 3).join(', ');
  }, []);

  const generateFeatures = useCallback((broker: Broker): string[] => {
    const features: string[] = [];
    
    // Use keyFeatures if available, otherwise generate based on broker data
    if (broker.keyFeatures && broker.keyFeatures.length > 0) {
      return broker.keyFeatures.slice(0, 3);
    }
    
    // Generate features based on broker characteristics
    if (broker.spreadsFrom <= 0.5) features.push('Low Costs');
    if (broker.isRegulated) features.push('Regulated');
    if (broker.minDeposit <= 10) features.push('Low Min Deposit');
    if (broker.maxLeverage >= 500) features.push('High Leverage');
    if (broker.trustScore >= 8) features.push('Trusted');
    
    return features.slice(0, 3);
  }, []);

  if (loading) {
    return (
      <section className="py-20 cosmic-void">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-white/10 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 cosmic-void">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold cosmic-text mb-4">
            Top Rated Brokers 2025
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Compare the highest-rated brokers based on our comprehensive analysis
          </p>
          {error && (
            <p className="text-yellow-400 text-sm mt-2">
              Using fallback data due to loading issues
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {safeBrokers.map((broker, index) => (
            <Card key={broker.id} className="glass-card border-white/10 hover:border-topforex-accent/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-white text-xl">{broker.name}</CardTitle>
                  {index === 0 && (
                    <Badge className="bg-topforex-accent text-white">
                      <Award className="w-3 h-3 mr-1" />
                      #1 Choice
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white ml-1">{broker.rating.toFixed(1)}</span>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white/80">
                    <Shield className="w-3 h-3 mr-1" />
                    {CollectionManager.validateCollection(broker.regulators, 'regulators').toArray()[0] || 'Regulated'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Min Spread</span>
                    <p className="text-white font-semibold">{formatSpread(broker.spreadsFrom)}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Min Deposit</span>
                    <p className="text-white font-semibold">{formatMinDeposit(broker.minDeposit)}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-white/60 text-sm">Key Features</span>
                  <div className="flex flex-wrap gap-1">
                    {CollectionManager.validateCollection(generateFeatures(broker), 'features').map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-white/10 text-white/80">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full bg-topforex-accent hover:bg-topforex-accent/80 text-white"
                  onClick={() => window.location.href = `/broker/${broker.id}`}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/20 text-white hover:bg-white/10 px-8"
            onClick={() => window.location.href = '/brokers'}
          >
            Compare All Brokers
          </Button>
        </div>
      </div>
    </section>
  )
}
