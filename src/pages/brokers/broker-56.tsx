import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { CheckCircle, DollarSign, ExternalLink, Globe, Mail, Phone, Shield, Star, TrendingUp } from 'lucide-react';

const BDSwissReview: React.FC = () => {
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
        <title>BDSwiss Review 2024 - Comprehensive Analysis | BrokerAnalysis</title>
        <meta name="description" content="BDSwiss is a regulated forex and CFD broker offering competitive spreads and professional trading platforms. Read our detailed BDSwiss review covering fees, platforms, regulation, and more." />
        <meta name="keywords" content="BDSwiss, broker review, trading, forex, cfd, mt4, mt5" />
        <link rel="canonical" href={`https://brokeranalysis.com/brokers/broker-56`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-shrink-0">
                <img 
                  src="https://img.brokersview.com/stage/image/20210125/ALIOSS/1611553068000" 
                  alt="BDSwiss logo" 
                  className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  BDSwiss Review 2024
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  BDSwiss is a regulated forex and CFD broker offering competitive spreads and professional trading platforms.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    {renderStars(4)}
                    <span className="ml-2 text-lg font-semibold">4/5</span>
                    <span className="ml-2 text-gray-500">(471 reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-700 font-medium">Trust Score: 80/100</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">FCA</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <a 
                  href="https://www.bdswiss.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Visit Broker
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">Min Deposit</h3>
                  <p className="text-2xl font-bold text-green-600">$250</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">Max Leverage</h3>
                  <p className="text-2xl font-bold text-blue-600">1:200</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Globe className="w-8 h-8 text-purple-600 mb-2" />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">Spreads From</h3>
                  <p className="text-2xl font-bold text-purple-600">12 pips</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-green-600 mb-2" />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">Established</h3>
                  <p className="text-2xl font-bold text-green-600">2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  BDSwiss is a stp broker established in 2023 and headquartered in United Kingdom. 
                  With a trust score of 80/100 and full regulatory compliance, 
                  this broker serves traders across multiple asset classes.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The broker offers competitive trading conditions with spreads starting from 12 pips and 
                  leverage up to 1:200. BDSwiss supports trading in 2 asset classes 
                  and provides 2 trading platforms to meet different trader preferences.
                </p>
              </div>

              {/* Key Features */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
                <ul className="space-y-2">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Spreads from 12 pips</li><li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Risk Level: 2/10</li><li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Regulated broker</li><li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Multiple trading platforms</li><li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Competitive swap rates</li>
                </ul>
              </div>

              {/* Trading Platforms */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Trading Platforms</h2>
                <ul className="space-y-2">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />MT4</li><li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />MT5</li>
                </ul>
              </div>

              {/* Asset Classes */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Asset Classes</h2>
                <ul className="grid grid-cols-2 gap-2">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Forex</li><li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Cfd</li>
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">support@bdswiss.com</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">+44 20 7000 0000</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-500 mr-2" />
                    <a href="https://www.bdswiss.com" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      Official Website
                    </a>
                  </div>
                </div>
              </div>

              {/* Regulation */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Regulation</h3>
                <div className="space-y-2">
                  
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">FCA</span>
                  </div>
                </div>
              </div>

              {/* Quick Action */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Start Trading?</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Visit BDSwiss to open your account and start trading today.
                </p>
                <a 
                  href="https://www.bdswiss.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open Account
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BDSwissReview;
