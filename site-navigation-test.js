/**
 * Site Navigation Test Script
 * Sequential Thinking MCP approach for systematic site testing
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class SiteNavigationTester {
  constructor() {
    this.testResults = {
      timestamp: new Date().toISOString(),
      serverStatus: null,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      testedPages: [],
      errors: [],
      recommendations: []
    };
    
    this.baseUrl = 'http://localhost:5173';
    this.testPages = this.defineTestPages();
  }

  /**
   * Define all pages to test based on Context7 MCP analysis
   */
  defineTestPages() {
    return [
      // Homepage and main sections
      { url: '/', name: 'Homepage', priority: 'critical', category: 'main' },
      { url: '/compare', name: 'Compare Page', priority: 'high', category: 'main' },
      { url: '/education', name: 'Education Hub', priority: 'high', category: 'main' },
      { url: '/news', name: 'News Section', priority: 'medium', category: 'main' },
      { url: '/community', name: 'Community Section', priority: 'medium', category: 'main' },
      { url: '/about', name: 'About Page', priority: 'medium', category: 'main' },
      
      // Broker pages (sample)
      { url: '/brokers/interactive-brokers', name: 'Interactive Brokers', priority: 'high', category: 'brokers' },
      { url: '/brokers/etoro', name: 'eToro Review', priority: 'high', category: 'brokers' },
      { url: '/brokers/xtb', name: 'XTB Review', priority: 'high', category: 'brokers' },
      { url: '/brokers/saxo-bank', name: 'Saxo Bank Review', priority: 'medium', category: 'brokers' },
      { url: '/brokers/trading-212', name: 'Trading 212 Review', priority: 'medium', category: 'brokers' },
      
      // Comparison pages
      { url: '/comparison/best-online-brokers', name: 'Best Online Brokers', priority: 'high', category: 'comparison' },
      { url: '/comparison/best-forex-brokers', name: 'Best Forex Brokers', priority: 'high', category: 'comparison' },
      { url: '/comparison/best-stock-brokers', name: 'Best Stock Brokers', priority: 'medium', category: 'comparison' },
      { url: '/comparison/best-cfd-brokers', name: 'Best CFD Brokers', priority: 'medium', category: 'comparison' },
      
      // Tools pages
      { url: '/tools/find-my-broker', name: 'Find My Broker Tool', priority: 'medium', category: 'tools' },
      { url: '/tools/brokerage-fee-calculator', name: 'Fee Calculator', priority: 'medium', category: 'tools' },
      { url: '/tools/spread-comparison', name: 'Spread Comparison', priority: 'low', category: 'tools' },
      { url: '/tools/leverage-calculator', name: 'Leverage Calculator', priority: 'low', category: 'tools' },
      
      // Education pages
      { url: '/education/trading-glossary', name: 'Trading Glossary', priority: 'medium', category: 'education' },
      { url: '/education/how-to-choose-broker-2025', name: 'How to Choose Broker', priority: 'medium', category: 'education' },
      { url: '/education/understanding-forex-spreads', name: 'Forex Spreads Guide', priority: 'low', category: 'education' },
      { url: '/education/cfd-trading-guide-2025', name: 'CFD Trading Guide', priority: 'low', category: 'education' },
      
      // Country pages
      { url: '/countries/united-states', name: 'US Brokers', priority: 'low', category: 'countries' },
      { url: '/countries/united-kingdom', name: 'UK Brokers', priority: 'low', category: 'countries' },
      { url: '/countries/australia', name: 'Australian Brokers', priority: 'low', category: 'countries' },
      { url: '/countries/canada', name: 'Canadian Brokers', priority: 'low', category: 'countries' },
      
      // Legal pages
      { url: '/privacy', name: 'Privacy Policy', priority: 'low', category: 'legal' },
      { url: '/terms', name: 'Terms of Service', priority: 'low', category: 'legal' },
      { url: '/cookies', name: 'Cookie Policy', priority: 'low', category: 'legal' }
    ];
  }

  /**
   * Main test execution
   */
  async runNavigationTest() {
    console.log('🚀 Starting Site Navigation Test with Sequential Thinking MCP');
    console.log(`📋 Testing ${this.testPages.length} pages systematically`);
    
    try {
      // Step 1: Verify server accessibility
      await this.verifyServer();
      
      // Step 2: Test pages by priority
      await this.testPagesByPriority();
      
      // Step 3: Generate report
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Critical error in navigation test:', error.message);
      this.testResults.errors.push({
        type: 'critical',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Verify server is accessible
   */
  async verifyServer() {
    console.log('🔍 Step 1: Verifying server accessibility...');
    
    try {
      const response = await this.fetchWithTimeout(this.baseUrl, 5000);
      if (response.ok) {
        this.testResults.serverStatus = 'accessible';
        console.log('✅ Server is accessible at', this.baseUrl);
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      this.testResults.serverStatus = 'failed';
      throw new Error(`Server verification failed: ${error.message}`);
    }
  }

  /**
   * Test pages systematically by priority
   */
  async testPagesByPriority() {
    console.log('🧪 Step 2: Testing pages by priority...');
    
    const priorities = ['critical', 'high', 'medium', 'low'];
    
    for (const priority of priorities) {
      const pagesForPriority = this.testPages.filter(page => page.priority === priority);
      console.log(`\n📊 Testing ${priority.toUpperCase()} priority pages (${pagesForPriority.length} pages)`);
      
      for (const page of pagesForPriority) {
        await this.testSinglePage(page);
        // Small delay to avoid overwhelming the server
        await this.delay(100);
      }
    }
  }

  /**
   * Test a single page
   */
  async testSinglePage(page) {
    this.testResults.totalTests++;
    const fullUrl = this.baseUrl + page.url;
    
    console.log(`  🔗 Testing: ${page.name} (${page.url})`);
    
    try {
      const startTime = Date.now();
      const response = await this.fetchWithTimeout(fullUrl, 10000);
      const loadTime = Date.now() - startTime;
      
      if (response.ok) {
        const text = await response.text();
        const hasReactContent = text.includes('id="root"') && !text.includes('Cannot GET');
        const hasErrorContent = text.includes('404') || text.includes('Page not found') || text.includes('Error');
        
        if (hasReactContent && !hasErrorContent) {
          this.testResults.passedTests++;
          console.log(`    ✅ PASSED (${loadTime}ms)`);
          
          this.testResults.testedPages.push({
            ...page,
            status: 'passed',
            loadTime: loadTime,
            timestamp: new Date().toISOString()
          });
        } else {
          this.testResults.failedTests++;
          const reason = !hasReactContent ? 'No React content' : 'Error content detected';
          console.log(`    ❌ FAILED: ${reason}`);
          
          this.testResults.testedPages.push({
            ...page,
            status: 'failed',
            reason: reason,
            loadTime: loadTime,
            timestamp: new Date().toISOString()
          });
          
          this.testResults.errors.push({
            type: page.category,
            page: page.name,
            url: page.url,
            message: reason,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        this.testResults.failedTests++;
        console.log(`    ❌ FAILED: HTTP ${response.status}`);
        
        this.testResults.testedPages.push({
          ...page,
          status: 'failed',
          reason: `HTTP ${response.status}`,
          timestamp: new Date().toISOString()
        });
        
        this.testResults.errors.push({
          type: page.category,
          page: page.name,
          url: page.url,
          message: `HTTP ${response.status}: ${response.statusText}`,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      this.testResults.failedTests++;
      console.log(`    ❌ ERROR: ${error.message}`);
      
      this.testResults.testedPages.push({
        ...page,
        status: 'error',
        reason: error.message,
        timestamp: new Date().toISOString()
      });
      
      this.testResults.errors.push({
        type: page.category,
        page: page.name,
        url: page.url,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Generate comprehensive test report
   */
  async generateReport() {
    console.log('\n📊 Step 3: Generating comprehensive test report...');
    
    // Calculate statistics
    const stats = this.calculateStatistics();
    
    // Generate recommendations
    const recommendations = this.generateRecommendations();
    
    const report = {
      ...this.testResults,
      statistics: stats,
      recommendations: recommendations
    };
    
    // Write JSON report
    const jsonReportPath = path.join(process.cwd(), 'site-navigation-test-report.json');
    fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));
    
    // Write markdown report
    const markdownReport = this.generateMarkdownReport(report);
    const mdReportPath = path.join(process.cwd(), 'site-navigation-test-report.md');
    fs.writeFileSync(mdReportPath, markdownReport);
    
    // Print summary
    this.printSummary(stats);
    
    console.log('\n📄 Reports generated:');
    console.log(`   JSON: ${jsonReportPath}`);
    console.log(`   Markdown: ${mdReportPath}`);
  }

  /**
   * Calculate test statistics
   */
  calculateStatistics() {
    const byCategory = {};
    const byPriority = {};
    
    this.testResults.testedPages.forEach(page => {
      // By category
      if (!byCategory[page.category]) {
        byCategory[page.category] = { total: 0, passed: 0, failed: 0 };
      }
      byCategory[page.category].total++;
      if (page.status === 'passed') byCategory[page.category].passed++;
      else byCategory[page.category].failed++;
      
      // By priority
      if (!byPriority[page.priority]) {
        byPriority[page.priority] = { total: 0, passed: 0, failed: 0 };
      }
      byPriority[page.priority].total++;
      if (page.status === 'passed') byPriority[page.priority].passed++;
      else byPriority[page.priority].failed++;
    });
    
    return {
      overall: {
        total: this.testResults.totalTests,
        passed: this.testResults.passedTests,
        failed: this.testResults.failedTests,
        successRate: ((this.testResults.passedTests / this.testResults.totalTests) * 100).toFixed(2) + '%'
      },
      byCategory,
      byPriority
    };
  }

  /**
   * Generate recommendations based on test results
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.testResults.serverStatus !== 'accessible') {
      recommendations.push({
        priority: 'critical',
        category: 'infrastructure',
        issue: 'Server not accessible',
        recommendation: 'Ensure development server is running on localhost:5173'
      });
    }
    
    // Analyze errors by category
    const errorsByCategory = {};
    this.testResults.errors.forEach(error => {
      errorsByCategory[error.type] = (errorsByCategory[error.type] || 0) + 1;
    });
    
    Object.entries(errorsByCategory).forEach(([category, count]) => {
      if (count > 2) {
        recommendations.push({
          priority: 'high',
          category: category,
          issue: `Multiple failures in ${category} section (${count} errors)`,
          recommendation: `Review ${category} routing and component implementation`
        });
      }
    });
    
    // Check critical page failures
    const criticalFailures = this.testResults.testedPages.filter(
      page => page.priority === 'critical' && page.status !== 'passed'
    );
    
    if (criticalFailures.length > 0) {
      recommendations.push({
        priority: 'critical',
        category: 'navigation',
        issue: `${criticalFailures.length} critical pages failed`,
        recommendation: 'Fix critical page routing immediately as these affect core functionality'
      });
    }
    
    return recommendations;
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(report) {
    return `# Site Navigation Test Report

**Generated:** ${report.timestamp}
**Server Status:** ${report.serverStatus}

## Executive Summary

- **Total Tests:** ${report.statistics.overall.total}
- **Passed:** ${report.statistics.overall.passed}
- **Failed:** ${report.statistics.overall.failed}
- **Success Rate:** ${report.statistics.overall.successRate}

## Results by Category

${Object.entries(report.statistics.byCategory).map(([category, stats]) => 
  `### ${category.charAt(0).toUpperCase() + category.slice(1)}
- Total: ${stats.total}
- Passed: ${stats.passed}
- Failed: ${stats.failed}
- Success Rate: ${((stats.passed / stats.total) * 100).toFixed(1)}%`
).join('\n\n')}

## Results by Priority

${Object.entries(report.statistics.byPriority).map(([priority, stats]) => 
  `### ${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
- Total: ${stats.total}
- Passed: ${stats.passed}
- Failed: ${stats.failed}
- Success Rate: ${((stats.passed / stats.total) * 100).toFixed(1)}%`
).join('\n\n')}

## Failed Pages

${report.testedPages.filter(page => page.status !== 'passed').map(page => 
  `- **${page.name}** (${page.url}) - ${page.reason || 'Unknown error'}`
).join('\n') || 'No failed pages'}

## Recommendations

${report.recommendations.map(rec => 
  `### ${rec.priority.toUpperCase()}: ${rec.issue}
**Category:** ${rec.category}
**Recommendation:** ${rec.recommendation}`
).join('\n\n') || 'No specific recommendations'}

## Detailed Results

${report.testedPages.map(page => 
  `- ${page.status === 'passed' ? '✅' : '❌'} **${page.name}** (${page.url}) - ${page.status}${page.loadTime ? ` (${page.loadTime}ms)` : ''}`
).join('\n')}

---
*Generated by Sequential Thinking MCP Site Navigation Tester*
`;
  }

  /**
   * Print summary to console
   */
  printSummary(stats) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 SITE NAVIGATION TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${stats.overall.total}`);
    console.log(`Passed: ${stats.overall.passed}`);
    console.log(`Failed: ${stats.overall.failed}`);
    console.log(`Success Rate: ${stats.overall.successRate}`);
    console.log('\n📈 Results by Category:');
    Object.entries(stats.byCategory).forEach(([category, categoryStats]) => {
      const rate = ((categoryStats.passed / categoryStats.total) * 100).toFixed(1);
      console.log(`  ${category}: ${categoryStats.passed}/${categoryStats.total} (${rate}%)`);
    });
    console.log('='.repeat(60));
  }

  /**
   * Fetch with timeout
   */
  async fetchWithTimeout(url, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Simple delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the test
if (require.main === module) {
  const tester = new SiteNavigationTester();
  tester.runNavigationTest().catch(console.error);
}

module.exports = SiteNavigationTester;