/**
 * Unit tests for the BrokerChooser.com review parser
 * Tests parsing functionality with real review page fixtures
 */

import BrokerReviewParser from './parse.js';
import fs from 'fs/promises';
import path from 'path';

class ParserTester {
    constructor() {
        this.parser = new BrokerReviewParser();
        this.testResults = [];
        this.fixturesDir = './test-fixtures';
    }

    /**
     * Create test fixtures directory if it doesn't exist
     */
    async ensureFixturesDir() {
        try {
            await fs.access(this.fixturesDir);
        } catch {
            await fs.mkdir(this.fixturesDir, { recursive: true });
            console.log(`📁 Created fixtures directory: ${this.fixturesDir}`);
        }
    }

    /**
     * Sample HTML fixtures for testing
     */
    getTestFixtures() {
        return [
            {
                name: 'eToro Review',
                url: 'https://brokerchooser.com/broker-reviews/etoro/',
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>eToro Review 2024 - Pros and Cons Uncovered</title>
                    <meta name="description" content="eToro review: social trading platform with copy trading features">
                    <meta name="keywords" content="eToro, broker, review, social trading">
                </head>
                <body>
                    <main>
                        <h1>eToro Review 2024</h1>
                        <div class="rating">8.5/10</div>
                        <div class="last-updated">Last updated: January 15, 2024</div>
                        
                        <div class="pros-cons">
                            <div class="pros">
                                <h3>Pros</h3>
                                <ul>
                                    <li>Innovative social trading features</li>
                                    <li>User-friendly platform interface</li>
                                    <li>Wide range of tradable assets</li>
                                    <li>Strong regulatory oversight</li>
                                </ul>
                            </div>
                            <div class="cons">
                                <h3>Cons</h3>
                                <ul>
                                    <li>Limited research and analysis tools</li>
                                    <li>High withdrawal fees</li>
                                    <li>Spreads can be wide during volatile periods</li>
                                </ul>
                            </div>
                        </div>
                        
                        <section>
                            <h2>Fees and Commissions</h2>
                            <p>eToro operates on a spread-based model with no commission on stock trades. The spreads are competitive but can widen during high volatility periods.</p>
                        </section>
                        
                        <section>
                            <h2>Trading Platforms</h2>
                            <p>eToro offers a proprietary web-based platform and mobile app. The platform is designed for ease of use with social trading features integrated throughout.</p>
                        </section>
                        
                        <section>
                            <h2>Safety and Regulation</h2>
                            <p>eToro is regulated by multiple tier-1 authorities including FCA, CySEC, and ASIC, providing strong investor protection.</p>
                        </section>
                        
                        <section>
                            <h2>Customer Service</h2>
                            <p>Customer support is available 24/5 through live chat and email. Response times are generally good during business hours.</p>
                        </section>
                    </main>
                </body>
                </html>
                `
            },
            {
                name: 'XTB Review',
                url: 'https://brokerchooser.com/broker-reviews/xtb/',
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>XTB Review 2024 - Comprehensive Analysis</title>
                    <meta name="description" content="XTB broker review covering fees, platforms, and trading conditions">
                </head>
                <body>
                    <main>
                        <h1>XTB Review 2024</h1>
                        <div class="rating">9.2/10</div>
                        <div class="updated">Updated: February 1, 2024</div>
                        
                        <div class="summary">
                            <h3>Advantages</h3>
                            <ul>
                                <li>Excellent research and education</li>
                                <li>Competitive pricing structure</li>
                                <li>Advanced trading platforms</li>
                                <li>Strong regulatory framework</li>
                            </ul>
                            
                            <h3>Disadvantages</h3>
                            <ul>
                                <li>Limited cryptocurrency offerings</li>
                                <li>No US clients accepted</li>
                                <li>Inactivity fees apply</li>
                            </ul>
                        </div>
                        
                        <h2>Non-trading Fees</h2>
                        <p>XTB charges inactivity fees after 365 days of no trading activity. Withdrawal fees vary by method but are generally reasonable.</p>
                        
                        <h2>Research and Education</h2>
                        <p>XTB excels in providing comprehensive market research, daily analysis, and educational content for traders of all levels.</p>
                        
                        <h2>Account Opening Process</h2>
                        <p>The account opening process is streamlined and can be completed online within minutes. KYC verification typically takes 1-2 business days.</p>
                    </main>
                </body>
                </html>
                `
            },
            {
                name: 'Interactive Brokers Review',
                url: 'https://brokerchooser.com/broker-reviews/interactive-brokers/',
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Interactive Brokers Review 2024 - Professional Trading</title>
                    <meta name="description" content="Interactive Brokers review for professional traders">
                </head>
                <body>
                    <main>
                        <h1>Interactive Brokers Review 2024</h1>
                        <div class="score">9.5/10</div>
                        <time datetime="2024-01-20">January 20, 2024</time>
                        
                        <div class="pros-cons-section">
                            <div class="positives">
                                <h3>Strengths</h3>
                                <ul>
                                    <li>Lowest cost structure in the industry</li>
                                    <li>Extensive global market access</li>
                                    <li>Professional-grade platforms</li>
                                    <li>Advanced order types and tools</li>
                                </ul>
                            </div>
                            <div class="negatives">
                                <h3>Weaknesses</h3>
                                <ul>
                                    <li>Complex platform for beginners</li>
                                    <li>High minimum deposit requirements</li>
                                    <li>Limited educational resources</li>
                                </ul>
                            </div>
                        </div>
                        
                        <h2>Order Types and Execution</h2>
                        <p>Interactive Brokers offers the most comprehensive selection of order types in the industry, with advanced algorithms for optimal execution.</p>
                        
                        <h2>Mobile Application</h2>
                        <p>The IBKR mobile app provides full trading functionality with real-time data and advanced charting capabilities.</p>
                        
                        <h2>Desktop Platform</h2>
                        <p>Trader Workstation (TWS) is a professional-grade desktop platform with extensive customization options and advanced trading tools.</p>
                        
                        <h2>Portfolio Analysis Tools</h2>
                        <p>Comprehensive portfolio analysis tools including risk metrics, performance attribution, and scenario analysis.</p>
                    </main>
                </body>
                </html>
                `
            }
        ];
    }

    /**
     * Save test fixtures to files
     */
    async saveFixtures() {
        await this.ensureFixturesDir();
        const fixtures = this.getTestFixtures();
        
        for (const fixture of fixtures) {
            const filename = `${fixture.name.toLowerCase().replace(/\s+/g, '-')}.html`;
            const filepath = path.join(this.fixturesDir, filename);
            await fs.writeFile(filepath, fixture.html, 'utf8');
            console.log(`💾 Saved fixture: ${filename}`);
        }
    }

    /**
     * Test metadata extraction
     */
    testMetadataExtraction(html, expectedTitle, url) {
        const metadata = this.parser.extractMetadata(html, url);
        
        const test = {
            name: 'Metadata Extraction',
            passed: false,
            details: {}
        };

        // Test title extraction
        if (metadata.title && metadata.title.includes(expectedTitle.split(' ')[0])) {
            test.details.title = '✅ Title extracted correctly';
        } else {
            test.details.title = `❌ Title extraction failed. Expected: ${expectedTitle}, Got: ${metadata.title}`;
        }

        // Test description extraction
        if (metadata.description && metadata.description.length > 0) {
            test.details.description = '✅ Description extracted';
        } else {
            test.details.description = '❌ Description not extracted';
        }

        // Test page type detection
        if (metadata.pageType === 'broker_review') {
            test.details.pageType = '✅ Page type correctly identified as broker_review';
        } else {
            test.details.pageType = `❌ Page type incorrect. Expected: broker_review, Got: ${metadata.pageType}`;
        }

        test.passed = Object.values(test.details).every(detail => detail.startsWith('✅'));
        return test;
    }

    /**
     * Test broker review parsing
     */
    testBrokerReviewParsing(html, url) {
        const reviewData = this.parser.parseBrokerReview(html, url);
        
        const test = {
            name: 'Broker Review Parsing',
            passed: false,
            details: {}
        };

        // Test basic fields
        if (reviewData.title && reviewData.title.length > 0) {
            test.details.title = '✅ Title extracted';
        } else {
            test.details.title = '❌ Title not extracted';
        }

        if (reviewData.brokerName && reviewData.brokerName.length > 0) {
            test.details.brokerName = '✅ Broker name extracted';
        } else {
            test.details.brokerName = '❌ Broker name not extracted';
        }

        if (reviewData.rating && reviewData.rating > 0) {
            test.details.rating = `✅ Rating extracted: ${reviewData.rating}`;
        } else {
            test.details.rating = '❌ Rating not extracted';
        }

        // Test pros and cons
        if (reviewData.pros && reviewData.pros.length > 0) {
            test.details.pros = `✅ Pros extracted: ${reviewData.pros.length} items`;
        } else {
            test.details.pros = '❌ Pros not extracted';
        }

        if (reviewData.cons && reviewData.cons.length > 0) {
            test.details.cons = `✅ Cons extracted: ${reviewData.cons.length} items`;
        } else {
            test.details.cons = '❌ Cons not extracted';
        }

        // Test sections
        if (reviewData.sections && Object.keys(reviewData.sections).length > 0) {
            test.details.sections = `✅ Sections extracted: ${Object.keys(reviewData.sections).length} sections`;
        } else {
            test.details.sections = '❌ Sections not extracted';
        }

        test.passed = Object.values(test.details).filter(detail => detail.startsWith('✅')).length >= 4;
        return test;
    }

    /**
     * Test content hash generation
     */
    testContentHashing(html) {
        const hash1 = this.parser.generateHash(html);
        const hash2 = this.parser.generateHash(html);
        const hash3 = this.parser.generateHash(html + ' ');
        
        const test = {
            name: 'Content Hashing',
            passed: false,
            details: {}
        };

        if (hash1 === hash2) {
            test.details.consistency = '✅ Hash generation is consistent';
        } else {
            test.details.consistency = '❌ Hash generation is inconsistent';
        }

        if (hash1 !== hash3) {
            test.details.sensitivity = '✅ Hash is sensitive to content changes';
        } else {
            test.details.sensitivity = '❌ Hash is not sensitive to content changes';
        }

        if (hash1 && hash1.length === 64) {
            test.details.format = '✅ Hash format is correct (SHA256)';
        } else {
            test.details.format = `❌ Hash format is incorrect. Length: ${hash1?.length || 0}`;
        }

        test.passed = Object.values(test.details).every(detail => detail.startsWith('✅'));
        return test;
    }

    /**
     * Test review page detection
     */
    testReviewPageDetection() {
        const testUrls = [
            { url: 'https://brokerchooser.com/broker-reviews/etoro/', expected: true },
            { url: 'https://brokerchooser.com/broker-reviews/xtb/', expected: true },
            { url: 'https://brokerchooser.com/blog/trading-tips/', expected: false },
            { url: 'https://brokerchooser.com/about/', expected: false },
            { url: 'https://brokerchooser.com/broker-reviews/', expected: false }
        ];

        const test = {
            name: 'Review Page Detection',
            passed: false,
            details: {}
        };

        let correctDetections = 0;
        for (const testCase of testUrls) {
            const isReview = this.parser.isBrokerReviewPage(testCase.url);
            if (isReview === testCase.expected) {
                correctDetections++;
                test.details[testCase.url] = `✅ Correctly detected: ${isReview}`;
            } else {
                test.details[testCase.url] = `❌ Incorrect detection. Expected: ${testCase.expected}, Got: ${isReview}`;
            }
        }

        test.passed = correctDetections === testUrls.length;
        return test;
    }

    /**
     * Run all tests
     */
    async runTests() {
        console.log('🧪 Starting BrokerChooser Parser Tests\n');
        
        // Save fixtures first
        await this.saveFixtures();
        
        const fixtures = this.getTestFixtures();
        
        // Test each fixture
        for (const fixture of fixtures) {
            console.log(`\n📄 Testing: ${fixture.name}`);
            console.log(`🔗 URL: ${fixture.url}`);
            
            // Test metadata extraction
            const metadataTest = this.testMetadataExtraction(fixture.html, fixture.name, fixture.url);
            this.testResults.push(metadataTest);
            
            // Test broker review parsing
            const reviewTest = this.testBrokerReviewParsing(fixture.html, fixture.url);
            this.testResults.push(reviewTest);
            
            // Test content hashing
            const hashTest = this.testContentHashing(fixture.html);
            this.testResults.push(hashTest);
            
            // Print results for this fixture
            console.log(`\n  ${metadataTest.name}: ${metadataTest.passed ? '✅ PASS' : '❌ FAIL'}`);
            for (const [key, detail] of Object.entries(metadataTest.details)) {
                console.log(`    ${detail}`);
            }
            
            console.log(`\n  ${reviewTest.name}: ${reviewTest.passed ? '✅ PASS' : '❌ FAIL'}`);
            for (const [key, detail] of Object.entries(reviewTest.details)) {
                console.log(`    ${detail}`);
            }
            
            console.log(`\n  ${hashTest.name}: ${hashTest.passed ? '✅ PASS' : '❌ FAIL'}`);
            for (const [key, detail] of Object.entries(hashTest.details)) {
                console.log(`    ${detail}`);
            }
        }
        
        // Test review page detection
        console.log('\n🔍 Testing Review Page Detection');
        const detectionTest = this.testReviewPageDetection();
        this.testResults.push(detectionTest);
        
        console.log(`\n  ${detectionTest.name}: ${detectionTest.passed ? '✅ PASS' : '❌ FAIL'}`);
        for (const [key, detail] of Object.entries(detectionTest.details)) {
            console.log(`    ${detail}`);
        }
        
        // Print summary
        this.printSummary();
    }

    /**
     * Print test summary
     */
    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(60));
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(test => test.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests} ✅`);
        console.log(`Failed: ${failedTests} ❌`);
        console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        
        if (failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(test => !test.passed)
                .forEach(test => {
                    console.log(`  - ${test.name}`);
                });
        }
        
        console.log('\n' + '='.repeat(60));
        
        if (passedTests === totalTests) {
            console.log('🎉 All tests passed! Parser is working correctly.');
        } else {
            console.log('⚠️  Some tests failed. Please review the parser implementation.');
            process.exit(1);
        }
    }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const tester = new ParserTester();
    tester.runTests().catch(error => {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
    });
}

export { ParserTester };