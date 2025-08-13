import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Award, BookOpen, CheckCircle, Eye, FileText, Shield, Target, Users } from 'lucide-react';

const EditorialPolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Editorial Policy - BrokerAnalysis Content Standards & Review Process 2025</title>
        <meta name="description" content="BrokerAnalysis Editorial Policy 2025: Our commitment to accurate, unbiased broker reviews and financial content. Learn about our editorial standards and review process." />
        <meta name="keywords" content="editorial policy, content standards, review process, editorial guidelines, broker reviews, financial journalism, content integrity 2025" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://brokeranalysis.com/legal/editorial-policy" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Editorial Policy - BrokerAnalysis Content Standards 2025" />
        <meta property="og:description" content="Our commitment to accurate, unbiased broker reviews and financial content standards." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://brokeranalysis.com/legal/editorial-policy" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Editorial Policy - BrokerAnalysis 2025" />
        <meta name="twitter:description" content="Content standards and editorial guidelines for accurate broker reviews." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Editorial Policy - BrokerAnalysis 2025",
            "description": "Editorial standards and content guidelines for BrokerAnalysis",
            "url": "https://brokeranalysis.com/legal/editorial-policy",
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
                <FileText className="h-8 w-8 text-accent-blue" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Editorial Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to providing accurate, unbiased, and comprehensive broker reviews and financial content through rigorous editorial standards.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 1, 2025 | Effective: January 1, 2025
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <a href="#editorial-mission" className="text-accent-blue hover:text-blue-800 text-sm">
                Editorial Mission
              </a>
              <a href="#content-standards" className="text-accent-blue hover:text-blue-800 text-sm">
                Content Standards
              </a>
              <a href="#review-process" className="text-accent-blue hover:text-blue-800 text-sm">
                Review Process
              </a>
              <a href="#independence" className="text-accent-blue hover:text-blue-800 text-sm">
                Editorial Independence
              </a>
              <a href="#fact-checking" className="text-accent-blue hover:text-blue-800 text-sm">
                Fact-Checking
              </a>
              <a href="#corrections" className="text-accent-blue hover:text-blue-800 text-sm">
                Corrections Policy
              </a>
              <a href="#team" className="text-accent-blue hover:text-blue-800 text-sm">
                Editorial Team
              </a>
              <a href="#contact" className="text-accent-blue hover:text-blue-800 text-sm">
                Contact Us
              </a>
            </div>
          </div>

          <div className="space-y-8">
            {/* Editorial Mission */}
            <section id="editorial-mission" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Target className="h-6 w-6 text-accent-blue mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Editorial Mission</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Our Commitment</h3>
                  <p className="text-blue-700 mb-4">
                    BrokerAnalysis is dedicated to providing traders and investors with accurate, comprehensive, 
                    and unbiased information to help them make informed decisions about financial brokers and trading platforms.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Core Values</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Accuracy and factual reporting</li>
                        <li>• Editorial independence</li>
                        <li>• Transparency in methodology</li>
                        <li>• User-focused content</li>
                        <li>• Continuous improvement</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Editorial Principles</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Evidence-based analysis</li>
                        <li>• Balanced perspective</li>
                        <li>• Clear disclosure of conflicts</li>
                        <li>• Regular content updates</li>
                        <li>• Expert review and validation</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Shield className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Integrity</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      We maintain the highest standards of journalistic integrity, ensuring our content 
                      is honest, accurate, and serves our readers' best interests.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Eye className="h-5 w-5 text-accent-blue mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Transparency</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      We clearly disclose our review methodology, potential conflicts of interest, 
                      and any commercial relationships that may influence our content.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Users className="h-5 w-5 text-purple-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">User-Centric</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Every piece of content is created with our users in mind, focusing on practical 
                      value and actionable insights for traders and investors.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Content Standards */}
            <section id="content-standards" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <BookOpen className="h-6 w-6 text-accent-blue mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Content Standards</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  All content published on BrokerAnalysis must meet our rigorous standards for accuracy, 
                  relevance, and editorial quality.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Requirements</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Accuracy</h4>
                          <p className="text-gray-700 text-sm">All facts and figures must be verified through multiple reliable sources</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Relevance</h4>
                          <p className="text-gray-700 text-sm">Content must provide practical value to our target audience</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Timeliness</h4>
                          <p className="text-gray-700 text-sm">Information must be current and regularly updated</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Clarity</h4>
                          <p className="text-gray-700 text-sm">Complex topics explained in accessible language</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Types</h3>
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-3">
                        <h4 className="font-semibold text-gray-900">Broker Reviews</h4>
                        <p className="text-gray-700 text-sm">Comprehensive analysis based on standardized criteria</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-3">
                        <h4 className="font-semibold text-gray-900">Educational Content</h4>
                        <p className="text-gray-700 text-sm">Trading guides and financial education materials</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-3">
                        <h4 className="font-semibold text-gray-900">Market Analysis</h4>
                        <p className="text-gray-700 text-sm">Data-driven insights and trend analysis</p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-3">
                        <h4 className="font-semibold text-gray-900">News & Updates</h4>
                        <p className="text-gray-700 text-sm">Industry developments and regulatory changes</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">Content Restrictions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Prohibited Content</h4>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Misleading or false information</li>
                        <li>• Unsubstantiated claims</li>
                        <li>• Promotional content disguised as editorial</li>
                        <li>• Plagiarized or duplicate content</li>
                        <li>• Content that violates regulations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Required Disclosures</h4>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Affiliate relationships</li>
                        <li>• Sponsored content labeling</li>
                        <li>• Potential conflicts of interest</li>
                        <li>• Data sources and methodology</li>
                        <li>• Risk warnings where applicable</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Review Process */}
            <section id="review-process" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-6 w-6 text-accent-blue mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Editorial Review Process</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  Every piece of content undergoes a multi-stage review process to ensure it meets 
                  our editorial standards before publication.
                </p>
                
                <div className="grid md:grid-cols-1 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Stages</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-accent-blue font-semibold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Initial Draft Review</h4>
                          <p className="text-gray-700 text-sm">Content structure, completeness, and adherence to guidelines</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-green-600 font-semibold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Fact-Checking</h4>
                          <p className="text-gray-700 text-sm">Verification of all claims, statistics, and broker information</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-purple-600 font-semibold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Expert Review</h4>
                          <p className="text-gray-700 text-sm">Subject matter expert validation of technical content</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-orange-600 font-semibold text-sm">4</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Editorial Review</h4>
                          <p className="text-gray-700 text-sm">Final editorial review for style, tone, and overall quality</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-red-600 font-semibold text-sm">5</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Final Approval</h4>
                          <p className="text-gray-700 text-sm">Senior editor approval and publication authorization</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">Quality Assurance</h3>
                    <ul className="text-green-700 space-y-2">
                      <li>• Multiple reviewer validation</li>
                      <li>• Automated plagiarism detection</li>
                      <li>• SEO and readability optimization</li>
                      <li>• Legal compliance review</li>
                      <li>• Technical accuracy verification</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Post-Publication</h3>
                    <ul className="text-blue-700 space-y-2">
                      <li>• Regular content audits</li>
                      <li>• User feedback monitoring</li>
                      <li>• Accuracy verification updates</li>
                      <li>• Performance analytics review</li>
                      <li>• Continuous improvement implementation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Editorial Independence */}
            <section id="independence" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-accent-blue mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Editorial Independence</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Independence Guarantee</h3>
                  <p className="text-blue-700 mb-4">
                    Our editorial team operates independently from our business development and marketing teams. 
                    Editorial decisions are made solely based on merit, accuracy, and user value.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Editorial Autonomy</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Independent content creation</li>
                        <li>• Unbiased broker evaluations</li>
                        <li>• Merit-based rankings</li>
                        <li>• Objective analysis methodology</li>
                        <li>• User-focused recommendations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Conflict Management</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Clear separation of editorial and business</li>
                        <li>• Transparent disclosure policies</li>
                        <li>• Regular independence audits</li>
                        <li>• Ethical guidelines enforcement</li>
                        <li>• Reader interest prioritization</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Review Methodology</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Our broker reviews follow a standardized methodology that evaluates:
                    </p>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Platform features and usability</li>
                      <li>• Fees and pricing structure</li>
                      <li>• Regulatory compliance</li>
                      <li>• Customer support quality</li>
                      <li>• Educational resources</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Ranking Criteria</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Broker rankings are determined by objective criteria:
                    </p>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Weighted scoring system</li>
                      <li>• User experience metrics</li>
                      <li>• Safety and security measures</li>
                      <li>• Trading conditions</li>
                      <li>• Overall value proposition</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Process</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Regular updates ensure content accuracy:
                    </p>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Quarterly comprehensive reviews</li>
                      <li>• Real-time regulatory updates</li>
                      <li>• User feedback integration</li>
                      <li>• Market condition adjustments</li>
                      <li>• Technology advancement tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Fact-Checking */}
            <section id="fact-checking" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Eye className="h-6 w-6 text-accent-blue mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Fact-Checking Process</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  We employ rigorous fact-checking procedures to ensure the accuracy and reliability 
                  of all information published on our platform.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Standards</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Primary Sources</h4>
                          <p className="text-gray-700 text-sm">Direct verification with broker websites and official documentation</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Regulatory Data</h4>
                          <p className="text-gray-700 text-sm">Cross-reference with regulatory authority databases</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Multiple Sources</h4>
                          <p className="text-gray-700 text-sm">Confirmation through at least two independent sources</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Expert Validation</h4>
                          <p className="text-gray-700 text-sm">Industry expert review of technical and complex information</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Sources</h3>
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-3">
                        <h4 className="font-semibold text-gray-900">Regulatory Bodies</h4>
                        <p className="text-gray-700 text-sm">FCA, SEC, ASIC, CySEC, and other financial regulators</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-3">
                        <h4 className="font-semibold text-gray-900">Broker Documentation</h4>
                        <p className="text-gray-700 text-sm">Official terms, conditions, and disclosure documents</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-3">
                        <h4 className="font-semibold text-gray-900">Industry Reports</h4>
                        <p className="text-gray-700 text-sm">Research from reputable financial institutions and analysts</p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-3">
                        <h4 className="font-semibold text-gray-900">Direct Testing</h4>
                        <p className="text-gray-700 text-sm">Hands-on platform testing and feature verification</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">Fact-Checking Timeline</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-800 font-semibold">24h</span>
                      </div>
                      <h4 className="font-semibold text-yellow-800">Initial Check</h4>
                      <p className="text-yellow-700 text-sm">Basic fact verification</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-800 font-semibold">48h</span>
                      </div>
                      <h4 className="font-semibold text-yellow-800">Deep Dive</h4>
                      <p className="text-yellow-700 text-sm">Comprehensive verification</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-800 font-semibold">72h</span>
                      </div>
                      <h4 className="font-semibold text-yellow-800">Expert Review</h4>
                      <p className="text-yellow-700 text-sm">Specialist validation</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-800 font-semibold">96h</span>
                      </div>
                      <h4 className="font-semibold text-yellow-800">Final Approval</h4>
                      <p className="text-yellow-700 text-sm">Publication clearance</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Corrections Policy */}
            <section id="corrections" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-accent-blue mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Corrections Policy</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  We are committed to correcting errors promptly and transparently. When mistakes are identified, 
                  we take immediate action to rectify them and prevent similar issues in the future.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Reporting</h3>
                    <div className="space-y-3">
                      <p className="text-gray-700 text-sm mb-3">
                        We encourage readers to report any errors or inaccuracies they discover:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-accent-blue rounded-full mr-2"></span>
                          <span className="text-gray-700 text-sm">Email: corrections@brokeranalysis.com</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-accent-blue rounded-full mr-2"></span>
                          <span className="text-gray-700 text-sm">Contact form on each article</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-accent-blue rounded-full mr-2"></span>
                          <span className="text-gray-700 text-sm">Social media channels</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-accent-blue rounded-full mr-2"></span>
                          <span className="text-gray-700 text-sm">Direct message to editorial team</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Correction Process</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-red-600 font-semibold text-xs">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Investigation</h4>
                          <p className="text-gray-700 text-sm">Immediate review and verification of reported error</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-orange-600 font-semibold text-xs">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Correction</h4>
                          <p className="text-gray-700 text-sm">Prompt correction of verified errors</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-green-600 font-semibold text-xs">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Disclosure</h4>
                          <p className="text-gray-700 text-sm">Transparent notation of correction and date</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Correction Standards</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">Minor Corrections</h4>
                      <ul className="text-red-700 text-sm space-y-1">
                        <li>• Spelling and grammar errors</li>
                        <li>• Formatting issues</li>
                        <li>• Minor factual updates</li>
                        <li>• Link corrections</li>
                        <li>• Updated within 24 hours</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">Major Corrections</h4>
                      <ul className="text-red-700 text-sm space-y-1">
                        <li>• Significant factual errors</li>
                        <li>• Misleading information</li>
                        <li>• Incorrect broker data</li>
                        <li>• Regulatory status changes</li>
                        <li>• Prominent correction notice added</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Editorial Team */}
            <section id="team" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-accent-blue mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Editorial Team</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  Our editorial team consists of experienced financial journalists, trading experts, 
                  and industry professionals committed to delivering high-quality content.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Award className="h-5 w-5 text-gold-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Editorial Leadership</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">Editor-in-Chief</h4>
                        <p className="text-gray-700 text-sm">15+ years financial journalism experience</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Managing Editor</h4>
                        <p className="text-gray-700 text-sm">Former regulatory compliance officer</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Senior Editors</h4>
                        <p className="text-gray-700 text-sm">Specialized in different trading markets</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <BookOpen className="h-5 w-5 text-accent-blue mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Content Specialists</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">Trading Experts</h4>
                        <p className="text-gray-700 text-sm">Active traders with platform expertise</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Financial Analysts</h4>
                        <p className="text-gray-700 text-sm">CFA and professional certifications</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Technical Writers</h4>
                        <p className="text-gray-700 text-sm">Complex topic simplification specialists</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Quality Assurance</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">Fact-Checkers</h4>
                        <p className="text-gray-700 text-sm">Dedicated verification specialists</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Copy Editors</h4>
                        <p className="text-gray-700 text-sm">Grammar, style, and clarity experts</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Legal Reviewers</h4>
                        <p className="text-gray-700 text-sm">Compliance and regulatory specialists</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Team Qualifications</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Professional Background</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Financial journalism degrees</li>
                        <li>• Industry certifications (CFA, FRM)</li>
                        <li>• Trading and investment experience</li>
                        <li>• Regulatory knowledge</li>
                        <li>• Technical analysis expertise</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Ongoing Development</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Regular training programs</li>
                        <li>• Industry conference attendance</li>
                        <li>• Continuing education requirements</li>
                        <li>• Peer review processes</li>
                        <li>• Performance evaluations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section id="contact" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Editorial Team</h2>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  We welcome feedback, suggestions, and questions about our editorial policies and content. 
                  Your input helps us maintain the highest standards of quality and accuracy.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Editorial Inquiries</h3>
                    <div className="text-gray-700 space-y-2">
                      <p>Email: editorial@brokeranalysis.com</p>
                      <p>Phone: +1 (555) 123-4567 ext. 201</p>
                      <p>Response Time: Within 2 business days</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Feedback Categories</h3>
                    <div className="text-gray-700 space-y-1">
                      <p>• Content suggestions and improvements</p>
                      <p>• Error reporting and corrections</p>
                      <p>• Editorial policy questions</p>
                      <p>• Expert collaboration opportunities</p>
                      <p>• General editorial feedback</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">
                    <strong>Commitment to Excellence:</strong> We continuously strive to improve our editorial 
                    processes and welcome your feedback to help us serve our readers better.
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

export default EditorialPolicy;
