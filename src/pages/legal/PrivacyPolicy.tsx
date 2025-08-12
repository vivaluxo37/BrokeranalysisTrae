import React, { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Clock, Eye, FileText, Globe, Lock, Mail, Phone, Shield, Search, ChevronRight, Download, Print } from 'lucide-react';
import { PageLayout } from '@/components/layout';
import { ProfessionalCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PrivacyPolicy: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    { id: 'information-collection', title: 'Information We Collect', icon: FileText },
    { id: 'how-we-use', title: 'How We Use Data', icon: Eye },
    { id: 'data-sharing', title: 'Data Sharing', icon: Globe },
    { id: 'data-security', title: 'Data Security', icon: Lock },
    { id: 'your-rights', title: 'Your Rights', icon: Shield },
    { id: 'cookies', title: 'Cookies', icon: Globe }
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
      <>
      <Helmet>
        <title>Privacy Policy - BrokerAnalysis Data Protection & GDPR Compliance 2025</title>
        <meta name="description" content="Comprehensive privacy policy for BrokerAnalysis 2025. Learn how we protect your data, GDPR compliance, cookie usage, and your privacy rights when using our broker comparison platform." />
        <meta name="keywords" content="privacy policy, data protection, GDPR, CCPA, broker analysis privacy, personal data, cookies, user rights 2025" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://brokeranalysis.com/legal/privacy-policy" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Privacy Policy - BrokerAnalysis Data Protection 2025" />
        <meta property="og:description" content="Learn how BrokerAnalysis protects your personal data and ensures GDPR compliance in 2025." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://brokeranalysis.com/legal/privacy-policy" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Privacy Policy - BrokerAnalysis Data Protection 2025" />
        <meta name="twitter:description" content="Comprehensive privacy policy and data protection information for BrokerAnalysis users." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy - BrokerAnalysis 2025",
            "description": "Privacy policy and data protection information for BrokerAnalysis",
            "url": "https://brokeranalysis.com/legal/privacy-policy",
            "dateModified": "2025-01-01",
            "publisher": {
              "@type": "Organization",
              "name": "BrokerAnalysis",
              "url": "https://brokeranalysis.com"
            }
          })}
        </script>
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

        {/* Search and Navigation */}
        <div className="grid lg:grid-cols-4 gap-8">
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
                        className="flex items-center gap-3 p-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <IconComponent className="w-4 h-4" />
                        {section.title}
                        <ChevronRight className="w-3 h-3 ml-auto" />
                      </a>
                    );
                  })}
                </nav>
              </div>
            </ProfessionalCard>
          </div>

          <div className="lg:col-span-3">

            <div className="space-y-8">
              {/* Information We Collect */}
              <section id="information-collection">
                <ProfessionalCard variant="default">
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <FileText className="h-6 w-6 text-blue-600 mr-3" />
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
            </section>

            {/* How We Use Your Information */}
            <section id="how-we-use" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Eye className="h-6 w-6 text-blue-600 mr-3" />
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
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Send important service updates and notifications</li>
                    <li>Provide educational content and market insights</li>
                    <li>Share promotional offers (with your consent)</li>
                    <li>Conduct surveys and feedback collection</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Compliance</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Comply with applicable laws and regulations</li>
                    <li>Respond to legal requests and court orders</li>
                    <li>Protect our rights and interests</li>
                    <li>Prevent illegal activities and policy violations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section id="data-sharing" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Globe className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Data Sharing and Disclosure</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    We do not sell your personal information to third parties.
                  </p>
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
            </section>

            {/* Data Security */}
            <section id="data-security" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Lock className="h-6 w-6 text-blue-600 mr-3" />
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
            </section>

            {/* Your Rights */}
            <section id="your-rights" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Your Privacy Rights</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">GDPR Rights (EU Users)</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
                    <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                    <li><strong>Portability:</strong> Receive your data in a structured format</li>
                    <li><strong>Restriction:</strong> Limit how we process your data</li>
                    <li><strong>Objection:</strong> Object to certain types of processing</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">CCPA Rights (California Users)</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Know:</strong> What personal information we collect and how it's used</li>
                    <li><strong>Delete:</strong> Request deletion of your personal information</li>
                    <li><strong>Opt-out:</strong> Opt-out of the sale of personal information</li>
                    <li><strong>Non-discrimination:</strong> Equal service regardless of privacy choices</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    To exercise your rights, contact us at privacy@brokeranalysis.com or use our data request form.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section id="cookies" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Globe className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Cookies and Tracking</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Types of Cookies We Use</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Essential Cookies</h4>
                      <p className="text-gray-700 text-sm">Required for basic site functionality and security</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h4>
                      <p className="text-gray-700 text-sm">Help us understand how users interact with our site</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Preference Cookies</h4>
                      <p className="text-gray-700 text-sm">Remember your settings and personalization choices</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h4>
                      <p className="text-gray-700 text-sm">Used to deliver relevant advertisements (with consent)</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Managing Cookies</h3>
                  <p className="text-gray-700 mb-3">
                    You can control cookies through your browser settings or our cookie preference center. 
                    Note that disabling certain cookies may affect site functionality.
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Cookie Preferences
                  </button>
                </div>
              </div>
            </section>

            {/* International Transfers */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">International Data Transfers</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Standard Contractual Clauses approved by the European Commission</li>
                  <li>Adequacy decisions for countries with equivalent data protection</li>
                  <li>Binding Corporate Rules for intra-group transfers</li>
                  <li>Certification schemes and codes of conduct</li>
                </ul>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Children's Privacy</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                  Our services are not intended for individuals under 18 years of age. We do not knowingly 
                  collect personal information from children. If you believe we have collected information 
                  from a child, please contact us immediately.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Clock className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We retain your personal information only as long as necessary for the purposes outlined 
                  in this policy or as required by law:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Account Data:</strong> Until account deletion plus 30 days</li>
                  <li><strong>Usage Analytics:</strong> Aggregated data retained for 2 years</li>
                  <li><strong>Support Records:</strong> 3 years from last interaction</li>
                  <li><strong>Legal Requirements:</strong> As mandated by applicable laws</li>
                </ul>
              </div>
            </section>

            {/* Policy Changes */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Policy Changes</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We may update this privacy policy from time to time. We will notify you of any 
                  material changes by:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending email notifications to registered users</li>
                  <li>Displaying prominent notices on our platform</li>
                  <li>Requiring acceptance for significant changes</li>
                </ul>
                <p className="text-gray-700">
                  Your continued use of our services after policy changes constitutes acceptance 
                  of the updated terms.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
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
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
