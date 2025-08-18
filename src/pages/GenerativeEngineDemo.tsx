/**
 * Generative Engine SEO Demo Page
 * Demonstrates AI-answer-ready content generation from broker JSON
 * Shows complete implementation of machine-quotable content blocks
 */

import React, { useState, useEffect } from 'react';
import { GenerativeEngineContentService, GenerativeEngineContent } from '../services/GenerativeEngineContentService';
import AIAnswerReadyContent from '../components/seo/AIAnswerReadyContent';
import { SEOMetaTags, generateBrokerSEOMeta } from '../components/seo/SEOMetaTags';
import EnhancedStructuredData from '../components/seo/EnhancedStructuredData';

// Sample broker record JSON as requested by user
const SAMPLE_BROKER_JSON = {
  "id": "ig-markets",
  "name": "IG Markets",
  "rating": 4.3,
  "reviewCount": 1247,
  "regulators": ["FCA", "ASIC", "MAS"],
  "minDeposit": 250,
  "maxLeverage": "1:30",
  "spreadsFrom": "0.6",
  "assetClasses": ["forex", "cfds", "stocks", "indices", "commodities"],
  "platforms": ["mt4", "proprietary", "web", "mobile"],
  "category": "full-service",
  "trustScore": 9.2,
  "isRegulated": true,
  "yearEstablished": 1974,
  "headquarters": "London, UK",
  "website": "https://www.ig.com",
  "description": "IG Markets is a leading global CFD and forex broker regulated by the FCA, offering competitive spreads and advanced trading platforms.",
  "keyFeatures": [
    "FCA regulated",
    "17,000+ markets",
    "Award-winning platform",
    "Professional charts",
    "Risk management tools"
  ],
  "details": {
    "fullName": "IG Markets Limited",
    "businessModel": "Market Maker",
    "baseCurrency": "GBP",
    "supportHours": "24/5 (Mon-Fri)"
  },
  "costs": {
    "spreads": {
      "eur_usd": "0.6",
      "gbp_usd": "0.9",
      "usd_jpy": "0.7"
    },
    "commissions": "No commission on forex",
    "swapRates": "Variable",
    "fees": {
      "withdrawal": "Free (bank transfer)",
      "inactivity": "£12/month after 2 years",
      "currency_conversion": "0.5%"
    }
  },
  "regulation": {
    "fca": {
      "license": "195355",
      "status": "Authorized",
      "compensation": "£85,000 FSCS"
    },
    "asic": {
      "license": "515106",
      "status": "Authorized"
    }
  }
};

export default function GenerativeEngineDemo() {
  const [generatedContent, setGeneratedContent] = useState<GenerativeEngineContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showJSON, setShowJSON] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState(SAMPLE_BROKER_JSON);

  // Generate SEO meta data
  const seoMeta = generateBrokerSEOMeta(selectedBroker, 'en');

  useEffect(() => {
    generateContent();
  }, [selectedBroker]);

  const generateContent = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const content = GenerativeEngineContentService.generateContent(selectedBroker);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!generatedContent) return;
    
    const dataStr = JSON.stringify(generatedContent, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${selectedBroker.name.toLowerCase().replace(/\s+/g, '-')}-generative-content.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <SEOMetaTags 
        meta={{
          title: "Generative Engine SEO Demo - AI-Answer-Ready Content | BrokerAnalysis",
          description: "Demonstration of AI-optimized content generation for broker reviews. See how we create machine-quotable content blocks for Generative Engine SEO.",
          canonical: "https://brokeranalysis.com/demo/generative-engine",
          keywords: "generative engine SEO, AI content, broker reviews, machine quotable content",
          ogType: "website"
        }}
      />

      {/* Enhanced Structured Data */}
      <EnhancedStructuredData 
        broker={selectedBroker}
        content={generatedContent}
        pageType="demo"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Generative Engine SEO Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how we transform broker data into AI-answer-ready content blocks 
            optimized for machine quotability and source-worthy citations.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowJSON(!showJSON)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showJSON ? 'Hide' : 'Show'} Source JSON
              </button>
              
              <button
                onClick={generateContent}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Generating...' : 'Regenerate Content'}
              </button>
              
              {generatedContent && (
                <button
                  onClick={downloadJSON}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Download JSON
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              Broker: <span className="font-semibold">{selectedBroker.name}</span>
            </div>
          </div>
        </div>

        {/* Source JSON Display */}
        {showJSON && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Source Broker JSON
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{JSON.stringify(selectedBroker, null, 2)}</code>
            </pre>
          </div>
        )}

        {/* Generated Content Display */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating AI-answer-ready content...</p>
          </div>
        ) : generatedContent ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Generated AI-Answer-Ready Content
              </h2>
              <p className="text-gray-600">
                Content blocks optimized for LLM consumption and machine quotability
              </p>
            </div>
            
            <AIAnswerReadyContent 
              content={generatedContent}
              brokerName={selectedBroker.name}
              className="space-y-8"
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No content generated yet. Click "Generate Content" to start.</p>
          </div>
        )}

        {/* Generated JSON Output */}
        {generatedContent && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Generated JSON Output
            </h2>
            <p className="text-gray-600 mb-4">
              This is the exact JSON format requested: TL;DR, Pros/Cons, Key Facts, FAQs, Editorial, and Internal Links.
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{JSON.stringify(generatedContent, null, 2)}</code>
            </pre>
          </div>
        )}

        {/* Implementation Notes */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">
            Implementation Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">AI-Optimized Content</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• TL;DR in exactly 2 sentences</li>
                <li>• Bulleted Pros/Cons (5 each)</li>
                <li>• Structured Key Facts table</li>
                <li>• FAQs with Q as headings</li>
                <li>• 120-160 word editorial summary</li>
                <li>• Topic clustering internal links</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Entity Clarity</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Explicit mention of FCA, CySEC</li>
                <li>• MetaTrader 4/5 platform references</li>
                <li>• CFD and forex instrument clarity</li>
                <li>• Regulatory body citations</li>
                <li>• Authority source links</li>
                <li>• Author bio and methodology</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO Features */}
        <div className="bg-green-50 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-900">
            SEO & Structured Data Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Meta Tags</h3>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Clean titles (60 chars)</li>
                <li>• Optimized descriptions (160 chars)</li>
                <li>• Canonical URLs</li>
                <li>• Open Graph images</li>
                <li>• Twitter cards</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Structured Data</h3>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Review schema</li>
                <li>• AggregateRating schema</li>
                <li>• FAQPage schema</li>
                <li>• FinancialService schema</li>
                <li>• Article schema</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-2">AI Visibility</h3>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• AI-friendly robots.txt</li>
                <li>• Machine-quotable format</li>
                <li>• Source-worthy citations</li>
                <li>• Entity-rich content</li>
                <li>• Comparison sections</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}