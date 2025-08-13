import React, { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Clock, Eye, FileText, Globe, Lock, Mail, Phone, Shield, Search, ChevronRight, Download, Print, AlertTriangle } from 'lucide-react';
import { PageLayout } from '@/components/layout';
import { ProfessionalCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EnhancedPrivacyPolicy: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    { id: 'information-collection', title: 'Information We Collect', icon: FileText },
    { id: 'how-we-use', title: 'How We Use Data', icon: Eye },
    { id: 'data-sharing', title: 'Data Sharing', icon: Globe },
    { id: 'data-security', title: 'Data Security', icon: Lock },
    { id: 'your-rights', title: 'Your Rights', icon: Shield },
    { id: 'cookies', title: 'Cookies & Tracking', icon: Globe },
    { id: 'international-transfers', title: 'International Transfers', icon: Globe },
    { id: 'data-retention', title: 'Data Retention', icon: Clock },
    { id: 'contact', title: 'Contact Information', icon: Mail }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout
      title="Privacy Policy"
      description="Your privacy is important to us. This policy explains how BrokerAnalysis collects, uses, and protects your personal information."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Legal', href: '/legal' },
        { label: 'Privacy Policy', current: true }
      ]}
    >
      <Helmet>
        <title>Privacy Policy - BrokerAnalysis Data Protection & GDPR Compliance 2025</title>
        <meta name="description" content="Comprehensive privacy policy for BrokerAnalysis 2025. Learn how we protect your data, GDPR compliance, cookie usage, and your privacy rights when using our broker comparison platform." />
        <meta name="keywords" content="privacy policy, data protection, GDPR, CCPA, broker analysis privacy, personal data, cookies, user rights 2025" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://brokeranalysis.com/legal/privacy-policy" />
      </Helmet>

      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
          <Shield className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-4">
            Your privacy is important to us. This policy explains how BrokerAnalysis collects, uses, and protects your personal information.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Last updated: January 1, 2025
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              GDPR Compliant
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              CCPA Compliant
            </span>
          </div>
        </div>

        {/* Document Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Print className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            Reading time: ~15 minutes
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <ProfessionalCard variant="compact" className="sticky top-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
                
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search sections..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                </div>
                
                <nav className="space-y-2">
                  {filteredSections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="flex items-center gap-3 p-2 text-sm text-gray-700 hover:text-accent-blue hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <IconComponent className="w-4 h-4" />
                        {section.title}
                        <ChevronRight className="w-3 h-3 ml-auto" />
                      </a>
                    );
                  })}
                </nav>

                {/* Quick Contact */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Privacy Questions?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Contact our privacy team for any questions about your data.
                  </p>
                  <Button size="sm" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Privacy Team
                  </Button>
                </div>
              </div>
            </ProfessionalCard>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Information We Collect */}
            <section id="information-collection">
              <ProfessionalCard variant="default">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <FileText className="h-6 w-6 text-accent-blue mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Name, email address, and contact information when you register</li>
                        <li>Trading experience and investment preferences</li>
                        <li>Account verification documents (when required)</li>
                        <li>Communication records and support interactions</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Information</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Pages visited, time spent, and user interactions</li>
                        <li>Search queries and broker comparison activities</li>
                        <li>Device information, IP address, and browser details</li>
                        <li>Referral sources and marketing campaign interactions</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Information</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Cookies, web beacons, and similar tracking technologies</li>
                        <li>Log files and server data</li>
                        <li>Performance metrics and error reports</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ProfessionalCard>
            </section>

            {/* How We Use Your Information */}
            <section id="how-we-use">
              <ProfessionalCard variant="default">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <Eye className="h-6 w-6 text-accent-blue mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Provision</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Provide broker comparison and analysis services</li>
                        <li>Personalize recommendations based on your preferences</li>
                        <li>Process account registration and authentication</li>
                        <li>Respond to customer support inquiries</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Improvement</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Analyze usage patterns to improve our services</li>
                        <li>Conduct research and development activities</li>
                        <li>Monitor and prevent fraud and abuse</li>
                        <li>Ensure platform security and performance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ProfessionalCard>
            </section>

            {/* Data Sharing */}
            <section id="data-sharing">
              <ProfessionalCard variant="default">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <Globe className="h-6 w-6 text-accent-blue mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Data Sharing and Disclosure</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-yellow-800 font-medium">
                          We do not sell your personal information to third parties.
                        </p>
                        <p className="text-yellow-700 text-sm mt-1">
                          Your data is only shared in specific circumstances outlined below.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">We may share information with:</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><strong>Service Providers:</strong> Third-party vendors who help us operate our platform</li>
                        <li><strong>Business Partners:</strong> Brokers and financial institutions (with your consent)</li>
                        <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                        <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
                        <li><strong>Analytics Partners:</strong> For aggregated, anonymized usage statistics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ProfessionalCard>
            </section>

            {/* Data Security */}
            <section id="data-security">
              <ProfessionalCard variant="default">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <Lock className="h-6 w-6 text-accent-blue mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Safeguards</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>SSL/TLS encryption for data transmission</li>
                        <li>Encrypted data storage and backups</li>
                        <li>Regular security audits and penetration testing</li>
                        <li>Multi-factor authentication for sensitive operations</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Organizational Measures</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Access controls and employee training</li>
                        <li>Data minimization and purpose limitation</li>
                        <li>Incident response and breach notification procedures</li>
                        <li>Regular policy reviews and updates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ProfessionalCard>
            </section>

            {/* Your Rights */}
            <section id="your-rights">
              <ProfessionalCard variant="default">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <Shield className="h-6 w-6 text-accent-blue mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Your Privacy Rights</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">GDPR Rights (EU Users)</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <strong>Access:</strong> Request a copy of your personal data
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <strong>Rectification:</strong> Correct inaccurate information
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <strong>Erasure:</strong> Request deletion of your data
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <strong>Portability:</strong> Receive data in structured format
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <strong>Restriction:</strong> Limit data processing
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <strong>Objection:</strong> Object to certain processing
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800">
                        To exercise your rights, contact us at privacy@brokeranalysis.com or use our data request form.
                      </p>
                    </div>
                  </div>
                </div>
              </ProfessionalCard>
            </section>

            {/* Contact Information */}
            <section id="contact">
              <ProfessionalCard variant="default">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <Mail className="h-6 w-6 text-accent-blue mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy Officer</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">privacy@brokeranalysis.com</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">+1 (555) 123-4567</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Mailing Address</h3>
                      <div className="text-gray-700">
                        <p>BrokerAnalysis Privacy Team</p>
                        <p>123 Financial District</p>
                        <p>New York, NY 10004</p>
                        <p>United States</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      For EU users: You also have the right to lodge a complaint with your local 
                      data protection authority if you believe we have not addressed your concerns adequately.
                    </p>
                  </div>
                </div>
              </ProfessionalCard>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default EnhancedPrivacyPolicy;
