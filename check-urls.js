import fs from 'fs/promises';

async function checkUrls() {
  try {
    console.log('📊 Checking collected URLs...');
    
    const data = await fs.readFile('collected_urls.json', 'utf8');
    const urlData = JSON.parse(data);
    const urls = urlData.urls || urlData; // Handle both formats
    
    console.log(`\n📊 Total URLs collected: ${urls.length}`);
    console.log(`📅 Collection date: ${urlData.collectedAt || 'Unknown'}`);
    
    // Count broker review URLs
    const brokerReviews = urls.filter(url => 
      url.includes('broker-reviews') || 
      url.includes('review') ||
      url.includes('brokers/')
    );
    
    console.log(`🏢 Broker review URLs: ${brokerReviews.length}`);
    
    // Count by language
    const languages = {};
    urls.forEach(url => {
      const match = url.match(/\/([a-z]{2})\//) || 
                   url.match(/brokerchooser\.com\/([a-z]{2}-[a-z]{2})\//); 
      const lang = match ? match[1] : 'en';
      languages[lang] = (languages[lang] || 0) + 1;
    });
    
    console.log('\n🌍 Top languages found:');
    Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([lang, count]) => {
        console.log(`   ${lang}: ${count} URLs`);
      });
      
    // Show some sample broker review URLs
    console.log('\n📋 Sample broker review URLs:');
    brokerReviews.slice(0, 10).forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    
  } catch (error) {
    console.log('❌ Error reading collected_urls.json:', error.message);
    console.log('   This means the crawl hasn\'t started collecting URLs yet.');
  }
}

checkUrls();