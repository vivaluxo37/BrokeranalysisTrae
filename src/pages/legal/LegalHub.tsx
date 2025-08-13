import React, { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { Shield, FileText, Search, Clock, Download, Eye, Scale, Lock, Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import { PageLayout } from '@/components/layout';
import { ProfessionalCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LegalDocument {
  id: string;
  title: string;
  description: string;
  category: 'Privacy' | 'Terms' | 'Compliance' | 'Policies';
  lastUpdated: string;
  readTime: string;
  icon: React.ComponentType<any>;
  href: string;
  importance: 'high' | 'medium' | 'low';
  tags: string[];
}

const LegalHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const legalDocuments: LegalDocument[] = [
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your personal information. GDPR and CCPA compliant.',
      category: 'Privacy',
      lastUpdated: '2025-01-01',
      readTime: '15 min',
      icon: Shield,
      href: '/legal/privacy-policy',
      importance: 'high',
      tags: ['GDPR', 'CCPA', 'data protection', 'cookies', 'personal data']
    },
    {
      id: 'terms-of-service',
      title: 'Terms of Service',
      description: 'Legal agreement governing your use of BrokerAnalysis platform and services.',
      category: 'Terms',
      lastUpdated: '2025-01-01',
      readTime: '20 min',
      icon: Scale,
      href: '/legal/terms-of-service',
      importance: 'high',
      tags: ['user agreement', 'platform rules', 'liability', 'termination']
    },
    {
      id: 'cookie-policy',
      title: 'Cookie Policy',
      description: 'Detailed information about cookies and tracking technologies we use.',
      category: 'Privacy',
      lastUpdated: '2025-01-01',
      readTime: '8 min',
      icon: Globe,
      href: '/legal/cookie-policy',
      importance: 'medium',
      tags: ['cookies', 'tracking', 'analytics', 'preferences']
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      description: 'Important disclaimers about our services, content, and financial information.',
      category: 'Policies',
      lastUpdated: '2025-01-01',
      readTime: '10 min',
      icon: AlertTriangle,
      href: '/legal/disclaimer',
      importance: 'high',
      tags: ['financial advice', 'risk warning', 'liability', 'accuracy']
    },
    {
      id: 'advertiser-disclosure',
      title: 'Advertiser Disclosure',
      description: 'Transparency about our advertising relationships and compensation.',
      category: 'Compliance',
      lastUpdated: '2025-01-01',
      readTime: '5 min',
      icon: Eye,
      href: '/legal/advertiser-disclosure',
      importance: 'medium',
      tags: ['advertising', 'compensation', 'transparency', 'affiliate']
    },
    {
      id: 'editorial-policy',
      title: 'Editorial Policy',
      description: 'Our commitment to editorial independence and content quality standards.',
      category: 'Policies',
      lastUpdated: '2025-01-01',
      readTime: '7 min',
      icon: FileText,
      href: '/legal/editorial-policy',
      importance: 'medium',
      tags: ['editorial independence', 'content quality', 'reviews', 'standards']
    }
  ];

  const categories = ['All', 'Privacy', 'Terms', 'Compliance', 'Policies'];

  const filteredDocuments = legalDocuments.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout
      title="Legal Center"
      description="Access all legal documents, policies, and compliance information for BrokerAnalysis."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Legal', current: true }
      ]}
    >
      <Helmet>
        <title>Legal Center - BrokerAnalysis Terms, Privacy & Compliance 2025</title>
        <meta name="description" content="Access all legal documents, privacy policies, terms of service, and compliance information for BrokerAnalysis platform." />
        <meta name="keywords" content="legal documents, privacy policy, terms of service, compliance, GDPR, CCPA, broker analysis legal" />
        <link rel="canonical" href="https://brokeranalysis.com/legal" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gray-900 text-white p-8 rounded-lg text-center">
          <Scale className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Legal Center</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Access all legal documents, policies, and compliance information for BrokerAnalysis. 
            We're committed to transparency and protecting your rights.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              GDPR Compliant
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              CCPA Compliant
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Regularly Updated
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <ProfessionalCard variant="compact" className="text-center hover:shadow-lg transition-shadow">
            <div className="p-6">
              <Shield className="w-8 h-8 text-accent-blue mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Rights</h3>
              <p className="text-sm text-gray-600 mb-4">
                Exercise your data protection rights under GDPR and CCPA
              </p>
              <Button size="sm" className="w-full">
                Manage Privacy
              </Button>
            </div>
          </ProfessionalCard>

          <ProfessionalCard variant="compact" className="text-center hover:shadow-lg transition-shadow">
            <div className="p-6">
              <Download className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Download Documents</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download PDF versions of all legal documents
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Download All
              </Button>
            </div>
          </ProfessionalCard>

          <ProfessionalCard variant="compact" className="text-center hover:shadow-lg transition-shadow">
            <div className="p-6">
              <FileText className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Legal Questions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contact our legal team for questions or concerns
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Contact Legal
              </Button>
            </div>
          </ProfessionalCard>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search legal documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredDocuments.length} of {legalDocuments.length} documents
          </div>
        </div>

        {/* Legal Documents */}
        <div className="grid gap-6">
          {filteredDocuments.map((doc) => {
            const IconComponent = doc.icon;
            return (
              <ProfessionalCard key={doc.id} variant="default" className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <IconComponent className="w-6 h-6 text-accent-blue" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{doc.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(doc.importance)}`}>
                            {doc.importance} priority
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{doc.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {doc.readTime}
                          </span>
                          <span>Last updated: {formatDate(doc.lastUpdated)}</span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {doc.category}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 4).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {doc.tags.length > 4 && (
                            <span className="text-xs text-gray-500">
                              +{doc.tags.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button asChild>
                        <Link to={doc.href}>
                          <Eye className="w-4 h-4 mr-2" />
                          Read Document
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </ProfessionalCard>
            );
          })}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No documents found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Legal Notice */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Notice</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Document Updates</h3>
              <p className="mb-4">
                We regularly review and update our legal documents to ensure compliance with 
                current laws and regulations. Material changes will be communicated to users 
                with appropriate notice periods.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Questions or Concerns</h3>
              <p className="mb-4">
                If you have questions about any of our legal documents or need clarification 
                on your rights and obligations, please contact our legal team at 
                legal@brokeranalysis.com.
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              This legal center provides access to all current versions of our legal documents. 
              By using BrokerAnalysis, you agree to be bound by these terms and policies. 
              Please review them regularly as they may be updated from time to time.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LegalHub;
