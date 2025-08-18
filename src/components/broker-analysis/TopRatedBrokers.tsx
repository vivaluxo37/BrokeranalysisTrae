import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, Shield, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

interface Broker {
  id: string;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  trustScore: number;
  minDeposit: number;
  spreads: {
    eurusd: number;
    gbpusd: number;
    usdjpy: number;
  };
  instruments: number;
  regulators: string[];
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  isPromoted: boolean;
}

interface TopRatedBrokersProps {
  brokers: Broker[];
}

export function TopRatedBrokers({ brokers }: TopRatedBrokersProps) {
  const [comparedBrokers, setComparedBrokers] = useState<string[]>([]);

  const handleCompare = (brokerId: string) => {
    if (comparedBrokers.includes(brokerId)) {
      setComparedBrokers(comparedBrokers.filter(id => id !== brokerId));
    } else if (comparedBrokers.length < 3) {
      setComparedBrokers([...comparedBrokers, brokerId]);
    }
  };

  const formatRegulator = (reg: string) => {
    const regulatorMap: Record<string, string> = {
      'fca': 'FCA',
      'asic': 'ASIC',
      'cysec': 'CySEC',
      'sec': 'SEC',
      'finra': 'FINRA',
      'nfa': 'NFA'
    };
    return regulatorMap[reg] || reg.toUpperCase();
  };

  return (
    <section id="top-brokers" className="professional-section bg-charcoal-grey">
      <div className="w-full px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-section-title text-pure-white mb-4">
            Top Rated Brokers
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Our highest-rated brokers based on comprehensive analysis of fees, platforms, 
            regulation, and customer satisfaction.
          </p>
        </div>

        {/* Brokers Carousel */}
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {brokers.map((broker) => (
              <CarouselItem key={broker.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="professional-card h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={broker.logo}
                          alt={`${broker.name} logo`}
                          className="w-12 h-12 rounded-lg object-cover"
                          style={{ width: '48px', height: '48px' }}
                        />
                        <div>
                          <CardTitle className="text-lg text-pure-white">{broker.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-pure-white">
                                {broker.rating.toFixed(1)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Shield className="w-4 h-4 text-accent-blue" />
                              <span className="text-sm text-light-grey">
                                {broker.trustScore}/100
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {broker.isPromoted && (
                        <Badge className="bg-accent-blue text-white text-xs">
                          Promoted
                        </Badge>
                      )}
                    </div>

                    {/* Regulators */}
                    <div className="flex flex-wrap gap-1">
                      {broker.regulators.slice(0, 3).map((reg) => (
                        <Badge key={reg} variant="outline" className="text-xs border-medium-grey text-light-grey">
                          {formatRegulator(reg)}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-text">Min Deposit</div>
                        <div className="font-medium text-pure-white">
                          {broker.minDeposit === 0 ? 'No minimum' : `$${broker.minDeposit.toLocaleString()}`}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-text">Instruments</div>
                        <div className="font-medium text-pure-white">
                          {broker.instruments.toLocaleString()}+
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-text">EUR/USD Spread</div>
                        <div className="font-medium text-pure-white">
                          {broker.spreads.eurusd} pips
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-text">Platform</div>
                        <div className="font-medium text-pure-white">Web, Mobile</div>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div>
                      <h4 className="text-sm font-medium text-light-grey mb-2">Key Features</h4>
                      <ul className="space-y-1">
                        {broker.keyFeatures.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-muted-text">
                            <CheckCircle className="w-3 h-3 text-accent-blue mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pros */}
                    <div>
                      <h4 className="text-sm font-medium text-light-grey mb-2">Pros</h4>
                      <ul className="space-y-1">
                        {broker.pros.slice(0, 2).map((pro, index) => (
                          <li key={index} className="flex items-center text-sm text-muted-text">
                            <div className="w-1 h-1 bg-accent-blue rounded-full mr-2 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-4">
                      <Button
                        variant={comparedBrokers.includes(broker.id) ? "default" : "secondary"}
                        size="sm"
                        onClick={() => handleCompare(broker.id)}
                        disabled={!comparedBrokers.includes(broker.id) && comparedBrokers.length >= 3}
                        className="flex-1"
                      >
                        {comparedBrokers.includes(broker.id) ? 'Remove' : 'Compare'}
                      </Button>
                      <Button asChild size="sm" className="flex-1">
                        <Link to={`/brokers/${broker.slug}`}>
                          Read Review
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* Compare Bar */}
        {comparedBrokers.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
            <Card className="bg-charcoal-grey border-medium-grey shadow-lg">
              <CardContent className="flex items-center space-x-4 p-4">
                <div className="text-sm text-pure-white">
                  {comparedBrokers.length} broker{comparedBrokers.length > 1 ? 's' : ''} selected
                </div>
                <Button asChild size="sm" className="bg-accent-blue hover:bg-accent-blue/90">
                  <Link to={`/compare?brokers=${comparedBrokers.join(',')}`}>
                    Compare Now
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link to="/brokers">
              View All Brokers
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}