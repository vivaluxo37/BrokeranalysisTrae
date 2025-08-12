import { Trophy, Calendar, Users, ShieldCheck } from 'lucide-react'

export function WhyActivTrades() {
  const features = [
    {
      icon: Trophy,
      title: "Award-Winning",
      description: "20+ International Awards",
      link: "All Awards",
      color: "text-blue-400"
    },
    {
      icon: Calendar,
      title: "More Than 20 Years of Excellence", 
      description: "Since 2001 we've been offering our traders the best possible conditions",
      link: "History of ActivTrades",
      color: "text-blue-400"
    },
    {
      icon: Users,
      title: "100k+ Traders",
      description: "ActivTrades serves traders in 170+ countries",
      link: "Why Us",
      color: "text-green-400"
    },
    {
      icon: ShieldCheck,
      title: "Enhanced Protection of Funds",
      description: "Our clients' funds are insured up to $1,000,000",
      link: "Funds Protection",
      color: "text-blue-400"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-section-title text-accent-blue mb-4">
            Why ActivTrades?
          </h2>
          <div className="flex justify-center">
            <a href="#" className="text-green-400 hover:text-green-500 transition-colors font-medium flex items-center space-x-2">
              <span>About Us</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={32} />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-professional-black mb-3">
                {feature.title}
              </h3>
              <p className="text-medium-grey mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Link */}
              <a 
                href="#" 
                className="text-green-400 hover:text-green-500 transition-colors font-medium inline-flex items-center space-x-1"
              >
                <span>{feature.link}</span>
                <span>→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
