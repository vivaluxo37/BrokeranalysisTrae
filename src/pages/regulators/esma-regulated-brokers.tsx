import React, { useState, useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Shield, Star, ExternalLink, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { supabaseHelpers } from '../../lib/supabase';

interface Broker {
  id: string;
  name: string;
  description: string;
  rating: number;
  min_deposit: number;
  spread_eur_usd: number;
  commission_per_trade: number;
  website_url: string;
  logo_url?: string;
  broker_regulation: {
    country_code: string;
    regulator_name: string;
    license_id: string;
  }[];
}

const ESMARegulatedBrokersPage: React.FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchESMABrokers = async () => {
      try {
        setLoading(true);
        // ESMA covers multiple EU countries, so we'll fetch from major EU regulators
        const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'CY', 'MT', 'IE'];
        const allBrokers: Broker[] = [];
        
        for (const country of euCountries) {
          const { data, error } = await supabaseHelpers.getBrokersByCountry(country);
          if (data && !error) {
            allBrokers.push(...data);
          }
        }
        
        // Remove duplicates and sort by rating
        const uniqueBrokers = allBrokers.filter((broker, index, self) => 
          index === self.findIndex(b => b.id === broker.id)
        );
        const sortedBrokers = uniqueBrokers.sort((a, b) => b.rating - a.rating);
        setBrokers(sortedBrokers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch brokers');
      } finally {
        setLoading(false);
      }
    };

    fetchESMABrokers();
  }, []);

  const generateTLDR = (broker: Broker): string => {
    const features = [];
    if (broker.min_deposit <= 100) features.push('Low minimum deposit');
    if (broker.rating >= 4.5) features.push('Excellent rating');
    if (broker.spread_eur_usd <= 1.0) features.push('Tight spreads');
    if (broker.commission_per_trade === 0) features.push('Zero commission');
    
    return features.length > 0 
      ? `${features.join(', ')}. ${broker.description?.substring(0, 100)}...`
      : broker.description?.substring(0, 150) + '...' || 'EU-regulated broker with comprehensive trading services under ESMA guidelines.';
  };

  const getRegulatorInfo = (broker: Broker) => {
    const regulation = broker.broker_regulation?.[0];
    if (!regulation) return null;
    
    const regulatorMap: { [key: string]: string } = {
      'DE': 'BaFin',
      'FR': 'AMF',
      'IT': 'CONSOB',
      'ES': 'CNMV',
      'NL': 'AFM',
      'CY': 'CySEC',
      'MT': 'MFSA',
      'IE': 'CBI'
    };
    
    return {
      regulator: regulatorMap[regulation.country_code] || regulation.regulator_name,
      license: regulation.license_id,
      country: regulation.country_code
    };
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is ESMA regulation and how does it work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The European Securities and Markets Authority (ESMA) is the EU's financial markets supervisor that coordinates regulation across member states. ESMA ensures consistent application of MiFID II rules, sets technical standards, and provides oversight of national regulators like BaFin, FCA, and CySEC."
        }
      },
      {
        "@type": "Question",
        "name": "What protection do I get with ESMA-regulated brokers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ESMA-regulated brokers must comply with MiFID II investor protection rules including segregated client funds, compensation schemes (varying by country from €20,000 to €100,000), negative balance protection, and strict conduct requirements. Each EU member state has its own investor compensation fund."
        }
      },
      {
        "@type": "Question",
        "name": "How can I verify if a broker is ESMA-compliant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Check the broker's license with their national regulator (e.g., BaFin for Germany, AMF for France). All EU-regulated brokers must display their authorization number and can passport services across the EU under MiFID II. ESMA maintains a database of regulated firms on its website."
        }
      },
      {
        "@type": "Question",
        "name": "What are ESMA's leverage restrictions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ESMA has implemented leverage limits for retail clients: 30:1 for major currency pairs, 20:1 for non-major currencies, gold and major indices, 10:1 for commodities (except gold), 5:1 for individual stocks, and 2:1 for cryptocurrencies. Professional clients may access higher leverage."
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ESMA-regulated brokers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Brokers</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Best ESMA-Regulated Brokers 2025 | European Securities Markets Authority</title>
        <meta name="description" content="Compare the best ESMA-regulated brokers in the European Union. All brokers comply with MiFID II under ESMA oversight with investor protection schemes. Find trusted EU brokers." />
        <meta name="keywords" content="ESMA regulated brokers, EU brokers, MiFID II, European regulation, BaFin, AMF, CySEC" />
        <link rel="canonical" href="https://brokeranalysis.com/regulators/esma-regulated-brokers" />
        <script type="application/ld+json">
          {JSON.stringify(faqData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Shield className="w-12 h-12" />
                <h1 className="text-4xl md:text-5xl font-bold">Best ESMA-Regulated Brokers</h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-indigo-100">
                Compare top EU brokers under ESMA oversight and MiFID II compliance
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-indigo-700 bg-opacity-50 p-4 rounded-lg">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">MiFID II Compliant</h3>
                  <p className="text-sm text-indigo-100">European investor protection</p>
                </div>
                <div className="bg-indigo-700 bg-opacity-50 p-4 rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">ESMA Oversight</h3>
                  <p className="text-sm text-indigo-100">EU-wide regulatory coordination</p>
                </div>
                <div className="bg-indigo-700 bg-opacity-50 p-4 rounded-lg">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">EU Passporting</h3>
                  <p className="text-sm text-indigo-100">Services across all EU states</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brokers List */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Top ESMA-Regulated Brokers ({brokers.length} Found)</h2>
                <p className="text-gray-600">
                  All brokers listed below are regulated by EU member state authorities under ESMA oversight 
                  and comply with MiFID II investor protection directives.
                </p>
              </div>

              <div className="space-y-6">
                {brokers.map((broker, index) => {
                  const regulatorInfo = getRegulatorInfo(broker);
                  
                  return (
                    <div key={broker.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Rank and Logo */}
                        <div className="flex items-center gap-4">
                          <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          {broker.logo_url && (
                            <img 
                              src={broker.logo_url} 
                              alt={`${broker.name} logo`}
                              className="w-16 h-16 object-contain"
                            />
                          )}
                        </div>

                        {/* Broker Info */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                            <h3 className="text-2xl font-bold text-gray-900">{broker.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="font-semibold">{broker.rating.toFixed(1)}</span>
                              </div>
                              {regulatorInfo && (
                                <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">
                                  {regulatorInfo.regulator}: {regulatorInfo.license}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* TL;DR */}
                          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-4">
                            <h4 className="font-semibold text-indigo-900 mb-1">TL;DR</h4>
                            <p className="text-indigo-800">{generateTLDR(broker)}</p>
                          </div>

                          {/* Key Features */}
                          <div className="grid sm:grid-cols-3 gap-4 mb-4">
                            <div>
                              <span className="text-sm text-gray-500">Min Deposit</span>
                              <p className="font-semibold">
                                {broker.min_deposit ? `€${broker.min_deposit.toLocaleString()}` : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">EUR/USD Spread</span>
                              <p className="font-semibold">
                                {broker.spread_eur_usd ? `${broker.spread_eur_usd} pips` : 'Variable'}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Commission</span>
                              <p className="font-semibold">
                                {broker.commission_per_trade === 0 ? 'Zero' : `€${broker.commission_per_trade}`}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3">
                            <a
                              href={`/brokers/${broker.id}`}
                              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-center"
                            >
                              Read Full Review
                            </a>
                            {broker.website_url && (
                              <a
                                href={broker.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors text-center flex items-center justify-center gap-2"
                              >
                                Visit Broker
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {brokers.length === 0 && (
                <div className="text-center py-12">
                  <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No ESMA-Regulated Brokers Found</h3>
                  <p className="text-gray-600">Please check back later or contact support if this seems incorrect.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqData.mainEntity.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{faq.name}</h3>
                    <p className="text-gray-700 leading-relaxed">{faq.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Why Choose ESMA-Regulated Brokers?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg">
                  <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Harmonized Standards</h3>
                  <p className="text-gray-700">
                    ESMA ensures consistent regulatory standards across all EU member states through 
                    MiFID II, providing uniform investor protection regardless of the broker's home country.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Comprehensive Protection</h3>
                  <p className="text-gray-700">
                    EU brokers must provide negative balance protection, segregated client funds, 
                    investor compensation schemes, and comply with strict conduct and transparency rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ESMARegulatedBrokersPage;