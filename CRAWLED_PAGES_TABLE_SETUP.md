# Crawled Pages Table Setup for Supabase

## Overview

This document provides the SQL commands to create the `crawled_pages` table in your Supabase database. This table is designed to store web crawling data including URLs, content, metadata, and extracted information.

## SQL Commands to Execute

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `diykotyhjwcwdscozltq`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query** to create a new SQL script

### Step 2: Execute the Following SQL

Copy and paste the following SQL commands into the SQL Editor and click **Run**:

```sql
-- Create crawled_pages table for web scraping data storage
create table if not exists crawled_pages (
  id uuid primary key default gen_random_uuid(),
  url text unique not null,
  status int,
  fetched_at timestamptz default now(),
  sha256 text,
  html text,
  text_content text,
  meta jsonb,
  data jsonb
);

-- Create helpful index for JSON queries on the data column
create index if not exists crawled_pages_data_idx on crawled_pages using gin (data);
```

## Table Structure Explanation

### Columns

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated using `gen_random_uuid()` |
| `url` | TEXT | Unique constraint, stores the crawled page URL |
| `status` | INT | HTTP status code from the crawl request |
| `fetched_at` | TIMESTAMPTZ | Timestamp when the page was crawled (defaults to now) |
| `sha256` | TEXT | SHA256 hash of content for deduplication |
| `html` | TEXT | Raw HTML content of the page |
| `text_content` | TEXT | Extracted text content (cleaned HTML) |
| `meta` | JSONB | Metadata about the page (title, description, etc.) |
| `data` | JSONB | Extracted structured data from the page |

### Indexes

- **Primary Key Index**: Automatic on `id` column
- **Unique Index**: Automatic on `url` column
- **GIN Index**: On `data` column for efficient JSONB queries

## Usage Examples

### Insert a Crawled Page

```sql
INSERT INTO crawled_pages (url, status, sha256, html, text_content, meta, data)
VALUES (
  'https://example.com/broker-review',
  200,
  'abc123def456...',
  '<html><body>...</body></html>',
  'Broker review content...',
  '{"title": "Broker Review", "description": "Comprehensive review"}',
  '{"rating": 4.5, "features": ["trading", "analysis"]}'
);
```

### Query Pages by Status

```sql
SELECT url, fetched_at, status
FROM crawled_pages
WHERE status = 200
ORDER BY fetched_at DESC;
```

### Search JSON Data

```sql
-- Find pages with specific data attributes
SELECT url, data
FROM crawled_pages
WHERE data @> '{"rating": 4.5}';

-- Search for pages containing specific features
SELECT url, data->'features' as features
FROM crawled_pages
WHERE data->'features' ? 'trading';
```

### Get Recent Crawls

```sql
SELECT url, status, fetched_at
FROM crawled_pages
WHERE fetched_at > NOW() - INTERVAL '24 hours'
ORDER BY fetched_at DESC;
```

## Integration with Bright Data

This table is designed to work with the Bright Data Web Unlocker service configured in your environment:

- **API Key**: `BRIGHTDATA_API_KEY` from `.env`
- **Zone**: `brokeranalysis`
- **Endpoint**: `https://api.brightdata.com/request`

### Example Integration Code

```javascript
// Example: Store Bright Data crawl results
async function storeCrawlResult(url, brightDataResponse) {
  const { data, error } = await supabase
    .from('crawled_pages')
    .insert({
      url: url,
      status: brightDataResponse.status,
      html: brightDataResponse.html,
      text_content: extractTextContent(brightDataResponse.html),
      meta: extractMetadata(brightDataResponse.html),
      data: extractStructuredData(brightDataResponse.html),
      sha256: generateSHA256(brightDataResponse.html)
    });
  
  return { data, error };
}
```

## Performance Considerations

### Indexing Strategy

1. **GIN Index on JSONB**: Enables fast queries on JSON data
2. **Unique Constraint on URL**: Prevents duplicate crawls
3. **Timestamp Index**: Consider adding if you frequently query by date

### Storage Optimization

- **HTML Compression**: Consider compressing large HTML content
- **Text Extraction**: Store cleaned text separately for search
- **Data Archival**: Implement archival strategy for old crawl data

## Security and Privacy

### Row Level Security (RLS)

Consider enabling RLS if you need user-specific access:

```sql
-- Enable RLS
ALTER TABLE crawled_pages ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can view crawled pages" ON crawled_pages
  FOR SELECT USING (auth.role() = 'authenticated');
```

### Data Retention

Implement data retention policies:

```sql
-- Delete crawls older than 90 days
DELETE FROM crawled_pages
WHERE fetched_at < NOW() - INTERVAL '90 days';
```

## Verification

After executing the SQL commands, verify the table creation:

```sql
-- Check if table exists
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'crawled_pages'
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'crawled_pages';
```

## Next Steps

1. ✅ Execute the SQL commands in Supabase SQL Editor
2. 🔄 Verify table creation with the verification queries
3. 🧪 Test with sample data insertion
4. 🔗 Integrate with your web crawling workflow
5. 📊 Set up monitoring and analytics

---

**Created**: $(Get-Date)
**Project**: BrokerAnalysis Platform
**Database**: Supabase (Project: diykotyhjwcwdscozltq)