import { Award, Shield, Star, Users } from 'lucide-react'

export function TrustedTradersSection() {
  return (
    <section className="section-padding cosmic-void" aria-labelledby="trusted-heading">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-16">
          <h2 id="trusted-heading" className="text-section-title cosmic-text mb-6 text-glow">
            Trusted by Professional Traders Worldwide
          </h2>
          <p className="text-xl neural-text max-w-3xl mx-auto">
            Join millions of traders who trust our platform for honest broker reviews, 
            comprehensive comparisons, and expert market insights.
          </p>
        </header>

        {/* Trust Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Users, number: "2.5M+", label: "Traders Helped", description: "Active users who found their perfect broker" },
            { icon: Shield, number: "500+", label: "Verified Brokers", description: "All brokers are regulatory compliant" },
            { icon: Award, number: "15+", label: "Years Experience", description: "Combined team expertise in financial markets" },
            { icon: Star, number: "4.9/5", label: "User Rating", description: "Based on 50,000+ user reviews" }
          ].map((stat, index) => (
            <div key={index} className="text-center floating-node" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center mx-auto mb-4 cosmic-glow">
                <stat.icon className="w-8 h-8 text-topforex-accent" />
              </div>
              <div className="text-3xl font-bold cosmic-text mb-2 text-glow">{stat.number}</div>
              <div className="text-topforex-accent font-semibold mb-1">{stat.label}</div>
              <div className="neural-text text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}