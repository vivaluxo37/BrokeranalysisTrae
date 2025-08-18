#!/usr/bin/env node
/**
 * Test script to verify crawler functionality with specific URLs
 */

import dotenv from 'dotenv';
import BrokerChooserCrawler from './crawl.js';

// Load environment variables
dotenv.config();

// Test URLs - specific broker reviews
const testUrls = [
  'https://brokerchooser.com/broker-reviews/plus500-review',
  'https://brokerchooser.com/broker-reviews/etoro-review',
  'https://brokerchooser.com/broker-reviews/interactive-brokers-review'
];

class TestCrawler extends BrokerChooserCrawler {
  // Override collectUrls to use our test URLs instead of sitemap
  async collectUrls() {
    this.log('🧪 Using test URLs instead of sitemap...');
    
    const urls = [...testUrls]; // Return URLs as strings, not objects
    
    this.log(`📊 Found ${urls.length} test URLs`, 'success');
    
    // Apply URL limit if specified
    if (this.options.maxUrls && urls.length > this.options.maxUrls) {
      this.log(`🔢 Limiting to ${this.options.maxUrls} URLs`, 'warning');
      return urls.slice(0, this.options.maxUrls);
    }
    
    return urls;
  }
}

// Run test crawler
const options = {
  debug: true,
  force: true,
  concurrency: 2,
  maxUrls: 3
};

const crawler = new TestCrawler(options);

crawler.crawl()
  .then(report => {
    console.log('\n📊 TEST CRAWL REPORT');
    console.log('====================');
    console.log(JSON.stringify(report.summary, null, 2));
    
    if (report.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      report.errors.forEach(error => {
        console.log(`   ${error.url}: ${error.error}`);
      });
    }
    
    console.log('\n✅ Test crawl completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Test crawl failed:', error.message);
    process.exit(1);
  });