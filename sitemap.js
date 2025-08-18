/**
 * Sitemap Collector for BrokerChooser.com
 * Recursively processes sitemap.xml and sitemap indexes to collect all URLs
 */

import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import dotenv from 'dotenv';
import WebUnlocker from './unlocker.js';

dotenv.config();

class SitemapCollector {
  constructor(options = {}) {
    this.timeout = options.timeout || 60000;
    this.maxRetries = options.maxRetries || 3;
    this.delay = options.delay || 1000;
    this.userAgent = options.userAgent || 'BrokerChooser-Crawler/1.0';
    
    // Initialize Web Unlocker for fallback when direct access fails
    this.webUnlocker = new WebUnlocker({
      apiKey: process.env.BRIGHTDATA_API_KEY,
      zone: process.env.BRIGHTDATA_ZONE,
      timeout: this.timeout,
      retries: 2,
      debug: options.debug || false
    });
    
    // XML parser configuration
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true,
      trimValues: true
    });
    
    this.processedSitemaps = new Set();
    this.collectedUrls = new Set();
  }

  /**
   * Sleep utility for delays
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch XML content from a URL with retries and Web Unlocker fallback
   */
  async fetchXml(url) {
    let lastError = null;
    
    // First try direct access
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`📥 Fetching sitemap directly (attempt ${attempt}): ${url}`);
        
        const response = await axios.get(url, {
          timeout: this.timeout,
          headers: {
            'User-Agent': this.userAgent,
            'Accept': 'application/xml, text/xml, */*',
            'Accept-Encoding': 'gzip, deflate'
          },
          validateStatus: (status) => status < 400
        });
        
        if (!response.data) {
          throw new Error('Empty response received');
        }
        
        console.log(`✅ Sitemap fetched directly: ${url} (${response.data.length} chars)`);
        return response.data;
        
      } catch (error) {
        lastError = error;
        console.log(`❌ Direct attempt ${attempt} failed for ${url}: ${error.message}`);
        
        // If we get a 403 or similar blocking error, try Web Unlocker immediately
        if (error.response && (error.response.status === 403 || error.response.status === 429)) {
          console.log(`🔄 Bot detection detected (${error.response.status}), trying Web Unlocker...`);
          break;
        }
        
        if (attempt < this.maxRetries) {
          const backoffDelay = this.delay * Math.pow(2, attempt - 1);
          console.log(`⏳ Waiting ${backoffDelay}ms before retry...`);
          await this.sleep(backoffDelay);
        }
      }
    }
    
    // If direct access failed, try Web Unlocker as fallback
    if (lastError && (lastError.response?.status === 403 || lastError.response?.status === 429 || lastError.code === 'ECONNRESET')) {
      try {
        console.log(`🌐 Trying Web Unlocker fallback for: ${url}`);
        const result = await this.webUnlocker.fetch(url);
        
        if (!result || !result.content) {
          throw new Error('Empty response from Web Unlocker');
        }
        
        const content = result.content;
        console.log(`✅ Sitemap fetched via Web Unlocker: ${url} (${content.length} chars)`);
        console.log(`🔍 Content preview: ${content.substring(0, 200)}...`);
        return content;
        
      } catch (unlockerError) {
        console.log(`❌ Web Unlocker also failed for ${url}: ${unlockerError.message}`);
        throw new Error(`Both direct access and Web Unlocker failed. Direct: ${lastError?.message}, Unlocker: ${unlockerError.message}`);
      }
    }
    
    throw new Error(`Failed to fetch sitemap after ${this.maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Parse XML content and extract URLs or sitemap references
   */
  parseXml(xmlContent) {
    try {
      console.log(`🔍 Parsing XML content (${xmlContent.length} chars): ${xmlContent.substring(0, 300)}...`);
      const parsed = this.xmlParser.parse(xmlContent);
      console.log(`🔍 Parsed XML structure:`, Object.keys(parsed));
      
      // Handle sitemap index (contains references to other sitemaps)
      if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
        const sitemaps = Array.isArray(parsed.sitemapindex.sitemap) 
          ? parsed.sitemapindex.sitemap 
          : [parsed.sitemapindex.sitemap];
        
        return {
          type: 'sitemapindex',
          sitemaps: sitemaps.map(sitemap => ({
            loc: sitemap.loc,
            lastmod: sitemap.lastmod || null
          }))
        };
      }
      
      // Handle regular sitemap (contains URLs)
      if (parsed.urlset && parsed.urlset.url) {
        const urls = Array.isArray(parsed.urlset.url) 
          ? parsed.urlset.url 
          : [parsed.urlset.url];
        
        return {
          type: 'urlset',
          urls: urls.map(url => ({
            loc: url.loc,
            lastmod: url.lastmod || null,
            changefreq: url.changefreq || null,
            priority: url.priority || null
          }))
        };
      }
      
      throw new Error('Invalid sitemap format: no sitemapindex or urlset found');
      
    } catch (error) {
      throw new Error(`Failed to parse XML: ${error.message}`);
    }
  }

  /**
   * Filter URLs to only include BrokerChooser.com URLs
   */
  filterUrls(urls) {
    return urls.filter(urlObj => {
      const url = urlObj.loc;
      return url && 
             typeof url === 'string' && 
             url.startsWith('https://brokerchooser.com/') &&
             !url.includes('#') && // Remove fragment URLs
             !url.match(/\.(pdf|jpg|jpeg|png|gif|css|js|ico)$/i); // Remove non-HTML files
    });
  }

  /**
   * Recursively process a sitemap URL
   */
  async processSitemap(sitemapUrl) {
    // Avoid processing the same sitemap twice
    if (this.processedSitemaps.has(sitemapUrl)) {
      console.log(`⏭️ Skipping already processed sitemap: ${sitemapUrl}`);
      return [];
    }
    
    this.processedSitemaps.add(sitemapUrl);
    
    try {
      const xmlContent = await this.fetchXml(sitemapUrl);
      const parsed = this.parseXml(xmlContent);
      
      if (parsed.type === 'sitemapindex') {
        console.log(`📋 Found sitemap index with ${parsed.sitemaps.length} sitemaps`);
        
        const allUrls = [];
        
        // Process each sitemap in the index
        for (const sitemap of parsed.sitemaps) {
          try {
            const urls = await this.processSitemap(sitemap.loc);
            allUrls.push(...urls);
            
            // Small delay between sitemap requests
            await this.sleep(500);
            
          } catch (error) {
            console.error(`❌ Failed to process sitemap ${sitemap.loc}: ${error.message}`);
          }
        }
        
        return allUrls;
        
      } else if (parsed.type === 'urlset') {
        const filteredUrls = this.filterUrls(parsed.urls);
        console.log(`📄 Found ${parsed.urls.length} URLs, ${filteredUrls.length} after filtering`);
        
        // Add to collected URLs set for deduplication
        filteredUrls.forEach(urlObj => {
          this.collectedUrls.add(urlObj.loc);
        });
        
        return filteredUrls;
      }
      
    } catch (error) {
      console.error(`❌ Failed to process sitemap ${sitemapUrl}: ${error.message}`);
      return [];
    }
  }

  /**
   * Collect all URLs from BrokerChooser.com sitemap
   */
  async collectAllUrls(startingSitemapUrl = 'https://brokerchooser.com/sitemap.xml') {
    console.log(`🗺️ Starting sitemap collection from: ${startingSitemapUrl}`);
    const startTime = Date.now();
    
    // Reset state
    this.processedSitemaps.clear();
    this.collectedUrls.clear();
    
    try {
      const urls = await this.processSitemap(startingSitemapUrl);
      
      // Convert Set back to Array and add metadata
      const uniqueUrls = Array.from(this.collectedUrls).map(url => ({
        url: url,
        discovered_at: new Date().toISOString(),
        source: 'sitemap'
      }));
      
      const duration = Date.now() - startTime;
      
      console.log(`🎯 Sitemap collection complete:`);
      console.log(`   📊 Total URLs discovered: ${uniqueUrls.length}`);
      console.log(`   🗺️ Sitemaps processed: ${this.processedSitemaps.size}`);
      console.log(`   ⏱️ Duration: ${duration}ms`);
      
      // Categorize URLs
      const categories = this.categorizeUrls(uniqueUrls);
      console.log(`   📋 URL Categories:`);
      Object.entries(categories).forEach(([category, count]) => {
        console.log(`      ${category}: ${count} URLs`);
      });
      
      return {
        urls: uniqueUrls,
        total: uniqueUrls.length,
        sitemapsProcessed: this.processedSitemaps.size,
        categories: categories,
        duration: duration,
        completedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`💥 Sitemap collection failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Categorize URLs by type/section
   */
  categorizeUrls(urls) {
    const categories = {
      'broker-reviews': 0,
      'blog': 0,
      'guides': 0,
      'compare': 0,
      'news': 0,
      'tools': 0,
      'about': 0,
      'legal': 0,
      'homepage': 0,
      'other': 0
    };
    
    urls.forEach(urlObj => {
      const url = urlObj.url.toLowerCase();
      
      if (url.includes('/broker-reviews/')) {
        categories['broker-reviews']++;
      } else if (url.includes('/blog/')) {
        categories['blog']++;
      } else if (url.includes('/guide') || url.includes('/how-to')) {
        categories['guides']++;
      } else if (url.includes('/compare')) {
        categories['compare']++;
      } else if (url.includes('/news/')) {
        categories['news']++;
      } else if (url.includes('/tools/') || url.includes('/calculator')) {
        categories['tools']++;
      } else if (url.includes('/about') || url.includes('/team') || url.includes('/contact')) {
        categories['about']++;
      } else if (url.includes('/legal') || url.includes('/privacy') || url.includes('/terms')) {
        categories['legal']++;
      } else if (url === 'https://brokerchooser.com/' || url === 'https://brokerchooser.com') {
        categories['homepage']++;
      } else {
        categories['other']++;
      }
    });
    
    return categories;
  }

  /**
   * Get URLs by category
   */
  getUrlsByCategory(urls, category) {
    return urls.filter(urlObj => {
      const url = urlObj.url.toLowerCase();
      
      switch (category) {
        case 'broker-reviews':
          return url.includes('/broker-reviews/');
        case 'blog':
          return url.includes('/blog/');
        case 'guides':
          return url.includes('/guide') || url.includes('/how-to');
        case 'compare':
          return url.includes('/compare');
        case 'news':
          return url.includes('/news/');
        case 'tools':
          return url.includes('/tools/') || url.includes('/calculator');
        case 'about':
          return url.includes('/about') || url.includes('/team') || url.includes('/contact');
        case 'legal':
          return url.includes('/legal') || url.includes('/privacy') || url.includes('/terms');
        case 'homepage':
          return url === 'https://brokerchooser.com/' || url === 'https://brokerchooser.com';
        default:
          return true;
      }
    });
  }

  /**
   * Save URLs to file for inspection
   */
  async saveUrlsToFile(urls, filename = 'collected_urls.json') {
    const fs = await import('fs/promises');
    
    try {
      await fs.writeFile(filename, JSON.stringify({
        collectedAt: new Date().toISOString(),
        total: urls.length,
        urls: urls
      }, null, 2));
      
      console.log(`💾 URLs saved to ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to save URLs to file: ${error.message}`);
    }
  }
}

export default SitemapCollector;

// For testing purposes
if (import.meta.url === `file://${process.argv[1]}`) {
  const collector = new SitemapCollector();
  
  console.log('🧪 Testing Sitemap Collector...');
  
  try {
    const result = await collector.collectAllUrls();
    
    console.log('🎯 Collection Summary:');
    console.log(`   Total URLs: ${result.total}`);
    console.log(`   Sitemaps processed: ${result.sitemapsProcessed}`);
    console.log(`   Duration: ${result.duration}ms`);
    
    // Show sample URLs from each category
    console.log('\n📋 Sample URLs by category:');
    Object.entries(result.categories).forEach(([category, count]) => {
      if (count > 0) {
        const categoryUrls = collector.getUrlsByCategory(result.urls, category);
        const samples = categoryUrls.slice(0, 3).map(u => u.url);
        console.log(`   ${category} (${count}): ${samples.join(', ')}`);
      }
    });
    
    // Save to file
    await collector.saveUrlsToFile(result.urls);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}