/**
 * Generative Engine SEO Page Component
 * Demonstrates complete implementation of AI-answer-ready content
 * with structured data, SEO optimization, and proper formatting
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AIAnswerReadyContent } from './ai/AIAnswerReadyContent';
import { EnhancedStructuredData } from './seo/EnhancedStructuredData';
import { SEOMetaTags } from './seo/SEOMetaTags';
import { GenerativeEngineContentService, GenerativeEngineContent } from '../services/GenerativeEngineContentService';

interface GenerativeEnginePageProps {
  broker: any;
  language?: string;
}

export const GenerativeEnginePage: React.FC<GenerativeEnginePageProps> = ({ 
  broker, 
  language = 'en' 
}) => {
  const [content, setContent] = useState<GenerativeEngineContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateContent();
  }, [broker]);

  const generateContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate AI-answer-ready content
      const generatedContent = GenerativeEngineContentService.generateContent(broker);
      
      // Validate content
      const isValid = GenerativeEngineContentService.validateContent(generatedContent);
      if (!isValid) {
        throw new Error('Generated content failed validation');
      }
      
      setContent(generatedContent);
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate AI-answer-ready content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error || 'Failed to load content'}</p>
          <button 
            onClick={generateContent}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <SEOMetaTags 
        broker={broker}
        content={content}
        language={language}
      />
      
      {/* Enhanced Structured Data */}
      <EnhancedStructuredData 
        broker={broker}
        content={content}
      />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {broker.name} Review {new Date().getFullYear()}: Complete Analysis
          </h1>
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-4">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="hover:text-blue-600">Home</a></li>
              <li className="before:content-['/'] before:mx-2">Brokers</li>
              <li className="before:content-['/'] before:mx-2">{broker.name}</li>
            </ol>
          </nav>
          
          {/* Rating and Trust Score */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(broker.rating || 0) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-semibold">{broker.rating}/5</span>
              <span className="text-gray-600 ml-2">({broker.reviewCount} reviews)</span>
            </div>
            
            {broker.trustScore && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Trust Score:</span>
                <span className="text-lg font-semibold text-green-600">{broker.trustScore}/10</span>
              </div>
            )}
          </div>
          
          {/* Regulation Badges */}
          {broker.regulators && broker.regulators.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {broker.regulators.map((regulator: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {regulator} Regulated
                </span>
              ))}
            </div>
          )}
        </header>
        
        {/* AI-Answer-Ready Content */}
        <AIAnswerReadyContent 
          content={content}
          broker={broker}
        />
        
        {/* Additional SEO Content */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Review</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Author Bio */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Editorial Team</h3>
              <p className="text-gray-600 mb-4">
                Our expert editorial team conducts comprehensive broker analysis using standardized 
                criteria including regulation, trading costs, platform features, and customer support.
              </p>
              <a href="/methodology" className="text-blue-600 hover:text-blue-800 font-medium">
                View Our Review Methodology →
              </a>
            </div>
            
            {/* Last Updated */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Review Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Review Type:</span>
                  <span className="font-medium">Independent Analysis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Sources:</span>
                  <span className="font-medium">Official, Regulatory</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Disclaimer */}
        <section className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Risk Disclaimer</h3>
          <p className="text-yellow-700 text-sm">
            Trading forex and CFDs involves significant risk and may not be suitable for all investors. 
            Past performance is not indicative of future results. Please ensure you fully understand 
            the risks involved and seek independent advice if necessary.
          </p>
        </section>
      </div>
    </>
  );
};

/**
 * Static generation helper for broker pages
 */
export async function generateStaticProps(brokerId: string) {
  try {
    // This would fetch broker data from your database
    const broker = await fetchBrokerData(brokerId);
    
    if (!broker) {
      return {
        notFound: true
      };
    }
    
    return {
      props: {
        broker
      },
      revalidate: 3600 // Revalidate every hour
    };
  } catch (error) {
    console.error('Error generating static props:', error);
    return {
      notFound: true
    };
  }
}

/**
 * Placeholder function to fetch broker data
 */
async function fetchBrokerData(brokerId: string): Promise<any | null> {
  // This would integrate with your existing broker service
  // For demo purposes, return null
  return null;
}

export default GenerativeEnginePage;