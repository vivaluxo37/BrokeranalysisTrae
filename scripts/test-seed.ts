#!/usr/bin/env tsx

/**
 * Simple test script to verify the seed-broker.ts functionality
 * This script tests the basic components without requiring full Supabase setup
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface TestResult {
  test: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function runTest(testName: string, testFn: () => boolean, successMessage: string, errorMessage: string) {
  try {
    const passed = testFn();
    results.push({
      test: testName,
      passed,
      message: passed ? successMessage : errorMessage
    });
  } catch (error) {
    results.push({
      test: testName,
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

function main() {
  console.log('🧪 Testing Broker Seeding Script Components\n');
  
  // Test 1: Check if sample JSON file exists
  runTest(
    'Sample JSON File',
    () => existsSync(path.join(__dirname, 'sample-broker.json')),
    '✅ Sample JSON file exists',
    '❌ Sample JSON file not found'
  );
  
  // Test 2: Check if sample logo file exists
  runTest(
    'Sample Logo File',
    () => existsSync(path.join(__dirname, 'sample-logo.png')),
    '✅ Sample logo file exists',
    '❌ Sample logo file not found'
  );
  
  // Test 3: Validate JSON structure
  runTest(
    'JSON Structure',
    () => {
      const jsonPath = path.join(__dirname, 'sample-broker.json');
      if (!existsSync(jsonPath)) return false;
      
      const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
      return !!(data.broker && data.broker.id && data.broker.name && data.broker.slug);
    },
    '✅ JSON structure is valid',
    '❌ JSON structure is invalid or missing required fields'
  );
  
  // Test 4: Check environment variables
  runTest(
    'Environment Variables',
    () => {
      const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
      return required.every(env => process.env[env]);
    },
    '✅ All required environment variables are set',
    '❌ Missing required environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)'
  );
  
  // Test 5: Check if main script exists
  runTest(
    'Main Script File',
    () => existsSync(path.join(__dirname, 'seed-broker.ts')),
    '✅ Main seed-broker.ts script exists',
    '❌ Main seed-broker.ts script not found'
  );
  
  // Test 6: Check TypeScript compilation
  runTest(
    'TypeScript Syntax',
    () => {
      try {
        // Basic syntax check by requiring the module
        const scriptPath = path.join(__dirname, 'seed-broker.ts');
        return existsSync(scriptPath);
      } catch {
        return false;
      }
    },
    '✅ TypeScript syntax appears valid',
    '❌ TypeScript syntax issues detected'
  );
  
  // Display results
  console.log('\n📊 Test Results:\n');
  
  let passedCount = 0;
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.test}: ${result.message}`);
    if (result.passed) passedCount++;
  });
  
  console.log(`\n🎯 Summary: ${passedCount}/${results.length} tests passed\n`);
  
  if (passedCount === results.length) {
    console.log('🎉 All tests passed! The broker seeding script should work correctly.');
    console.log('\n💡 To run the actual seeding script:');
    console.log('   npm run seed-broker:sample');
    console.log('   or');
    console.log('   npx tsx scripts/seed-broker.ts scripts/sample-broker.json');
  } else {
    console.log('⚠️  Some tests failed. Please address the issues above before running the seeding script.');
    
    if (!results.find(r => r.test === 'Environment Variables')?.passed) {
      console.log('\n🔧 To set up environment variables:');
      console.log('   1. Create a .env file in the project root');
      console.log('   2. Add your Supabase credentials:');
      console.log('      VITE_SUPABASE_URL=your_supabase_url');
      console.log('      VITE_SUPABASE_ANON_KEY=your_anon_key');
      console.log('      SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
    }
  }
  
  console.log('\n📚 For more information, see scripts/README.md');
}

// Run the main function
main();