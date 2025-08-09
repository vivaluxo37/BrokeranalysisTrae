// Test script to verify AI content generation
const { BrokerContentGenerator } = require('./src/ai-content-generator/core/BrokerContentGenerator.ts');

async function testAIGeneration() {
  try {
    console.log('Testing AI Content Generator...');
    
    const generator = new BrokerContentGenerator();
    
    // Test broker discovery
    console.log('Discovering brokers from logos...');
    const brokers = await generator.extractBrokerInfo();
    console.log(`Found ${brokers.length} brokers`);
    
    if (brokers.length > 0) {
      // Test content generation for first broker
      const firstBroker = brokers[0];
      console.log(`Generating content for: ${firstBroker.name}`);
      
      const content = await generator.generateBrokerReview(firstBroker);
      console.log('Content generated successfully!');
      console.log('Title:', content.title);
      console.log('Summary length:', content.summary.length);
      
      // Test page creation
      console.log('Creating React page...');
      await generator.createBrokerReviewPages([firstBroker]);
      console.log('Page created successfully!');
    }
    
  } catch (error) {
    console.error('Error testing AI generation:', error);
  }
}

testAIGeneration();