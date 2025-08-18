import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Award, Users, TrendingUp } from 'lucide-react';

export function BrokerAnalysisHero() {
  const trustMetrics = [
    { icon: ShieldCheck, label: 'Regulation verified', value: '50+ regulators' },
    { icon: Award, label: 'Brokers analyzed', value: '100+' },
    { icon: Users, label: 'Traders helped', value: '10K+' },
    { icon: TrendingUp, label: 'Reviews published', value: '500+' },
  ];

  return (
    <section className="relative bg-professional-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1586448681913-2fc1b29c5cca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHx0cmFkaW5nJTIwZGFzaGJvYXJkJTIwY2hhcnRzJTIwZmluYW5jaWFsJTIwZ3JhcGhzfGVufDB8MHx8Ymx1ZXwxNzU1NTAyNDUxfDA&ixlib=rb-4.1.0&q=85"
          alt="Professional financial trading dashboard with charts and graphs, modern dark theme, trading interface - KOBU Agency on Unsplash"
          className="w-full h-full object-cover opacity-20"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-professional-black via-professional-black/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full px-6 lg:px-12">
        <div className="professional-hero">
          <div className="max-w-4xl">
            {/* Main Headline */}
            <h1 className="text-hero text-pure-white mb-6 leading-tight">
              Independent Broker Reviews & Comparisons for{' '}
              <span className="text-accent-blue">Forex, Stocks, Crypto & CFDs</span>
            </h1>

            {/* Subtext with Trust Metrics */}
            <p className="text-subtitle mb-8 max-w-2xl">
              Make informed trading decisions with our comprehensive broker analysis. 
              We've analyzed 100+ brokers across 50+ regulators to help you find the perfect trading partner.
            </p>

            {/* Trust Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {trustMetrics.map((metric, index) => (
                <div key={index} className="flex items-center space-x-2 text-light-grey">
                  <metric.icon className="w-5 h-5 text-accent-blue" />
                  <div>
                    <div className="text-sm font-medium text-pure-white">{metric.value}</div>
                    <div className="text-xs">{metric.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                asChild
                size="lg" 
                className="btn-professional-primary text-lg px-8 py-4"
              >
                <Link to="/wizard">Find My Broker</Link>
              </Button>
              <Button 
                asChild
                variant="secondary" 
                size="lg"
                className="btn-professional-secondary text-lg px-8 py-4"
              >
                <Link to="/compare">Compare Brokers</Link>
              </Button>
            </div>

            {/* Secondary CTA */}
            <div className="mb-8">
              <Link 
                to="#top-brokers" 
                className="text-accent-blue hover:text-accent-blue/80 font-medium transition-colors"
              >
                View Top Rated Brokers →
              </Link>
            </div>

            {/* Trust Badge Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-text">
              <Badge variant="outline" className="border-medium-grey text-light-grey">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Methodology
              </Badge>
              <Badge variant="outline" className="border-medium-grey text-light-grey">
                Data updated daily
              </Badge>
              <Badge variant="outline" className="border-medium-grey text-light-grey">
                Affiliate disclosure
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-accent-blue/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-accent-blue/5 to-transparent rounded-full blur-2xl" />
    </section>
  );
}