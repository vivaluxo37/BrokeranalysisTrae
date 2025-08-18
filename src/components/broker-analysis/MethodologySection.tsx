import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { Shield, FileCheck, Monitor, Headphones, TrendingUp, Award } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export function MethodologySection() {
  const methodologyItems = [
    {
      icon: Shield,
      title: 'Regulation Checks',
      description: 'We verify regulatory status with 50+ financial authorities worldwide',
      metric: '50+ Regulators',
      color: '#3b82f6'
    },
    {
      icon: FileCheck,
      title: 'Fee Transparency',
      description: 'Comprehensive analysis of all trading costs, spreads, and hidden fees',
      metric: '100+ Fee Types',
      color: '#10b981'
    },
    {
      icon: Monitor,
      title: 'Platform Testing',
      description: 'Hands-on testing of trading platforms, tools, and execution quality',
      metric: '25+ Platforms',
      color: '#f59e0b'
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Real-world testing of support quality, response times, and availability',
      metric: '24/7 Testing',
      color: '#ef4444'
    }
  ];

  const trustScoreData = [
    { name: 'Regulation', value: 30, color: '#3b82f6' },
    { name: 'Fees', value: 25, color: '#10b981' },
    { name: 'Platform', value: 20, color: '#f59e0b' },
    { name: 'Support', value: 15, color: '#ef4444' },
    { name: 'Execution', value: 10, color: '#8b5cf6' }
  ];

  const analysisData = [
    { category: 'Regulation', score: 95 },
    { category: 'Fees', score: 88 },
    { category: 'Platform', score: 92 },
    { category: 'Support', score: 85 },
    { category: 'Execution', score: 90 }
  ];

  return (
    <section className="professional-section bg-professional-black">
      <div className="w-full px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-section-title text-pure-white mb-4">
            Why We're Different
          </h2>
          <p className="text-subtitle max-w-3xl mx-auto">
            Our methodology combines rigorous testing, regulatory verification, and real-world analysis 
            to provide you with the most accurate and comprehensive broker reviews in the industry.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Methodology Items */}
          <div className="space-y-6">
            {methodologyItems.map((item, index) => (
              <Card key={index} className="professional-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <item.icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-pure-white mb-2">{item.title}</h3>
                      <p className="text-muted-text mb-3">{item.description}</p>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-accent-blue" />
                        <span className="text-sm font-medium text-accent-blue">{item.metric}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Score Visualization */}
          <div className="space-y-6">
            <Card className="professional-card">
              <CardContent className="p-6">
                <h3 className="font-semibold text-pure-white mb-4 text-center">
                  Trust Score Breakdown
                </h3>
                <ChartContainer className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trustScoreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {trustScoreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a1a', 
                          border: '1px solid #404040',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {trustScoreData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-light-grey">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="professional-card">
              <CardContent className="p-6">
                <h3 className="font-semibold text-pure-white mb-4">
                  Sample Analysis Scores
                </h3>
                <div className="space-y-4">
                  {analysisData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-light-grey">{item.category}</span>
                        <span className="text-pure-white font-medium">{item.score}/100</span>
                      </div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Methodology Image */}
        <div className="relative mb-12">
          <Card className="professional-card overflow-hidden">
            <div className="relative h-64 md:h-80">
              <img
                src="https://images.unsplash.com/photo-1593407089396-93f0c7a575f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxhbmFseXNpcyUyMGRhdGElMjB2ZXJpZmljYXRpb24lMjBzZWN1cml0eXxlbnwwfDB8fGJsdWV8MTc1NTUwMjQ1MXww&ixlib=rb-4.1.0&q=85"
                alt="Abstract illustration showing data analysis, verification checkmarks, security elements - Riku Lu on Unsplash"
                className="w-full h-full object-cover"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-professional-black/80 via-transparent to-professional-black/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-accent-blue mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-pure-white mb-2">
                    Data-Driven Analysis
                  </h3>
                  <p className="text-light-grey max-w-md">
                    Every broker review is backed by comprehensive data analysis and real-world testing
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Brokers Analyzed', value: '100+' },
            { label: 'Regulators Tracked', value: '50+' },
            { label: 'Data Points', value: '1000+' },
            { label: 'Reviews Published', value: '500+' }
          ].map((stat, index) => (
            <Card key={index} className="professional-card text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-accent-blue mb-1">{stat.value}</div>
                <div className="text-sm text-muted-text">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white">
            Learn More About Our Methodology
          </Button>
        </div>
      </div>
    </section>
  );
}