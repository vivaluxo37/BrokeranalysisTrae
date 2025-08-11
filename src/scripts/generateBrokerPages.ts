import { promises as fs } from 'fs';
import path from 'path';

interface BrokerData {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  regulators: string[];
  minDeposit: number;
  maxLeverage: number;
  spreadsFrom: number;
  assetClasses: string[];
  platforms: string[];
  category: string;
  trustScore: number;
  isRegulated: boolean;
  yearEstablished: number;
  headquarters: string;
  website: string;
  description: string;
  keyFeatures: string[];
  featured: boolean;
  details: any;
  costs: any;
  regulation: any[];
  features: any;
  contact: any;
}

function generateBrokerPageContent(broker: BrokerData): string {
  const regulatorBadges = broker.regulators.map(reg => 
    `<span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">${reg.toUpperCase()}</span>`
  ).join('');

  const assetClassesList = broker.assetClasses.map(asset => 
    `<li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />${asset.charAt(0).toUpperCase() + asset.slice(1)}</li>`
  ).join('');

  const platformsList = broker.platforms.map(platform => 
    `<li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />${platform.toUpperCase()}</li>`
  ).join('');

  const keyFeaturesList = broker.keyFeatures.map(feature => 
    `<li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />${feature}</li>`
  ).join('');

  return `import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Star, CheckCircle, Shield, TrendingUp, DollarSign, Globe, Phone, Mail, ExternalLink } from 'lucide-react';

const ${broker.name.replace(/[^a-zA-Z0-9]/g, '')}Review: React.FC = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={\`w-5 h-5 \${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}\`}
      />
    ));
  };

  return (
    <>
      <Helmet>
        <title>${broker.name} Review 2024 - Comprehensive Analysis | BrokerAnalysis</title>
        <meta name="description" content="${broker.description} Read our detailed ${broker.name} review covering fees, platforms, regulation, and more." />
        <meta name="keywords" content="${broker.name}, broker review, trading, ${broker.assetClasses.join(', ')}, ${broker.platforms.join(', ')}" />
        <link rel="canonical" href={\`https://brokeranalysis.com/brokers/${broker.id}\`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-shrink-0">
                <img 
                  src="${broker.logo}" 
                  alt="${broker.name} logo" 
                  className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  ${broker.name} Review 2024
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  ${broker.description}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    {renderStars(${broker.rating})}
                    <span className="ml-2 text-lg font-semibold">${broker.rating}/5</span>
                    <span className="ml-2 text-gray-500">(${broker.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-700 font-medium">Trust Score: ${broker.trustScore}/100</span>
                  </div>
                </div>
                <div className="mt-4">
                  ${regulatorBadges}
                </div>
              </div>
              <div className="flex-shrink-0">
                <a 
                  href="${broker.website}" 
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
                  <p className="text-2xl font-bold text-green-600">\$${broker.minDeposit}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">Max Leverage</h3>
                  <p className="text-2xl font-bold text-blue-600">1:${broker.maxLeverage}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Globe className="w-8 h-8 text-purple-600 mb-2" />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">Spreads From</h3>
                  <p className="text-2xl font-bold text-purple-600">${broker.spreadsFrom} pips</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-green-600 mb-2" />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">Established</h3>
                  <p className="text-2xl font-bold text-green-600">${broker.yearEstablished}</p>
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
                  ${broker.name} is a ${broker.category} broker established in ${broker.yearEstablished} and headquartered in ${broker.headquarters}. 
                  With a trust score of ${broker.trustScore}/100 and ${broker.isRegulated ? 'full regulatory compliance' : 'limited regulation'}, 
                  this broker serves traders across multiple asset classes.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The broker offers competitive trading conditions with spreads starting from ${broker.spreadsFrom} pips and 
                  leverage up to 1:${broker.maxLeverage}. ${broker.name} supports trading in ${broker.assetClasses.length} asset classes 
                  and provides ${broker.platforms.length} trading platforms to meet different trader preferences.
                </p>
              </div>

              {/* Key Features */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
                <ul className="space-y-2">
                  ${keyFeaturesList}
                </ul>
              </div>

              {/* Trading Platforms */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Trading Platforms</h2>
                <ul className="space-y-2">
                  ${platformsList}
                </ul>
              </div>

              {/* Asset Classes */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Asset Classes</h2>
                <ul className="grid grid-cols-2 gap-2">
                  ${assetClassesList}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  ${broker.contact?.email ? `
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">${broker.contact.email}</span>
                  </div>` : ''}
                  ${broker.contact?.phone ? `
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">${broker.contact.phone}</span>
                  </div>` : ''}
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-500 mr-2" />
                    <a href="${broker.website}" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      Official Website
                    </a>
                  </div>
                </div>
              </div>

              {/* Regulation */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Regulation</h3>
                <div className="space-y-2">
                  ${broker.regulators.map(reg => `
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">${reg.toUpperCase()}</span>
                  </div>`).join('')}
                </div>
              </div>

              {/* Quick Action */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Start Trading?</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Visit ${broker.name} to open your account and start trading today.
                </p>
                <a 
                  href="${broker.website}" 
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

export default ${broker.name.replace(/[^a-zA-Z0-9]/g, '')}Review;`;
}

export async function generateAllBrokerPages(): Promise<void> {
  try {
    // Read the extractedBrokers.json file
    const brokersPath = path.join(process.cwd(), 'src', 'data', 'extractedBrokers.json');
    const brokersData = await fs.readFile(brokersPath, 'utf-8');
    const brokers: BrokerData[] = JSON.parse(brokersData);

    console.log(`Found ${brokers.length} brokers to generate pages for`);

    // Ensure the brokers directory exists
    const brokersDir = path.join(process.cwd(), 'src', 'pages', 'brokers');
    await fs.mkdir(brokersDir, { recursive: true });

    // Generate a page for each broker
    for (const broker of brokers) {
      try {
        const pageContent = generateBrokerPageContent(broker);
        const fileName = `${broker.id}.tsx`;
        const filePath = path.join(brokersDir, fileName);
        
        await fs.writeFile(filePath, pageContent, 'utf-8');
        console.log(`✓ Generated page for ${broker.name} (${fileName})`);
      } catch (error) {
        console.error(`✗ Failed to generate page for ${broker.name}:`, error);
      }
    }

    console.log(`\n🎉 Successfully generated ${brokers.length} broker review pages!`);
  } catch (error) {
    console.error('❌ Error generating broker pages:', error);
    throw error;
  }
}

// Run the script if called directly
if (require.main === module) {
  generateAllBrokerPages().catch(console.error);
}