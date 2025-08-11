#!/usr/bin/env node

/**
 * Asset testing script for Vercel deployment verification
 * Can be run in both development and production environments
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple asset existence checker for Node.js environment
function checkAssetExists(assetPath) {
  const fullPath = path.join(__dirname, '..', 'public', assetPath.replace(/^\//, ''));
  return fs.existsSync(fullPath);
}

function testCriticalAssets() {
  console.log('🧪 Testing critical static assets...\n');
  
  const criticalAssets = [
    '/favicon.svg',
    '/vite.svg',
    '/assets/icons/broker-placeholder.svg',
    '/assets/icons/broker-placeholder.webp',
    '/assets/README.md'
  ];

  let passed = 0;
  let failed = 0;

  criticalAssets.forEach(asset => {
    const exists = checkAssetExists(asset);
    if (exists) {
      console.log(`✅ ${asset}`);
      passed++;
    } else {
      console.log(`❌ ${asset} - File not found`);
      failed++;
    }
  });

  console.log(`\n📊 Critical Assets: ${passed}/${criticalAssets.length} passed\n`);
  return { passed, failed, total: criticalAssets.length };
}

function testAssetDirectories() {
  console.log('📁 Testing asset directory structure...\n');
  
  const directories = [
    '/assets',
    '/assets/brokers',
    '/assets/brokers/logos',
    '/assets/brokers/logos/square',
    '/assets/brokers/logos/horizontal',
    '/assets/brokers/logos/favicon',
    '/assets/icons'
  ];

  let passed = 0;
  let failed = 0;

  directories.forEach(dir => {
    const exists = checkAssetExists(dir);
    if (exists) {
      console.log(`✅ ${dir}/`);
      passed++;
    } else {
      console.log(`❌ ${dir}/ - Directory not found`);
      failed++;
    }
  });

  console.log(`\n📊 Asset Directories: ${passed}/${directories.length} passed\n`);
  return { passed, failed, total: directories.length };
}

function testAssetMapping() {
  console.log('🗺️ Testing asset mapping configuration...\n');
  
  const mappingPath = '/assets/brokers/logos/asset-mapping.json';
  const exists = checkAssetExists(mappingPath);
  
  if (exists) {
    console.log(`✅ ${mappingPath}`);
    
    try {
      const fullPath = path.join(__dirname, '..', 'public', mappingPath.replace(/^\//, ''));
      const mapping = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      
      console.log(`   📋 Version: ${mapping.version}`);
      console.log(`   📋 Brokers: ${mapping.brokers?.length || 0} configured`);
      console.log(`   📋 Fallback: ${mapping.fallback ? 'configured' : 'missing'}`);
      
      return { passed: 1, failed: 0, total: 1 };
    } catch (error) {
      console.log(`❌ ${mappingPath} - Invalid JSON: ${error.message}`);
      return { passed: 0, failed: 1, total: 1 };
    }
  } else {
    console.log(`❌ ${mappingPath} - File not found`);
    return { passed: 0, failed: 1, total: 1 };
  }
}

function generateReport(results) {
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const totalTests = results.reduce((sum, r) => sum + r.total, 0);
  
  console.log('📋 ASSET TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${totalPassed}`);
  console.log(`Failed: ${totalFailed}`);
  console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
  
  if (totalFailed === 0) {
    console.log('\n🎉 All asset tests passed! Assets are properly configured for Vercel deployment.');
  } else {
    console.log('\n⚠️ Some asset tests failed. Please check the missing files and directories.');
    console.log('\nRecommendations:');
    console.log('- Ensure all required assets are in the public/ directory');
    console.log('- Verify asset paths match the expected structure');
    console.log('- Check that the build process includes all necessary assets');
  }
  
  return totalFailed === 0;
}

// Run all tests
async function main() {
  console.log('🚀 Starting Asset Accessibility Tests\n');
  
  const results = [
    testCriticalAssets(),
    testAssetDirectories(),
    testAssetMapping()
  ];
  
  const success = generateReport(results);
  process.exit(success ? 0 : 1);
}

main().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});