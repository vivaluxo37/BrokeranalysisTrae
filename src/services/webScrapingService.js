import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import pLimit from 'p-limit';
import { XMLParser } from 'fast-xml-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize XML parser
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

// Rate limiting for concurrent requests
const limit = pLimit(5); // Max 5 concurrent requests

class WebScrapingService {
  constructor() {
    // Load environment variables
    dotenv.config();

    // Initialize Supabase client
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Configure Bright Data settings
    this.brightDataConfig = {
      endpoint: 'https://api.brightdata.com/request',
      apiKey: process.env.BRIGHTDATA_API_KEY,
      zone: process.env.BRIGHTDATA_ZONE
    };

    // Initialize XML parser for sitemaps
    this.xmlParser = new XMLParser({ ignoreAttributes: false });

    // Rate limiting
    this.limit = pLimit(6); // Increased to 6 concurrent requests as per reference
  }

  /**
   * Generate SHA256 hash for content deduplication
   */
  generateSHA256(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Extract text content from HTML
   */
  extractTextContent(html) {
    const $ = cheerio.load(html);
    
    // Remove script and style elements
    $('script, style, noscript').remove();
    
    // Get text content and clean it up
    return $('body').text()
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract metadata from HTML
   */
  extractMetadata(html) {
    const $ = cheerio.load(html);
    const metadata = {};

    // Extract title
    const title = $('title').text().trim();
    if (title) metadata.title = title;

    // Extract meta description
    const description = $('meta[name="description"]').attr('content');
    if (description) metadata.description = description.trim();

    // Extract meta keywords
    const keywords = $('meta[name="keywords"]').attr('content');
    if (keywords) metadata.keywords = keywords.trim();

    // Extract Open Graph data
    $('meta[property^="og:"]').each((i, elem) => {
      const property = $(elem).attr('property');
      const content = $(elem).attr('content');
      if (property && content) {
        const key = property.replace('og:', 'og_');
        metadata[key] = content;
      }
    });

    // Extract Twitter Card data
    $('meta[name^="twitter:"]').each((i, elem) => {
      const name = $(elem).attr('name');
      const content = $(elem).attr('content');
      if (name && content) {
        const key = name.replace('twitter:', 'twitter_');
        metadata[key] = content;
      }
    });

    // Extract canonical URL
    const canonical = $('link[rel="canonical"]').attr('href');
    if (canonical) metadata.canonical = canonical;

    // Extract language
    const lang = $('html').attr('lang') || $('meta[http-equiv="content-language"]').attr('content');
    if (lang) metadata.language = lang;

    return metadata;
  }

  /**
   * Extract structured data from HTML (JSON-LD, microdata, etc.)
   */
  extractStructuredData(html, url) {
    const $ = cheerio.load(html);
    const structuredData = {
      url: url,
      extracted_at: new Date().toISOString(),
      json_ld: [],
      microdata: {},
      broker_specific: {}
    };

    // Extract JSON-LD structured data
    $('script[type="application/ld+json"]').each((i, elem) => {
      try {
        const jsonLd = JSON.parse($(elem).html());
        structuredData.json_ld.push(jsonLd);
      } catch (error) {
        console.warn('Failed to parse JSON-LD:', error.message);
      }
    });

    // Extract broker-specific information
    this.extractBrokerInfo($, structuredData.broker_specific);

    // Extract contact information
    this.extractContactInfo($, structuredData);

    // Extract ratings and reviews
    this.extractRatingsInfo($, structuredData);

    return structuredData;
  }

  /**
   * Extract broker-specific information
   */
  extractBrokerInfo($, brokerData) {
    // Common broker information patterns
    const patterns = {
      regulation: ['regulation', 'regulated', 'license', 'authorized'],
      spreads: ['spread', 'pip', 'commission'],
      platforms: ['platform', 'mt4', 'mt5', 'trading platform'],
      instruments: ['instrument', 'asset', 'forex', 'cfd', 'stock'],
      leverage: ['leverage', 'margin'],
      deposit: ['deposit', 'minimum deposit', 'funding']
    };

    // Search for broker information in text content
    const text = $('body').text().toLowerCase();
    
    Object.keys(patterns).forEach(category => {
      const matches = [];
      patterns[category].forEach(keyword => {
        if (text.includes(keyword)) {
          // Extract surrounding context
          const regex = new RegExp(`(.{0,50}${keyword}.{0,50})`, 'gi');
          const contextMatches = text.match(regex);
          if (contextMatches) {
            matches.push(...contextMatches);
          }
        }
      });
      if (matches.length > 0) {
        brokerData[category] = matches;
      }
    });

    // Extract specific elements
    const regulationInfo = $('[class*="regulation"], [id*="regulation"], [data-regulation]').text().trim();
    if (regulationInfo) brokerData.regulation_text = regulationInfo;

    const spreadInfo = $('[class*="spread"], [id*="spread"], [data-spread]').text().trim();
    if (spreadInfo) brokerData.spread_text = spreadInfo;
  }

  /**
   * Extract contact information
   */
  extractContactInfo($, data) {
    data.contact = {};

    // Extract email addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = $('body').text().match(emailRegex);
    if (emails) data.contact.emails = [...new Set(emails)];

    // Extract phone numbers
    const phoneRegex = /[\+]?[1-9]?[0-9]{7,15}/g;
    const phones = $('body').text().match(phoneRegex);
    if (phones) data.contact.phones = [...new Set(phones)];

    // Extract social media links
    const socialLinks = {};
    $('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="instagram.com"]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href.includes('facebook.com')) socialLinks.facebook = href;
      if (href.includes('twitter.com')) socialLinks.twitter = href;
      if (href.includes('linkedin.com')) socialLinks.linkedin = href;
      if (href.includes('instagram.com')) socialLinks.instagram = href;
    });
    if (Object.keys(socialLinks).length > 0) {
      data.contact.social_media = socialLinks;
    }
  }

  /**
   * Extract ratings and review information
   */
  extractRatingsInfo($, data) {
    data.ratings = {};

    // Look for rating elements
    const ratingSelectors = [
      '[class*="rating"]',
      '[class*="score"]',
      '[class*="star"]',
      '[data-rating]',
      '.rating',
      '.score',
      '.stars'
    ];

    ratingSelectors.forEach(selector => {
      $(selector).each((i, elem) => {
        const text = $(elem).text().trim();
        const ratingMatch = text.match(/([0-9]+(\.[0-9]+)?)\s*\/\s*([0-9]+)/); // e.g., "4.5/5"
        if (ratingMatch) {
          data.ratings[`rating_${i}`] = {
            score: parseFloat(ratingMatch[1]),
            max: parseInt(ratingMatch[3]),
            text: text
          };
        }
      });
    });

    // Extract review count
    const reviewCountRegex = /([0-9,]+)\s*(review|rating)s?/gi;
    const reviewMatches = $('body').text().match(reviewCountRegex);
    if (reviewMatches) {
      data.ratings.review_counts = reviewMatches;
    }
  }

  /**
   * Fetch page content using Web Unlocker Direct API (primary method)
   */
  async fetchWithUnlocker(url, options = {}) {
    const {
      timeout = 120000,
      retries = 3
    } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔓 Fetching with Web Unlocker ${url} (attempt ${attempt}/${retries})...`);
        
        const { data } = await axios.post(
          'https://api.brightdata.com/request',
          {
            zone: process.env.BRIGHTDATA_ZONE,
            url: url,
            format: 'raw'
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.BRIGHTDATA_API_KEY}`
            },
            timeout: timeout
          }
        );

        // Web Unlocker returns the raw target response in `data` when format='raw'
        const content = typeof data === 'string' ? data : (data?.body || '');
        console.log(`✅ Successfully fetched with Web Unlocker: ${url}`);
        return {
          content,
          status: 200,
          method: 'web_unlocker'
        };
      } catch (error) {
        console.warn(`⚠️ Web Unlocker attempt ${attempt} failed for ${url}:`, error.message);
        
        if (attempt === retries) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }

  /**
   * Fallback fetch using standard HTTP request
   */
  async fetchWithStandardHttp(url, options = {}) {
    const {
      timeout = 30000,
      headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    } = options;

    try {
      console.log(`🌐 Fallback: Fetching with standard HTTP ${url}...`);
      
      const response = await axios.get(url, {
        headers,
        timeout
      });

      console.log(`✅ Successfully fetched with standard HTTP: ${url}`);
      return {
        content: response.data,
        status: response.status,
        method: 'standard_http'
      };
    } catch (error) {
      console.warn(`⚠️ Standard HTTP failed for ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * Fetch page content using Bright Data Web Unlocker Direct API as PRIMARY method
   * Only falls back to other methods if Web Unlocker completely fails
   */
  async fetchPageContent(url, options = {}) {
    const { timeout = 120000, retries = 3 } = options; // Increased timeout and retries for Web Unlocker
    let lastError;

    // PRIMARY METHOD: Web Unlocker Direct API with multiple attempts
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔓 Web Unlocker Direct API attempt ${attempt}/${retries} for: ${url}`);
        const response = await axios.post(
          'https://api.brightdata.com/request',
          {
            zone: process.env.BRIGHTDATA_ZONE,
            url: url,
            format: 'raw'
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: timeout
          }
        );

        const content = typeof response.data === 'string' ? response.data : (response.data?.body || '');
         if (content && content.length > 0) {
           console.log(`✅ Web Unlocker SUCCESS (attempt ${attempt}) for: ${url}`);
           return {
             success: true,
             html: content,
             status: 200,
             fetchMethod: 'web_unlocker_direct'
           };
        } else {
          throw new Error('Empty response from Web Unlocker');
        }
      } catch (error) {
        console.log(`❌ Web Unlocker attempt ${attempt} failed for ${url}:`, error.message);
        lastError = error;
        
        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.log(`⚠️ Web Unlocker completely failed after ${retries} attempts. Trying fallback methods...`);

    // FALLBACK METHOD 1: Enhanced HTTP with better headers
    try {
      console.log(`🌐 Fallback: Enhanced HTTP request for: ${url}`);
      const response = await axios.get(url, {
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 400
      });

      if (response.data && response.status === 200) {
         console.log(`✅ Enhanced HTTP fallback success for: ${url}`);
         return {
           success: true,
           html: response.data,
           status: response.status,
           fetchMethod: 'enhanced_http_fallback'
         };
      }
    } catch (error) {
      console.log(`❌ Enhanced HTTP fallback failed for ${url}:`, error.message);
      lastError = error;
    }

    // FALLBACK METHOD 2: Basic HTTP (last resort)
    try {
      console.log(`🔧 Last resort: Basic HTTP request for: ${url}`);
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BrokerAnalysis/1.0)'
        },
        validateStatus: (status) => status < 500
      });

      if (response.data) {
         console.log(`✅ Basic HTTP last resort success for: ${url}`);
         return {
           success: true,
           html: response.data,
           status: response.status,
           fetchMethod: 'basic_http_last_resort'
         };
      }
    } catch (error) {
      console.log(`❌ Basic HTTP last resort failed for ${url}:`, error.message);
      lastError = error;
    }

    console.log(`💥 ALL METHODS FAILED for ${url}`);
     return {
       success: false,
       error: lastError?.message || 'All fetch methods failed after multiple attempts',
       fetchMethod: 'all_methods_failed'
     };
  }

  /**
   * Scrape a single URL using Web Unlocker with fallbacks
   */
  async scrapePage(url, options = {}) {
    try {
      console.log(`🔍 Scraping: ${url}`);

      // Fetch page content using Web Unlocker as primary method
      const fetchResult = await this.fetchPageContent(url, options);
      const html = fetchResult.content;
      const status = fetchResult.status;

      // Extract content and metadata
      const textContent = this.extractTextContent(html);
      const metadata = this.extractMetadata(html);
      const structuredData = this.extractStructuredData(html, url);
      const sha256 = this.generateSHA256(html);

      // Store in Supabase
      const crawlData = {
        url: url,
        status: status,
        html: html,
        text_content: textContent,
        meta: metadata,
        data: structuredData,
        sha256: sha256,
        fetch_method: fetchResult.method
      };

      const { data: insertData, error: insertError } = await supabase
        .from('crawled_pages')
        .upsert(crawlData, { onConflict: 'url' })
        .select();

      if (insertError) {
        console.error('❌ Failed to store crawl data:', insertError.message);
        throw insertError;
      }

      console.log(`✅ Successfully scraped and stored: ${url} (method: ${fetchResult.method})`);
      return {
        success: true,
        data: insertData[0],
        url: url,
        status: status,
        contentLength: html.length,
        textLength: textContent.length,
        fetchMethod: fetchResult.method
      };

    } catch (error) {
      console.error(`❌ Failed to scrape ${url}:`, error.message);
      
      // Store error information
      try {
        await supabase
          .from('crawled_pages')
          .upsert({
            url: url,
            status: error.response?.status || 0,
            html: null,
            text_content: null,
            meta: { error: error.message },
            data: { error: error.message, error_type: error.name },
            sha256: null
          }, { onConflict: 'url' });
      } catch (storeError) {
        console.error('Failed to store error data:', storeError.message);
      }

      return {
        success: false,
        error: error.message,
        url: url,
        status: error.response?.status || 0
      };
    }
  }

  /**
   * Scrape multiple URLs with rate limiting and optional review detection
   */
  async scrapeMultiplePages(urls, options = {}) {
    const {
      useReviewDetection = false,
      storeInDatabase = true,
      ...otherOptions
    } = options;
    
    console.log(`🚀 Starting bulk scrape of ${urls.length} URLs...`);
    console.log(`   🔍 Review detection: ${useReviewDetection ? 'enabled' : 'disabled'}`);
    console.log(`   💾 Database storage: ${storeInDatabase ? 'enabled' : 'disabled'}`);
    
    const results = {
      successful: [],
      failed: [],
      total: urls.length,
      startTime: new Date(),
      reviewPages: 0,
      methodStats: {}
    };

    // Process URLs with rate limiting
    const promises = urls.map(url => 
      limit(async () => {
        try {
          let result;
          
          if (useReviewDetection) {
            result = await this.scrapePageWithReviewDetection(url, otherOptions);
          } else {
            result = await this.scrapePage(url, otherOptions);
          }
          
          if (result.success) {
            // Track review pages
            if (result.pageType === 'broker_review') {
              results.reviewPages++;
            }
            
            // Track fetch methods
            const method = result.fetchMethod || 'unknown';
            results.methodStats[method] = (results.methodStats[method] || 0) + 1;
          }
          
          return result;
        } catch (error) {
          return {
            success: false,
            url: url,
            error: error.message
          };
        }
      })
    );

    const responses = await Promise.allSettled(promises);

    // Process results
    responses.forEach((response, index) => {
      if (response.status === 'fulfilled') {
        if (response.value.success) {
          results.successful.push(response.value);
        } else {
          results.failed.push(response.value);
        }
      } else {
        results.failed.push({
          success: false,
          url: urls[index],
          error: response.reason.message
        });
      }
    });

    results.endTime = new Date();
    results.duration = results.endTime - results.startTime;
    results.successRate = (results.successful.length / results.total * 100).toFixed(2);

    console.log(`\n📊 Bulk scrape completed:`);
    console.log(`   ✅ Successful: ${results.successful.length}`);
    console.log(`   ❌ Failed: ${results.failed.length}`);
    console.log(`   📈 Success rate: ${results.successRate}%`);
    console.log(`   📊 Review Pages: ${results.reviewPages}`);
    console.log(`   🔧 Method Stats:`, results.methodStats);
    console.log(`   ⏱️  Duration: ${Math.round(results.duration / 1000)}s`);

    return results;
  }

  /**
   * Get crawled page data from Supabase
   */
  async getCrawledPage(url) {
    const { data, error } = await supabase
      .from('crawled_pages')
      .select('*')
      .eq('url', url)
      .single();

    if (error) {
      throw new Error(`Failed to get crawled page: ${error.message}`);
    }

    return data;
  }

  /**
   * Search crawled pages by content
   */
  async searchCrawledPages(query, options = {}) {
    const {
      limit = 10,
      offset = 0,
      status = 200,
      dateFrom,
      dateTo
    } = options;

    let queryBuilder = supabase
      .from('crawled_pages')
      .select('url, status, fetched_at, meta, data')
      .eq('status', status)
      .order('fetched_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add text search if query provided
    if (query) {
      queryBuilder = queryBuilder.or(`text_content.ilike.%${query}%,meta->>title.ilike.%${query}%`);
    }

    // Add date filters
    if (dateFrom) {
      queryBuilder = queryBuilder.gte('fetched_at', dateFrom);
    }
    if (dateTo) {
      queryBuilder = queryBuilder.lte('fetched_at', dateTo);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      throw new Error(`Failed to search crawled pages: ${error.message}`);
    }

    return data;
  }

  /**
   * Collect URLs from sitemap (recursive for sitemap indexes)
   */
  async collectSitemapUrls(sitemapUrl) {
    const seen = new Set();
    const urls = new Set();
    
    const walk = async (url) => {
      if (seen.has(url)) return;
      seen.add(url);
      
      try {
        console.log(`📋 Processing sitemap: ${url}`);
        const response = await axios.get(url, { timeout: 60000 });
        const xml = response.data;
        const json = this.xmlParser.parse(xml);

        // Handle sitemapindex (nested sitemaps)
        const sitemaps = json?.sitemapindex?.sitemap || [];
        const sitemapArray = Array.isArray(sitemaps) ? sitemaps : [sitemaps].filter(Boolean);
        
        for (const sitemap of sitemapArray) {
          if (sitemap?.loc) {
            await walk(sitemap.loc);
          }
        }

        // Handle urlset (actual URLs)
        const urlEntries = json?.urlset?.url || [];
        const urlArray = Array.isArray(urlEntries) ? urlEntries : [urlEntries].filter(Boolean);
        
        for (const urlEntry of urlArray) {
          if (urlEntry?.loc) {
            urls.add(urlEntry.loc);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Failed to process sitemap ${url}:`, error.message);
      }
    };

    await walk(sitemapUrl);
    console.log(`✅ Collected ${urls.size} URLs from sitemap`);
    return [...urls];
  }

  /**
   * Parse broker review pages with specific extraction logic
   */
  parseBrokerReview(html, url) {
    const $ = cheerio.load(html);
    
    // Extract basic information
    const title = $('h1').first().text().trim();
    const lastUpdated = $('[data-test*="updated"], time[datetime]').first().attr('datetime') || '';
    
    // Extract rating (look for numbers in rating elements)
    const ratingText = $('[class*=rating]').first().text();
    const ratingMatch = ratingText.match(/[\d.]+/);
    const rating = ratingMatch ? Number(ratingMatch[0]) : 0;

    // Extract sections (h2, h3 headings with following content)
    const sections = {};
    $('h2, h3').each((_, el) => {
      const heading = $(el).text().trim();
      const key = heading.toLowerCase().replace(/\s+/g, '_').slice(0, 60);
      const content = $(el).nextUntil('h2, h3').text().replace(/\s+/g, ' ').trim();
      if (content && key) {
        sections[key] = content;
      }
    });

    // Extract pros and cons (common review pattern)
    const pros = [];
    $('ul li:contains("Pros"), .pros li, [class*="pro"] li').each((_, li) => {
      const text = $(li).text().trim();
      if (text && pros.length < 50) {
        pros.push(text);
      }
    });

    const cons = [];
    $('ul li:contains("Cons"), .cons li, [class*="con"] li').each((_, li) => {
      const text = $(li).text().trim();
      if (text && cons.length < 50) {
        cons.push(text);
      }
    });

    return {
      url,
      title,
      rating,
      lastUpdated,
      sections,
      pros,
      cons
    };
  }

  /**
   * Check if URL is a broker review page
   */
  isReviewUrl(url) {
    return /\/broker-reviews\//i.test(url) || 
           /\/review\//i.test(url) || 
           /\/brokers\//i.test(url);
  }

  /**
   * Enhanced scraping with broker review detection
   */
  async scrapePageWithReviewDetection(url, options = {}) {
    try {
      const result = await this.scrapePage(url, options);
      
      if (result.success && this.isReviewUrl(url)) {
        // Parse as broker review
        const reviewData = this.parseBrokerReview(result.html, url);
        result.reviewData = reviewData;
        result.pageType = 'broker_review';
        console.log(`📊 Detected and parsed broker review: ${url}`);
      } else {
        result.pageType = 'general';
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Failed to scrape with review detection ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * Bulk scraping from sitemap with review detection
   */
  async scrapeSitemapUrls(sitemapUrl, options = {}) {
    const {
      filterDomain = null,
      maxUrls = null,
      prioritizeReviews = true
    } = options;

    try {
      // Collect all URLs from sitemap
      const urls = await this.collectSitemapUrls(sitemapUrl);
      
      // Filter by domain if specified
      let filteredUrls = urls;
      if (filterDomain) {
        filteredUrls = urls.filter(url => url.startsWith(filterDomain));
        console.log(`🔍 Filtered to ${filteredUrls.length} URLs for domain: ${filterDomain}`);
      }
      
      // Prioritize review URLs if requested
      if (prioritizeReviews) {
        const reviewUrls = filteredUrls.filter(url => this.isReviewUrl(url));
        const otherUrls = filteredUrls.filter(url => !this.isReviewUrl(url));
        filteredUrls = [...reviewUrls, ...otherUrls];
        console.log(`📊 Prioritized ${reviewUrls.length} review URLs`);
      }
      
      // Limit URLs if specified
      if (maxUrls && filteredUrls.length > maxUrls) {
        filteredUrls = filteredUrls.slice(0, maxUrls);
        console.log(`✂️ Limited to ${maxUrls} URLs`);
      }
      
      // Scrape URLs with review detection
      const results = await this.scrapeMultiplePages(filteredUrls, {
        ...options,
        useReviewDetection: true
      });
      
      return {
        ...results,
        sitemapUrl,
        totalSitemapUrls: urls.length,
        filteredUrls: filteredUrls.length,
        reviewUrls: filteredUrls.filter(url => this.isReviewUrl(url)).length
      };
    } catch (error) {
      console.error(`❌ Failed to scrape sitemap ${sitemapUrl}:`, error.message);
      throw error;
    }
  }

  /**
   * Get crawling statistics
   */
  async getCrawlingStats() {
    const { data, error } = await supabase
      .from('crawled_pages')
      .select('status, fetched_at')
      .order('fetched_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get crawling stats: ${error.message}`);
    }

    const stats = {
      total: data.length,
      successful: data.filter(p => p.status === 200).length,
      failed: data.filter(p => p.status !== 200).length,
      last24Hours: data.filter(p => 
        new Date(p.fetched_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      statusCodes: {}
    };

    // Count by status codes
    data.forEach(page => {
      stats.statusCodes[page.status] = (stats.statusCodes[page.status] || 0) + 1;
    });

    stats.successRate = stats.total > 0 ? (stats.successful / stats.total * 100).toFixed(2) : 0;

    return stats;
  }
}

export default WebScrapingService;
export { WebScrapingService };