import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { AlertTriangle, DollarSign, ExternalLink, Eye, FileText, Shield } from 'lucide-react';

const AdvertiserDisclosure: React.FC = () => {
  const quickNavItems = [
    { id: 'advertising-relationships', title: 'Advertising Relationships' },
    { id: 'compensation-disclosure', title: 'Compensation Disclosure' },
    { id: 'editorial-independence', title: 'Editorial Independence' },
    { id: 'affiliate-partnerships', title: 'Affiliate Partnerships' },
    { id: 'sponsored-content', title: 'Sponsored Content' },
    { id: 'transparency-commitment', title: 'Transparency Commitment' },
    { id: 'contact-information', title: 'Contact Information' }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Advertiser Disclosure - BrokerAnalysis Transparency & Advertising Policy 2025",
    "description": "Learn about BrokerAnalysis advertising relationships, compensation disclosure, and our commitment to editorial independence and transparency in broker reviews.",
    "url": "https://brokeranalysis.com/legal/advertiser-disclosure",
    "publisher": {
      "@type": "Organization",
      "name": "BrokerAnalysis",
      "url": "https://brokeranalysis.com"
    },
    "dateModified": "2025-01-01",
    "inLanguage": "en-US"
  };

  return (
    <>
      <Helmet>
        <title>Advertiser Disclosure - BrokerAnalysis Transparency &amp; Advertising Policy 2025</title>
        <meta name="description" content="Learn about BrokerAnalysis advertising relationships, compensation disclosure, and our commitment to editorial independence and transparency in broker reviews." />
        <meta name="keywords" content="advertiser disclosure, advertising policy, compensation disclosure, affiliate partnerships, editorial independence, transparency, broker reviews, BrokerAnalysis 2025" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://brokeranalysis.com/legal/advertiser-disclosure" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advertiser Disclosure - BrokerAnalysis Transparency & Advertising Policy 2025" />
        <meta property="og:description" content="Learn about BrokerAnalysis advertising relationships, compensation disclosure, and our commitment to editorial independence and transparency in broker reviews." />
        <meta property="og:url" content="https://brokeranalysis.com/legal/advertiser-disclosure" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BrokerAnalysis" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Advertiser Disclosure - BrokerAnalysis Transparency & Advertising Policy 2025" />
        <meta name="twitter:description" content="Learn about BrokerAnalysis advertising relationships, compensation disclosure, and our commitment to editorial independence and transparency in broker reviews." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                <Eye className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Advertiser Disclosure
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to transparency in advertising relationships and editorial independence
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Last updated: January 1, 2025
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Quick Navigation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                >
                  <span className="text-blue-600 font-medium">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Advertising Relationships */}
              <section id="advertising-relationships" className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <ExternalLink className="h-6 w-6 mr-3 text-blue-600" />
                  Advertising Relationships
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="mb-4">
                    BrokerAnalysis maintains advertising relationships with various financial service providers, 
                    including brokers, trading platforms, and financial technology companies. We believe in 
                    complete transparency about these relationships and how they may influence our content.
                  </p>
                  <p className="mb-4">
                    Our advertising partners may include brokers that we review and compare on our platform. 
                    However, the existence of an advertising relationship does not guarantee favorable coverage 
                    or higher rankings in our comparisons.
                  </p>
                  <p>
                    We clearly distinguish between editorial content and advertising material throughout our 
                    website to ensure users can make informed decisions.
                  </p>
                </div>
              </section>

              {/* Compensation Disclosure */}
              <section id="compensation-disclosure" className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <DollarSign className="h-6 w-6 mr-3 text-green-600" />
                  Compensation Disclosure
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Types of Compensation</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Affiliate commissions when users sign up with brokers through our referral links</li>
                    <li>Display advertising fees for banner ads and promotional placements</li>
                    <li>Sponsored content fees for clearly marked promotional articles</li>
                    <li>Lead generation fees for qualified user referrals</li>
                    <li>Partnership fees for featured broker placements</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How Compensation Works</h3>
                  <p className="mb-4">
                    When you click on certain links or sign up with brokers through our platform, we may 
                    receive compensation. This compensation helps us maintain our free service and continue 
                    providing comprehensive broker analysis and comparison tools.
                  </p>
                  <p>
                    The amount of compensation varies by partner and may be based on factors such as the 
                    type of account opened, deposit amount, or trading activity. However, compensation 
                    levels do not influence our editorial rankings or review scores.
                  </p>
                </div>
              </section>

              {/* Editorial Independence */}
              <section id="editorial-independence" className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-purple-600" />
                  Editorial Independence
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="mb-4">
                    Our editorial team maintains complete independence from our business development and 
                    advertising teams. Broker reviews, rankings, and recommendations are based solely on 
                    our objective analysis methodology and user feedback.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Editorial Standards</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Reviews are conducted using standardized criteria applied equally to all brokers</li>
                    <li>Advertising partners cannot influence review scores or editorial content</li>
                    <li>Negative reviews of advertising partners are published when warranted</li>
                    <li>Editorial decisions are made independently of commercial considerations</li>
                    <li>Clear separation between editorial content and promotional material</li>
                  </ul>
                  
                  <p>
                    We regularly review and update our editorial policies to ensure they meet the highest 
                    standards of journalistic integrity and serve our users' best interests.
                  </p>
                </div>
              </section>

              {/* Affiliate Partnerships */}
              <section id="affiliate-partnerships" className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <ExternalLink className="h-6 w-6 mr-3 text-orange-600" />
                  Affiliate Partnerships
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="mb-4">
                    BrokerAnalysis participates in affiliate marketing programs with various brokers and 
                    financial service providers. These partnerships allow us to earn commissions when 
                    users sign up for services through our referral links.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Affiliate Link Disclosure</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Affiliate links are clearly marked with appropriate disclosures</li>
                    <li>Users are informed when clicking on affiliate links</li>
                    <li>No additional cost to users when using affiliate links</li>
                    <li>Alternative non-affiliate links provided when available</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Partner Selection Criteria</h3>
                  <p className="mb-4">
                    We only partner with brokers and service providers that meet our quality standards 
                    and regulatory requirements. Partnership decisions are based on:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>Regulatory compliance and licensing status</li>
                    <li>User feedback and satisfaction ratings</li>
                    <li>Platform quality and feature offerings</li>
                    <li>Customer service standards</li>
                    <li>Transparency in pricing and terms</li>
                  </ul>
                </div>
              </section>

              {/* Sponsored Content */}
              <section id="sponsored-content" className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-3 text-red-600" />
                  Sponsored Content
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="mb-4">
                    Occasionally, we publish sponsored content in partnership with brokers and financial 
                    service providers. All sponsored content is clearly labeled and distinguished from 
                    our editorial content.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Sponsored Content Guidelines</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Clear "Sponsored" or "Advertisement" labels on all paid content</li>
                    <li>Sponsored content must provide value to our users</li>
                    <li>Editorial team reviews all sponsored content for accuracy</li>
                    <li>Sponsored content cannot make false or misleading claims</li>
                    <li>Separate disclosure statements for sponsored articles</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Content Standards</h3>
                  <p>
                    Even in sponsored content, we maintain our commitment to accuracy and user value. 
                    Sponsored articles must meet our editorial standards and provide genuine insights 
                    or educational value to our readers.
                  </p>
                </div>
              </section>

              {/* Transparency Commitment */}
              <section id="transparency-commitment" className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Eye className="h-6 w-6 mr-3 text-blue-600" />
                  Transparency Commitment
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="mb-4">
                    We are committed to maintaining the highest levels of transparency in all our 
                    business relationships and content creation processes. Our users deserve to know 
                    how we operate and fund our services.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Our Transparency Practices</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Regular updates to this advertiser disclosure policy</li>
                    <li>Clear labeling of all commercial relationships</li>
                    <li>Public disclosure of major partnerships and sponsorships</li>
                    <li>Accessible contact information for disclosure-related questions</li>
                    <li>Regular audits of our disclosure practices</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">User Rights</h3>
                  <p className="mb-4">
                    Users have the right to:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>Know about all commercial relationships that may affect content</li>
                    <li>Access non-affiliate links when available</li>
                    <li>Receive clear disclosures before clicking affiliate links</li>
                    <li>Contact us with questions about our advertising practices</li>
                    <li>Provide feedback on our transparency efforts</li>
                  </ul>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact-information" className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="h-6 w-6 mr-3 text-green-600" />
                  Contact Information
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="mb-4">
                    If you have questions about our advertising relationships, compensation disclosure, 
                    or any aspect of our transparency policies, please contact us:
                  </p>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Disclosure Inquiries</h3>
                    <p className="mb-2"><strong>Email:</strong> disclosure@brokeranalysis.com</p>
                    <p className="mb-2"><strong>Subject Line:</strong> Advertiser Disclosure Inquiry</p>
                    <p className="mb-4"><strong>Response Time:</strong> Within 2 business days</p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Editorial Team</h3>
                    <p className="mb-2"><strong>Email:</strong> editorial@brokeranalysis.com</p>
                    <p className="mb-2"><strong>For:</strong> Editorial independence concerns</p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">General Contact</h3>
                    <p className="mb-2"><strong>Email:</strong> contact@brokeranalysis.com</p>
                    <p className="mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> 123 Financial District, New York, NY 10004</p>
                  </div>
                  
                  <p className="mt-6">
                    We welcome feedback on our transparency practices and are committed to continuously 
                    improving our disclosure policies to better serve our users.
                  </p>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Key Points */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Points</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Complete transparency in advertising relationships
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Editorial independence from commercial interests
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Clear labeling of all sponsored content
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      User-first approach to content creation
                    </li>
                  </ul>
                </div>

                {/* Related Pages */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Policies</h3>
                  <div className="space-y-3">
                    <a href="/legal/privacy-policy" className="block text-blue-600 hover:text-blue-800 text-sm">
                      Privacy Policy
                    </a>
                    <a href="/legal/terms-of-service" className="block text-blue-600 hover:text-blue-800 text-sm">
                      Terms of Service
                    </a>
                    <a href="/legal/editorial-policy" className="block text-blue-600 hover:text-blue-800 text-sm">
                      Editorial Policy
                    </a>
                    <a href="/legal/disclaimer" className="block text-blue-600 hover:text-blue-800 text-sm">
                      Disclaimer
                    </a>
                  </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-3">Questions?</h3>
                  <p className="text-sm mb-4 opacity-90">
                    Contact us about our advertising practices or transparency policies.
                  </p>
                  <a 
                    href="mailto:disclosure@brokeranalysis.com" 
                    className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvertiserDisclosure;