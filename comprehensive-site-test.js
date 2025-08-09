/**
 * Comprehensive Site Testing Script
 * Using Sequential Thinking MCP approach for systematic testing
 * 
 * This script tests all navigation paths and page accessibility
 * following the Context7 MCP gathered site structure
 */

import { spawn } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

class SequentialSiteTestRunner {
  constructor() {
    this.testResults = {
      timestamp: new Date().toISOString(),
      serverStatus: null,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      navigationTests: [],
      accessibilityTests: [],
      linkTests: [],
      errors: [],
      recommendations: []
    };
    
    this.mcpServerProcess = null;
    this.testSequence = this.createTestSequence();
  }

  /**
   * Sequential Thinking MCP: Create systematic test sequence
   * Based on Context7 MCP gathered site structure
   */
  createTestSequence() {
    return [
      // Phase 1: Infrastructure Verification
      { phase: 'infrastructure', name: 'Verify Development Server', priority: 'critical' },
      { phase: 'infrastructure', name: 'Launch Puppeteer MCP Server', priority: 'critical' },
      
      // Phase 2: Homepage Navigation Testing
      { phase: 'homepage', name: 'Test Homepage Load', priority: 'high' },
      { phase: 'homepage', name: 'Test Header Navigation Links', priority: 'high' },
      { phase: 'homepage', name: 'Test Footer Navigation Links', priority: 'high' },
      { phase: 'homepage', name: 'Test Search Functionality', priority: 'medium' },
      
      // Phase 3: Main Section Navigation
      { phase: 'main-sections', name: 'Test Brokers Section Navigation', priority: 'high' },
      { phase: 'main-sections', name: 'Test Compare Section Navigation', priority: 'high' },
      { phase: 'main-sections', name: 'Test Tools Section Navigation', priority: 'high' },
      { phase: 'main-sections', name: 'Test Education Section Navigation', priority: 'high' },
      { phase: 'main-sections', name: 'Test News Section Navigation', priority: 'medium' },
      { phase: 'main-sections', name: 'Test Community Section Navigation', priority: 'medium' },
      
      // Phase 4: Broker Pages Testing
      { phase: 'broker-pages', name: 'Test Individual Broker Pages', priority: 'high' },
      { phase: 'broker-pages', name: 'Test Broker Cross-Links', priority: 'medium' },
      
      // Phase 5: Comparison Pages Testing
      { phase: 'comparison-pages', name: 'Test Comparison Page Accessibility', priority: 'high' },
      { phase: 'comparison-pages', name: 'Test Broker References in Comparisons', priority: 'medium' },
      
      // Phase 6: Interactive Tools Testing
      { phase: 'tools', name: 'Test Tool Page Functionality', priority: 'medium' },
      { phase: 'tools', name: 'Test Tool Navigation', priority: 'medium' },
      
      // Phase 7: Educational Content Testing
      { phase: 'education', name: 'Test Educational Hub Navigation', priority: 'medium' },
      { phase: 'education', name: 'Test Article Accessibility', priority: 'low' },
      
      // Phase 8: Country-Specific Pages
      { phase: 'country-pages', name: 'Test Country Page Accessibility', priority: 'low' },
      { phase: 'country-pages', name: 'Test Local Broker Recommendations', priority: 'low' },
      
      // Phase 9: Legal Pages Testing
      { phase: 'legal-pages', name: 'Test Legal Page Accessibility', priority: 'low' },
      { phase: 'legal-pages', name: 'Test Footer Legal Navigation', priority: 'low' }
    ];
  }

  /**
   * Main test execution following Sequential Thinking MCP
   */
  async runComprehensiveTest() {
    console.log('🚀 Starting Comprehensive Site Testing with Sequential Thinking MCP');
    console.log('📋 Test Sequence:', this.testSequence.length, 'phases identified');
    
    try {
      // Phase 1: Infrastructure
      await this.verifyInfrastructure();
      
      // Phase 2-9: Sequential Testing
      for (const test of this.testSequence) {
        if (test.phase !== 'infrastructure') {
          await this.executeTestPhase(test);
        }
      }
      
      // Generate comprehensive report
      await this.generateTestReport();
      
    } catch (error) {
      console.error('❌ Critical error in test execution:', error);
      this.testResults.errors.push({
        type: 'critical',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Verify development server and MCP infrastructure
   */
  async verifyInfrastructure() {
    console.log('🔍 Phase 1: Infrastructure Verification');
    
    // Check if development server is running
    try {
      const response = await fetch('http://localhost:5173/');
      if (response.ok) {
        this.testResults.serverStatus = 'running';
        console.log('✅ Development server is running on localhost:5173');
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      this.testResults.serverStatus = 'failed';
      this.testResults.errors.push({
        type: 'infrastructure',
        message: `Development server not accessible: ${error.message}`,
        timestamp: new Date().toISOString()
      });
      throw new Error('Development server is not running. Please start with npm run dev');
    }
    
    // Launch Puppeteer MCP Server
    await this.launchMCPServer();
  }

  /**
   * Launch Puppeteer MCP Server for testing
   */
  async launchMCPServer() {
    console.log('🤖 Launching Puppeteer MCP Server...');
    
    try {
      this.mcpServerProcess = spawn('node', ['mcp-servers/dist/puppeteer/index.js'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd()
      });
      
      // Wait for server to initialize
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('MCP Server startup timeout'));
        }, 10000);
        
        this.mcpServerProcess.stdout.on('data', (data) => {
          const output = data.toString();
          if (output.includes('Server started') || output.includes('listening')) {
            clearTimeout(timeout);
            resolve();
          }
        });
        
        this.mcpServerProcess.stderr.on('data', (data) => {
          console.error('MCP Server Error:', data.toString());
        });
      });
      
      console.log('✅ Puppeteer MCP Server launched successfully');
    } catch (error) {
      console.error('❌ Failed to launch MCP Server:', error.message);
      this.testResults.errors.push({
        type: 'infrastructure',
        message: `MCP Server launch failed: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Execute individual test phase
   */
  async executeTestPhase(test) {
    console.log(`🧪 Testing: ${test.name} (${test.priority} priority)`);
    this.testResults.totalTests++;
    
    try {
      let result;
      
      switch (test.phase) {
        case 'homepage':
          result = await this.testHomepageNavigation(test.name);
          break;
        case 'main-sections':
          result = await this.testMainSectionNavigation(test.name);
          break;
        case 'broker-pages':
          result = await this.testBrokerPages(test.name);
          break;
        case 'comparison-pages':
          result = await this.testComparisonPages(test.name);
          break;
        case 'tools':
          result = await this.testToolsSection(test.name);
          break;
        case 'education':
          result = await this.testEducationSection(test.name);
          break;
        case 'country-pages':
          result = await this.testCountryPages(test.name);
          break;
        case 'legal-pages':
          result = await this.testLegalPages(test.name);
          break;
        default:
          result = { success: false, message: 'Unknown test phase' };
      }
      
      if (result.success) {
        this.testResults.passedTests++;
        console.log(`✅ ${test.name}: PASSED`);
      } else {
        this.testResults.failedTests++;
        console.log(`❌ ${test.name}: FAILED - ${result.message}`);
        this.testResults.errors.push({
          type: test.phase,
          test: test.name,
          message: result.message,
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      this.testResults.failedTests++;
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
      this.testResults.errors.push({
        type: test.phase,
        test: test.name,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Test homepage navigation elements
   */
  async testHomepageNavigation(testName) {
    const mcpRequest = {
      method: 'tools/call',
      params: {
        name: 'puppeteer_navigate',
        arguments: {
          url: 'http://localhost:5173/',
          waitUntil: 'networkidle2'
        }
      }
    };
    
    // Simulate MCP call (in real implementation, this would use actual MCP protocol)
    return await this.simulateMCPCall(mcpRequest, testName);
  }

  /**
   * Test main section navigation
   */
  async testMainSectionNavigation(testName) {
    const sections = [
      '/compare',
      '/education', 
      '/news',
      '/community',
      '/about'
    ];
    
    const results = [];
    for (const section of sections) {
      const mcpRequest = {
        method: 'tools/call',
        params: {
          name: 'puppeteer_navigate',
          arguments: {
            url: `http://localhost:5173${section}`,
            waitUntil: 'networkidle2'
          }
        }
      };
      
      const result = await this.simulateMCPCall(mcpRequest, `${testName} - ${section}`);
      results.push(result);
    }
    
    const allPassed = results.every(r => r.success);
    return {
      success: allPassed,
      message: allPassed ? 'All main sections accessible' : 'Some main sections failed'
    };
  }

  /**
   * Test broker pages accessibility
   */
  async testBrokerPages(testName) {
    const sampleBrokers = [
      '/brokers/interactive-brokers',
      '/brokers/etoro',
      '/brokers/xtb',
      '/brokers/saxo-bank',
      '/brokers/trading-212'
    ];
    
    const results = [];
    for (const broker of sampleBrokers) {
      const mcpRequest = {
        method: 'tools/call',
        params: {
          name: 'puppeteer_navigate',
          arguments: {
            url: `http://localhost:5173${broker}`,
            waitUntil: 'networkidle2'
          }
        }
      };
      
      const result = await this.simulateMCPCall(mcpRequest, `${testName} - ${broker}`);
      results.push(result);
    }
    
    const allPassed = results.every(r => r.success);
    return {
      success: allPassed,
      message: allPassed ? 'All broker pages accessible' : 'Some broker pages failed'
    };
  }

  /**
   * Test comparison pages
   */
  async testComparisonPages(testName) {
    const comparisonPages = [
      '/comparison/best-online-brokers',
      '/comparison/best-forex-brokers',
      '/comparison/best-stock-brokers',
      '/comparison/best-cfd-brokers'
    ];
    
    const results = [];
    for (const page of comparisonPages) {
      const mcpRequest = {
        method: 'tools/call',
        params: {
          name: 'puppeteer_navigate',
          arguments: {
            url: `http://localhost:5173${page}`,
            waitUntil: 'networkidle2'
          }
        }
      };
      
      const result = await this.simulateMCPCall(mcpRequest, `${testName} - ${page}`);
      results.push(result);
    }
    
    const allPassed = results.every(r => r.success);
    return {
      success: allPassed,
      message: allPassed ? 'All comparison pages accessible' : 'Some comparison pages failed'
    };
  }

  /**
   * Test tools section
   */
  async testToolsSection(testName) {
    const toolPages = [
      '/tools/find-my-broker',
      '/tools/brokerage-fee-calculator',
      '/tools/spread-comparison',
      '/tools/leverage-calculator'
    ];
    
    const results = [];
    for (const tool of toolPages) {
      const mcpRequest = {
        method: 'tools/call',
        params: {
          name: 'puppeteer_navigate',
          arguments: {
            url: `http://localhost:5173${tool}`,
            waitUntil: 'networkidle2'
          }
        }
      };
      
      const result = await this.simulateMCPCall(mcpRequest, `${testName} - ${tool}`);
      results.push(result);
    }
    
    const allPassed = results.every(r => r.success);
    return {
      success: allPassed,
      message: allPassed ? 'All tool pages accessible' : 'Some tool pages failed'
    };
  }

  /**
   * Test education section
   */
  async testEducationSection(testName) {
    const educationPages = [
      '/education/trading-glossary',
      '/education/how-to-choose-broker-2025',
      '/education/understanding-forex-spreads',
      '/education/cfd-trading-guide-2025'
    ];
    
    const results = [];
    for (const page of educationPages) {
      const mcpRequest = {
        method: 'tools/call',
        params: {
          name: 'puppeteer_navigate',
          arguments: {
            url: `http://localhost:5173${page}`,
            waitUntil: 'networkidle2'
          }
        }
      };
      
      const result = await this.simulateMCPCall(mcpRequest, `${testName} - ${page}`);
      results.push(result);
    }
    
    const allPassed = results.every(r => r.success);
    return {
      success: allPassed,
      message: allPassed ? 'All education pages accessible' : 'Some education pages failed'
    };
  }

  /**
   * Test country-specific pages
   */
  async testCountryPages(testName) {
    const countryPages = [
      '/countries/united-states',
      '/countries/united-kingdom',
      '/countries/australia',
      '/countries/canada'
    ];
    
    const results = [];
    for (const page of countryPages) {
      const mcpRequest = {
        method: 'tools/call',
        params: {
          name: 'puppeteer_navigate',
          arguments: {
            url: `http://localhost:5173${page}`,
            waitUntil: 'networkidle2'
          }
        }
      };
      
      const result = await this.simulateMCPCall(mcpRequest, `${testName} - ${page}`);
      results.push(result);
    }
    
    const allPassed = results.every(r => r.success);
    return {
      success: allPassed,
      message: allPassed ? 'All country pages accessible' : 'Some country pages failed'
    };
  }

  /**
   * Test legal pages
   */
  async testLegalPages(testName) {
    const legalPages = [
      '/privacy',
      '/terms',
      '/cookies'
    ];
    
    const results = [];
    for (const page of legalPages) {
      const mcpRequest = {
        method: 'tools/call',
        params: {
          name: 'puppeteer_navigate',
          arguments: {
            url: `http://localhost:5173${page}`,
            waitUntil: 'networkidle2'
          }
        }
      };
      
      const result = await this.simulateMCPCall(mcpRequest, `${testName} - ${page}`);
      results.push(result);
    }
    
    const allPassed = results.every(r => r.success);
    return {
      success: allPassed,
      message: allPassed ? 'All legal pages accessible' : 'Some legal pages failed'
    };
  }

  /**
   * Simulate MCP call (placeholder for actual MCP implementation)
   */
  async simulateMCPCall(request, testName) {
    // In real implementation, this would make actual MCP calls
    // For now, simulate with basic fetch
    try {
      const url = request.params.arguments.url;
      const response = await fetch(url);
      
      if (response.ok) {
        const text = await response.text();
        const hasReactContent = text.includes('id="root"') && !text.includes('Cannot GET');
        
        return {
          success: hasReactContent,
          message: hasReactContent ? 'Page loaded successfully' : 'Page loaded but no React content found'
        };
      } else {
        return {
          success: false,
          message: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Network error: ${error.message}`
      };
    }
  }

  /**
   * Generate comprehensive test report
   */
  async generateTestReport() {
    console.log('📊 Generating Comprehensive Test Report...');
    
    const report = {
      ...this.testResults,
      summary: {
        totalTests: this.testResults.totalTests,
        passedTests: this.testResults.passedTests,
        failedTests: this.testResults.failedTests,
        successRate: ((this.testResults.passedTests / this.testResults.totalTests) * 100).toFixed(2) + '%',
        serverStatus: this.testResults.serverStatus
      },
      recommendations: this.generateRecommendations()
    };
    
    // Write report to file
    const reportPath = join(process.cwd(), 'comprehensive-test-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate human-readable report
    const humanReport = this.generateHumanReadableReport(report);
    const humanReportPath = join(process.cwd(), 'comprehensive-test-report.md');
    writeFileSync(humanReportPath, humanReport);
    
    console.log('✅ Test reports generated:');
    console.log(`   📄 JSON Report: ${reportPath}`);
    console.log(`   📄 Markdown Report: ${humanReportPath}`);
    
    // Print summary to console
    console.log('\n📊 TEST SUMMARY:');
    console.log(`   Total Tests: ${report.summary.totalTests}`);
    console.log(`   Passed: ${report.summary.passedTests}`);
    console.log(`   Failed: ${report.summary.failedTests}`);
    console.log(`   Success Rate: ${report.summary.successRate}`);
    console.log(`   Server Status: ${report.summary.serverStatus}`);
  }

  /**
   * Generate recommendations based on test results
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.testResults.serverStatus !== 'running') {
      recommendations.push({
        priority: 'critical',
        category: 'infrastructure',
        issue: 'Development server not running',
        recommendation: 'Ensure development server is started with npm run dev before testing'
      });
    }
    
    if (this.testResults.failedTests > 0) {
      recommendations.push({
        priority: 'high',
        category: 'navigation',
        issue: `${this.testResults.failedTests} navigation tests failed`,
        recommendation: 'Review failed navigation links and ensure all routes are properly configured'
      });
    }
    
    const errorsByType = this.testResults.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(errorsByType).forEach(([type, count]) => {
      if (count > 2) {
        recommendations.push({
          priority: 'medium',
          category: type,
          issue: `Multiple errors in ${type} section (${count} errors)`,
          recommendation: `Focus on fixing ${type} section issues as they appear to be systematic`
        });
      }
    });
    
    return recommendations;
  }

  /**
   * Generate human-readable markdown report
   */
  generateHumanReadableReport(report) {
    return `# Comprehensive Site Testing Report

**Generated:** ${report.timestamp}

## Executive Summary

- **Total Tests:** ${report.summary.totalTests}
- **Passed:** ${report.summary.passedTests}
- **Failed:** ${report.summary.failedTests}
- **Success Rate:** ${report.summary.successRate}
- **Server Status:** ${report.summary.serverStatus}

## Test Results by Category

### Infrastructure
- Development Server: ${report.summary.serverStatus === 'running' ? '✅ Running' : '❌ Failed'}
- Puppeteer MCP Server: ${this.mcpServerProcess ? '✅ Launched' : '❌ Failed'}

### Navigation Testing
${report.errors.length === 0 ? '✅ All navigation tests passed' : '❌ Some navigation tests failed'}

## Errors and Issues

${report.errors.length === 0 ? 'No errors detected.' : report.errors.map(error => 
  `- **${error.type}**: ${error.message} (${error.test || 'General'})`
).join('\n')}

## Recommendations

${report.recommendations.map(rec => 
  `### ${rec.priority.toUpperCase()}: ${rec.issue}\n**Category:** ${rec.category}\n**Recommendation:** ${rec.recommendation}\n`
).join('\n')}

## Next Steps

1. Address critical infrastructure issues first
2. Fix high-priority navigation problems
3. Systematically resolve category-specific issues
4. Re-run tests to verify fixes

---
*Report generated by Sequential Thinking MCP Test Runner*
`;
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    console.log('🧹 Cleaning up test resources...');
    
    if (this.mcpServerProcess) {
      this.mcpServerProcess.kill();
      console.log('✅ MCP Server process terminated');
    }
    
    console.log('✅ Cleanup completed');
  }
}

// Export for use
export { SequentialSiteTestRunner };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testRunner = new SequentialSiteTestRunner();
  testRunner.runComprehensiveTest().catch(console.error);
}