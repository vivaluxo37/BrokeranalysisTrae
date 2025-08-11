import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Award, Globe, Shield, Target, TrendingUp, Users } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About BrokerAnalysis - Leading Broker Review Platform 2025</title>
        <meta name="description" content="Learn about BrokerAnalysis, the trusted broker review platform helping traders find the best brokers since 2020. Our expert team provides unbiased reviews and comprehensive analysis." />
        <meta name="keywords" content="about brokeranalysis, broker review platform, trading experts, financial analysis team, broker comparison experts 2025" />
        <link rel="canonical" href="https://brokeranalysis.com/about" />
        <meta property="og:title" content="About BrokerAnalysis - Leading Broker Review Platform 2025" />
        <meta property="og:description" content="Learn about BrokerAnalysis, the trusted broker review platform helping traders find the best brokers since 2020. Our expert team provides unbiased reviews and comprehensive analysis." />
        <meta property="og:url" content="https://brokeranalysis.com/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About BrokerAnalysis - Leading Broker Review Platform 2025" />
        <meta name="twitter:description" content="Learn about BrokerAnalysis, the trusted broker review platform helping traders find the best brokers since 2020. Our expert team provides unbiased reviews and comprehensive analysis." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "BrokerAnalysis",
            "url": "https://brokeranalysis.com",
            "logo": "https://brokeranalysis.com/logo.png",
            "description": "Leading broker review and comparison platform providing unbiased analysis and expert insights for traders worldwide.",
            "foundingDate": "2020",
            "sameAs": [
              "https://twitter.com/brokeranalysis",
              "https://linkedin.com/company/brokeranalysis"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-BROKER",
              "contactType": "Customer Service",
              "email": "support@brokeranalysis.com"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                About <span className="text-blue-600">BrokerAnalysis</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                Your trusted partner in finding the perfect broker since 2020. We provide unbiased, 
                comprehensive analysis to help traders make informed decisions in 2025 and beyond.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  500+ Broker Reviews
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  2M+ Users Helped
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  50+ Countries Served
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  At BrokerAnalysis, we believe every trader deserves access to transparent, 
                  unbiased information about brokers. Our mission is to democratize trading 
                  by providing comprehensive reviews, detailed comparisons, and expert insights 
                  that empower traders to make confident decisions.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Since our founding in 2020, we've helped over 2 million traders find their 
                  ideal broker, saving them time, money, and frustration. As we move into 2025, 
                  we continue to innovate and expand our platform to serve the evolving needs 
                  of the global trading community.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Target className="w-5 h-5" />
                    <span className="font-semibold">Transparency First</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">Unbiased Reviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-600">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">Expert Analysis</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Values</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Independence:</strong> We maintain editorial independence and never let 
                      commercial relationships influence our reviews.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Accuracy:</strong> Our team conducts thorough research and testing 
                      to ensure all information is current and accurate.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>User-Centric:</strong> Every feature and review is designed with 
                      our users' needs and success in mind.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Expert Team
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our diverse team of financial experts, former traders, and technology specialists 
                brings decades of combined experience to deliver the most comprehensive broker analysis.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  JS
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">John Smith</h3>
                <p className="text-blue-600 font-semibold mb-3">Chief Executive Officer</p>
                <p className="text-gray-600 text-sm">
                  Former investment banker with 15+ years in financial markets. 
                  John founded BrokerAnalysis to bring transparency to broker selection.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  MJ
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Maria Johnson</h3>
                <p className="text-green-600 font-semibold mb-3">Head of Research</p>
                <p className="text-gray-600 text-sm">
                  CFA charterholder and former hedge fund analyst. Maria leads our 
                  research team in conducting comprehensive broker evaluations.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  DL
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">David Lee</h3>
                <p className="text-purple-600 font-semibold mb-3">Chief Technology Officer</p>
                <p className="text-gray-600 text-sm">
                  Former fintech engineer with expertise in trading platforms. 
                  David ensures our technology delivers the best user experience.
                </p>
              </div>

              {/* Team Member 4 */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  SC
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Chen</h3>
                <p className="text-orange-600 font-semibold mb-3">Senior Analyst</p>
                <p className="text-gray-600 text-sm">
                  Professional trader with 10+ years experience across forex, stocks, 
                  and derivatives. Sarah specializes in platform usability testing.
                </p>
              </div>

              {/* Team Member 5 */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  RB
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Robert Brown</h3>
                <p className="text-red-600 font-semibold mb-3">Regulatory Expert</p>
                <p className="text-gray-600 text-sm">
                  Former regulatory compliance officer with deep knowledge of 
                  global financial regulations and broker licensing requirements.
                </p>
              </div>

              {/* Team Member 6 */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  EW
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Emily Wilson</h3>
                <p className="text-teal-600 font-semibold mb-3">Content Director</p>
                <p className="text-gray-600 text-sm">
                  Financial journalist and content strategist. Emily ensures all 
                  our content is accurate, engaging, and valuable for traders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                BrokerAnalysis by the Numbers
              </h2>
              <p className="text-lg text-gray-600">
                Our impact on the trading community continues to grow in 2025
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600 font-semibold">Brokers Reviewed</div>
                <div className="text-sm text-gray-500 mt-1">Comprehensive analysis</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">2M+</div>
                <div className="text-gray-600 font-semibold">Users Helped</div>
                <div className="text-sm text-gray-500 mt-1">Successful matches</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600 font-semibold">Countries Served</div>
                <div className="text-sm text-gray-500 mt-1">Global reach</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">99.8%</div>
                <div className="text-gray-600 font-semibold">Accuracy Rate</div>
                <div className="text-sm text-gray-500 mt-1">Verified information</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Your Perfect Broker?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join millions of traders who trust BrokerAnalysis for unbiased broker reviews and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/compare"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Compare Brokers
              </a>
              <a
                href="/tools/find-my-broker"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Find My Broker
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;