# BrokerChooser.com Web Crawler

A comprehensive web scraping system for crawling and analyzing BrokerChooser.com using Bright Data Web Unlocker and Supabase for data storage.

## 🎯 Features

- **Comprehensive Crawling**: Crawls entire BrokerChooser.com website using sitemap discovery
- **Bright Data Integration**: Uses Web Unlocker Direct API for reliable content fetching
- **Intelligent Parsing**: Extracts structured data from broker review pages
- **Resume Capability**: Supports resumable crawling to avoid re-processing existing pages
- **Concurrent Processing**: Configurable concurrency with rate limiting
- **Database Storage**: Stores raw HTML, clean text, and structured JSON in Supabase
- **Error Handling**: Robust retry mechanisms with exponential backoff
- **Progress Monitoring**: Real-time progress reporting and statistics

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account and project
- Bright Data account with Web Unlocker access

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd brokeranalysis-project
npm install
```

### 2. Environment Setup

Copy the sample environment file and configure your credentials:

```bash
cp .env.sample .env
```

Edit `.env` with your actual credentials:

```env
# Required: Bright Data Configuration
BRIGHTDATA_API_KEY=your_brightdata_api_key_here
BRIGHTDATA_ZONE=your_brightdata_zone_here

# Required: Supabase Configuration  
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: Crawler Configuration
CRAWLER_CONCURRENCY=6
CRAWLER_TIMEOUT=60000
CRAWLER_RETRIES=3
CRAWLER_DELAY=1000
CRAWLER_DEBUG=false
CRAWLER_RESUMABLE=true

# Optional: Database Configuration
DB_BATCH_SIZE=50
```

### 3. Database Setup

Run the SQL migration in your Supabase SQL Editor:

```bash
# Copy the contents of migration.sql and run in Supabase SQL Editor
cat migration.sql
```

Or use the Supabase CLI:

```bash
supabase db reset
supabase db push
```

### 4. Run the Crawler

```bash
# Basic crawl with resume capability
node crawl.js

# Force re-crawl all URLs (ignore existing)
node crawl.js --force

# Debug mode with detailed logging
node crawl.js --debug

# Limit crawl to first 100 URLs for testing
node crawl.js --max-urls 100

# Custom concurrency and timeout
node crawl.js --concurrency 10 --timeout 120000
```

## 📚 Usage

### Command Line Options

```bash
node crawl.js [options]

Options:
  --force           Force re-crawl all URLs (ignore existing)
  --no-resume       Disable resume functionality
  --debug           Enable debug logging
  --concurrency N   Set concurrency level (default: 6)
  --max-urls N      Limit number of URLs to crawl
  --timeout N       Request timeout in milliseconds
  --delay N         Delay between requests in milliseconds
  --help            Show help message
```

### NPM Scripts

```bash
# Run crawler with default settings
npm run crawl

# Force re-crawl all URLs
npm run crawl:force

# Test the parser with sample data
npm run test:parser

# Setup crawler (check dependencies and database)
npm run setup:crawler
```

### Programmatic Usage

```javascript
import BrokerChooserCrawler from './crawl.js';

const crawler = new BrokerChooserCrawler({
  concurrency: 8,
  timeout: 60000,
  debug: true,
  maxUrls: 500
});

try {
  const report = await crawler.crawl();
  console.log('Crawl completed:', report.summary);
} catch (error) {
  console.error('Crawl failed:', error.message);
}
```

## 🏗️ Architecture

### Core Components

1. **`unlocker.js`** - Bright Data Web Unlocker API wrapper
2. **`sitemap.js`** - Sitemap discovery and URL collection
3. **`parse.js`** - Content parsing and data extraction
4. **`db.js`** - Supabase database operations
5. **`crawl.js`** - Main orchestrator and CLI interface

### Data Flow

```
Sitemap Collection → URL Filtering → Concurrent Fetching → Content Parsing → Database Storage
```

### Database Schema

```sql
CREATE TABLE crawled_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL UNIQUE,
    status INTEGER NOT NULL DEFAULT 200,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sha256 TEXT NOT NULL,
    html TEXT,
    text_content TEXT,
    meta JSONB,
    data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 📊 Data Structure

### Extracted Metadata

```json
{
  "title": "Page title",
  "description": "Meta description",
  "keywords": "Meta keywords",
  "author": "Page author",
  "publishedTime": "2024-01-01T00:00:00Z",
  "modifiedTime": "2024-01-01T00:00:00Z",
  "canonicalUrl": "https://example.com/canonical",
  "pageType": "broker_review",
  "lang": "en"
}
```

### Broker Review Data

```json
{
  "reviewData": {
    "url": "https://brokerchooser.com/broker-reviews/etoro/",
    "title": "eToro Review 2024",
    "brokerName": "eToro",
    "brokerSlug": "etoro",
    "rating": 8.5,
    "lastUpdated": "2024-01-01T00:00:00Z",
    "pros": [
      "Social trading features",
      "User-friendly platform"
    ],
    "cons": [
      "Limited research tools",
      "High withdrawal fees"
    ],
    "sections": {
      "fees": "eToro charges competitive spreads...",
      "platforms": "The eToro platform is web-based...",
      "safety": "eToro is regulated by multiple authorities..."
    },
    "unmappedSections": {
      "conclusion": "Overall, eToro is a solid choice..."
    }
  }
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BRIGHTDATA_API_KEY` | ✅ | - | Bright Data API key |
| `BRIGHTDATA_ZONE` | ✅ | - | Bright Data zone identifier |
| `SUPABASE_URL` | ✅ | - | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | - | Supabase service role key |
| `CRAWLER_CONCURRENCY` | ❌ | 6 | Number of concurrent requests |
| `CRAWLER_TIMEOUT` | ❌ | 60000 | Request timeout in milliseconds |
| `CRAWLER_RETRIES` | ❌ | 3 | Number of retry attempts |
| `CRAWLER_DELAY` | ❌ | 1000 | Delay between requests in milliseconds |
| `CRAWLER_DEBUG` | ❌ | false | Enable debug logging |
| `CRAWLER_RESUMABLE` | ❌ | true | Enable resume functionality |
| `DB_BATCH_SIZE` | ❌ | 50 | Database batch size for bulk operations |

### Performance Tuning

- **Concurrency**: Start with 6, increase gradually based on rate limits
- **Timeout**: 60-120 seconds for reliable fetching
- **Delay**: 1-2 seconds between requests to be respectful
- **Batch Size**: 50-100 for database operations

## 🧪 Testing

### Test Individual Components

```bash
# Test Web Unlocker
node unlocker.js

# Test Sitemap Collector
node sitemap.js

# Test Parser
node parse.js

# Test Database
node db.js
```

### Test with Limited URLs

```bash
# Test with first 10 URLs
node crawl.js --max-urls 10 --debug

# Test specific broker review
node crawl.js --max-urls 1 --debug
```

## 📈 Monitoring

### Progress Tracking

The crawler provides real-time progress updates:

```
📊 Progress: 150/1000 (15.0%) - Success: 145, Failed: 3, Skipped: 2
```

### Final Report

```json
{
  "summary": {
    "totalUrls": 1000,
    "crawledUrls": 1000,
    "successfulCrawls": 985,
    "failedCrawls": 15,
    "skippedCrawls": 0,
    "reviewPages": 156,
    "duration": "45.2 minutes",
    "urlsPerMinute": 22.1,
    "successRate": "98.5%"
  },
  "errors": [...],
  "dbStats": {...}
}
```

### Database Queries

```sql
-- Get crawling statistics
SELECT * FROM crawling_stats;

-- Get broker reviews
SELECT * FROM broker_reviews ORDER BY rating DESC;

-- Search pages
SELECT * FROM search_pages('eToro', 10, 0);

-- Get broker summary
SELECT * FROM get_broker_review_summary('eToro');
```

## 🚨 Error Handling

### Common Issues

1. **Rate Limiting**: Reduce concurrency or increase delay
2. **Timeout Errors**: Increase timeout value
3. **Database Errors**: Check Supabase connection and permissions
4. **API Errors**: Verify Bright Data credentials and zone

### Retry Logic

- **Exponential Backoff**: 1s, 2s, 4s delays
- **Max Retries**: 3 attempts per URL
- **Error Classification**: Temporary vs permanent failures

### Resume Functionality

The crawler automatically resumes from where it left off:

- Checks existing URLs in database
- Skips unchanged content (based on SHA256 hash)
- Continues with remaining URLs
- Use `--force` to override resume behavior

## 🔒 Security

### Best Practices

- Store credentials in `.env` file (never commit to git)
- Use Supabase service role key (not anon key)
- Rotate API keys regularly
- Monitor usage and costs

### Rate Limiting

- Respect robots.txt (though we have explicit permission)
- Use reasonable delays between requests
- Monitor for 429 (Too Many Requests) responses
- Implement exponential backoff

## 📝 Logging

### Log Levels

- **Info** (📝): General progress and status
- **Success** (✅): Successful operations
- **Warning** (⚠️): Non-critical issues
- **Error** (❌): Failed operations
- **Debug** (🔍): Detailed debugging info

### Log Format

```
📝 [2024-01-01T12:00:00.000Z] Starting BrokerChooser.com crawl...
✅ [2024-01-01T12:00:01.000Z] Database connection verified
📊 [2024-01-01T12:00:02.000Z] Found 1000 URLs in sitemap
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section
2. Review error logs with `--debug` flag
3. Open an issue with detailed error information
4. Include environment details and configuration

## 🔄 Changelog

### v1.0.0
- Initial release
- Bright Data Web Unlocker integration
- Sitemap-based URL discovery
- Broker review parsing
- Supabase storage
- Resume functionality
- CLI interface

---

**Note**: This crawler is designed specifically for BrokerChooser.com with explicit permission. Ensure you have proper authorization before crawling any website.

## Deployment

The application is configured for deployment on Vercel. For detailed information about deployment configuration changes and troubleshooting, see [VERCEL_DEPLOYMENT_CHANGES.md](./VERCEL_DEPLOYMENT_CHANGES.md).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
