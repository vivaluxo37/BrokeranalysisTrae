/**
 * Asset testing utilities for Vercel deployment verification
 * Tests that all static assets are properly served and accessible
 */

import { ASSET_CONFIG, getBrokerAssetPaths, validateAssetAccessibility } from './assetOptimization';

export interface AssetTestResult {
  path: string;
  accessible: boolean;
  status?: number;
  error?: string;
}

export interface AssetTestSuite {
  name: string;
  results: AssetTestResult[];
  passed: number;
  failed: number;
  total: number;
}

/**
 * Test individual asset accessibility
 */
export async function testAssetAccessibility(path: string): Promise<AssetTestResult> {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return {
      path,
      accessible: response.ok,
      status: response.status
    };
  } catch (error) {
    return {
      path,
      accessible: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Test critical static assets
 */
export async function testCriticalAssets(): Promise<AssetTestSuite> {
  const criticalAssets = [
    '/favicon.svg',
    '/vite.svg',
    '/assets/icons/broker-placeholder.svg',
    '/assets/icons/broker-placeholder.webp',
    '/assets/README.md'
  ];

  const results = await Promise.all(
    criticalAssets.map(path => testAssetAccessibility(path))
  );

  const passed = results.filter(r => r.accessible).length;
  const failed = results.length - passed;

  return {
    name: 'Critical Assets',
    results,
    passed,
    failed,
    total: results.length
  };
}

/**
 * Test broker asset path structure
 */
export async function testBrokerAssetPaths(): Promise<AssetTestSuite> {
  const testBrokerIds = ['test-broker', 'sample-broker'];
  const results: AssetTestResult[] = [];

  for (const brokerId of testBrokerIds) {
    const paths = getBrokerAssetPaths(brokerId);
    
    // Test all path variations
    const pathsToTest = [
      paths.square.small,
      paths.square.medium,
      paths.square.large,
      paths.horizontal,
      paths.favicon
    ];

    for (const path of pathsToTest) {
      const result = await testAssetAccessibility(path);
      results.push(result);
    }
  }

  const passed = results.filter(r => r.accessible).length;
  const failed = results.length - passed;

  return {
    name: 'Broker Asset Paths',
    results,
    passed,
    failed,
    total: results.length
  };
}

/**
 * Test asset directory structure
 */
export async function testAssetDirectories(): Promise<AssetTestSuite> {
  const directories = [
    '/assets/',
    '/assets/brokers/',
    '/assets/brokers/logos/',
    '/assets/brokers/logos/square/',
    '/assets/brokers/logos/horizontal/',
    '/assets/brokers/logos/favicon/',
    '/assets/icons/'
  ];

  const results = await Promise.all(
    directories.map(path => testAssetAccessibility(path))
  );

  const passed = results.filter(r => r.accessible).length;
  const failed = results.length - passed;

  return {
    name: 'Asset Directories',
    results,
    passed,
    failed,
    total: results.length
  };
}

/**
 * Run comprehensive asset tests
 */
export async function runAssetTests(): Promise<{
  suites: AssetTestSuite[];
  overallPassed: number;
  overallFailed: number;
  overallTotal: number;
  success: boolean;
}> {
  console.log('🧪 Running asset accessibility tests...');

  const suites = await Promise.all([
    testCriticalAssets(),
    testBrokerAssetPaths(),
    testAssetDirectories()
  ]);

  const overallPassed = suites.reduce((sum, suite) => sum + suite.passed, 0);
  const overallFailed = suites.reduce((sum, suite) => sum + suite.failed, 0);
  const overallTotal = suites.reduce((sum, suite) => sum + suite.total, 0);

  // Also run the validation function
  const validation = await validateAssetAccessibility();
  
  console.log('📊 Asset Test Results:');
  suites.forEach(suite => {
    console.log(`  ${suite.name}: ${suite.passed}/${suite.total} passed`);
    if (suite.failed > 0) {
      suite.results
        .filter(r => !r.accessible)
        .forEach(r => console.log(`    ❌ ${r.path}: ${r.error || `HTTP ${r.status}`}`));
    }
  });

  if (validation.errors.length > 0) {
    console.log('🚨 Validation Errors:');
    validation.errors.forEach(error => console.log(`  ❌ ${error}`));
  }

  if (validation.warnings.length > 0) {
    console.log('⚠️ Validation Warnings:');
    validation.warnings.forEach(warning => console.log(`  ⚠️ ${warning}`));
  }

  const success = validation.success && overallFailed === 0;
  console.log(`\n${success ? '✅' : '❌'} Overall: ${overallPassed}/${overallTotal} tests passed`);

  return {
    suites,
    overallPassed,
    overallFailed,
    overallTotal,
    success
  };
}

/**
 * Generate asset test report
 */
export function generateAssetTestReport(testResults: Awaited<ReturnType<typeof runAssetTests>>): string {
  const { suites, overallPassed, overallFailed, overallTotal, success } = testResults;
  
  let report = '# Asset Accessibility Test Report\n\n';
  report += `**Overall Status:** ${success ? '✅ PASSED' : '❌ FAILED'}\n`;
  report += `**Total Tests:** ${overallTotal}\n`;
  report += `**Passed:** ${overallPassed}\n`;
  report += `**Failed:** ${overallFailed}\n\n`;

  suites.forEach(suite => {
    report += `## ${suite.name}\n\n`;
    report += `**Status:** ${suite.failed === 0 ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `**Results:** ${suite.passed}/${suite.total} tests passed\n\n`;

    if (suite.failed > 0) {
      report += '### Failed Tests\n\n';
      suite.results
        .filter(r => !r.accessible)
        .forEach(r => {
          report += `- ❌ \`${r.path}\`: ${r.error || `HTTP ${r.status}`}\n`;
        });
      report += '\n';
    }

    if (suite.passed > 0) {
      report += '### Passed Tests\n\n';
      suite.results
        .filter(r => r.accessible)
        .forEach(r => {
          report += `- ✅ \`${r.path}\`\n`;
        });
      report += '\n';
    }
  });

  report += '## Recommendations\n\n';
  if (!success) {
    report += '- Verify that all static assets are properly copied to the build output\n';
    report += '- Check Vercel configuration for correct asset serving\n';
    report += '- Ensure asset paths are correctly configured for production environment\n';
    report += '- Validate that Vite build process includes all necessary assets\n';
  } else {
    report += '- All critical assets are properly accessible\n';
    report += '- Asset serving configuration is working correctly\n';
    report += '- No immediate action required\n';
  }

  return report;
}
