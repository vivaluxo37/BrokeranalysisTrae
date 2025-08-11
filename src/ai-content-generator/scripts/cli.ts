#!/usr/bin/env node

import { generateBrokerContent } from './generateBrokerContent.js';
import { program } from 'commander';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

program
  .name('ai-content-generator')
  .description('AI Content Generator CLI for BrokerAnalysis platform')
  .version('1.0.0');

program
  .command('generate-brokers')
  .description('Generate broker review pages from logo files')
  .option('-d, --dry-run', 'Run without actually creating files')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (options) => {
    console.log('🚀 AI Content Generator CLI');
    console.log('============================\n');
    
    if (options.dryRun) {
      console.log('🔍 Running in dry-run mode (no files will be created)\n');
    }
    
    if (options.verbose) {
      console.log('📝 Verbose logging enabled\n');
    }
    
    try {
      await generateBrokerContent();
      console.log('\n✅ Content generation completed successfully!');
    } catch (error) {
      console.error('\n❌ Content generation failed:', error);
      process.exit(1);
    }
  });

program
  .command('check-env')
  .description('Check environment variables and configuration')
  .action(() => {
    console.log('🔧 Environment Check');
    console.log('====================\n');
    
    const requiredEnvVars = [
      'GROQ_API_KEY',
      'OPENROUTER_API_KEY'
    ];
    
    const optionalEnvVars = [
      'NODE_ENV',
      'AI_CONTENT_OUTPUT_DIR',
      'AI_CONTENT_LOGO_DIR'
    ];
    
    console.log('Required Environment Variables:');
    requiredEnvVars.forEach(envVar => {
      const value = process.env[envVar];
      const status = value ? '✅' : '❌';
      const displayValue = value ? `${value.substring(0, 8)}...` : 'Not set';
      console.log(`  ${status} ${envVar}: ${displayValue}`);
    });
    
    console.log('\nOptional Environment Variables:');
    optionalEnvVars.forEach(envVar => {
      const value = process.env[envVar];
      const status = value ? '✅' : '⚠️';
      const displayValue = value || 'Not set (using default)';
      console.log(`  ${status} ${envVar}: ${displayValue}`);
    });
    
    const missingRequired = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingRequired.length > 0) {
      console.log('\n❌ Missing required environment variables:');
      missingRequired.forEach(envVar => {
        console.log(`  - ${envVar}`);
      });
      console.log('\nPlease set these variables in your .env file or environment.');
      process.exit(1);
    } else {
      console.log('\n✅ All required environment variables are set!');
    }
  });

program
  .command('list-brokers')
  .description('List all brokers found in the logo directory')
  .option('-p, --path <path>', 'Custom path to logo directory')
  .action(async (options) => {
    console.log('🏢 Broker Discovery');
    console.log('===================\n');
    
    try {
      const { BrokerContentGenerator } = await import('../broker-content/BrokerContentGenerator.js');
      const { AIProviderGateway } = await import('../services/AIProviderGateway.js');
      const { ContentProcessor } = await import('../content-processing/ContentProcessor.js');
      const { QAOrchestrator } = await import('../qa-pipeline/QAOrchestrator.js');
      const { WorkflowOrchestrator } = await import('../publishing-workflow/WorkflowOrchestrator.js');
      
      const logoDirectory = options.path || 'C:/Users/LENOVO/Desktop/New folder (2)/Broker reviews │ BrokerChooser';
      
      // Create minimal instances for broker discovery
      const aiGateway = {} as AIProviderGateway;
      const contentProcessor = {} as ContentProcessor;
      const qaOrchestrator = {} as QAOrchestrator;
      const workflowOrchestrator = {} as WorkflowOrchestrator;
      
      const brokerGenerator = new BrokerContentGenerator(
        aiGateway,
        contentProcessor,
        qaOrchestrator,
        workflowOrchestrator,
        logoDirectory
      );
      
      const brokers = await brokerGenerator.extractBrokerInfo();
      
      console.log(`📁 Logo directory: ${logoDirectory}`);
      console.log(`🏢 Found ${brokers.length} brokers:\n`);
      
      brokers.forEach((broker, index) => {
        console.log(`${index + 1}. ${broker.name}`);
        console.log(`   Slug: ${broker.slug}`);
        console.log(`   Category: ${broker.category}`);
        console.log(`   Region: ${broker.region}`);
        console.log(`   Logo: ${broker.logoPath}`);
        console.log('');
      });
      
    } catch (error) {
      console.error('❌ Error discovering brokers:', error);
      process.exit(1);
    }
  });

program.parse();

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}