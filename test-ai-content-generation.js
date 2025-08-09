import { BrokerContentGenerator } from './src/ai-content-generator/broker-content/BrokerContentGenerator.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testAIContentGeneration() {
  console.log('🚀 Testing AI Content Generator System...');
  
  try {
    const generator = new BrokerContentGenerator();
    
    // Test broker discovery
    console.log('📁 Discovering brokers from logo directory...');
    const logoDir = path.join(__dirname, 'Broker reviews │ BrokerChooser');
    const brokers = await generator.extractBrokerInfo(logoDir);
    console.log(`✅ Found ${brokers.length} brokers`);
    
    if (brokers.length > 0) {
      // Test content generation for the first broker
      const testBroker = brokers[0];
      console.log(`🤖 Generating content for: ${testBroker.name}`);
      
      const reviewContent = await generator.generateBrokerReview(testBroker);
      console.log('✅ Content generated successfully!');
      console.log('📝 Sample content:', reviewContent.title);
      
      // Test React page creation
      console.log('⚛️ Creating React page...');
      const reactPage = await generator.createBrokerReviewPages([reviewContent]);
      console.log('✅ React page created successfully!');
      
      console.log('🎉 AI Content Generator System test completed successfully!');
      console.log('📊 Test Results:');
      console.log(`   - Brokers discovered: ${brokers.length}`);
      console.log(`   - Content generated for: ${testBroker.name}`);
      console.log(`   - React page created: ${reviewContent.slug}.tsx`);
      
    } else {
      console.log('❌ No brokers found in logo directory');
    }
    
  } catch (error) {
    console.error('❌ AI Content Generation test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testAIContentGeneration();