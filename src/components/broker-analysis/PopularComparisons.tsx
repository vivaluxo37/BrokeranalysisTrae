import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Calculator, BarChart3, PieChart, Target, Zap } from 'lucide-react';

interface PopularComparison {
  title: string;
  slug: string;
  description: string;
}

interface PopularComparisonsProps {
  comparisons: PopularComparison[];
}

export function PopularComparisons({ comparisons }: PopularComparisonsProps) {
  const tools = [
    {
      icon: Calculator,
      title: 'Fee Calculator',
      description: 'Calculate and compare trading costs across different brokers',
      href: '/tools/fee-calculator',
      color: '#3b82f6'
    },
    {
      icon: BarChart3,
      title: 'Leverage Calculator',
      description: 'Calculate margin requirements and position sizes',
      href: '/tools/leverage-calculator',
      color: '#10b981'
    },
    {
      icon: PieChart,
      title: 'Correlation Matrix',
      description: 'Analyze correlations between different trading instruments',
      href: '/tools/correlation-matrix',
      color: '#f59e0b'
    },
    {
      icon: Target,
      title: 'Position Calculator',
      description: 'Calculate optimal position sizes based on risk tolerance',
      href: '/tools/position-calculator',
      color: '#ef4444'
    },
    {
      icon: TrendingUp,
      title: 'Economic Calendar',
      description: 'Track important economic events and market announcements',
      href: '/tools/economic-calendar',
      color: '#8b5cf6'
    },
    {
      icon: Zap,
      title: 'Spread Comparison',
      description: 'Compare real-time spreads across multiple brokers',
      href: '/tools/spread-comparison',
      color: '#06b6d4'
    }
  ];

  return (
    <section className="professional-section bg-charcoal-grey">
      <div className="w-full px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Popular Comparisons */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-pure-white mb-4">
                Popular Comparisons
              </h2>
              <p className="text-muted-text">
                See how top brokers stack up against each other in detailed side-by-side comparisons.
              </p>
            </div>

            <div className="space-y-4">
              {comparisons.map((comparison, index) => (
                <Card key={index} className="professional-card group hover:border-accent-blue/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-pure-white mb-2 group-hover:text-accent-blue transition-colors">
                          {comparison.title}
                        </h3>
                        <p className="text-sm text-muted-text mb-3">
                          {comparison.description}
                        </p>
                        <Badge variant="outline" className="text-xs border-medium-grey text-light-grey">
                          Updated recently
                        </Badge>
                      </div>
                      <Button asChild variant="ghost" size="icon" className="ml-4">
                        <Link to={`/comparison/${comparison.slug}`}>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link to="/comparisons">
                  View All Comparisons
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Tools & Calculators */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-pure-white mb-4">
                Tools & Calculators
              </h2>
              <p className="text-muted-text">
                Professional trading tools to help you make informed decisions and optimize your trading strategy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool, index) => (
                <Card key={index} className="professional-card group hover:border-accent-blue/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${tool.color}20` }}
                      >
                        <tool.icon className="w-5 h-5" style={{ color: tool.color }} />
                      </div>
                      <CardTitle className="text-base text-pure-white group-hover:text-accent-blue transition-colors">
                        {tool.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-text mb-4">
                      {tool.description}
                    </p>
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <Link to={tool.href}>
                        Use Tool
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link to="/tools">
                  View All Tools
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Comparison CTA */}
        <div className="mt-16">
          <Card className="professional-card bg-gradient-to-r from-charcoal-grey to-medium-grey/20 border-accent-blue/20">
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-12 h-12 text-accent-blue mx-auto mb-4" />
              <h3 className="text-xl font-bold text-pure-white mb-2">
                Need a Custom Comparison?
              </h3>
              <p className="text-muted-text mb-6 max-w-2xl mx-auto">
                Can't find the comparison you're looking for? Use our advanced comparison tool 
                to create a custom side-by-side analysis of any brokers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-accent-blue hover:bg-accent-blue/90">
                  <Link to="/compare/tool">
                    Create Custom Comparison
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/request-comparison">
                    Request Comparison
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}