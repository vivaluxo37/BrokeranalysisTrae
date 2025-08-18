/**
 * Generative Engine API Endpoint
 * Generates AI-answer-ready content from broker JSON data
 * Returns exact format: tldr, pros, cons, facts, faqs, editorial, internal_links
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { GenerativeEngineContentService, GenerativeEngineContent } from '../services/GenerativeEngineContentService';

export interface GenerativeEngineRequest {
  broker: any; // Broker JSON data
  options?: {
    includeStructuredData?: boolean;
    includeSEOMeta?: boolean;
    language?: string;
  };
}

export interface GenerativeEngineResponse {
  success: boolean;
  data?: GenerativeEngineContent;
  structuredData?: any;
  seoMeta?: any;
  error?: string;
  timestamp: string;
  processingTime: number;
}

/**
 * Main API handler for generating AI-answer-ready content
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerativeEngineResponse>
) {
  const startTime = Date.now();
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    });
  }

  try {
    const { broker, options = {} } = req.body as GenerativeEngineRequest;

    // Validate broker data
    if (!broker || !broker.name) {
      return res.status(400).json({
        success: false,
        error: 'Invalid broker data. Broker object with name is required.',
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      });
    }

    // Generate AI-answer-ready content
    const content = GenerativeEngineContentService.generateContent(broker);

    // Validate generated content
    const isValid = GenerativeEngineContentService.validateContent(content);
    if (!isValid) {
      return res.status(500).json({
        success: false,
        error: 'Generated content failed validation checks.',
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      });
    }

    // Prepare response
    const response: GenerativeEngineResponse = {
      success: true,
      data: content,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    };

    // Add structured data if requested
    if (options.includeStructuredData) {
      response.structuredData = generateStructuredData(broker, content);
    }

    // Add SEO meta if requested
    if (options.includeSEOMeta) {
      const { generateBrokerSEOMeta } = await import('../components/seo/SEOMetaTags');
      response.seoMeta = generateBrokerSEOMeta(broker, options.language || 'en');
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return res.status(200).json(response);

  } catch (error) {
    console.error('Generative Engine API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error while generating content.',
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    });
  }
}

/**
 * Generate structured data for the broker and content
 */
function generateStructuredData(broker: any, content: GenerativeEngineContent) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // Financial Service
      {
        '@type': 'FinancialService',
        '@id': `https://brokeranalysis.com/brokers/${broker.id}#service`,
        'name': broker.name,
        'description': content.tldr,
        'url': broker.website,
        'serviceType': 'Forex and CFD Broker',
        'areaServed': 'Global',
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'Trading Services',
          'itemListElement': broker.assetClasses?.map((asset: string, index: number) => ({
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': `${asset.charAt(0).toUpperCase() + asset.slice(1)} Trading`
            },
            'position': index + 1
          })) || []
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': broker.rating || 0,
          'reviewCount': broker.reviewCount || 0,
          'bestRating': 5,
          'worstRating': 1
        }
      },
      
      // Review
      {
        '@type': 'Review',
        '@id': `https://brokeranalysis.com/brokers/${broker.id}#review`,
        'itemReviewed': {
          '@id': `https://brokeranalysis.com/brokers/${broker.id}#service`
        },
        'reviewBody': content.editorial,
        'author': {
          '@type': 'Organization',
          'name': 'BrokerAnalysis Editorial Team'
        },
        'datePublished': new Date().toISOString(),
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': broker.rating || 0,
          'bestRating': 5,
          'worstRating': 1
        },
        'positiveNotes': content.pros,
        'negativeNotes': content.cons
      },
      
      // FAQ Page
      {
        '@type': 'FAQPage',
        '@id': `https://brokeranalysis.com/brokers/${broker.id}#faq`,
        'mainEntity': content.faqs.map((faq, index) => ({
          '@type': 'Question',
          '@id': `https://brokeranalysis.com/brokers/${broker.id}#faq-${index + 1}`,
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      },
      
      // Article
      {
        '@type': 'Article',
        '@id': `https://brokeranalysis.com/brokers/${broker.id}#article`,
        'headline': `${broker.name} Review ${new Date().getFullYear()}: Complete Analysis`,
        'description': content.tldr,
        'author': {
          '@type': 'Organization',
          'name': 'BrokerAnalysis Editorial Team'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'BrokerAnalysis',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://brokeranalysis.com/logo.png'
          }
        },
        'datePublished': new Date().toISOString(),
        'dateModified': new Date().toISOString(),
        'mainEntityOfPage': `https://brokeranalysis.com/brokers/${broker.id}`,
        'articleSection': 'Broker Reviews',
        'keywords': [
          `${broker.name} review`,
          'forex broker',
          'CFD trading',
          'regulated broker',
          ...(broker.regulators || [])
        ].join(', ')
      }
    ]
  };
  
  return structuredData;
}

/**
 * Utility function to generate content for a specific broker ID
 */
export async function generateContentForBroker(brokerId: string): Promise<GenerativeEngineContent | null> {
  try {
    // This would typically fetch from your broker database
    // For demo purposes, we'll use a placeholder
    const broker = await fetchBrokerById(brokerId);
    if (!broker) return null;
    
    return GenerativeEngineContentService.generateContent(broker);
  } catch (error) {
    console.error('Error generating content for broker:', error);
    return null;
  }
}

/**
 * Placeholder function to fetch broker data
 * Replace with your actual broker service
 */
async function fetchBrokerById(brokerId: string): Promise<any | null> {
  // This would integrate with your existing broker service
  // For now, return null as this is a placeholder
  return null;
}

/**
 * Batch generate content for multiple brokers
 */
export async function batchGenerateContent(brokerIds: string[]): Promise<Record<string, GenerativeEngineContent | null>> {
  const results: Record<string, GenerativeEngineContent | null> = {};
  
  // Process in batches to avoid overwhelming the system
  const batchSize = 10;
  for (let i = 0; i < brokerIds.length; i += batchSize) {
    const batch = brokerIds.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (brokerId) => {
      const content = await generateContentForBroker(brokerId);
      return { brokerId, content };
    });
    
    const batchResults = await Promise.all(batchPromises);
    
    batchResults.forEach(({ brokerId, content }) => {
      results[brokerId] = content;
    });
  }
  
  return results;
}

/**
 * Export types for use in other files
 */
export type { GenerativeEngineContent, GenerativeEngineRequest, GenerativeEngineResponse };