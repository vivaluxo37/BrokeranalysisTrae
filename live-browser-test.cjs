const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class LiveBrowserTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'http://localhost:5173';
    this.issues = [];
    this.testResults = {
      totalPages: 0,
      successfulPages: 0,
      failedPages: 0,
      issues: [],
      startTime: new Date(),
      endTime: null
    };
    
    // Comprehensive list of all pages to test
    this.testPages = [
      // Main pages
      { url: '/', name: 'Homepage', category: 'main', priority: 'high' },
      { url: '/about', name: 'About', category: 'main', priority: 'medium' },
      { url: '/contact', name: 'Contact', category: 'main', priority: 'medium' },
      { url: '/privacy-policy', name: 'Privacy Policy', category: 'legal', priority: 'low' },
      { url: '/terms-of-service', name: 'Terms of Service', category: 'legal', priority: 'low' },
      { url: '/disclaimer', name: 'Disclaimer', category: 'legal', priority: 'low' },
      
      // Broker pages
      { url: '/brokers/ic-markets', name: 'IC Markets Review', category: 'brokers', priority: 'high' },
      { url: '/brokers/pepperstone', name: 'Pepperstone Review', category: 'brokers', priority: 'high' },
      { url: '/brokers/fp-markets', name: 'FP Markets Review', category: 'brokers', priority: 'high' },
      { url: '/brokers/oanda', name: 'OANDA Review', category: 'brokers', priority: 'high' },
      { url: '/brokers/xm', name: 'XM Review', category: 'brokers', priority: 'high' },
      { url: '/brokers/avatrade', name: 'AvaTrade Review', category: 'brokers', priority: 'high' },
      { url: '/brokers/etoro', name: 'eToro Review', category: 'brokers', priority: 'high' },
      { url: '/brokers/plus500', name: 'Plus500 Review', category: 'brokers', priority: 'high' },
      { url: '/brokers/ig', name: 'IG Review', category: 'brokers', priority: 'high' },
      { url: '/brokers/forex-com', name: 'Forex.com Review', category: 'brokers', priority: 'high' },
      { url: '/brokers/fxpro', name: 'FxPro Review', category: 'brokers', priority: 'medium' },
      { url: '/brokers/admiral-markets', name: 'Admiral Markets Review', category: 'brokers', priority: 'medium' },
      { url: '/brokers/exness', name: 'Exness Review', category: 'brokers', priority: 'medium' },
      { url: '/brokers/fxtm', name: 'FXTM Review', category: 'brokers', priority: 'medium' },
      { url: '/brokers/hotforex', name: 'HotForex Review', category: 'brokers', priority: 'medium' },
      
      // Comparison pages
      { url: '/compare/ic-markets-vs-pepperstone', name: 'IC Markets vs Pepperstone', category: 'comparisons', priority: 'high' },
      { url: '/compare/oanda-vs-forex-com', name: 'OANDA vs Forex.com', category: 'comparisons', priority: 'high' },
      { url: '/compare/etoro-vs-plus500', name: 'eToro vs Plus500', category: 'comparisons', priority: 'high' },
      { url: '/compare/xm-vs-avatrade', name: 'XM vs AvaTrade', category: 'comparisons', priority: 'medium' },
      { url: '/compare/fp-markets-vs-ic-markets', name: 'FP Markets vs IC Markets', category: 'comparisons', priority: 'medium' },
      
      // Tools pages
      { url: '/tools/find-my-broker', name: 'Find My Broker Tool', category: 'tools', priority: 'high' },
      { url: '/tools/fee-calculator', name: 'Fee Calculator', category: 'tools', priority: 'high' },
      { url: '/tools/spread-comparison', name: 'Spread Comparison Tool', category: 'tools', priority: 'medium' },
      { url: '/tools/leverage-calculator', name: 'Leverage Calculator', category: 'tools', priority: 'medium' },
      { url: '/tools/pip-calculator', name: 'Pip Calculator', category: 'tools', priority: 'medium' },
      
      // Education pages
      { url: '/education', name: 'Education Hub', category: 'education', priority: 'high' },
      { url: '/education/trading-glossary', name: 'Trading Glossary', category: 'education', priority: 'medium' },
      { url: '/education/forex-basics', name: 'Forex Basics', category: 'education', priority: 'medium' },
      { url: '/education/trading-strategies', name: 'Trading Strategies', category: 'education', priority: 'medium' },
      { url: '/education/risk-management', name: 'Risk Management', category: 'education', priority: 'medium' },
      
      // News pages
      { url: '/news', name: 'News Hub', category: 'news', priority: 'medium' },
      { url: '/news/market-analysis', name: 'Market Analysis', category: 'news', priority: 'medium' },
      { url: '/news/broker-updates', name: 'Broker Updates', category: 'news', priority: 'medium' },
      
      // Country pages
      { url: '/countries/united-states', name: 'US Brokers', category: 'countries', priority: 'medium' },
      { url: '/countries/united-kingdom', name: 'UK Brokers', category: 'countries', priority: 'medium' },
      { url: '/countries/australia', name: 'Australian Brokers', category: 'countries', priority: 'medium' },
      { url: '/countries/canada', name: 'Canadian Brokers', category: 'countries', priority: 'low' },
      { url: '/countries/singapore', name: 'Singapore Brokers', category: 'countries', priority: 'low' },
      { url: '/countries/south-africa', name: 'South African Brokers', category: 'countries', priority: 'low' },
      
      // Test pages
      { url: '/test-page', name: 'Test Page', category: 'test', priority: 'low' },
      { url: '/test-broker-page', name: 'Test Broker Page', category: 'test', priority: 'low' }
    ];
  }

  async initialize() {
    console.log('🚀 Launching browser for live testing...');
    
    this.browser = await puppeteer.launch({
      headless: false, // Keep browser visible
      defaultViewport: { width: 1920, height: 1080 },
      args: [
        '--start-maximized',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    this.page = await this.browser.newPage();
    
    // Set up page event listeners
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.recordIssue('console-error', `Console error: ${msg.text()}`, 'high');
      }
    });
    
    this.page.on('pageerror', error => {
      this.recordIssue('page-error', `Page error: ${error.message}`, 'high');
    });
    
    this.page.on('requestfailed', request => {
      this.recordIssue('request-failed', `Failed request: ${request.url()} - ${request.failure().errorText}`, 'medium');
    });
    
    console.log('✅ Browser launched successfully!');
  }

  recordIssue(type, description, severity, pageUrl = null) {
    const issue = {
      type,
      description,
      severity,
      pageUrl: pageUrl || this.page?.url() || 'unknown',
      timestamp: new Date().toISOString()
    };
    
    this.issues.push(issue);
    this.testResults.issues.push(issue);
    
    console.log(`❌ ISSUE [${severity.toUpperCase()}]: ${description}`);
  }

  async testPage(pageInfo) {
    const { url, name, category, priority } = pageInfo;
    const fullUrl = `${this.baseUrl}${url}`;
    
    console.log(`\n🔍 Testing: ${name} (${fullUrl})`);

    try {
      // Navigate to page with timeout
      const response = await this.page.goto(fullUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      // Check response status
      if (!response.ok()) {
        this.recordIssue('http-error', `HTTP ${response.status()}: ${name}`, 'high', fullUrl);
        this.testResults.failedPages++;
        return false;
      }
      
      // Wait for page to load
      await this.page.waitForTimeout(2000);
      
      // Check for React app mount
      const hasReactRoot = await this.page.$('#root');
      if (!hasReactRoot) {
        this.recordIssue('missing-react-root', `No React root element found: ${name}`, 'high', fullUrl);
      }
      
      // Check for error messages
      const errorElements = await this.page.$$eval(
        '[class*="error"], [class*="Error"], .error-message, .error-page',
        elements => elements.map(el => el.textContent)
      ).catch(() => []);
      
      if (errorElements.length > 0) {
        this.recordIssue('error-content', `Error content found: ${errorElements.join(', ')}`, 'high', fullUrl);
      }
      
      // Check for 404 content
      const pageText = await this.page.evaluate(() => document.body.textContent.toLowerCase());
      if (pageText.includes('404') || pageText.includes('not found') || pageText.includes('page not found')) {
        this.recordIssue('404-content', `404 or "not found" content detected: ${name}`, 'high', fullUrl);
      }
      
      // Test navigation links (sample a few)
      try {
        const navLinks = await this.page.$$eval('nav a, header a', links => 
          links.slice(0, 5).map(link => ({ href: link.href, text: link.textContent.trim() }))
        ).catch(() => []);
        
        for (const link of navLinks) {
          if (link.href && !link.href.includes('javascript:') && !link.href.includes('#')) {
            // Just check if link is valid, don't navigate
            console.log(`  📎 Found nav link: ${link.text} -> ${link.href}`);
          }
        }
      } catch (error) {
        this.recordIssue('navigation-test-error', `Error testing navigation: ${error.message}`, 'medium', fullUrl);
      }
      
      // Check for SEO elements
      const title = await this.page.title();
      if (!title || title.length < 10) {
        this.recordIssue('seo-title', `Missing or short page title: ${name}`, 'medium', fullUrl);
      }
      
      const metaDescription = await this.page.$eval('meta[name="description"]', el => el.content).catch(() => null);
      if (!metaDescription) {
        this.recordIssue('seo-description', `Missing meta description: ${name}`, 'medium', fullUrl);
      }
      
      console.log(`✅ ${name} - Page loaded successfully`);
      this.testResults.successfulPages++;
      return true;
      
    } catch (error) {
      this.recordIssue('page-load-error', `Failed to load ${name}: ${error.message}`, 'high', fullUrl);
      this.testResults.failedPages++;
      return false;
    }
  }

  async runComprehensiveTest() {
    console.log('🎯 Starting comprehensive live browser testing...');
    console.log(`📊 Total pages to test: ${this.testPages.length}`);
    
    this.testResults.totalPages = this.testPages.length;
    
    // Sort pages by priority (high first)
    const sortedPages = this.testPages.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    for (let i = 0; i < sortedPages.length; i++) {
      const pageInfo = sortedPages[i];
      console.log(`\n📄 Progress: ${i + 1}/${sortedPages.length} - Testing ${pageInfo.category} page`);
      
      await this.testPage(pageInfo);
      
      // Add delay between tests to allow observation
      await this.page.waitForTimeout(3000);
    }
    
    this.testResults.endTime = new Date();
    console.log('\n🏁 Testing completed!');
  }

  generateReport() {
    const duration = (this.testResults.endTime - this.testResults.startTime) / 1000;
    const successRate = ((this.testResults.successfulPages / this.testResults.totalPages) * 100).toFixed(2);
    
    const report = {
      summary: {
        totalPages: this.testResults.totalPages,
        successfulPages: this.testResults.successfulPages,
        failedPages: this.testResults.failedPages,
        successRate: `${successRate}%`,
        duration: `${duration} seconds`,
        totalIssues: this.issues.length
      },
      issuesByCategory: this.categorizeIssues(),
      issuesBySeverity: this.groupIssuesBySeverity(),
      detailedIssues: this.issues,
      recommendations: this.generateRecommendations()
    };
    
    // Save JSON report
    const jsonPath = path.join(__dirname, 'live-test-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    
    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(report);
    const mdPath = path.join(__dirname, 'live-test-report.md');
    fs.writeFileSync(mdPath, markdownReport);
    
    console.log(`\n📋 Reports generated:`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`   Markdown: ${mdPath}`);
    
    return report;
  }

  categorizeIssues() {
    const categories = {};
    this.issues.forEach(issue => {
      const category = issue.type;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(issue);
    });
    return categories;
  }

  groupIssuesBySeverity() {
    const severities = { high: [], medium: [], low: [] };
    this.issues.forEach(issue => {
      severities[issue.severity].push(issue);
    });
    return severities;
  }

  generateRecommendations() {
    const recommendations = [];
    const issueTypes = this.categorizeIssues();
    
    if (issueTypes['http-error']) {
      recommendations.push('Fix HTTP errors and ensure all routes are properly configured');
    }
    
    if (issueTypes['404-content']) {
      recommendations.push('Implement proper 404 error pages and fix broken routes');
    }
    
    if (issueTypes['console-error']) {
      recommendations.push('Resolve JavaScript console errors to improve user experience');
    }
    
    if (issueTypes['seo-title'] || issueTypes['seo-description']) {
      recommendations.push('Improve SEO by adding proper titles and meta descriptions');
    }
    
    if (issueTypes['missing-react-root']) {
      recommendations.push('Ensure React application mounts properly on all pages');
    }
    
    return recommendations;
  }

  generateMarkdownReport(report) {
    return `# Live Browser Test Report

## Summary
- **Total Pages Tested:** ${report.summary.totalPages}
- **Successful Pages:** ${report.summary.successfulPages}
- **Failed Pages:** ${report.summary.failedPages}
- **Success Rate:** ${report.summary.successRate}
- **Test Duration:** ${report.summary.duration}
- **Total Issues Found:** ${report.summary.totalIssues}

## Issues by Severity

### High Priority Issues (${report.issuesBySeverity.high.length})
${report.issuesBySeverity.high.map(issue => `- **${issue.type}**: ${issue.description} (${issue.pageUrl})`).join('\n')}

### Medium Priority Issues (${report.issuesBySeverity.medium.length})
${report.issuesBySeverity.medium.map(issue => `- **${issue.type}**: ${issue.description} (${issue.pageUrl})`).join('\n')}

### Low Priority Issues (${report.issuesBySeverity.low.length})
${report.issuesBySeverity.low.map(issue => `- **${issue.type}**: ${issue.description} (${issue.pageUrl})`).join('\n')}

## Recommendations
${report.recommendations.map(rec => `- ${rec}`).join('\n')}

## Detailed Issues
${report.detailedIssues.map(issue => `
### ${issue.type} - ${issue.severity.toUpperCase()}
- **Description:** ${issue.description}
- **Page:** ${issue.pageUrl}
- **Timestamp:** ${issue.timestamp}`).join('\n')}
`;
  }

  async cleanup() {
    if (this.browser) {
      console.log('\n🧹 Keeping browser open for inspection...');
      console.log('💡 Close the browser manually when you\'re done reviewing.');
      // Don't close browser automatically - let user inspect
      // await this.browser.close();
    }
  }
}

// Main execution
async function runLiveBrowserTest() {
  const tester = new LiveBrowserTester();
  
  try {
    await tester.initialize();
    await tester.runComprehensiveTest();
    const report = tester.generateReport();
    
    console.log('\n📊 Test Summary:');
    console.log(`   Success Rate: ${report.summary.successRate}`);
    console.log(`   Issues Found: ${report.summary.totalIssues}`);
    console.log(`   High Priority: ${report.issuesBySeverity.high.length}`);
    console.log(`   Medium Priority: ${report.issuesBySeverity.medium.length}`);
    console.log(`   Low Priority: ${report.issuesBySeverity.low.length}`);
    
    await tester.cleanup();
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    await tester.cleanup();
  }
}

// Run the test
if (require.main === module) {
  runLiveBrowserTest();
}

module.exports = LiveBrowserTester;