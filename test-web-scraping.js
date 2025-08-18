import WebScrapingService from './src/services/webScrapingService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the web scraping service
const scraper = new WebScrapingService();

async function testWebScraping() {
  console.log('🧪 Testing Web Scraping Service...');
  console.log('=' .repeat(50));

  try {
    // Test 1: Single page scraping
    console.log('\n1️⃣ Testing single page scraping...');
    
    const testUrl = 'https://httpbin.org/html';
    console.log(`Testing with: ${testUrl}`);
    
    const singleResult = await scraper.scrapePage(testUrl);
    
    if (singleResult.success) {
      console.log('✅ Single page scraping successful!');
      console.log(`   📄 Content length: ${singleResult.contentLength} characters`);
      console.log(`   📝 Text length: ${singleResult.textLength} characters`);
      console.log(`   📊 Status: ${singleResult.status}`);
      console.log(`   🆔 Record ID: ${singleResult.data.id}`);
    } else {
      console.log('❌ Single page scraping failed:', singleResult.error);
    }

    // Test 2: Multiple pages scraping
    console.log('\n2️⃣ Testing multiple pages scraping...');
    
    const testUrls = [
      'https://httpbin.org/html',
      'https://httpbin.org/json',
      'https://httpbin.org/xml'
    ];
    
    console.log(`Testing with ${testUrls.length} URLs...`);
    
    const multipleResults = await scraper.scrapeMultiplePages(testUrls);
    
    console.log('\n📊 Bulk scraping results:');
    console.log(`   ✅ Successful: ${multipleResults.successful.length}`);
    console.log(`   ❌ Failed: ${multipleResults.failed.length}`);
    console.log(`   📈 Success rate: ${multipleResults.successRate}%`);
    console.log(`   ⏱️  Duration: ${Math.round(multipleResults.duration / 1000)}s`);

    // Test 3: Retrieve crawled data
    console.log('\n3️⃣ Testing data retrieval...');
    
    try {
      const crawledData = await scraper.getCrawledPage(testUrl);
      console.log('✅ Data retrieval successful!');
      console.log(`   🔗 URL: ${crawledData.url}`);
      console.log(`   📅 Fetched at: ${crawledData.fetched_at}`);
      console.log(`   📋 Metadata keys: ${Object.keys(crawledData.meta || {}).join(', ')}`);
      console.log(`   📦 Data keys: ${Object.keys(crawledData.data || {}).join(', ')}`);
    } catch (error) {
      console.log('❌ Data retrieval failed:', error.message);
    }

    // Test 4: Search functionality
    console.log('\n4️⃣ Testing search functionality...');
    
    try {
      const searchResults = await scraper.searchCrawledPages('html', { limit: 5 });
      console.log('✅ Search successful!');
      console.log(`   📊 Found ${searchResults.length} results`);
      searchResults.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.url} (${result.status})`);
      });
    } catch (error) {
      console.log('❌ Search failed:', error.message);
    }

    // Test 5: Get crawling statistics
    console.log('\n5️⃣ Testing statistics...');
    
    try {
      const stats = await scraper.getCrawlingStats();
      console.log('✅ Statistics retrieved!');
      console.log(`   📊 Total pages: ${stats.total}`);
      console.log(`   ✅ Successful: ${stats.successful}`);
      console.log(`   ❌ Failed: ${stats.failed}`);
      console.log(`   📈 Success rate: ${stats.successRate}%`);
      console.log(`   🕐 Last 24h: ${stats.last24Hours}`);
      console.log(`   📋 Status codes:`, stats.statusCodes);
    } catch (error) {
      console.log('❌ Statistics failed:', error.message);
    }

    // Test 6: Broker-specific scraping example
    console.log('\n6️⃣ Testing broker-specific scraping...');
    
    // Example broker URLs (these are examples - replace with actual broker sites)
    const brokerUrls = [
      'https://example.com/broker1', // Replace with actual broker URLs
      'https://example.com/broker2'
    ];
    
    console.log('ℹ️  Broker URL testing skipped (replace with actual broker URLs)');
    console.log('   Example usage:');
    console.log('   const brokerResults = await scraper.scrapeMultiplePages(brokerUrls);');

    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Web Scraping Service is ready for use!');
    console.log('\n🔧 Next steps:');
    console.log('   1. Replace test URLs with actual broker websites');
    console.log('   2. Configure Bright Data zone settings');
    console.log('   3. Set up scheduled crawling jobs');
    console.log('   4. Implement data analysis and insights');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Helper function to demonstrate broker data extraction
function demonstrateBrokerDataExtraction() {
  console.log('\n📖 Broker Data Extraction Examples:');
  console.log('\n🏦 The service automatically extracts:');
  console.log('   • Regulation information (licenses, authorities)');
  console.log('   • Trading conditions (spreads, leverage, commissions)');
  console.log('   • Platform information (MT4, MT5, web platforms)');
  console.log('   • Available instruments (forex, CFDs, stocks)');
  console.log('   • Contact details (emails, phones, social media)');
  console.log('   • Ratings and reviews');
  console.log('   • Structured data (JSON-LD, microdata)');
  
  console.log('\n💾 All data is stored in Supabase with:');
  console.log('   • Raw HTML content');
  console.log('   • Cleaned text content');
  console.log('   • Extracted metadata');
  console.log('   • Structured broker information');
  console.log('   • SHA256 hash for deduplication');
  console.log('   • Timestamp for tracking');
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testWebScraping()
    .then(() => {
      demonstrateBrokerDataExtraction();
      process.exit(0);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

export { testWebScraping, demonstrateBrokerDataExtraction };