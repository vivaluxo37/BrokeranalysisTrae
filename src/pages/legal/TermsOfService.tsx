import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Scale, Shield, AlertTriangle, Users, Globe } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - BrokerAnalysis Legal Agreement & User Terms 2025</title>
        <meta name="description" content="Complete terms of service for BrokerAnalysis 2025. Understand your rights, responsibilities, and legal obligations when using our broker comparison and analysis platform." />
        <meta name="keywords" content="terms of service, user agreement, legal terms, broker analysis terms, platform rules, user responsibilities 2025" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://brokeranalysis.com/legal/terms-of-service" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Terms of Service - BrokerAnalysis Legal Agreement 2025" />
        <meta property="og:description" content="Legal terms and conditions for using BrokerAnalysis platform and services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://brokeranalysis.com/legal/terms-of-service" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Terms of Service - BrokerAnalysis 2025" />
        <meta name="twitter:description" content="Legal terms and user agreement for BrokerAnalysis platform." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms of Service - BrokerAnalysis 2025",
            "description": "Legal terms and conditions for BrokerAnalysis platform",
            "url": "https://brokeranalysis.com/legal/terms-of-service",
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
              <div className="p-3 bg-blue-100 rounded-full">
                <Scale className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These terms govern your use of BrokerAnalysis and outline the rights and responsibilities of all users.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 1, 2025 | Effective: January 1, 2025
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <a href="#acceptance" className="text-blue-600 hover:text-blue-800 text-sm">
                Acceptance of Terms
              </a>
              <a href="#services" className="text-blue-600 hover:text-blue-800 text-sm">
                Our Services
              </a>
              <a href="#user-accounts" className="text-blue-600 hover:text-blue-800 text-sm">
                User Accounts
              </a>
              <a href="#prohibited-uses" className="text-blue-600 hover:text-blue-800 text-sm">
                Prohibited Uses
              </a>
              <a href="#disclaimers" className="text-blue-600 hover:text-blue-800 text-sm">
                Disclaimers
              </a>
              <a href="#termination" className="text-blue-600 hover:text-blue-800 text-sm">
                Termination
              </a>
            </div>
          </div>

          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <section id="acceptance" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  By accessing or using BrokerAnalysis ("the Platform", "our Service"), you agree to be bound 
                  by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use our Service.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">
                    These Terms constitute a legally binding agreement between you and BrokerAnalysis.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>You must be at least 18 years old to use our services</li>
                    <li>You must have the legal capacity to enter into binding agreements</li>
                    <li>Your use of the Platform constitutes acceptance of these Terms</li>
                    <li>We may update these Terms from time to time with notice</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Description of Services */}
            <section id="services" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Globe className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Description of Services</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  BrokerAnalysis provides broker comparison, analysis, and educational services to help users 
                  make informed decisions about financial service providers.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Services Include</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Broker reviews and comparisons</li>
                      <li>Educational content and resources</li>
                      <li>Market analysis and insights</li>
                      <li>Interactive tools and calculators</li>
                      <li>User account and preference management</li>
                      <li>Customer support services</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Limitations</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Information is for educational purposes only</li>
                      <li>We do not provide financial advice</li>
                      <li>Services may be modified or discontinued</li>
                      <li>Availability may vary by jurisdiction</li>
                      <li>Some features require account registration</li>
                      <li>Third-party integrations may have separate terms</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <p className="text-yellow-800">
                      <strong>Important:</strong> Our services are for informational purposes only and do not 
                      constitute financial, investment, or trading advice. Always consult with qualified 
                      professionals before making financial decisions.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* User Accounts */}
            <section id="user-accounts" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">User Accounts and Registration</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Requirements</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>You must provide accurate and complete information</li>
                    <li>You are responsible for maintaining account security</li>
                    <li>You must promptly update any changes to your information</li>
                    <li>One person may not maintain multiple accounts</li>
                    <li>You must not share your account credentials</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Security</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Your Responsibilities</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Choose a strong, unique password</li>
                        <li>• Keep login credentials confidential</li>
                        <li>• Report suspicious activity immediately</li>
                        <li>• Log out from shared devices</li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Our Responsibilities</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Implement security measures</li>
                        <li>• Monitor for unauthorized access</li>
                        <li>• Provide security notifications</li>
                        <li>• Assist with account recovery</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Termination</h3>
                  <p className="text-gray-700 mb-3">
                    You may terminate your account at any time. We may suspend or terminate accounts 
                    for violations of these Terms or applicable laws.
                  </p>
                </div>
              </div>
            </section>

            {/* Prohibited Uses */}
            <section id="prohibited-uses" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Prohibited Uses</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  You agree not to use our Platform for any unlawful purpose or in any way that could 
                  damage, disable, or impair our services.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Violating any applicable laws or regulations</li>
                      <li>Impersonating others or providing false information</li>
                      <li>Attempting to gain unauthorized access</li>
                      <li>Distributing malware or harmful code</li>
                      <li>Scraping or automated data collection</li>
                      <li>Interfering with platform functionality</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Restrictions</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Posting false or misleading information</li>
                      <li>Sharing copyrighted material without permission</li>
                      <li>Publishing defamatory or harmful content</li>
                      <li>Promoting illegal activities</li>
                      <li>Spamming or excessive promotional content</li>
                      <li>Harassment or abusive behavior</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">
                    Violation of these terms may result in immediate account suspension or termination, 
                    and we may report illegal activities to appropriate authorities.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Intellectual Property Rights</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Content</h3>
                  <p className="text-gray-700 mb-3">
                    All content on BrokerAnalysis, including text, graphics, logos, images, software, 
                    and data compilations, is owned by us or our licensors and protected by copyright, 
                    trademark, and other intellectual property laws.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>You may view and use content for personal, non-commercial purposes</li>
                    <li>You may not reproduce, distribute, or create derivative works</li>
                    <li>Commercial use requires explicit written permission</li>
                    <li>Attribution is required when permitted use is granted</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">User-Generated Content</h3>
                  <p className="text-gray-700 mb-3">
                    By submitting content to our Platform, you grant us a non-exclusive, worldwide, 
                    royalty-free license to use, modify, and display your content in connection with our services.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>You retain ownership of your original content</li>
                    <li>You represent that you have rights to submit the content</li>
                    <li>You agree not to submit copyrighted material without permission</li>
                    <li>We may remove content that violates these Terms</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section id="disclaimers" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Disclaimers and Limitations</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">No Financial Advice</h3>
                  <p className="text-yellow-800">
                    BrokerAnalysis provides information and educational content only. We do not provide 
                    financial, investment, trading, or legal advice. All decisions are your responsibility.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Disclaimers</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>"As Is" Basis:</strong> Services are provided without warranties of any kind</li>
                    <li><strong>Accuracy:</strong> We strive for accuracy but cannot guarantee error-free information</li>
                    <li><strong>Availability:</strong> Services may be interrupted or unavailable</li>
                    <li><strong>Third Parties:</strong> We are not responsible for third-party content or services</li>
                    <li><strong>Market Risks:</strong> Trading and investing involve substantial risk of loss</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
                  <p className="text-gray-700 mb-3">
                    To the maximum extent permitted by law, BrokerAnalysis shall not be liable for any 
                    indirect, incidental, special, consequential, or punitive damages, including but not 
                    limited to loss of profits, data, or business opportunities.
                  </p>
                  <p className="text-gray-700">
                    Our total liability for any claims shall not exceed the amount you paid us in the 
                    twelve months preceding the claim, or $100, whichever is greater.
                  </p>
                </div>
              </div>
            </section>

            {/* Indemnification */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Indemnification</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  You agree to indemnify, defend, and hold harmless BrokerAnalysis, its officers, 
                  directors, employees, and agents from any claims, damages, losses, or expenses 
                  (including reasonable attorney fees) arising from:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Your use of our services</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Any content you submit or share</li>
                  <li>Your negligent or wrongful conduct</li>
                </ul>
              </div>
            </section>

            {/* Termination */}
            <section id="termination" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Termination</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Termination by You</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>You may terminate your account at any time</li>
                      <li>Contact support for account deletion</li>
                      <li>Some data may be retained as required by law</li>
                      <li>Termination does not affect prior obligations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Termination by Us</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>We may suspend or terminate for Terms violations</li>
                      <li>We may discontinue services with notice</li>
                      <li>Immediate termination for serious violations</li>
                      <li>We will provide reasonable notice when possible</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Effect of Termination</h3>
                  <p className="text-gray-700">
                    Upon termination, your right to use our services ceases immediately. Provisions 
                    regarding intellectual property, disclaimers, indemnification, and dispute resolution 
                    shall survive termination.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law and Disputes</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Applicable Law</h3>
                  <p className="text-gray-700">
                    These Terms are governed by the laws of the State of New York, United States, 
                    without regard to conflict of law principles.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Dispute Resolution</h3>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      We encourage resolving disputes through direct communication. If informal 
                      resolution fails, disputes shall be resolved through binding arbitration.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Arbitration will be conducted under AAA Commercial Arbitration Rules</li>
                      <li>Arbitration will take place in New York, NY</li>
                      <li>You waive the right to participate in class action lawsuits</li>
                      <li>Small claims court remains available for qualifying disputes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to These Terms</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We may update these Terms from time to time to reflect changes in our services, 
                  legal requirements, or business practices.
                </p>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Notification Process</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Material changes will be announced with 30 days notice</li>
                    <li>Notice will be provided via email and platform announcements</li>
                    <li>Continued use after changes constitutes acceptance</li>
                    <li>You may terminate your account if you disagree with changes</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    We recommend reviewing these Terms periodically to stay informed of any updates.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  If you have questions about these Terms, please contact us:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Department</h3>
                    <div className="text-gray-700">
                      <p>Email: legal@brokeranalysis.com</p>
                      <p>Phone: +1 (555) 123-4567</p>
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
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="bg-gray-100 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Acknowledgment</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  By using BrokerAnalysis, you acknowledge that you have read, understood, and agree 
                  to be bound by these Terms of Service. These Terms constitute the entire agreement 
                  between you and BrokerAnalysis regarding your use of our services.
                </p>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800 font-medium text-center">
                    Thank you for choosing BrokerAnalysis. We're committed to providing you with 
                    valuable broker comparison and analysis services.
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

export default TermsOfService;