/**
 * Broker Review Parser for BrokerChooser.com
 * Extracts structured data from broker review pages with resilient parsing
 */

import * as cheerio from 'cheerio';
import crypto from 'crypto';

class BrokerReviewParser {
  constructor(options = {}) {
    this.debug = options.debug || false;
    this.strictMode = options.strictMode || false;
  }

  /**
   * Generate SHA256 hash for content
   */
  generateHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Clean and normalize text content
   */
  cleanText(text) {
    if (!text) return '';
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim();
  }

  /**
   * Extract text content from HTML, preserving structure
   */
  extractTextContent(html) {
    const $ = cheerio.load(html);
    
    // Remove script, style, and other non-content elements
    $('script, style, nav, header, footer, .cookie-banner, .advertisement').remove();
    
    // Get main content
    const mainContent = $('main, .main-content, .content, article, .article').first();
    const textContent = mainContent.length > 0 ? mainContent.text() : $('body').text();
    
    return this.cleanText(textContent);
  }

  /**
   * Extract metadata from HTML
   */
  extractMetadata(html, url = '') {
    const $ = cheerio.load(html);
    
    const metadata = {
      title: $('title').text() || $('h1').first().text() || '',
      description: $('meta[name="description"]').attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content') || '',
      author: $('meta[name="author"]').attr('content') || '',
      publishedTime: $('meta[property="article:published_time"]').attr('content') || 
                     $('meta[name="article:published_time"]').attr('content') || '',
      modifiedTime: $('meta[property="article:modified_time"]').attr('content') || 
                    $('meta[name="article:modified_time"]').attr('content') || '',
      canonicalUrl: $('link[rel="canonical"]').attr('href') || '',
      ogTitle: $('meta[property="og:title"]').attr('content') || '',
      ogDescription: $('meta[property="og:description"]').attr('content') || '',
      ogImage: $('meta[property="og:image"]').attr('content') || '',
      twitterTitle: $('meta[name="twitter:title"]').attr('content') || '',
      twitterDescription: $('meta[name="twitter:description"]').attr('content') || '',
      lang: $('html').attr('lang') || 'en',
      pageType: this.detectPageType(url, $)
    };
    
    // Clean metadata
    Object.keys(metadata).forEach(key => {
      if (typeof metadata[key] === 'string') {
        metadata[key] = this.cleanText(metadata[key]);
      }
    });
    
    return metadata;
  }

  /**
   * Detect page type based on URL and content
   */
  detectPageType(url, $) {
    if (!url) return 'unknown';
    
    if (this.isBrokerReviewPage(url)) {
      return 'broker_review';
    } else if (url.includes('/blog/')) {
      return 'blog';
    } else if (url.includes('/guides/')) {
      return 'guide';
    } else if (url.includes('/about')) {
      return 'about';
    } else if (url.includes('/contact')) {
      return 'contact';
    }
    
    return 'page';
  }

  /**
   * Check if URL is a broker review page
   */
  isBrokerReviewPage(url) {
    if (!url || typeof url !== 'string' || !url.includes('/broker-reviews/')) {
      return false;
    }
    
    // Must have a specific broker name after /broker-reviews/
    const match = url.match(/\/broker-reviews\/([^/]+)\/?/);
    return !!(match && match[1] && match[1].length > 0);
  }

  /**
   * Extract broker rating from various possible locations
   */
  extractRating($) {
    const ratingSelectors = [
      '.rating-value',
      '.score',
      '.rating-score',
      '.overall-rating',
      '[data-rating]',
      '.stars .rating',
      '.review-rating',
      '.broker-rating'
    ];
    
    for (const selector of ratingSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        // Try to extract numeric rating
        const text = element.text().trim();
        const dataRating = element.attr('data-rating');
        
        // Check data attribute first
        if (dataRating) {
          const rating = parseFloat(dataRating);
          if (!isNaN(rating) && rating >= 0 && rating <= 10) {
            return rating;
          }
        }
        
        // Parse text content
        const match = text.match(/([0-9]+\.?[0-9]*)/);;
        if (match) {
          const rating = parseFloat(match[1]);
          if (!isNaN(rating) && rating >= 0 && rating <= 10) {
            return rating;
          }
        }
      }
    }
    
    return null;
  }

  /**
   * Extract pros and cons lists
   */
  extractProsAndCons($) {
    const pros = [];
    const cons = [];
    
    // Look for pros section
    const prosSelectors = [
      '.pros ul li, .pros ol li',
      '.advantages ul li, .advantages ol li',
      '.positive ul li, .positive ol li',
      '[class*="pro"] ul li, [class*="pro"] ol li',
      'h2:contains("Pros"), h3:contains("Pros"), h2:contains("Advantages"), h3:contains("Advantages")',
      'h2:contains("Positive"), h3:contains("Positive")'
    ];
    
    // Look for cons section
    const consSelectors = [
      '.cons ul li, .cons ol li',
      '.disadvantages ul li, .disadvantages ol li',
      '.negative ul li, .negative ol li',
      '[class*="con"] ul li, [class*="con"] ol li',
      'h2:contains("Cons"), h3:contains("Cons"), h2:contains("Disadvantages"), h3:contains("Disadvantages")',
      'h2:contains("Negative"), h3:contains("Negative")'
    ];
    
    // Extract pros
    prosSelectors.forEach(selector => {
      $(selector).each((i, el) => {
        const text = this.cleanText($(el).text());
        if (text && !pros.includes(text)) {
          pros.push(text);
        }
      });
    });
    
    // Extract cons
    consSelectors.forEach(selector => {
      $(selector).each((i, el) => {
        const text = this.cleanText($(el).text());
        if (text && !cons.includes(text)) {
          cons.push(text);
        }
      });
    });
    
    // Alternative approach: look for headings and following lists
    $('h2, h3, h4').each((i, el) => {
      const heading = $(el).text().toLowerCase();
      const nextList = $(el).next('ul, ol');
      
      if (nextList.length > 0) {
        if (heading.includes('pro') || heading.includes('advantage') || heading.includes('positive')) {
          nextList.find('li').each((j, li) => {
            const text = this.cleanText($(li).text());
            if (text && !pros.includes(text)) {
              pros.push(text);
            }
          });
        } else if (heading.includes('con') || heading.includes('disadvantage') || heading.includes('negative')) {
          nextList.find('li').each((j, li) => {
            const text = this.cleanText($(li).text());
            if (text && !cons.includes(text)) {
              cons.push(text);
            }
          });
        }
      }
    });
    
    return { pros, cons };
  }

  /**
   * Extract review sections based on headings
   */
  extractSections($) {
    const sections = {
      fees: '',
      non_trading_fees: '',
      platforms: '',
      research: '',
      education: '',
      account_opening: '',
      deposits_withdrawals: '',
      customer_service: '',
      safety: '',
      products: '',
      regulation: '',
      order_types: '',
      mobile_app: '',
      desktop: '',
      web_trader: '',
      usability: '',
      portfolio_analysis: '',
      alerts: '',
      insights: ''
    };
    
    const unmappedSections = {};
    
    // Section mapping patterns
    const sectionMappings = {
      fees: ['fee', 'cost', 'commission', 'spread', 'pricing'],
      non_trading_fees: ['non-trading', 'withdrawal', 'deposit', 'inactivity'],
      platforms: ['platform', 'trading platform', 'software'],
      research: ['research', 'analysis', 'market research'],
      education: ['education', 'learning', 'tutorial', 'course'],
      account_opening: ['account opening', 'registration', 'sign up'],
      deposits_withdrawals: ['deposit', 'withdrawal', 'funding'],
      customer_service: ['customer service', 'support', 'help'],
      safety: ['safety', 'security', 'protection'],
      products: ['product', 'instrument', 'asset'],
      regulation: ['regulation', 'license', 'regulatory'],
      order_types: ['order', 'execution'],
      mobile_app: ['mobile', 'app', 'smartphone'],
      desktop: ['desktop', 'download'],
      web_trader: ['web', 'browser', 'online'],
      usability: ['usability', 'user experience', 'interface'],
      portfolio_analysis: ['portfolio', 'analysis'],
      alerts: ['alert', 'notification'],
      insights: ['insight', 'recommendation']
    };
    
    // Find headings and extract content
    $('h1, h2, h3, h4, h5, h6').each((i, el) => {
      const heading = $(el).text().toLowerCase().trim();
      if (!heading) return;
      
      // Get content until next heading
      let content = '';
      let nextElement = $(el).next();
      
      while (nextElement.length > 0 && !nextElement.is('h1, h2, h3, h4, h5, h6')) {
        content += ' ' + nextElement.text();
        nextElement = nextElement.next();
      }
      
      content = this.cleanText(content);
      if (!content) return;
      
      // Try to map to known sections
      let mapped = false;
      for (const [sectionKey, keywords] of Object.entries(sectionMappings)) {
        if (keywords.some(keyword => heading.includes(keyword))) {
          if (!sections[sectionKey]) {
            sections[sectionKey] = content;
          } else {
            sections[sectionKey] += ' ' + content;
          }
          mapped = true;
          break;
        }
      }
      
      // Store unmapped sections
      if (!mapped) {
        unmappedSections[heading] = content;
      }
    });
    
    // Clean sections
    Object.keys(sections).forEach(key => {
      sections[key] = this.cleanText(sections[key]);
    });
    
    return { sections, unmappedSections };
  }

  /**
   * Extract last updated date
   */
  extractLastUpdated($) {
    const dateSelectors = [
      '.last-updated',
      '.updated-date',
      '.modified-date',
      '[datetime]',
      'time',
      '.date-updated'
    ];
    
    for (const selector of dateSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        const datetime = element.attr('datetime') || element.text();
        if (datetime) {
          const date = new Date(datetime);
          if (!isNaN(date.getTime())) {
            return date.toISOString();
          }
        }
      }
    }
    
    return null;
  }

  /**
   * Parse a broker review page
   */
  parseBrokerReview(html, url) {
    if (!this.isBrokerReviewPage(url)) {
      throw new Error('URL is not a broker review page');
    }
    
    const $ = cheerio.load(html);
    const metadata = this.extractMetadata(html, url);
    const textContent = this.extractTextContent(html);
    
    // Extract structured review data
    const rating = this.extractRating($);
    const { pros, cons } = this.extractProsAndCons($);
    const { sections, unmappedSections } = this.extractSections($);
    const lastUpdated = this.extractLastUpdated($);
    
    // Extract broker name from URL or title
    const urlParts = url.split('/');
    const brokerSlug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
    const brokerName = brokerSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const reviewData = {
      url: url,
      title: metadata.title,
      brokerName: brokerName,
      brokerSlug: brokerSlug,
      rating: rating,
      lastUpdated: lastUpdated || metadata.modifiedTime || metadata.publishedTime,
      pros: pros,
      cons: cons,
      sections: sections,
      unmappedSections: unmappedSections,
      metadata: metadata,
      textContent: textContent,
      contentHash: this.generateHash(textContent),
      parsedAt: new Date().toISOString()
    };
    
    if (this.debug) {
      console.log(`📊 Parsed review for ${brokerName}:`);
      console.log(`   Rating: ${rating || 'N/A'}`);
      console.log(`   Pros: ${pros.length} items`);
      console.log(`   Cons: ${cons.length} items`);
      console.log(`   Sections: ${Object.keys(sections).filter(k => sections[k]).length} mapped`);
      console.log(`   Unmapped: ${Object.keys(unmappedSections).length} sections`);
    }
    
    return reviewData;
  }

  /**
   * Parse any page (not just broker reviews)
   */
  parsePage(html, url) {
    const $ = cheerio.load(html);
    const metadata = this.extractMetadata(html, url);
    const textContent = this.extractTextContent(html);
    
    const pageData = {
      url: url,
      title: metadata.title,
      pageType: this.isBrokerReviewPage(url) ? 'broker_review' : 'general',
      metadata: metadata,
      textContent: textContent,
      contentHash: this.generateHash(textContent),
      parsedAt: new Date().toISOString()
    };
    
    // If it's a broker review, add review-specific data
    if (this.isBrokerReviewPage(url)) {
      try {
        const reviewData = this.parseBrokerReview(html, url);
        pageData.reviewData = {
          brokerName: reviewData.brokerName,
          brokerSlug: reviewData.brokerSlug,
          rating: reviewData.rating,
          lastUpdated: reviewData.lastUpdated,
          pros: reviewData.pros,
          cons: reviewData.cons,
          sections: reviewData.sections,
          unmappedSections: reviewData.unmappedSections
        };
      } catch (error) {
        if (this.debug) {
          console.warn(`⚠️ Failed to parse review data for ${url}: ${error.message}`);
        }
      }
    }
    
    return pageData;
  }

  /**
   * Validate parsed data
   */
  validateParsedData(data) {
    const errors = [];
    
    if (!data.url) errors.push('Missing URL');
    if (!data.title) errors.push('Missing title');
    if (!data.textContent) errors.push('Missing text content');
    if (!data.contentHash) errors.push('Missing content hash');
    
    if (data.pageType === 'broker_review' && data.reviewData) {
      if (!data.reviewData.brokerName) errors.push('Missing broker name');
      if (data.reviewData.rating !== null && (data.reviewData.rating < 0 || data.reviewData.rating > 10)) {
        errors.push('Invalid rating value');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

export default BrokerReviewParser;

// For testing purposes
if (import.meta.url === `file://${process.argv[1]}`) {
  const parser = new BrokerReviewParser({ debug: true });
  
  // Test with sample HTML (you would replace this with actual fetched content)
  const sampleHtml = `
    <html>
      <head>
        <title>eToro Review 2024 - Pros, Cons, and Rating</title>
        <meta name="description" content="Comprehensive eToro review covering fees, platforms, and features.">
      </head>
      <body>
        <h1>eToro Review</h1>
        <div class="rating-value">8.5</div>
        <h2>Pros</h2>
        <ul>
          <li>Social trading features</li>
          <li>User-friendly platform</li>
        </ul>
        <h2>Cons</h2>
        <ul>
          <li>Limited research tools</li>
          <li>High withdrawal fees</li>
        </ul>
        <h2>Trading Fees</h2>
        <p>eToro charges competitive spreads...</p>
      </body>
    </html>
  `;
  
  const testUrl = 'https://brokerchooser.com/broker-reviews/etoro/';
  
  try {
    console.log('🧪 Testing parser with sample data...');
    const result = parser.parsePage(sampleHtml, testUrl);
    
    console.log('🎯 Parse result:');
    console.log(JSON.stringify(result, null, 2));
    
    const validation = parser.validateParsedData(result);
    console.log('✅ Validation:', validation);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}