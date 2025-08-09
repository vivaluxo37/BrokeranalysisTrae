import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, Building } from 'lucide-react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', category: 'general', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact BrokerAnalysis - Get Expert Support &amp; Assistance 2025</title>
        <meta name="description" content="Contact BrokerAnalysis for expert support, broker inquiries, partnership opportunities, and technical assistance. Our team is here to help you find the perfect broker." />
        <meta name="keywords" content="contact brokeranalysis, broker support, trading help, customer service, partnership inquiries, technical support 2025" />
        <link rel="canonical" href="https://brokeranalysis.com/contact" />
        <meta property="og:title" content="Contact BrokerAnalysis - Get Expert Support &amp; Assistance 2025" />
        <meta property="og:description" content="Contact BrokerAnalysis for expert support, broker inquiries, partnership opportunities, and technical assistance. Our team is here to help you find the perfect broker." />
        <meta property="og:url" content="https://brokeranalysis.com/contact" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact BrokerAnalysis - Get Expert Support &amp; Assistance 2025" />
        <meta name="twitter:description" content="Contact BrokerAnalysis for expert support, broker inquiries, partnership opportunities, and technical assistance. Our team is here to help you find the perfect broker." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact BrokerAnalysis",
            "description": "Contact page for BrokerAnalysis - expert broker reviews and comparison platform",
            "url": "https://brokeranalysis.com/contact",
            "mainEntity": {
              "@type": "Organization",
              "name": "BrokerAnalysis",
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+1-555-BROKER",
                  "contactType": "Customer Service",
                  "email": "support@brokeranalysis.com",
                  "availableLanguage": ["English"],
                  "hoursAvailable": "Mo-Fr 09:00-18:00"
                },
                {
                  "@type": "ContactPoint",
                  "email": "partnerships@brokeranalysis.com",
                  "contactType": "Business Partnerships"
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Contact <span className="text-blue-600">BrokerAnalysis</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Get expert support, ask questions about brokers, or explore partnership opportunities. 
              Our team is here to help you succeed in 2025.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {/* General Support */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">General Support</h3>
                <p className="text-gray-600 mb-4">Questions about brokers, platform features, or account issues</p>
                <a href="mailto:support@brokeranalysis.com" className="text-blue-600 hover:text-blue-700 font-semibold">
                  support@brokeranalysis.com
                </a>
              </div>

              {/* Business Inquiries */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Business Inquiries</h3>
                <p className="text-gray-600 mb-4">Partnership opportunities, advertising, and business development</p>
                <a href="mailto:partnerships@brokeranalysis.com" className="text-green-600 hover:text-green-700 font-semibold">
                  partnerships@brokeranalysis.com
                </a>
              </div>

              {/* Technical Support */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Support</h3>
                <p className="text-gray-600 mb-4">Website issues, bugs, feature requests, and technical assistance</p>
                <a href="mailto:tech@brokeranalysis.com" className="text-purple-600 hover:text-purple-700 font-semibold">
                  tech@brokeranalysis.com
                </a>
              </div>

              {/* Phone Support */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">Speak directly with our expert team for urgent matters</p>
                <a href="tel:+1-555-BROKER" className="text-orange-600 hover:text-orange-700 font-semibold">
                  +1 (555) BROKER
                </a>
                <p className="text-sm text-gray-500 mt-2">Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">
                  Have a specific question or need personalized assistance? Fill out the form below 
                  and our expert team will get back to you within 24 hours.
                </p>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-green-800">
                      <Send className="w-5 h-5" />
                      <span className="font-semibold">Message sent successfully!</span>
                    </div>
                    <p className="text-green-700 mt-1">We'll get back to you within 24 hours.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-red-800">
                      <HelpCircle className="w-5 h-5" />
                      <span className="font-semibold">Error sending message</span>
                    </div>
                    <p className="text-red-700 mt-1">Please try again or contact us directly.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                      Inquiry Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General Support</option>
                      <option value="broker-inquiry">Broker Inquiry</option>
                      <option value="technical">Technical Issue</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Feedback &amp; Suggestions</option>
                      <option value="press">Press &amp; Media</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-8">
                  We're here to help you find the perfect broker and answer any questions 
                  about our platform. Choose the best way to reach us.
                </p>

                <div className="space-y-6">
                  {/* Office Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Office Address</h3>
                      <p className="text-gray-600">
                        123 Financial District<br />
                        New York, NY 10004<br />
                        United States
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                      <p className="text-gray-600">
                        General: support@brokeranalysis.com<br />
                        Business: partnerships@brokeranalysis.com<br />
                        Technical: tech@brokeranalysis.com
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                      <p className="text-gray-600">
                        +1 (555) BROKER<br />
                        International: +1 (555) 276-5377
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                        Saturday: 10:00 AM - 4:00 PM EST<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Response Times</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Email inquiries: Within 24 hours</li>
                    <li>• Phone support: Immediate during business hours</li>
                    <li>• Technical issues: Within 4-8 hours</li>
                    <li>• Partnership inquiries: Within 48 hours</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
                Quick answers to common questions about BrokerAnalysis
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">How do you review brokers?</h3>
                <p className="text-gray-600">
                  Our expert team conducts comprehensive reviews using a standardized methodology 
                  that evaluates over 100 criteria including regulation, fees, platforms, customer service, 
                  and more. We test each broker's services firsthand.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Are your reviews unbiased?</h3>
                <p className="text-gray-600">
                  Yes, we maintain complete editorial independence. While we may receive compensation 
                  from some brokers, this never influences our reviews or ratings. Our methodology 
                  and scoring remain consistent for all brokers.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">How often do you update broker information?</h3>
                <p className="text-gray-600">
                  We continuously monitor broker changes and update our reviews monthly or whenever 
                  significant changes occur. Our team tracks regulatory updates, fee changes, 
                  and platform improvements in real-time.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Can you help me choose a broker?</h3>
                <p className="text-gray-600">
                  Absolutely! Use our "Find My Broker" tool for personalized recommendations, 
                  or contact our support team for expert guidance based on your specific trading 
                  needs and preferences.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactUs;