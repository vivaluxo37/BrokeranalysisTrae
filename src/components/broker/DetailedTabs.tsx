import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const DetailedTabs = ({ broker, ratings, feeFeatures, safetyFeatures, depositFeatures, accountFeatures, mobileFeatures, desktopFeatures, productsFeatures }) => {
  return (
    <section className="py-12 bg-charcoal-grey">
      <div className="content-container">
        <Tabs defaultValue="fees" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-professional-black">
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="fees" className="mt-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-xl text-pure-white flex items-center gap-2">
                  Fees
                  <Badge className="bg-green-600 text-white">Score: {ratings.fees}/5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light-grey mb-6">
                  {broker.name} has low trading fees and competitive pricing across all asset classes.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(feeFeatures || []).map((feature) => (
                    <div key={feature.feature_key}>
                      <h4 className="font-semibold text-pure-white mb-3">{feature.feature_key}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-medium-grey">
                          <span className="text-light-grey">{feature.feature_key}</span>
                          <span className="font-medium text-pure-white">{feature.feature_value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety" className="mt-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-xl text-pure-white flex items-center gap-2">
                  Safety
                  <Badge className="bg-green-600 text-white">Score: {ratings.safety}/5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light-grey mb-4">
                  {broker.name} is regulated by top-tier financial authorities and provides strong investor protection.
                </p>
                <div className="space-y-3">
                  {(safetyFeatures || []).map((feature) => (
                    <div className="flex items-center gap-3" key={feature.feature_key}>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-pure-white">{feature.feature_value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-xl text-pure-white flex items-center gap-2">
                  Account Types
                  <Badge className="bg-green-600 text-white">Score: {ratings.account}/5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light-grey mb-6">
                  Ally Invest offers flexible account options with no minimum deposit requirements for most account types.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(accountFeatures || []).map((feature) => (
                    <div key={feature.feature_key}>
                      <h4 className="font-semibold text-pure-white mb-3">{feature.feature_key}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-medium-grey">
                          <span className="text-light-grey">{feature.feature_key}</span>
                          <span className="font-medium text-pure-white">{feature.feature_value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposit" className="mt-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-xl text-pure-white flex items-center gap-2">
                  Deposit & Funding
                  <Badge className="bg-green-600 text-white">Score: {ratings.deposit}/5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light-grey mb-6">
                  Multiple funding options with seamless integration between Ally Bank and Ally Invest accounts.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(depositFeatures || []).map((feature) => (
                    <div key={feature.feature_key}>
                      <h4 className="font-semibold text-pure-white mb-3">{feature.feature_key}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-medium-grey">
                          <span className="text-light-grey">{feature.feature_key}</span>
                          <span className="font-medium text-pure-white">{feature.feature_value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mobile" className="mt-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-xl text-pure-white flex items-center gap-2">
                  Mobile Trading App
                  <Badge className="bg-yellow-600 text-white">Score: {ratings.mobile}/5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light-grey mb-6">
                  Ally's unified mobile app combines banking and investing in one platform with essential trading features.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(mobileFeatures || []).map((feature) => (
                    <div key={feature.feature_key}>
                      <h4 className="font-semibold text-pure-white mb-3">{feature.feature_key}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-medium-grey">
                          <span className="text-light-grey">{feature.feature_key}</span>
                          <span className="font-medium text-pure-white">{feature.feature_value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="desktop" className="mt-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-xl text-pure-white flex items-center gap-2">
                  Desktop Platform
                  <Badge className="bg-yellow-600 text-white">Score: {ratings.desktop}/5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light-grey mb-6">
                  Web-based trading platform focused on simplicity and ease of use for buy-and-hold investors.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(desktopFeatures || []).map((feature) => (
                    <div key={feature.feature_key}>
                      <h4 className="font-semibold text-pure-white mb-3">{feature.feature_key}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-medium-grey">
                          <span className="text-light-grey">{feature.feature_key}</span>
                          <span className="font-medium text-pure-white">{feature.feature_value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-xl text-pure-white flex items-center gap-2">
                  Trading Products
                  <Badge className="bg-green-600 text-white">Score: {ratings.products}/5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light-grey mb-6">
                  Comprehensive selection of investment products with strong fixed-income offerings and commission-free trading.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(productsFeatures || []).map((feature) => (
                    <div key={feature.feature_key}>
                      <h4 className="font-semibold text-pure-white mb-3">{feature.feature_key}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-medium-grey">
                          <span className="text-light-grey">{feature.feature_key}</span>
                          <span className="font-medium text-pure-white">{feature.feature_value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};