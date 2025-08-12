import { AIProviderGateway } from '../services/AIProviderGateway.js';
import { ContentProcessor } from '../content-processing/ContentProcessor.js';
import { QAOrchestrator } from '../qa-pipeline/QAOrchestrator.js';
import { WorkflowOrchestrator } from '../publishing-workflow/WorkflowOrchestrator.js';
import { BrokerContentGenerator } from '../broker-content/BrokerContentGenerator.js';
import { loadConfig } from '../config.js';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Script to generate broker review content using the AI Content Generator System
 */
export async function generateBrokerContent(options: {
  dryRun?: boolean;
  verbose?: boolean;
  limit?: number;
} = {}): Promise<void> {
  const { dryRun = false, verbose = false, limit } = options;

  try {
    // Load configuration
    const config = loadConfig();
    
    // Check if we have valid API keys (not demo keys)
    const hasRealApiKeys = config.providers.some(provider => 
      provider.apiKey && 
      provider.apiKey !== '' && 
      !provider.apiKey.includes('your_') && 
      !provider.apiKey.includes('demo-')
    );

    if (verbose) {
      console.log('🔧 Configuration loaded:', {
        providers: config.providers.map(p => ({ name: p.name, hasKey: !!p.apiKey, isDemo: p.apiKey?.includes('demo-') })),
        logoDir: config.brokerLogosPath,
        outputDir: config.outputDirectory,
        demoMode: !hasRealApiKeys
      });
    }

    // Initialize AI Gateway
    const aiGateway = new AIProviderGateway(config);
    
    // Initialize Content Processor
    const contentProcessor = new ContentProcessor({
      templatesPath: path.join(process.cwd(), 'src', 'ai-content-generator', 'templates'),
      outputPath: config.outputDirectory,
      aiGateway,
      processingRules: {
        maxContentLength: 10000,
        minContentLength: 500,
        requiredSections: ['introduction', 'overview', 'pros', 'cons', 'verdict'],
        allowedFormats: ['html', 'markdown', 'json']
      }
    });
    
    // Initialize QA Orchestrator
    const qaOrchestrator = new QAOrchestrator({
      aiGateway,
      validationRules: config.qaPipeline.validationRules,
      qualityChecks: config.qaPipeline.qualityChecks
    });
    
    // Initialize Workflow Orchestrator
    const workflowOrchestrator = new WorkflowOrchestrator({
      aiGateway,
      contentProcessor,
      qaOrchestrator,
      deploymentConfig: config.publishing
    });
    
    // Initialize Broker Content Generator
    if (verbose) {
      console.log('📝 Initializing Broker Content Generator...');
    }
    const brokerGenerator = new BrokerContentGenerator(
      aiGateway,
      contentProcessor,
      qaOrchestrator,
      workflowOrchestrator,
      config.brokerLogosPath
    );
    
    // Extract broker information
    if (verbose) {
      console.log('🔍 Extracting broker information from logos...');
    }
    const brokers = await brokerGenerator.extractBrokerInfo();
    
    // Apply limit if specified
    const brokersToProcess = limit ? brokers.slice(0, limit) : brokers;
    
    if (verbose) {
      console.log(`📊 Found ${brokers.length} brokers${limit ? ` (processing ${brokersToProcess.length})` : ''}:`);
      brokersToProcess.forEach(broker => {
        console.log(`  - ${broker.name} (${broker.category}, ${broker.region})`);
      });
    }
    
    // Generate reviews for brokers
    if (verbose) {
      console.log('\n🎯 Generating broker reviews...');
    }
    
    if (dryRun) {
      console.log('🔍 DRY RUN MODE - No actual content will be generated');
      console.log(`Would process ${brokersToProcess.length} brokers`);
      if (!hasRealApiKeys) {
        console.log('⚠️  Demo mode: Would use placeholder content (no real API keys)');
      }
      return;
    }
    
    const reviews = await brokerGenerator.generateAllBrokerReviews(brokersToProcess);
    if (verbose) {
      console.log(`✅ Generated ${reviews.size} broker reviews`);
    }
    
    // Create React component pages
    if (verbose) {
      console.log('\n⚛️ Creating React component pages...');
    }
    await brokerGenerator.createBrokerReviewPages(reviews);
    if (verbose) {
      console.log('✅ Created all broker review pages');
    }
    
    // Generate summary report
    console.log('\n📋 Generation Summary:');
    console.log(`  📁 Logo directory: ${config.brokerLogosPath}`);
    console.log(`  📁 Output directory: ${config.outputDirectory}`);
    console.log(`  🏢 Total brokers found: ${brokers.length}`);
    console.log(`  📝 Reviews generated: ${reviews.size}`);
    console.log(`  📄 Pages created: ${reviews.size + 1} (including index)`);
    if (!hasRealApiKeys) {
      console.log('  ⚠️  Generated in demo mode with placeholder content');
    }
    
    // List generated files
    if (verbose) {
      console.log('\n📄 Generated files:');
      for (const [slug] of reviews) {
        const filePath = path.join(config.outputDirectory, `${slug}.tsx`);
        console.log(`  - ${filePath}`);
      }
      console.log(`  - ${path.join(config.outputDirectory, 'index.tsx')}`);
    }
    
    console.log('\n🎉 Broker content generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during broker content generation:', error);
    process.exit(1);
  }
}
