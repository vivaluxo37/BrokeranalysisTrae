/**
 * Generative Engine SEO Components
 * AI-answer-ready content blocks for better LLM visibility
 */

import React from 'react';
import { SEOContentBlock } from '../../services/GenerativeEngineService';

interface GenerativeEngineContentProps {
  content: SEOContentBlock;
  brokerName: string;
}

export function GenerativeEngineContent({ content, brokerName }: GenerativeEngineContentProps) {
  return (
    <div className="generative-engine-content space-y-8">
      <TLDRSection content={content.tldr} />
      <ProsConsSection pros={content.pros} cons={content.cons} />
      <KeyFactsTable facts={content.facts} />
      <FAQSection faqs={content.faqs} />
      <EditorialSection content={content.editorial} />
      <InternalLinksSection links={content.internal_links} />
    </div>
  );
}

/**
 * TL;DR Section - Machine quotable summary
 */
function TLDRSection({ content }: { content: string }) {
  return (
    <section className="tldr-section bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
      <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
        <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold mr-3">TL;DR</span>
        Quick Summary
      </h2>
      <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
        {content}
      </p>
    </section>
  );
}

/**
 * Pros and Cons Section - Bulleted format LLMs love
 */
function ProsConsSection({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <section className="pros-cons-section">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Pros and Cons</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="pros bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            Pros
          </h3>
          <ul className="space-y-3">
            {pros.map((pro, index) => (
              <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-3 mt-1 flex-shrink-0">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="cons bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center">
            <span className="text-red-600 mr-2">✗</span>
            Cons
          </h3>
          <ul className="space-y-3">
            {cons.map((con, index) => (
              <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                <span className="text-red-500 mr-3 mt-1 flex-shrink-0">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * Key Facts Table - Structured data LLMs can easily parse
 */
function KeyFactsTable({ facts }: { facts: SEOContentBlock['facts'] }) {
  const factEntries = [
    { label: 'Minimum Deposit', value: facts.min_deposit, icon: '💰' },
    { label: 'Trading Platform', value: facts.platform, icon: '🖥️' },
    { label: 'Fees Summary', value: facts.fees_summary, icon: '📊' },
    { label: 'Base Currency', value: facts.base_currency, icon: '💱' },
    { label: 'Support Hours', value: facts.support_hours, icon: '🕐' }
  ];

  return (
    <section className="key-facts-section">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Key Facts</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Attribute
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {factEntries.map((fact, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  <span className="mr-2">{fact.icon}</span>
                  {fact.label}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {fact.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/**
 * FAQ Section - Questions as headings for better LLM parsing
 */
function FAQSection({ faqs }: { faqs: SEOContentBlock['faqs'] }) {
  return (
    <section className="faq-section">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Frequently Asked Questions</h2>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {faq.question}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Editorial Section - Neutral, comprehensive summary
 */
function EditorialSection({ content }: { content: string }) {
  return (
    <section className="editorial-section">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Editorial Review</h2>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
          {content}
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Methodology:</strong> Our reviews are based on comprehensive analysis of trading costs, 
            platform features, regulatory compliance, and verified user feedback. 
            <a href="/methodology" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline ml-1">
              Learn about our review process
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Internal Links Section - Topic clustering for SEO
 */
function InternalLinksSection({ links }: { links: SEOContentBlock['internal_links'] }) {
  return (
    <section className="internal-links-section">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Topics</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.target_slug}
            className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <span className="text-blue-700 dark:text-blue-300 font-medium hover:underline">
              {link.anchor}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

/**
 * Author Bio Component for Authority
 */
export function AuthorBio() {
  return (
    <section className="author-bio bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">About the Author</h3>
      
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
          BA
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">BrokerAnalysis Editorial Team</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Financial Services Analysts</p>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            Our team of financial analysts has over 15 years of combined experience in broker analysis, 
            regulatory compliance, and trading platform evaluation. We maintain strict editorial independence 
            and follow a comprehensive methodology for all broker reviews.
          </p>
          
          <a 
            href="/methodology" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline mt-2 inline-block"
          >
            View our review methodology →
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Citation Component for Authority
 */
export function CitationSection({ broker }: { broker: any }) {
  const citations = [
    {
      title: 'Regulatory Information',
      url: broker.regulation?.[0]?.verificationUrl || '#',
      description: `Official regulatory status verification for ${broker.name}`
    },
    {
      title: 'Official Website',
      url: broker.website || '#',
      description: `${broker.name} official website and platform access`
    },
    {
      title: 'Trading Platforms',
      url: '/platforms',
      description: 'Comprehensive platform comparison and analysis'
    }
  ];

  return (
    <section className="citations bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Sources & References</h3>
      
      <ul className="space-y-3">
        {citations.map((citation, index) => (
          <li key={index} className="flex items-start space-x-3">
            <span className="text-blue-600 font-mono text-sm mt-1">[{index + 1}]</span>
            <div>
              <a 
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline"
              >
                {citation.title}
              </a>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {citation.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}