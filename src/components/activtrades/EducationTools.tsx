import { Video, BarChart3, FileText, Bell } from 'lucide-react'

export function EducationTools() {
  const tools = [
    {
      icon: Video,
      title: 'Weekly Webinars',
      description: 'Join our expert-led webinars',
      bgColor: 'bg-professional-black',
      textColor: 'text-white',
      iconColor: 'text-white'
    },
    {
      icon: BarChart3,
      title: 'Daily Market Analysis',
      description: 'Professional market insights',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      iconColor: 'text-white'
    },
    {
      icon: FileText,
      title: 'Weekly outlook',
      description: 'Market forecasts and trends',
      bgColor: 'bg-green-500',
      textColor: 'text-white',
      iconColor: 'text-white'
    },
    {
      icon: Bell,
      title: 'Price Movers & Alerts',
      description: 'Real-time market notifications',
      bgColor: 'bg-gray-700',
      textColor: 'text-white',
      iconColor: 'text-white'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-section-title text-professional-black mb-4">
            Make the Most of Every Single Trade
          </h2>
          <p className="text-xl text-medium-grey">
            With Award-Winning Education, Research and Analysis Tools
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className={`${tool.bgColor} ${tool.textColor} p-8 rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer group relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-current"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border border-current"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center ${tool.iconColor}`}>
                    <tool.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">{tool.title}</h3>
                </div>
                <p className="text-lg opacity-90">{tool.description}</p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}