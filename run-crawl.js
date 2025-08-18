#!/usr/bin/env node
/**
 * Direct crawler runner to bypass CLI detection issues
 */

import dotenv from 'dotenv';
import BrokerChooserCrawler from './crawl.js';

// Load environment variables
dotenv.config();

console.log('🎯 Starting BrokerChooser.com comprehensive crawl...');
console.log('================================================================');

// Validate required environment variables
const requiredEnvVars = [
  'BRIGHTDATA_API_KEY',
  'BRIGHTDATA_ZONE', 
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.error(`   ${varName}`);
  });
  console.error('\nPlease check your .env file or set these variables.');
  process.exit(1);
}

// Configure crawler options for comprehensive crawl
const options = {
  debug: true,
  concurrency: 6,
  timeout: 60000,
  retries: 3,
  delay: 1000,
  force: false,  // Enable resume functionality
  resumable: true,
  maxUrls: null  // No limit - crawl everything
};

console.log('⚙️ Crawler Configuration:');
console.log(`   Concurrency: ${options.concurrency}`);
console.log(`   Timeout: ${options.timeout}ms`);
console.log(`   Retries: ${options.retries}`);
console.log(`   Delay: ${options.delay}ms`);
console.log(`   Resume: ${options.resumable}`);
console.log(`   Force: ${options.force}`);
console.log(`   Max URLs: ${options.maxUrls || 'unlimited'}`);
console.log('');

// Create and start crawler
const crawler = new BrokerChooserCrawler(options);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, stopping crawler gracefully...');
  crawler.stop();
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, stopping crawler gracefully...');
  crawler.stop();
});

// Start the crawl
crawler.crawl()
  .then(report => {
    console.log('\n📊 CRAWL REPORT');
    console.log('================');
    console.log(JSON.stringify(report.summary, null, 2));
    
    if (report.errors && report.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      report.errors.slice(0, 10).forEach(error => {
        console.log(`   ${error.url}: ${error.error}`);
      });
      
      if (report.errors.length > 10) {
        console.log(`   ... and ${report.errors.length - 10} more errors`);
      }
    }
    
    console.log('\n✅ Crawl completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Crawl failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  });