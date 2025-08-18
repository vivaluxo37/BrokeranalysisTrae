/**
 * AI-Answer-Ready Content Component
 * Renders machine-quotable content blocks optimized for Generative Engine SEO
 * Structured for LLM consumption and source-worthy citations
 */

import React from 'react';
import { GenerativeEngineContent } from '../../services/GenerativeEngineContentService';

interface AIAnswerReadyContentProps {
  content: GenerativeEngineContent;
  brokerName: string;
  className?: string;
}

export function AIAnswerReadyContent({ 
  content, 
  brokerName, 
  className = '' 
}: AIAnswerReadyContentProps) {
  return (
    <div className={`ai-answer-ready-content ${className}`}>
      {/* TL;DR Section - Optimized for AI summarization */}
      <TLDRSection content={content.tldr} brokerName={brokerName} />
      
      {/* Pros and Cons - Bulleted format LLMs love */}
      <ProsConsSection pros={content.pros} cons={content.cons} />
      
      {/* Key Facts Table - Structured data format */}
      <KeyFactsSection facts={content.facts} />
      
      {/* FAQs with Q as headings - Perfect for AI extraction */}
      <FAQSection faqs={content.faqs} />
      
      {/* Editorial Summary - Neutral, comprehensive */}
      <EditorialSection editorial={content.editorial} brokerName={brokerName} />
      
      {/* Internal Links for Topic Clustering */}
      <InternalLinksSection links={content.internal_links} />
      
      {/* Authority Signals */}
      <AuthoritySection brokerName={brokerName} />
    </div>
  );
}

/**
 * TL;DR Section - 2 sentences for quick AI consumption
 */
function TLDRSection({ content, brokerName }: { content: string; brokerName: string }) {
  return (
    <section className="tldr-section" itemScope itemType="https://schema.org/SummaryText">
      <h2 className="text-xl font-semibold mb-3 text-gray-900">
        TL;DR: {brokerName} Quick Summary
      </h2>
      <div 
        className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg"
        itemProp="text"
      >
        <p className="text-gray-800 leading-relaxed font-medium">
          {content}
        </p>
      </div>
    </section>
  );
}

/**
 * Pros and Cons Section - Bulleted format for AI extraction
 */
function ProsConsSection({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <section className="pros-cons-section mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Pros and Cons Analysis
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="pros-container" itemScope itemType="https://schema.org/ItemList">
          <h3 className="text-lg font-medium mb-3 text-green-700 flex items-center">
            <span className="mr-2">✅</span>
            Pros
          </h3>
          <ul className="space-y-2" itemProp="itemListElement">
            {pros.map((pro, index) => (
              <li 
                key={index}
                className="flex items-start text-gray-700"
                itemScope 
                itemType="https://schema.org/ListItem"
              >
                <span className="text-green-500 mr-2 mt-1">•</span>
                <span itemProp="name">{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Cons */}
        <div className="cons-container" itemScope itemType="https://schema.org/ItemList">
          <h3 className="text-lg font-medium mb-3 text-red-700 flex items-center">
            <span className="mr-2">❌</span>
            Cons
          </h3>
          <ul className="space-y-2" itemProp="itemListElement">
            {cons.map((con, index) => (
              <li 
                key={index}
                className="flex items-start text-gray-700"
                itemScope 
                itemType="https://schema.org/ListItem"
              >
                <span className="text-red-500 mr-2 mt-1">•</span>
                <span itemProp="name">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * Key Facts Table - Structured data perfect for AI
 */
function KeyFactsSection({ facts }: { facts: GenerativeEngineContent['facts'] }) {
  return (
    <section className="key-facts-section mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Key Facts at a Glance
      </h2>
      
      <div 
        className="bg-gray-50 rounded-lg p-6"
        itemScope 
        itemType="https://schema.org/Table"
      >
        <table className="w-full" itemProp="about">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-700 w-1/3">
                Minimum Deposit
              </td>
              <td className="py-3 text-gray-900 font-semibold">
                {facts.min_deposit}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-700">
                Trading Platform
              </td>
              <td className="py-3 text-gray-900">
                {facts.platform}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-700">
                Fees Summary
              </td>
              <td className="py-3 text-gray-900">
                {facts.fees_summary}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-700">
                Base Currency
              </td>
              <td className="py-3 text-gray-900">
                {facts.base_currency}
              </td>
            </tr>
            <tr>
              <td className="py-3 font-medium text-gray-700">
                Support Hours
              </td>
              <td className="py-3 text-gray-900">
                {facts.support_hours}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

/**
 * FAQ Section - Questions as headings for AI extraction
 */
function FAQSection({ faqs }: { faqs: GenerativeEngineContent['faqs'] }) {
  return (
    <section 
      className="faq-section mt-8"
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="faq-item border border-gray-200 rounded-lg p-4"
            itemScope 
            itemType="https://schema.org/Question"
          >
            <h3 
              className="font-medium text-gray-900 mb-2"
              itemProp="name"
            >
              {faq.question}
            </h3>
            <div 
              itemScope 
              itemType="https://schema.org/Answer"
              itemProp="acceptedAnswer"
            >
              <p 
                className="text-gray-700 leading-relaxed"
                itemProp="text"
              >
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Editorial Section - Neutral, comprehensive summary
 */
function EditorialSection({ editorial, brokerName }: { editorial: string; brokerName: string }) {
  return (
    <section 
      className="editorial-section mt-8"
      itemScope 
      itemType="https://schema.org/Review"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Editorial Analysis
      </h2>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div 
          itemProp="reviewBody"
          className="text-gray-800 leading-relaxed"
        >
          {editorial}
        </div>
        
        {/* Review metadata */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <span itemProp="author" itemScope itemType="https://schema.org/Organization">
              <span itemProp="name">BrokerAnalysis Editorial Team</span>
            </span>
            <span className="mx-2">•</span>
            <time 
              itemProp="datePublished" 
              dateTime={new Date().toISOString()}
            >
              {new Date().toLocaleDateString()}
            </time>
          </div>
        </div>
        
        {/* Hidden structured data */}
        <div style={{ display: 'none' }}>
          <span itemProp="itemReviewed" itemScope itemType="https://schema.org/FinancialService">
            <span itemProp="name">{brokerName}</span>
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * Internal Links Section - Topic clustering
 */
function InternalLinksSection({ links }: { links: GenerativeEngineContent['internal_links'] }) {
  return (
    <section className="internal-links-section mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Related Broker Comparisons
      </h2>
      
      <div className="bg-blue-50 rounded-lg p-4">
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index} className="flex items-center">
              <span className="text-blue-500 mr-2">→</span>
              <a 
                href={link.target_slug}
                className="text-blue-700 hover:text-blue-900 hover:underline font-medium"
                rel="noopener"
              >
                {link.anchor}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Authority Section - Author bio and methodology
 */
function AuthoritySection({ brokerName }: { brokerName: string }) {
  return (
    <section className="authority-section mt-8 pt-6 border-t border-gray-200">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Author Bio */}
        <div 
          className="author-bio"
          itemScope 
          itemType="https://schema.org/Person"
        >
          <h3 className="text-lg font-medium mb-3 text-gray-900">
            About Our Analysis
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              Our {brokerName} review is conducted by the 
              <span itemProp="name"> BrokerAnalysis Editorial Team</span>, 
              consisting of financial analysts with over 10 years of combined 
              experience in forex and CFD markets. We follow strict 
              <a 
                href="/methodology" 
                className="text-blue-600 hover:underline"
              >
                review methodology
              </a> 
              to ensure unbiased, accurate assessments.
            </p>
          </div>
        </div>
        
        {/* Regulatory Citations */}
        <div className="regulatory-citations">
          <h3 className="text-lg font-medium mb-3 text-gray-900">
            Authoritative Sources
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                • <a 
                    href="https://www.fca.org.uk" 
                    className="text-blue-600 hover:underline"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Financial Conduct Authority (FCA)
                  </a>
              </li>
              <li>
                • <a 
                    href="https://www.cysec.gov.cy" 
                    className="text-blue-600 hover:underline"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Cyprus Securities and Exchange Commission (CySEC)
                  </a>
              </li>
              <li>
                • <a 
                    href="https://www.esma.europa.eu" 
                    className="text-blue-600 hover:underline"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    European Securities and Markets Authority (ESMA)
                  </a>
              </li>
              <li>
                • Official {brokerName} regulatory disclosures
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Comparison Mini-Section Component
 */
export function ComparisonMiniSection({ 
  broker1, 
  broker2, 
  className = '' 
}: { 
  broker1: any; 
  broker2: any; 
  className?: string; 
}) {
  return (
    <section 
      className={`comparison-mini-section ${className}`}
      itemScope 
      itemType="https://schema.org/ComparisonTable"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        {broker1.name} vs {broker2.name} Quick Comparison
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Feature</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">{broker1.name}</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">{broker2.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-3 font-medium text-gray-700">Regulation</td>
              <td className="px-4 py-3 text-gray-900">
                {broker1.isRegulated ? broker1.regulators?.join(', ') : 'Unregulated'}
              </td>
              <td className="px-4 py-3 text-gray-900">
                {broker2.isRegulated ? broker2.regulators?.join(', ') : 'Unregulated'}
              </td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-3 font-medium text-gray-700">Min Deposit</td>
              <td className="px-4 py-3 text-gray-900">${broker1.minDeposit || 0}</td>
              <td className="px-4 py-3 text-gray-900">${broker2.minDeposit || 0}</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-3 font-medium text-gray-700">Spreads From</td>
              <td className="px-4 py-3 text-gray-900">{broker1.spreadsFrom || 'Variable'} pips</td>
              <td className="px-4 py-3 text-gray-900">{broker2.spreadsFrom || 'Variable'} pips</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-3 font-medium text-gray-700">Rating</td>
              <td className="px-4 py-3 text-gray-900">{broker1.rating || 'N/A'}/5</td>
              <td className="px-4 py-3 text-gray-900">{broker2.rating || 'N/A'}/5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AIAnswerReadyContent;