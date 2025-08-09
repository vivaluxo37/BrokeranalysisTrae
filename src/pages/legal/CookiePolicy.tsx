import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Cookie, Settings, Shield, Eye, ToggleLeft, Info } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - BrokerAnalysis Cookie Usage & Privacy Settings 2025</title>
        <meta name="description" content="Learn about BrokerAnalysis cookie policy 2025. Understand how we use cookies, your privacy choices, and how to manage cookie preferences on our platform." />
        <meta name="keywords" content="cookie policy, privacy settings, website cookies, tracking preferences, data collection, browser settings 2025" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://brokeranalysis.com/legal/cookie-policy" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Cookie Policy - BrokerAnalysis Privacy Settings 2025" />
        <meta property="og:description" content="Comprehensive cookie policy and privacy settings for BrokerAnalysis platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://brokeranalysis.com/legal/cookie-policy" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Cookie Policy - BrokerAnalysis 2025" />
        <meta name="twitter:description" content="Learn about our cookie usage and privacy settings." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Cookie Policy - BrokerAnalysis 2025",
            "description": "Cookie policy and privacy settings for BrokerAnalysis",
            "url": "https://brokeranalysis.com/legal/cookie-policy",
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
              <div className="p-3 bg-orange-100 rounded-full">
                <Cookie className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how BrokerAnalysis uses cookies and similar technologies to enhance your browsing experience and provide personalized services.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 1, 2025 | Effective: January 1, 2025
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <a href="#what-are-cookies" className="text-blue-600 hover:text-blue-800 text-sm">
                What Are Cookies
              </a>
              <a href="#cookie-types" className="text-blue-600 hover:text-blue-800 text-sm">
                Types of Cookies
              </a>
              <a href="#how-we-use" className="text-blue-600 hover:text-blue-800 text-sm">
                How We Use Cookies
              </a>
              <a href="#third-party" className="text-blue-600 hover:text-blue-800 text-sm">
                Third-Party Cookies
              </a>
              <a href="#manage-cookies" className="text-blue-600 hover:text-blue-800 text-sm">
                Manage Cookies
              </a>
              <a href="#contact" className="text-blue-600 hover:text-blue-800 text-sm">
                Contact Us
              </a>
            </div>
          </div>

          <div className="space-y-8">
            {/* What Are Cookies */}
            <section id="what-are-cookies" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Info className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">What Are Cookies?</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  Cookies are small text files that are stored on your device when you visit our website. 
                  They help us provide you with a better browsing experience by remembering your preferences 
                  and understanding how you use our platform.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">How Cookies Work</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Stored locally on your device</li>
                      <li>• Contain small amounts of data</li>
                      <li>• Sent back to our servers on subsequent visits</li>
                      <li>• Help us recognize returning visitors</li>
                      <li>• Enable personalized experiences</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Similar Technologies</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Local Storage</li>
                      <li>• Session Storage</li>
                      <li>• Web Beacons</li>
                      <li>• Pixel Tags</li>
                      <li>• Browser Fingerprinting</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Important:</strong> Cookies do not contain personal information like your name 
                    or email address unless you specifically provide it to us.
                  </p>
                </div>
              </div>
            </section>

            {/* Types of Cookies */}
            <section id="cookie-types" className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Settings className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Types of Cookies We Use</h2>
              </div>
              
              <div className="space-y-8">
                {/* Essential Cookies */}
                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                  <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-green-800">Essential Cookies (Required)</h3>
                  </div>
                  <p className="text-green-700 mb-4">
                    These cookies are necessary for the website to function properly and cannot be disabled.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Purpose</h4>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• User authentication and security</li>
                        <li>• Shopping cart functionality</li>
                        <li>• Form submission and validation</li>
                        <li>• Load balancing and performance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Examples</h4>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Session ID cookies</li>
                        <li>• CSRF protection tokens</li>
                        <li>• Language preferences</li>
                        <li>• Accessibility settings</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Performance Cookies */}
                <div className="border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Eye className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-blue-800">Performance Cookies</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What We Collect</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Page views and visit duration</li>
                        <li>• Click patterns and navigation paths</li>
                        <li>• Error messages and technical issues</li>
                        <li>• Device and browser information</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Improve website performance</li>
                        <li>• Identify and fix technical issues</li>
                        <li>• Optimize user experience</li>
                        <li>• Enhance content relevance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <ToggleLeft className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-purple-800">Functional Cookies</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    These cookies enable enhanced functionality and personalization, such as remembering 
                    your preferences and providing customized content.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Features Enabled</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Saved broker comparisons</li>
                        <li>• Personalized recommendations</li>
                        <li>• Theme and display preferences</li>
                        <li>• Recently viewed brokers</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">User Benefits</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Faster access to preferred content</li>
                        <li>• Customized user interface</li>
                        <li>• Improved search results</li>
                        <li>• Seamless cross-device experience</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Eye className="h-5 w-5 text-orange-600 mr-2" />
                    <h3 className="text-lg font-semibold text-orange-800">Marketing Cookies</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    These cookies are used to deliver relevant advertisements and track the effectiveness 
                    of our marketing campaigns.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Advertising Features</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Targeted broker recommendations</li>
                        <li>• Retargeting campaigns</li>
                        <li>• Interest-based advertising</li>
                        <li>• Cross-platform tracking</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Campaign performance measurement</li>
                        <li>• Conversion tracking</li>
                        <li>• Audience insights</li>
                        <li>• ROI optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Cookies */}
            <section id="how-we-use" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Cookies</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Functionality</h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-900">User Authentication</h4>
                        <p className="text-gray-700 text-sm">Keep you logged in and secure your account access</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Preferences</h4>
                        <p className="text-gray-700 text-sm">Remember your settings, language, and display options</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Shopping Cart</h4>
                        <p className="text-gray-700 text-sm">Maintain your broker comparisons and saved searches</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics & Improvement</h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Usage Analytics</h4>
                        <p className="text-gray-700 text-sm">Understand how you use our platform to improve services</p>
                      </div>
                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Performance Monitoring</h4>
                        <p className="text-gray-700 text-sm">Track page load times and identify technical issues</p>
                      </div>
                      <div className="border-l-4 border-yellow-500 pl-4">
                        <h4 className="font-semibold text-gray-900">A/B Testing</h4>
                        <p className="text-gray-700 text-sm">Test new features and optimize user experience</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Retention</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">Session</div>
                      <div className="text-sm text-gray-600">Essential cookies expire when you close your browser</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">30 Days</div>
                      <div className="text-sm text-gray-600">Functional cookies for preferences and settings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">2 Years</div>
                      <div className="text-sm text-gray-600">Analytics and marketing cookies (with consent)</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section id="third-party" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Third-Party Cookies and Services</h2>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  We work with trusted third-party services that may set their own cookies on your device. 
                  These services help us provide better functionality and analyze our website performance.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Services</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">Google Analytics</h4>
                        <p className="text-gray-600 text-sm">Website traffic analysis and user behavior insights</p>
                        <a href="https://policies.google.com/privacy" className="text-blue-600 text-sm hover:underline">
                          Privacy Policy →
                        </a>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Hotjar</h4>
                        <p className="text-gray-600 text-sm">User experience analysis and heatmap tracking</p>
                        <a href="https://www.hotjar.com/legal/policies/privacy/" className="text-blue-600 text-sm hover:underline">
                          Privacy Policy →
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Services</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">Google Ads</h4>
                        <p className="text-gray-600 text-sm">Advertising campaigns and conversion tracking</p>
                        <a href="https://policies.google.com/privacy" className="text-blue-600 text-sm hover:underline">
                          Privacy Policy →
                        </a>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Facebook Pixel</h4>
                        <p className="text-gray-600 text-sm">Social media advertising and audience insights</p>
                        <a href="https://www.facebook.com/privacy/policy/" className="text-blue-600 text-sm hover:underline">
                          Privacy Policy →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>Note:</strong> Third-party services have their own privacy policies and cookie 
                    practices. We recommend reviewing their policies to understand how they handle your data.
                  </p>
                </div>
              </div>
            </section>

            {/* Managing Cookies */}
            <section id="manage-cookies" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Managing Your Cookie Preferences</h2>
              
              <div className="space-y-8">
                {/* Cookie Consent Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Cookie Consent Banner</h3>
                  <p className="text-blue-700 mb-4">
                    When you first visit our website, you'll see a cookie consent banner that allows you 
                    to choose which types of cookies you want to accept.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Your Options</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Accept all cookies</li>
                        <li>• Accept only essential cookies</li>
                        <li>• Customize your preferences</li>
                        <li>• Learn more about each type</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Changing Preferences</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Access settings anytime</li>
                        <li>• Update preferences easily</li>
                        <li>• Clear existing cookies</li>
                        <li>• Reset to defaults</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Browser Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Cookie Settings</h3>
                  <p className="text-gray-700 mb-6">
                    You can also manage cookies directly through your browser settings. Here's how to 
                    access cookie controls in popular browsers:
                  </p>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Chrome</h4>
                      <p className="text-gray-600 text-sm mb-2">Settings → Privacy and Security → Cookies</p>
                      <a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 text-sm hover:underline">
                        Learn More →
                      </a>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Firefox</h4>
                      <p className="text-gray-600 text-sm mb-2">Options → Privacy & Security → Cookies</p>
                      <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-blue-600 text-sm hover:underline">
                        Learn More →
                      </a>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
                      <p className="text-gray-600 text-sm mb-2">Preferences → Privacy → Cookies</p>
                      <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-blue-600 text-sm hover:underline">
                        Learn More →
                      </a>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Edge</h4>
                      <p className="text-gray-600 text-sm mb-2">Settings → Cookies and Site Permissions</p>
                      <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-blue-600 text-sm hover:underline">
                        Learn More →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Mobile Devices */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mobile Device Settings</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">iOS (iPhone/iPad)</h4>
                      <ul className="text-gray-700 text-sm space-y-2">
                        <li>• Settings → Safari → Privacy & Security</li>
                        <li>• Block All Cookies option</li>
                        <li>• Prevent Cross-Site Tracking</li>
                        <li>• Clear History and Website Data</li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Android</h4>
                      <ul className="text-gray-700 text-sm space-y-2">
                        <li>• Chrome → Settings → Site Settings → Cookies</li>
                        <li>• Allow/Block cookies options</li>
                        <li>• Clear browsing data</li>
                        <li>• Third-party cookie controls</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Impact of Disabling Cookies */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">Impact of Disabling Cookies</h3>
                  <p className="text-orange-700 mb-4">
                    While you can disable cookies, please note that this may affect your experience on our website:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">Potential Issues</h4>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• Difficulty staying logged in</li>
                        <li>• Loss of personalized settings</li>
                        <li>• Reduced functionality</li>
                        <li>• Less relevant content</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">Still Available</h4>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• Basic website browsing</li>
                        <li>• Broker information access</li>
                        <li>• Educational content</li>
                        <li>• Contact forms</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Updates to Cookie Policy */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Updates to This Cookie Policy</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We may update this Cookie Policy from time to time to reflect changes in our practices, 
                  technology, legal requirements, or other factors.
                </p>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How We Notify You</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Email notifications for significant changes</li>
                    <li>Website banners for policy updates</li>
                    <li>Updated "Last Modified" date at the top of this page</li>
                    <li>Notice in our newsletter and social media</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    We recommend checking this page periodically to stay informed about our cookie practices.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section id="contact" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us About Cookies</h2>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  If you have questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy Team</h3>
                    <div className="text-gray-700 space-y-2">
                      <p>Email: privacy@brokeranalysis.com</p>
                      <p>Phone: +1 (555) 123-4567</p>
                      <p>Response Time: Within 48 hours</p>
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
                
                <div className="bg-gray-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Manage Cookie Preferences
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                      Clear All Cookies
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Download Cookie Data
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;