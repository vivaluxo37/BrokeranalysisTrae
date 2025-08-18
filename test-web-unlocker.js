import WebScrapingService from './src/services/webScrapingService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const scraper = new WebScrapingService();

/**
 * Test Web Unlocker Direct API priority system
 */
async function testWebUnlockerPriority() {
  console.log('🔓 Testing Web Unlocker Direct API Priority System');
  console.log('=' .repeat(60));

  const testUrls = [
    'https://brokerchooser.com/',
    'https://brokerchooser.com/broker-reviews/etoro/',
    'https://brokerchooser.com/broker-reviews/plus500/',
    'https://www.forexfactory.com/'
  ];

  for (const url of testUrls) {
    try {
      console.log(`\n🧪 Testing: ${url}`);
      const result = await scraper.scrapePage(url, {
        timeout: 60000
      });

      if (result.success) {
        console.log(`✅ Success with method: ${result.fetchMethod}`);
        console.log(`   📄 Content length: ${result.html.length} chars`);
        console.log(`   📝 Text length: ${result.textContent.length} chars`);
        console.log(`   🏷️ Title: ${result.metadata.title?.substring(0, 80)}...`);
        
        if (result.pageType === 'broker_review') {
          console.log(`   📊 Review detected - Rating: ${result.reviewData?.rating || 'N/A'}`);
        }
      } else {
        console.log(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

/**
 * Test sitemap collection functionality
 */
async function testSitemapCollection() {
  console.log('\n\n📋 Testing Sitemap Collection');
  console.log('=' .repeat(60));

  try {
    const sitemapUrl = 'https://brokerchooser.com/sitemap.xml';
    console.log(`🔍 Collecting URLs from: ${sitemapUrl}`);
    
    const urls = await scraper.collectSitemapUrls(sitemapUrl);
    
    console.log(`\n📊 Sitemap Analysis:`);
    console.log(`   📄 Total URLs found: ${urls.length}`);
    
    // Analyze URL types
    const reviewUrls = urls.filter(url => scraper.isReviewUrl(url));
    const brokerchooserUrls = urls.filter(url => url.startsWith('https://brokerchooser.com/'));
    
    console.log(`   📊 Review URLs: ${reviewUrls.length}`);
    console.log(`   🏠 BrokerChooser URLs: ${brokerchooserUrls.length}`);
    
    // Show sample URLs
    console.log(`\n📝 Sample URLs:`);
    urls.slice(0, 10).forEach((url, index) => {
      const isReview = scraper.isReviewUrl(url) ? '📊' : '📄';
      console.log(`   ${index + 1}. ${isReview} ${url}`);
    });
    
    if (reviewUrls.length > 0) {
      console.log(`\n📊 Sample Review URLs:`);
      reviewUrls.slice(0, 5).forEach((url, index) => {
        console.log(`   ${index + 1}. ${url}`);
      });
    }
    
  } catch (error) {
    console.error(`❌ Sitemap collection failed:`, error.message);
  }
}

/**
 * Test bulk scraping with review detection
 */
async function testBulkScrapingWithReviews() {
  console.log('\n\n🚀 Testing Bulk Scraping with Review Detection');
  console.log('=' .repeat(60));

  try {
    // Test with a small set of URLs including reviews
    const testUrls = [
      'https://brokerchooser.com/',
      'https://brokerchooser.com/broker-reviews/etoro/',
      'https://brokerchooser.com/broker-reviews/plus500/',
      'https://brokerchooser.com/about-us/'
    ];

    console.log(`🔍 Testing bulk scraping with ${testUrls.length} URLs...`);
    
    const results = await scraper.scrapeMultiplePages(testUrls, {
      useReviewDetection: true,
      storeInDatabase: false, // Don't store during testing
      timeout: 60000
    });

    console.log(`\n📊 Bulk Scraping Results:`);
    console.log(`   📄 Total URLs: ${results.total}`);
    console.log(`   ✅ Successful: ${results.successful.length}`);
    console.log(`   ❌ Failed: ${results.failed.length}`);
    console.log(`   📈 Success Rate: ${results.successRate}%`);
    console.log(`   📊 Review Pages: ${results.reviewPages}`);
    console.log(`   🔧 Method Stats:`, results.methodStats);
    console.log(`   ⏱️ Duration: ${(results.duration / 1000).toFixed(2)}s`);

    // Show details of successful scrapes
    if (results.successful.length > 0) {
      console.log(`\n✅ Successful Scrapes:`);
      results.successful.forEach((result, index) => {
        const type = result.pageType === 'broker_review' ? '📊 Review' : '📄 General';
        const method = result.fetchMethod || 'unknown';
        console.log(`   ${index + 1}. ${type} - ${method} - ${result.url}`);
        
        if (result.reviewData) {
          console.log(`      📊 Rating: ${result.reviewData.rating}`);
          console.log(`      📝 Title: ${result.reviewData.title?.substring(0, 60)}...`);
          if (result.reviewData.pros.length > 0) {
            console.log(`      ✅ Pros: ${result.reviewData.pros.length} items`);
          }
          if (result.reviewData.cons.length > 0) {
            console.log(`      ❌ Cons: ${result.reviewData.cons.length} items`);
          }
        }
      });
    }

    // Show failed scrapes
    if (results.failed.length > 0) {
      console.log(`\n❌ Failed Scrapes:`);
      results.failed.forEach((failure, index) => {
        console.log(`   ${index + 1}. ${failure.url} - ${failure.error}`);
      });
    }

  } catch (error) {
    console.error(`❌ Bulk scraping test failed:`, error.message);
  }
}

/**
 * Test sitemap-based scraping (limited sample)
 */
async function testSitemapScraping() {
  console.log('\n\n🗺️ Testing Sitemap-Based Scraping');
  console.log('=' .repeat(60));

  try {
    const sitemapUrl = 'https://brokerchooser.com/sitemap.xml';
    
    console.log(`🔍 Testing sitemap scraping from: ${sitemapUrl}`);
    console.log(`⚠️ Limited to 5 URLs for testing purposes`);
    
    const results = await scraper.scrapeSitemapUrls(sitemapUrl, {
      filterDomain: 'https://brokerchooser.com/',
      maxUrls: 5,
      prioritizeReviews: true,
      useReviewDetection: true,
      storeInDatabase: false,
      timeout: 60000
    });

    console.log(`\n📊 Sitemap Scraping Results:`);
    console.log(`   🗺️ Sitemap URL: ${results.sitemapUrl}`);
    console.log(`   📄 Total Sitemap URLs: ${results.totalSitemapUrls}`);
    console.log(`   🔍 Filtered URLs: ${results.filteredUrls}`);
    console.log(`   📊 Review URLs: ${results.reviewUrls}`);
    console.log(`   ✅ Successful: ${results.successful.length}`);
    console.log(`   ❌ Failed: ${results.failed.length}`);
    console.log(`   📈 Success Rate: ${results.successRate}%`);
    console.log(`   🔧 Method Stats:`, results.methodStats);
    console.log(`   ⏱️ Duration: ${(results.duration / 1000).toFixed(2)}s`);

  } catch (error) {
    console.error(`❌ Sitemap scraping test failed:`, error.message);
  }
}

/**
 * Test scraping statistics
 */
async function testScrapingStats() {
  console.log('\n\n📈 Testing Scraping Statistics');
  console.log('=' .repeat(60));

  try {
    const stats = await scraper.getCrawlingStats();
    
    console.log(`📊 Current Scraping Statistics:`);
    console.log(`   📄 Total pages: ${stats.total}`);
    console.log(`   ✅ Successful: ${stats.successful}`);
    console.log(`   ❌ Failed: ${stats.failed}`);
    console.log(`   📈 Success rate: ${stats.successRate}%`);
    console.log(`   🕒 Recent activity (24h): ${stats.recentActivity}`);
    console.log(`   📅 Last crawl: ${stats.lastCrawl || 'Never'}`);
    
    if (stats.methodStats && Object.keys(stats.methodStats).length > 0) {
      console.log(`   🔧 Method statistics:`);
      Object.entries(stats.methodStats).forEach(([method, count]) => {
        console.log(`      ${method}: ${count} pages`);
      });
    }
    
  } catch (error) {
    console.error(`❌ Stats retrieval failed:`, error.message);
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🧪 Web Unlocker Priority System Test Suite');
  console.log('=' .repeat(80));
  console.log(`🕒 Started at: ${new Date().toISOString()}`);
  console.log('');

  try {
    // Test 1: Web Unlocker Priority
    await testWebUnlockerPriority();
    
    // Test 2: Sitemap Collection
    await testSitemapCollection();
    
    // Test 3: Bulk Scraping with Reviews
    await testBulkScrapingWithReviews();
    
    // Test 4: Sitemap-based Scraping
    await testSitemapScraping();
    
    // Test 5: Scraping Statistics
    await testScrapingStats();
    
    console.log('\n\n🎉 All tests completed!');
    console.log('=' .repeat(80));
    console.log(`🕒 Finished at: ${new Date().toISOString()}`);
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    console.error(error.stack);
  }
}

// Run the tests
runAllTests().catch(console.error);