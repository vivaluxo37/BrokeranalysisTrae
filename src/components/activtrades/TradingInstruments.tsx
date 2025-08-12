import { useState } from 'react'
import { Search, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function TradingInstruments() {
  const [activeTab, setActiveTab] = useState('Popular')
  
  const tabs = ['Popular', 'Forex', 'Shares', 'Indices', 'Crypto currencies', 'ETFs', 'Commodities', 'Bonds']
  
  const cryptoData = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: '₿',
      sellPrice: '118666.61',
      buyPrice: '118734.61',
      change: '-0.03%',
      spread: '68',
      isPositive: false,
      color: 'orange'
    },
    {
      name: 'Ethereum', 
      symbol: 'ETH',
      icon: 'Ξ',
      sellPrice: '4292.49',
      buyPrice: '4295.59',
      change: '1.73%',
      spread: '3.1',
      isPositive: true,
      color: 'gray'
    },
    {
      name: 'Cardano',
      symbol: 'ADA', 
      icon: '₳',
      sellPrice: '0.7709',
      buyPrice: '0.7809',
      change: '0.18%',
      spread: '0.01',
      isPositive: true,
      color: 'blue'
    },
    {
      name: 'Doge',
      symbol: 'DOGE',
      icon: 'Ð',
      sellPrice: '0.22325',
      buyPrice: '0.22525',
      change: '-0.37%',
      spread: '0.002',
      isPositive: false,
      color: 'yellow'
    },
    {
      name: 'Litecoin',
      symbol: 'LTC',
      icon: 'Ł',
      sellPrice: '119.39',
      buyPrice: '120.20',
      change: '-0.63%',
      spread: '0.81',
      isPositive: false,
      color: 'blue'
    },
    {
      name: 'Bitcoin Cash',
      symbol: 'BCH',
      icon: '₿',
      sellPrice: '589.66',
      buyPrice: '595.46',
      change: '2.16%',
      spread: '5.8',
      isPositive: true,
      color: 'green'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-section-title text-professional-black mb-4">
            Trade 1000s of Instruments<br />
            With Unbeatable Spreads
          </h2>
          <p className="text-lg text-medium-grey max-w-4xl mx-auto">
            Trade <span className="text-accent-blue">Forex, Indices, Commodities, Shares, Cryptocurrencies</span> and more. 24/7 support, fast execution and deep liquidity
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-professional-black mb-2">No Requotes</h3>
            <p className="text-medium-grey text-sm">We strive to provide the best possible execution</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-professional-black mb-2">Ultra-Fast Execution</h3>
            <p className="text-medium-grey text-sm">Average trade execution times of under 0.004 seconds</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-professional-black mb-2">Transparent Pricing</h3>
            <p className="text-medium-grey text-sm">What you see is what you get, with no hidden commissions*</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-professional-black mb-2">Unbeatable Spreads</h3>
            <p className="text-medium-grey text-sm">Trade hundreds of Forex CFDs with spreads starting from 0.5 pips</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-medium-grey w-5 h-5" />
            <Input 
              placeholder="Search"
              className="pl-12 py-4 text-lg border-medium-grey focus:border-accent-blue"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-100 text-medium-grey hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Crypto Trading Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cryptoData.map((crypto, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-${crypto.color}-500`}>
                  {crypto.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-professional-black">{crypto.name}</h3>
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-medium-grey">Sell</p>
                  <p className="font-bold text-lg text-professional-black">{crypto.sellPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-medium-grey">Buy</p>
                  <p className="font-bold text-lg text-accent-blue">{crypto.buyPrice}</p>
                </div>
              </div>

              {/* Change and Spread */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-medium-grey">Change</p>
                  <p className={`font-semibold ${crypto.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.change} {crypto.isPositive ? '▲' : '▼'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-medium-grey">Spread</p>
                  <p className="font-semibold text-professional-black">{crypto.spread}</p>
                </div>
              </div>

              {/* Mini Chart Placeholder */}
              <div className="h-16 bg-gray-50 rounded mb-4 flex items-center justify-center">
                <div className="w-full h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded opacity-50"></div>
              </div>

              {/* Trade Button */}
              <Button className="w-full bg-accent-blue hover:bg-blue-700 text-white">
                Trade Now
              </Button>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-medium-grey mb-8">
          *The pricing is for indicative purposes only. Please go to individual instrument specifications to see the trading conditions.
        </p>

        {/* Bottom CTAs */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button size="lg" className="bg-accent-blue hover:bg-blue-700 text-white px-8">
            Start Trading Now
          </Button>
          <Button size="lg" variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white px-8">
            Try a Free Demo
          </Button>
        </div>
      </div>
    </section>
  )
}

// Import ShieldCheck at the top
import { ShieldCheck } from 'lucide-react'
