import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function CosmicHeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  return (
    <section className="hero-padding cosmic-void gradient-hero" aria-labelledby="hero-heading">
      <div className="container mx-auto container-padding text-center">
        {/* SEO-optimized heading structure */}
        <header className="mb-16 animate-fade-in">
          <h1 id="hero-heading" className="text-hero cosmic-text mb-6 text-glow">
            AI-Driven Broker Comparison & Matching
          </h1>
          <h2 className="text-2xl md:text-3xl neural-text mb-8 max-w-5xl mx-auto leading-relaxed">
            Compare 500+ Regulated Brokers • 2.5M+ Reviews • Personalized Matches
          </h2>
          <p className="text-xl neural-text max-w-4xl mx-auto leading-relaxed mb-12">
            Discover the best trading brokers with our AI-powered analysis, expert reviews, 
            and real-time data. Join millions of traders who trust our platform for honest 
            broker comparisons and personalized recommendations.
          </p>
        </header>

        {/* Intelligent Broker Matching Section */}
        <div className="max-w-4xl mx-auto mb-16 animate-slide-up">
          <div className="glass-card p-8 cosmic-glow">
            <h3 className="text-2xl font-bold cosmic-text mb-6">
              Intelligent Broker Matching
            </h3>
            <p className="neural-text mb-6">
              What's your trading style?
            </p>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Search brokers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass-card bg-white/5 border-white/10 text-white placeholder:text-white/60 h-12 rounded-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="glass-card bg-white/5 border-white/10 text-white h-12 rounded-lg">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      <SelectItem value="forex">Forex Trading</SelectItem>
                      <SelectItem value="stocks">Stock Trading</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="options">Options Trading</SelectItem>
                      <SelectItem value="day-trading">Day Trading</SelectItem>
                      <SelectItem value="beginners">Beginner Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  type="submit"
                  size="lg"
                  className="bg-topforex-accent hover:bg-topforex-accent/80 text-white px-12 h-12 rounded-lg font-semibold"
                >
                  Get Matched
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Key stats with social proof */}
        <div className="grid md:grid-cols-4 gap-8 animate-scale-in">
          {[
            { value: '2.5M+', label: 'Traders Reviewed', description: 'Active users who found their perfect broker' },
            { value: '500+', label: 'Regulated Brokers', description: 'All brokers are regulatory compliant' },
            { value: '4.9/5', label: 'Trust Score', description: 'Based on 50,000+ user reviews' },
            { value: '15+', label: 'Years Experience', description: 'Combined team expertise in financial markets' }
          ].map((stat, index) => (
            <div key={index} className="text-center floating-node" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="text-4xl font-bold cosmic-text mb-2 text-glow">{stat.value}</div>
              <div className="text-topforex-accent font-semibold mb-1">{stat.label}</div>
              <div className="neural-text text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
