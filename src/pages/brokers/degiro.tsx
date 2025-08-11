import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Award, DollarSign, Globe, Shield, Star, TrendingUp } from 'lucide-react';

const DEGIROReview: React.FC = () => {
  const brokerData = {
    name: 'DEGIRO',
    rating: 3.8,
    reviewCount: 173,
    minDeposit: '$100',
    regulators: ["FCA","CySEC","ASIC"],
    assetClasses: ["Stocks","Forex"],
    platforms: ["Web Platform","Mobile App"],
    description: `DEGIRO is a leading online broker offering comprehensive trading services across multiple asset classes. With competitive pricing and advanced trading tools, DEGIRO serves traders and investors worldwide in 2025.`
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <>
      <Helmet>
        <title>{brokerData.name} Review 2025 - Comprehensive Broker Analysis | BrokerAnalysis</title>
        <meta 
          name="description" 
          content={`Comprehensive DEGIRO review 2025. Expert analysis of fees, platforms, regulation, and trading features. Read our detailed DEGIRO broker review.`} 
        />
        <meta name="keywords" content={`DEGIRO review 2025, DEGIRO broker, DEGIRO trading, online broker review, DEGIRO fees`} />
        <link rel="canonical" href={`https://brokeranalysis.com/brokers/degiro`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`DEGIRO Review 2025 - Expert Broker Analysis`} />
        <meta property="og:description" content={`Detailed DEGIRO review covering fees, platforms, regulation, and trading features. Updated for 2025.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://brokeranalysis.com/brokers/degiro`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`DEGIRO Review 2025`} />
        <meta name="twitter:description" content={`Expert analysis of DEGIRO broker - fees, platforms, and features for 2025.`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            "itemReviewed": {
              "@type": "FinancialService",
              "name": "DEGIRO",
              "description": "DEGIRO is a leading online broker offering comprehensive trading services across multiple asset classes. With competitive pricing and advanced trading tools, DEGIRO serves traders and investors worldwide in 2025."
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": 3.8,
              "bestRating": 5,
              "worstRating": 1
            },
            "author": {
              "@type": "Organization",
              "name": "BrokerAnalysis"
            },
            "datePublished": "2025-01-01",
            "reviewBody": "Comprehensive review of DEGIRO covering all aspects of their trading services, fees, and platform features."
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {brokerData.name} Review 2025
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Comprehensive analysis of {brokerData.name} - Expert review of fees, platforms, and trading features
              </p>
              
              <div className="flex items-center justify-center space-x-6 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="flex">{renderStars(brokerData.rating)}</div>
                  <span className="text-lg font-semibold text-gray-900">{brokerData.rating}/5</span>
                  <span className="text-gray-600">({brokerData.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Minimum Deposit</h3>
              <p className="text-2xl font-bold text-green-600">{brokerData.minDeposit}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Regulation</h3>
              <p className="text-sm text-gray-600">{brokerData.regulators.join(', ')}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Asset Classes</h3>
              <p className="text-sm text-gray-600">{brokerData.assetClasses.length}+ Markets</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Globe className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Platforms</h3>
              <p className="text-sm text-gray-600">{brokerData.platforms.length} Platforms</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Review Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{brokerData.name} Overview</h2>
                <p className="text-gray-700 mb-6">{brokerData.description}</p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <Award className="w-5 h-5 text-green-600 mr-2" />
                        Competitive trading fees and transparent pricing
                      </li>
                      <li className="flex items-center">
                        <Award className="w-5 h-5 text-green-600 mr-2" />
                        Advanced trading platforms and tools
                      </li>
                      <li className="flex items-center">
                        <Award className="w-5 h-5 text-green-600 mr-2" />
                        Strong regulatory compliance and security
                      </li>
                      <li className="flex items-center">
                        <Award className="w-5 h-5 text-green-600 mr-2" />
                        Comprehensive market access and asset coverage
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Trading Platforms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {brokerData.platforms.map((platform, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900">{platform}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Professional trading platform with advanced features
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Available Markets</h3>
                    <div className="flex flex-wrap gap-2">
                      {brokerData.assetClasses.map((asset, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overall Rating</span>
                    <span className="font-semibold">{brokerData.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Deposit</span>
                    <span className="font-semibold">{brokerData.minDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Regulation</span>
                    <span className="font-semibold">{brokerData.regulators[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded</span>
                    <span className="font-semibold">2025</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Start Trading with {brokerData.name}</h3>
                <p className="text-blue-100 mb-4">
                  Join thousands of traders who trust {brokerData.name} for their trading needs.
                </p>
                <button className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Open Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DEGIROReview;
