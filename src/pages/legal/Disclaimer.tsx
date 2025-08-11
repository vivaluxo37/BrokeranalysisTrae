import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, ExternalLink, FileText, Info, Scale, Shield } from 'lucide-react';

const Disclaimer: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Disclaimer - BrokerAnalysis Legal Notice & Risk Warnings 2025</title>
        <meta name="description" content="Important legal disclaimer for BrokerAnalysis 2025. Understand risks, limitations, and legal notices regarding broker information and financial advice." />
        <meta name="keywords" content="disclaimer, legal notice, risk warning, financial advice, broker information, trading risks, investment disclaimer 2025" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://brokeranalysis.com/legal/disclaimer" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Disclaimer - BrokerAnalysis Legal Notice 2025" />
        <meta property="og:description" content="Important legal disclaimers and risk warnings for BrokerAnalysis platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://brokeranalysis.com/legal/disclaimer" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Disclaimer - BrokerAnalysis 2025" />
        <meta name="twitter:description" content="Legal disclaimers and risk warnings for our platform." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Disclaimer - BrokerAnalysis 2025",
            "description": "Legal disclaimers and risk warnings for BrokerAnalysis",
            "url": "https://brokeranalysis.com/legal/disclaimer",
            "dateModified": "2025-01-01",
            "publisher": {
              "@type": "Organization",
              "name": "BrokerAnalysis",
              "url": "https://brokeranalysis.com"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Legal Disclaimer
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Important legal notices, risk warnings, and disclaimers regarding the use of BrokerAnalysis platform and the information provided.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 1, 2025 | Effective: January 1, 2025
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <a href="#general-disclaimer" className="text-blue-600 hover:text-blue-800 text-sm">
                General Disclaimer
              </a>
              <a href="#financial-advice" className="text-blue-600 hover:text-blue-800 text-sm">
                Financial Advice
              </a>
              <a href="#broker-information" className="text-blue-600 hover:text-blue-800 text-sm">
                Broker Information
              </a>
              <a href="#trading-risks" className="text-blue-600 hover:text-blue-800 text-sm">
                Trading Risks
              </a>
              <a href="#accuracy-limitations" className="text-blue-600 hover:text-blue-800 text-sm">
                Accuracy & Limitations
              </a>
              <a href="#liability" className="text-blue-600 hover:text-blue-800 text-sm">
                Liability
              </a>
            </div>
          </div>

          <div className="space-y-8">
            {/* General Disclaimer */}
            <section id="general-disclaimer" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Info className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">General Disclaimer</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-800 mb-2">Important Notice</h3>
                      <p className="text-red-700">
                        The information provided on BrokerAnalysis is for educational and informational purposes only. 
                        It should not be considered as financial, investment, or trading advice. Always consult with 
                        qualified financial professionals before making investment decisions.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Purpose</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Educational content about trading and brokers</li>
                      <li>• Comparison tools for broker selection</li>
                      <li>• Market analysis and insights</li>
                      <li>• User reviews and experiences</li>
                      <li>• Industry news and updates</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Are NOT</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Financial advisory service</li>
                      <li>• Investment recommendation platform</li>
                      <li>• Licensed broker or dealer</li>
                      <li>• Regulatory authority</li>
                      <li>• Guarantee of trading success</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>User Responsibility:</strong> You are solely responsible for your trading and investment 
                    decisions. BrokerAnalysis does not accept responsibility for any losses or damages resulting 
                    from the use of our platform or information.
                  </p>
                </div>
              </div>
            </section>

            {/* Financial Advice Disclaimer */}
            <section id="financial-advice" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Scale className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Financial Advice Disclaimer</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">No Financial Advice</h3>
                  <p className="text-orange-700 mb-4">
                    BrokerAnalysis does not provide financial, investment, or trading advice. All content on our 
                    platform is for informational and educational purposes only.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">What Our Content Includes</h4>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• General market information</li>
                        <li>• Broker feature comparisons</li>
                        <li>• Educational trading concepts</li>
                        <li>• Historical data analysis</li>
                        <li>• User experience reviews</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">What It Does NOT Include</h4>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• Personalized investment advice</li>
                        <li>• Specific trading recommendations</li>
                        <li>• Portfolio management guidance</li>
                        <li>• Tax or legal advice</li>
                        <li>• Guaranteed profit strategies</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Professional Consultation</h3>
                  <p className="text-gray-700">
                    Before making any financial decisions, we strongly recommend consulting with:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Financial Advisors</h4>
                      <p className="text-gray-600 text-sm">Licensed professionals who can provide personalized investment advice</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Tax Professionals</h4>
                      <p className="text-gray-600 text-sm">Experts in tax implications of trading and investment activities</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Legal Counsel</h4>
                      <p className="text-gray-600 text-sm">Attorneys specializing in financial and securities law</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Broker Information Disclaimer */}
            <section id="broker-information" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <ExternalLink className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Broker Information Disclaimer</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  Information about brokers on our platform is compiled from various sources and may not 
                  always reflect the most current terms, conditions, or offerings.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Sources</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Broker websites and official documentation</li>
                      <li>• Regulatory filings and public records</li>
                      <li>• User reviews and feedback</li>
                      <li>• Industry reports and analysis</li>
                      <li>• Direct communication with brokers</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Responsibility</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Always verify information directly with brokers</li>
                      <li>• Check current terms and conditions</li>
                      <li>• Confirm regulatory status and licenses</li>
                      <li>• Review latest fee schedules</li>
                      <li>• Understand account requirements</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Affiliate Relationships</h3>
                  <p className="text-blue-700 mb-3">
                    BrokerAnalysis may receive compensation from some brokers featured on our platform. 
                    This does not influence our reviews or rankings, which are based on objective criteria.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Our Commitment</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Transparent disclosure of relationships</li>
                        <li>• Objective review methodology</li>
                        <li>• User-focused recommendations</li>
                        <li>• Regular content updates</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Your Due Diligence</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Research multiple sources</li>
                        <li>• Compare broker offerings</li>
                        <li>• Read terms and conditions</li>
                        <li>• Test demo accounts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Trading Risks */}
            <section id="trading-risks" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Trading Risks Warning</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">High Risk Warning</h3>
                  <p className="text-red-700 mb-4">
                    Trading financial instruments involves substantial risk of loss and may not be suitable 
                    for all investors. You could lose some or all of your initial investment.
                  </p>
                  <div className="text-red-700 text-sm">
                    <p className="font-semibold mb-2">Key Risk Factors:</p>
                    <ul className="space-y-1">
                      <li>• Market volatility and price fluctuations</li>
                      <li>• Leverage amplifies both gains and losses</li>
                      <li>• Past performance does not guarantee future results</li>
                      <li>• Economic and political events affect markets</li>
                      <li>• Technology failures and system outages</li>
                    </ul>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">CFD Trading</h3>
                    <div className="text-gray-700 text-sm space-y-2">
                      <p className="font-semibold text-red-600">High Risk Investment</p>
                      <p>CFDs are complex instruments with high risk of rapid money loss due to leverage.</p>
                      <p className="font-semibold">Retail investor losses: 67-89%</p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Forex Trading</h3>
                    <div className="text-gray-700 text-sm space-y-2">
                      <p className="font-semibold text-orange-600">Currency Risk</p>
                      <p>Foreign exchange trading involves currency fluctuation risks and leverage.</p>
                      <p className="font-semibold">24/7 market volatility</p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cryptocurrency</h3>
                    <div className="text-gray-700 text-sm space-y-2">
                      <p className="font-semibold text-purple-600">Extreme Volatility</p>
                      <p>Cryptocurrency trading involves extreme price volatility and regulatory uncertainty.</p>
                      <p className="font-semibold">Unregulated markets</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>Risk Management:</strong> Never invest more than you can afford to lose. 
                    Consider your experience level, investment objectives, and risk tolerance before trading.
                  </p>
                </div>
              </div>
            </section>

            {/* Accuracy and Limitations */}
            <section id="accuracy-limitations" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Accuracy and Limitations</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  While we strive to provide accurate and up-to-date information, we cannot guarantee 
                  the completeness, accuracy, or timeliness of all content on our platform.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Limitations</h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Market Data</h4>
                        <p className="text-gray-700 text-sm">Prices and market data may be delayed or inaccurate</p>
                      </div>
                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Broker Terms</h4>
                        <p className="text-gray-700 text-sm">Terms and conditions change frequently without notice</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Regulatory Status</h4>
                        <p className="text-gray-700 text-sm">Licensing and regulatory information may become outdated</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Limitations</h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold text-gray-900">System Availability</h4>
                        <p className="text-gray-700 text-sm">Platform may experience downtime or technical issues</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Data Processing</h4>
                        <p className="text-gray-700 text-sm">Automated systems may contain errors or inconsistencies</p>
                      </div>
                      <div className="border-l-4 border-yellow-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Third-Party Services</h4>
                        <p className="text-gray-700 text-sm">External data providers may affect information accuracy</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">User Responsibilities</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Verification</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Verify all information independently</li>
                        <li>• Check multiple sources</li>
                        <li>• Confirm current broker terms</li>
                        <li>• Validate regulatory status</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Due Diligence</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Conduct thorough research</li>
                        <li>• Understand risks involved</li>
                        <li>• Seek professional advice</li>
                        <li>• Make informed decisions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Liability Disclaimer */}
            <section id="liability" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">No Liability for Losses</h3>
                  <p className="text-red-700 mb-4">
                    BrokerAnalysis, its owners, employees, and affiliates shall not be liable for any direct, 
                    indirect, incidental, consequential, or punitive damages arising from your use of our platform.
                  </p>
                  <div className="text-red-700 text-sm">
                    <p className="font-semibold mb-2">This includes but is not limited to:</p>
                    <ul className="space-y-1">
                      <li>• Trading losses or investment damages</li>
                      <li>• Lost profits or business opportunities</li>
                      <li>• Data loss or system failures</li>
                      <li>• Errors in information or analysis</li>
                      <li>• Third-party actions or omissions</li>
                    </ul>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Maximum Liability</h3>
                    <p className="text-gray-700 mb-3">
                      In no event shall our total liability exceed the amount you paid to access our services 
                      in the 12 months preceding the claim.
                    </p>
                    <div className="bg-gray-100 rounded p-3">
                      <p className="text-gray-800 text-sm font-semibold">
                        For free services: Maximum liability is $100 USD
                      </p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Indemnification</h3>
                    <p className="text-gray-700 mb-3">
                      You agree to indemnify and hold harmless BrokerAnalysis from any claims, damages, 
                      or expenses arising from your use of our platform.
                    </p>
                    <div className="bg-gray-100 rounded p-3">
                      <p className="text-gray-800 text-sm">
                        This includes legal fees and court costs
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Jurisdictional Limitations</h3>
                  <p className="text-gray-700">
                    Some jurisdictions do not allow the exclusion or limitation of certain damages. 
                    In such jurisdictions, our liability is limited to the maximum extent permitted by law.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      <strong>Governing Law:</strong> This disclaimer is governed by the laws of [Jurisdiction] 
                      without regard to conflict of law principles.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions About This Disclaimer</h2>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  If you have questions about this disclaimer or need clarification on any points, 
                  please contact our legal team:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Department</h3>
                    <div className="text-gray-700 space-y-2">
                      <p>Email: legal@brokeranalysis.com</p>
                      <p>Phone: +1 (555) 123-4567</p>
                      <p>Response Time: Within 5 business days</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Mailing Address</h3>
                    <div className="text-gray-700">
                      <p>BrokerAnalysis Legal Team</p>
                      <p>123 Financial District</p>
                      <p>New York, NY 10004</p>
                      <p>United States</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>Important:</strong> This disclaimer is part of our Terms of Service. 
                    By using BrokerAnalysis, you acknowledge that you have read, understood, and agree 
                    to be bound by these terms.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Disclaimer;