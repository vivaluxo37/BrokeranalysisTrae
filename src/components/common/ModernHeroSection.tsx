import { useState } from 'react'
import { Calculator, CheckCircle, Search, Shield, Star, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

export function ModernHeroSection() {
  const [tradingInstrument, setTradingInstrument] = useState('')
  const [location, setLocation] = useState('')
  const [email, setEmail] = useState('')

  const trustMetrics = [
    { icon: Users, value: '2.5M+', label: 'Traders Served' },
    { icon: Shield, value: '500+', label: 'Verified Brokers' },
    { icon: Star, value: '4.9/5', label: 'User Rating' },
    { icon: TrendingUp, value: '15+', label: 'Years Experience' }
  ]

  const features = [
    {
      icon: Shield,
      title: 'Regulatory Verified',
      description: 'Only licensed brokers from top-tier authorities'
    },
    {
      icon: Calculator,
      title: 'Advanced Tools',
      description: 'Comprehensive trading calculators and analysis'
    },
    {
      icon: Users,
      title: 'Expert Reviews',
      description: '30-day comprehensive broker evaluation process'
    }
  ]

  return (
    <section className="relative min-h-screen flex items-center gradient-hero gradient-mesh overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 aurora-bg opacity-30"></div>
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBjaGFydHMlMjB0ZWNobm9sb2d5JTIwZGF0YSUyMGFic3RyYWN0fGVufDB8MHx8Ymx1ZXwxNzU0NTIyMDA1fDA&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      <div className="container mx-auto container-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-3 glass-card px-6 py-3 interactive-hover">
              <div className="w-10 h-10 bg-topforex-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">96</span>
              </div>
              <div>
                <span className="text-white font-semibold">Express Choice</span>
                <div className="text-topforex-muted text-sm">Full Online Verification</div>
              </div>
            </div>

            {/* Main Headline */}
            <header className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight">
                Find the
                <span className="text-gradient block">Perfect Broker</span>
                for Your Trading Journey
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                Join 2.5M+ traders who trust our AI-powered broker matching system. 
                Compare 500+ regulated brokers with expert analysis, real user reviews, 
                and comprehensive trading tools.
              </p>
            </header>

            {/* Trust Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustMetrics.map((metric, index) => (
                <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-12 h-12 bg-topforex-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <metric.icon className="w-6 h-6 text-topforex-accent" />
                  </div>
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="btn-topforex-primary text-lg px-8 py-4 interactive-hover"
                onClick={() => document.getElementById('broker-finder')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Search className="w-5 h-5 mr-2" />
                Find My Broker
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white/20 hover:bg-white/10 text-lg px-8 py-4"
              >
                View All Brokers
              </Button>
            </div>
          </div>

          {/* Right Content - Broker Finder Card */}
          <div className="animate-slide-up">
            <Card className="glass-card p-8 interactive-hover">
              <CardContent className="p-0">
                <div className="space-y-6">
                  <header className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Intelligent Broker Matching
                    </h2>
                    <p className="text-gray-300">
                      Answer a few questions to get personalized broker recommendations
                    </p>
                  </header>

                  <div id="broker-finder" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">
                        What do you want to trade?
                      </label>
                      <Select value={tradingInstrument} onValueChange={setTradingInstrument}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select trading instruments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="forex">Forex</SelectItem>
                          <SelectItem value="stocks">Stocks</SelectItem>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                          <SelectItem value="commodities">Commodities</SelectItem>
                          <SelectItem value="indices">Indices</SelectItem>
                          <SelectItem value="all">All Instruments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">
                        Your Location
                      </label>
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="eu">European Union</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full btn-topforex-primary text-lg py-4 interactive-hover">
                      <Search className="w-5 h-5 mr-2" />
                      Get My Broker Matches
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-topforex-accent" />
                      <span className="text-white text-xs">Regulated Only</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-topforex-accent" />
                      <span className="text-white text-xs">100% Free</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-topforex-accent" />
                      <span className="text-white text-xs">Expert Verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card topforex-card-hover animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-topforex-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-topforex-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}