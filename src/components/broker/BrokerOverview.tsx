import React, { useState } from 'react';
import { Shield, Users, MapPin, ExternalLink, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StarRating } from '@/components/ui/StarRating';
import { BrokerLogo } from '@/components/ui/BrokerLogo';
import { formatReviewCount } from '../string-formatters';

interface BrokerOverviewProps {
  broker: {
    id: string;
    name: string;
    logo_url: string;
    website: string;
    rating: number;
    review_count: number;
    verified: boolean;
    regulation: string[];
    founded: number;
    headquarters: string;
    description: string;
  };
  ratings: {
    overall: number;
    fees: number;
    safety: number;
    deposit_withdrawal: number;
    account_opening: number;
    mobile_app: number;
    desktop_platform: number;
    product_selection: number;
  };
}

export const BrokerOverview: React.FC<BrokerOverviewProps> = ({
  broker,
  ratings
}) => {
  const [activeTab, setActiveTab] = useState('key-data');

  return (
    <section className="py-12 bg-professional-black">
      <div className="content-container">
        {/* Main Broker Info */}
        <Card className="professional-card mb-8">
          <CardHeader>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <BrokerLogo 
                  src={broker.logo_url}
                  alt={`${broker.name} logo`}
                  size="lg"
                />
                <div>
                  <h2 className="text-3xl font-bold text-pure-white mb-2">
                    {broker.name}
                  </h2>
                  <div className="flex items-center gap-4 mb-2">
                    <StarRating 
                      rating={broker.rating} 
                      showValue 
                      size={20}
                    />
                    <span className="text-light-grey">
                      ({formatReviewCount(broker.review_count)} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {broker.verified && (
                      <Badge variant="default" className="bg-green-600 text-white">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      {broker.regulation.join(', ')}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" size="lg" className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save to Shortlist
                </Button>
                <Button size="lg" className="bg-accent-blue hover:bg-blue-600" asChild>
                  <a href={broker.website} target="_blank" rel="noopener noreferrer">
                    Visit {broker.name}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="professional-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold text-pure-white">Regulated and trusted</p>
                  <p className="text-sm text-light-grey">Tested via live trading</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="professional-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-accent-blue" />
                <div>
                  <p className="font-semibold text-pure-white">246,864 people</p>
                  <p className="text-sm text-light-grey">chose this broker</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="professional-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-8 h-8 text-accent-blue" />
                <div>
                  <p className="font-semibold text-pure-white">Available in</p>
                  <p className="text-sm text-light-grey">United States</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-charcoal-grey">
            <TabsTrigger value="key-data" className="text-xs lg:text-sm">Key data</TabsTrigger>
            <TabsTrigger value="fees" className="text-xs lg:text-sm">Fees</TabsTrigger>
            <TabsTrigger value="safety" className="text-xs lg:text-sm">Safety</TabsTrigger>
            <TabsTrigger value="deposit" className="text-xs lg:text-sm">Deposit</TabsTrigger>
            <TabsTrigger value="account" className="text-xs lg:text-sm">Account</TabsTrigger>
            <TabsTrigger value="mobile" className="text-xs lg:text-sm">Mobile</TabsTrigger>
            <TabsTrigger value="desktop" className="text-xs lg:text-sm">Desktop</TabsTrigger>
            <TabsTrigger value="products" className="text-xs lg:text-sm">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="key-data" className="mt-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-xl text-pure-white">Key Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-light-grey mb-1">Founded</p>
                    <p className="font-semibold text-pure-white">{broker.founded}</p>
                  </div>
                  <div>
                    <p className="text-sm text-light-grey mb-1">Headquarters</p>
                    <p className="font-semibold text-pure-white">{broker.headquarters}</p>
                  </div>
                  <div>
                    <p className="text-sm text-light-grey mb-1">Regulation</p>
                    <p className="font-semibold text-pure-white">{broker.regulation.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-light-grey mb-1">Overall Rating</p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={ratings.overall} size={16} />
                      <span className="font-semibold text-pure-white">{ratings.overall}/5</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-light-grey leading-relaxed">{broker.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees" className="mt-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-xl text-pure-white flex items-center gap-2">
                  Fees
                  <Badge className="bg-green-600 text-white">Score: {ratings.fees}/5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light-grey">
                  Detailed fee information and comparison with other brokers.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add other tab contents as needed */}
        </Tabs>
      </div>
    </section>
  );
};