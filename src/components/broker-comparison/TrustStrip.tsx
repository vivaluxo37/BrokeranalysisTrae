import { Shield, CheckCircle, Users, Award, Clock } from 'lucide-react'

export function TrustStrip() {
  const trustIndicators = [
    {
      icon: CheckCircle,
      title: '100+ In-depth Reviews',
      description: 'Comprehensive broker analysis'
    },
    {
      icon: Shield,
      title: 'Regulation Checks',
      description: 'Verified regulatory status'
    },
    {
      icon: Award,
      title: 'Transparent Methodology',
      description: 'Clear scoring criteria'
    },
    {
      icon: Users,
      title: 'User Reviews',
      description: 'Real trader feedback'
    },
    {
      icon: Clock,
      title: 'Daily Updates',
      description: 'Fresh market data'
    }
  ]

  return (
    <section className="py-12 bg-charcoal-grey border-y border-medium-grey">
      <div className="content-container">
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trustIndicators.map((indicator, index) => (
            <li key={index} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-accent-blue/20 rounded-full flex items-center justify-center group-hover:bg-accent-blue/30 transition-colors">
                <indicator.icon className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-xl">{indicator.title}</h3>
              <p className="text-lg text-light-grey">{indicator.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
