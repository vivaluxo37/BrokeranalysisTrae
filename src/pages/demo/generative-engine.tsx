/**
 * Generative Engine SEO Demo Page
 * Complete demonstration of AI-answer-ready content generation
 * Shows TL;DR, Pros/Cons, Key Facts, FAQs, Editorial, and Internal Links
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { GenerativeEnginePage } from '../../components/GenerativeEnginePage';
import { GenerativeEngineContentService } from '../../services/GenerativeEngineContentService';

// Sample broker data for demonstration
const sampleBroker = {
  id: 'ig-markets',
  name: 'IG Markets',
  rating: 4.3,
  reviewCount: 1247,
  regulators: ['FCA', 'ASIC', 'MAS'],
  minDeposit: 250,
  maxLeverage: 30,
  spreadsFrom: 0.6,
  assetClasses: ['forex', 'cfds', 'stocks', 'indices', 'commodities'],
  platforms: ['mt4', 'proprietary', 'web', 'mobile'],
  category: 'forex',
  trustScore: 9.2,
  isRegulated: true,
  yearEstablished: 1974,
  headquarters: 'London, UK',
  website: 'https://www.ig.com',
  description: 'IG Markets is a leading global forex and CFD broker offering competitive spreads and advanced trading platforms.',
  keyFeatures: [
    'FCA, ASIC, MAS regulated',
    'MetaTrader 4 platform',
    'Competitive spreads from 0.6 pips',
    'Multiple asset classes',
    'Professional trading tools'
  ],
  details: {
    fullName: 'IG Markets Limited',
    businessModel: 'Market Maker',
    baseCurrency: 'GBP',
    supportHours: '24/5 (Mon-Fri)'
  },
  costs: {
    spreads: {
      EURUSD: 0.6,
      GBPUSD: 0.9,
      USDJPY: 0.7
    },
    commissions: {
      forex: 'No commission',
      stocks: 'From $10 per trade'
    },
    fees: {
      withdrawal: 'Free (bank transfer)',
      inactivity: '$15/month after 2 years'
    }
  },
  regulation: {
    fca: {
      license: '195355',
      status: 'Authorized'
    },
    asic: {
      license: '515106',
      status: 'Authorized'
    }
  }
};

const GenerativeEngineDemo: React.FC = () => {
  const [selectedBroker, setSelectedBroker] = useState(sampleBroker);
  const [showRawJSON, setShowRawJSON] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleGenerateContent = () => {
    const content = GenerativeEngineContentService.generateContent(selectedBroker);
    setGeneratedContent(content);
  };

  return (
    <>
      <Head>
        <title>Generative Engine SEO Demo - BrokerAnalysis</title>
        <meta name="description" content="Demonstration of AI-answer-ready content generation for Generative Engine SEO optimization" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Demo Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Generative Engine SEO Demo</h1>
                <p className="text-gray-600 mt-2">AI-answer-ready content generation for broker reviews</p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowRawJSON(!showRawJSON)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {showRawJSON ? 'Hide' : 'Show'} Raw JSON
                </button>
                
                <button
                  onClick={handleGenerateContent}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Generate Content
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Controls */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Demo Controls</h2>
                
                {/* Broker Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Broker
                  </label>
                  <div className="p-3 bg-gray-50 rounded border">
                    <div className="font-medium">{selectedBroker.name}</div>
                    <div className="text-sm text-gray-600">
                      Rating: {selectedBroker.rating}/5 ({selectedBroker.reviewCount} reviews)
                    </div>
                    <div className="text-sm text-gray-600">
                      Regulated by: {selectedBroker.regulators.join(', ')}
                    </div>
                  </div>
                </div>
                
                {/* Content Features */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Generated Content Includes:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      TL;DR (2 sentences)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Pros & Cons (5 each)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Key Facts Table
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      6 FAQs with Answers
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Editorial Summary (120-160 words)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Internal Link Suggestions
                    </li>
                  </ul>
                </div>
                
                {/* SEO Features */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">SEO Optimization:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Structured Data (JSON-LD)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Meta Tags & OG
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Entity Clarity
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      AI Crawler Friendly
                    </li>
                  </ul>
                </div>
                
                {/* API Endpoint */}
                <div className="p-3 bg-gray-100 rounded text-xs">
                  <div className="font-medium mb-1">API Endpoint:</div>
                  <code>/api/generative-engine</code>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {showRawJSON && generatedContent && (
                <div className="mb-8 bg-white rounded-lg shadow">
                  <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Generated JSON Output</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      This is the exact JSON format returned by the API
                    </p>
                  </div>
                  <div className="p-4">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
                      {JSON.stringify(generatedContent, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              {/* Rendered Page */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Rendered Broker Page</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    This shows how the AI-answer-ready content appears to users and search engines
                  </p>
                </div>
                
                <div className="border-2 border-dashed border-gray-200 m-4 rounded">
                  <GenerativeEnginePage 
                    broker={selectedBroker}
                    language="en"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Generative Engine SEO</h3>
                <p className="text-gray-600 text-sm">
                  Optimized for AI crawlers including GPTBot, Claude-Web, Google-Extended, 
                  and other LLM systems that power generative search engines.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Content Structure</h3>
                <p className="text-gray-600 text-sm">
                  Machine-quotable content blocks designed for LLM consumption, 
                  with clear entity mentions and structured data markup.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Authority Signals</h3>
                <p className="text-gray-600 text-sm">
                  Author bio, review methodology, regulatory citations, 
                  and internal linking for topic clustering and authority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerativeEngineDemo;