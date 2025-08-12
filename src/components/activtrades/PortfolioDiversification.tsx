import { DollarSign, PieChart, Flag, Bitcoin, TrendingUp, Zap, FileText } from 'lucide-react'

export function PortfolioDiversification() {
  const assetClasses = [
    {
      icon: DollarSign,
      title: 'Forex',
      instruments: ['EURUSD', 'GBPUSD', 'USDJPY'],
      link: 'all FX pairs',
      color: 'text-green-500'
    },
    {
      icon: PieChart,
      title: 'Shares',
      instruments: ['TESLA M...', 'APPLE', 'META'],
      link: 'all Shares',
      color: 'text-blue-500'
    },
    {
      icon: Flag,
      title: 'Indices',
      instruments: ['US Tech 100', 'Germany 40', 'US Ind 30'],
      link: 'all indices',
      color: 'text-blue-500'
    },
    {
      icon: Bitcoin,
      title: 'Crypto currencies',
      instruments: ['Bitcoin', 'Ethereum', 'Cardano'],
      link: 'all Crypto',
      color: 'text-orange-500'
    },
    {
      icon: TrendingUp,
      title: 'ETFs',
      instruments: ['US Tech 1...', 'SP 500 ETF', 'iShares Tr...'],
      link: 'all ETFs',
      color: 'text-teal-500'
    },
    {
      icon: Zap,
      title: 'Commodities',
      instruments: ['Gold', 'Crude Oil', 'Brent'],
      link: 'all Commodities',
      color: 'text-yellow-500'
    },
    {
      icon: FileText,
      title: 'Bonds',
      instruments: ['Euro Bund', 'Euro BTP', 'Euro Bobl'],
      link: 'all Bonds',
      color: 'text-purple-500'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-section-title text-professional-black mb-4">
            Diversify Your Portfolio<br />
            With 1000+ Instruments Across 7 Asset Classes
          </h2>
        </div>

        {/* Asset Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {assetClasses.map((asset, index) => (
            <div key={index} className="text-center group">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center ${asset.color} group-hover:scale-110 transition-transform duration-300`}>
                  <asset.icon size={32} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-professional-black mb-4">
                {asset.title}
              </h3>

              {/* Instruments */}
              <div className="space-y-2 mb-4">
                {asset.instruments.map((instrument, idx) => (
                  <div key={idx} className="bg-gray-50 rounded px-3 py-2 text-sm text-medium-grey">
                    {instrument}
                  </div>
                ))}
              </div>

              {/* Link */}
              <a 
                href="#" 
                className="text-green-400 hover:text-green-500 transition-colors font-medium inline-flex items-center space-x-1"
              >
                <span>{asset.link}</span>
                <span>→</span>
              </a>
            </div>
          ))}
        </div>

        {/* Investment Promotion Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <h3 className="text-3xl font-bold text-professional-black mb-4">
                Invest in the top Cash<br />
                Indices and Index<br />
                Futures!
              </h3>
              <p className="text-lg text-medium-grey mb-8 leading-relaxed">
                ActivTrades clients can access highly competitive CFDs on global index markets. Invest in US, EU, UK and Chinese indices rather than individual stocks and gain exposure to the entire market. Receive dividends on select instruments!
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-accent-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Start Trading Now
                </button>
                <button className="border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Try a Free Demo
                </button>
              </div>
            </div>

            {/* Right - Featured Trading Cards */}
            <div className="space-y-4">
              {/* Main Featured Card */}
              <div className="bg-blue-600 text-white p-6 rounded-xl">
                <h4 className="text-2xl font-bold mb-2">US TECH ...</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-blue-200 text-sm">Sell</p>
                    <p className="text-xl font-bold">23559.21</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">Buy</p>
                    <p className="text-xl font-bold">23556.96</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-blue-200 text-sm">Change</p>
                    <p className="text-green-400 font-semibold">0.05%</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">Spread</p>
                    <p className="font-semibold">2.25</p>
                  </div>
                </div>
              </div>

              {/* Smaller Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'US TECH 1...', change: '+0.8%' },
                  { name: 'GERMAN...', change: '-0.2%' },
                  { name: 'US IND 30', change: '+1.1%' },
                  { name: 'SP 500', change: '+0.6%' },
                  { name: 'BRAZIL 50', change: '+2.3%' },
                  { name: 'UK 100', change: '-0.1%' }
                ].map((index, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 p-4 rounded-lg">
                    <h5 className="font-semibold text-professional-black text-sm mb-2">{index.name}</h5>
                    <p className={`text-sm font-medium ${index.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {index.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Read More Link */}
              <div className="text-center">
                <a href="#" className="text-green-400 hover:text-green-500 transition-colors font-medium inline-flex items-center space-x-1">
                  <span>Read More</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
