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

const CySECRegulatedBrokersPage: React.FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCySECBrokers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabaseHelpers.getBrokersByCountry('CY');
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Sort brokers by rating (highest first)
        const sortedBrokers = (data || []).sort((a, b) => b.rating - a.rating);
        setBrokers(sortedBrokers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch brokers');
      } finally {
        setLoading(false);
      }
    };

    fetchCySECBrokers();
  }, []);

  const generateTLDR = (broker: Broker): string => {
    const features = [];
    if (broker.min_deposit <= 100) features.push('Low minimum deposit');
    if (broker.rating >= 4.5) features.push('Excellent rating');
    if (broker.spread_eur_usd <= 1.0) features.push('Tight spreads');
    if (broker.commission_per_trade === 0) features.push('Zero commission');
    
    return features.length > 0 
      ? `${features.join(', ')}. ${broker.description?.substring(0, 100)}...`
      : broker.description?.substring(0, 150) + '...' || 'CySEC-regulated broker with comprehensive trading services.';
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is CySEC regulation and why is it important?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Cyprus Securities and Exchange Commission (CySEC) is Cyprus's financial services regulator and an EU member regulator. CySEC regulation ensures brokers comply with MiFID II directives, maintain segregated client funds, and provide investor compensation through the ICF (Investor Compensation Fund)."
        }
      },
      {
        "@type": "Question",
        "name": "What protection do I get with CySEC-regulated brokers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "CySEC-regulated brokers provide up to €20,000 protection per client through the Investor Compensation Fund (ICF). Client funds must be held in segregated accounts with tier-1 banks, and brokers must comply with strict MiFID II conduct rules and capital requirements."
        }
      },
      {
        "@type": "Question",
        "name": "How can I verify if a broker is CySEC regulated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Check the CySEC website at cysec.gov.cy in the 'Regulated Entities' section using the broker's name or CIF (Cyprus Investment Firm) license number. All legitimate CySEC brokers must display their CIF license number prominently on their website."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between CySEC and other EU regulators?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "CySEC follows the same MiFID II framework as other EU regulators but is known for being more accessible to international brokers. CySEC-regulated firms can passport their services across the EU, providing the same level of protection as other major EU financial centers."
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CySEC-regulated brokers...</p>
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
        <title>Best CySEC-Regulated Brokers 2025 | Cyprus Securities Commission</title>
        <meta name="description" content="Compare the best CySEC-regulated brokers in Cyprus. All brokers are licensed by the Cyprus Securities and Exchange Commission with ICF protection up to €20,000. Find trusted EU-regulated brokers." />
        <meta name="keywords" content="CySEC regulated brokers, Cyprus brokers, CIF license, MiFID II, ICF protection, EU regulation" />
        <link rel="canonical" href="https://brokeranalysis.com/regulators/cysec-regulated-brokers" />
        <script type="application/ld+json">
          {JSON.stringify(faqData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Shield className="w-12 h-12" />
                <h1 className="text-4xl md:text-5xl font-bold">Best CySEC-Regulated Brokers</h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-purple-100">
                Compare top Cyprus brokers regulated by CySEC under EU MiFID II
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-purple-700 bg-opacity-50 p-4 rounded-lg">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">ICF Protected</h3>
                  <p className="text-sm text-purple-100">Up to €20,000 compensation</p>
                </div>
                <div className="bg-purple-700 bg-opacity-50 p-4 rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">EU MiFID II</h3>
                  <p className="text-sm text-purple-100">European regulatory standards</p>
                </div>
                <div className="bg-purple-700 bg-opacity-50 p-4 rounded-lg">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">EU Passporting</h3>
                  <p className="text-sm text-purple-100">Services across EU member states</p>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Top CySEC-Regulated Brokers ({brokers.length} Found)</h2>
                <p className="text-gray-600">
                  All brokers listed below hold a Cyprus Investment Firm (CIF) license and are regulated 
                  by the Cyprus Securities and Exchange Commission (CySEC) under EU MiFID II directives.
                </p>
              </div>

              <div className="space-y-6">
                {brokers.map((broker, index) => {
                  const cysecRegulation = broker.broker_regulation?.find(reg => reg.country_code === 'CY');
                  
                  return (
                    <div key={broker.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Rank and Logo */}
                        <div className="flex items-center gap-4">
                          <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
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
                              {cysecRegulation && (
                                <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                                  CIF: {cysecRegulation.license_id}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* TL;DR */}
                          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-4">
                            <h4 className="font-semibold text-purple-900 mb-1">TL;DR</h4>
                            <p className="text-purple-800">{generateTLDR(broker)}</p>
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
                              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
                            >
                              Read Full Review
                            </a>
                            {broker.website_url && (
                              <a
                                href={broker.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center flex items-center justify-center gap-2"
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No CySEC-Regulated Brokers Found</h3>
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
              <h2 className="text-3xl font-bold mb-6">Why Choose CySEC-Regulated Brokers?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg">
                  <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">EU Regulation</h3>
                  <p className="text-gray-700">
                    CySEC operates under the EU's MiFID II framework, providing the same regulatory 
                    standards as other major European financial centers with full EU passporting rights.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Investor Protection</h3>
                  <p className="text-gray-700">
                    ICF protection provides up to €20,000 compensation per client, while strict 
                    segregation rules ensure client funds are held separately from broker assets.
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

export default CySECRegulatedBrokersPage;