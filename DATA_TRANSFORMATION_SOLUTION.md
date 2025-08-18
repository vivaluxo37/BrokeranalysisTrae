# Data Transformation Solution: Broker Data Discrepancy

## Problem Analysis

Through systematic investigation using Sequential Thinking MCP and Context7 MCP, we identified the root cause of the data discrepancy:

### Issue Summary
- **Expected**: Over 100 broker details in a dedicated `brokers` table
- **Actual**: Only 5 broker details exist in Supabase
- **Root Cause**: The crawler stores all data in `crawled_pages` table, but there's no mechanism to transform broker review data into individual broker records in a separate `brokers` table

### Technical Details

1. **Data Storage Pattern**: The crawler successfully extracts broker data and stores it in `crawled_pages.data.reviewData` for pages with `pageType = 'broker_review'`

2. **Missing Transformation**: No process exists to read broker review data from `crawled_pages` and create corresponding records in the `brokers` table

3. **Schema Mismatch**: The `brokers` table schema exists in the architecture document but the table itself wasn't created in the database

## Solution Implementation

### Step 1: Create Brokers Table

**File**: `scripts/create-brokers-table.sql`

Execute this SQL in your Supabase dashboard:

```sql
-- Create brokers table
CREATE TABLE IF NOT EXISTS brokers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    features JSONB,
    fees JSONB,
    regulation JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_brokers_rating ON brokers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_brokers_active ON brokers(is_active);
CREATE INDEX IF NOT EXISTS idx_brokers_name ON brokers(name);
```

### Step 2: Data Transformation Script

**File**: `scripts/transform-broker-data.js`

This script:
- Reads broker review pages from `crawled_pages` where `pageType = 'broker_review'`
- Extracts broker information from `data.reviewData`
- Maps data to the `brokers` table schema
- Handles deduplication (multiple review pages for same broker)
- Performs batch upserts to populate the `brokers` table

### Key Features

1. **Data Extraction**: Extracts broker name, rating, logo URL, review count, pros/cons, and sections
2. **Deduplication**: Merges data when multiple pages exist for the same broker
3. **Data Validation**: Skips invalid records and provides detailed logging
4. **Batch Processing**: Processes data in batches of 50 for efficiency
5. **Progress Tracking**: Shows detailed progress and statistics

## Execution Instructions

### 1. Create the Brokers Table

1. Go to your Supabase dashboard: `https://supabase.com/dashboard/project/[your-project-id]/sql`
2. Copy and paste the SQL from `scripts/create-brokers-table.sql`
3. Execute the SQL

### 2. Run the Data Transformation

```bash
node scripts/transform-broker-data.js
```

## Expected Results

After successful execution:

- **Brokers Table**: Populated with individual broker records
- **Data Structure**: Each broker will have:
  - Unique ID (generated from broker name)
  - Name, rating, review count
  - Features (pros, cons, sections)
  - Fees and regulation information
  - Active status and timestamps

- **Deduplication**: Multiple review pages for the same broker are merged
- **Statistics**: Detailed report of processed pages and created broker records

## Data Mapping

| Source (`crawled_pages.data.reviewData`) | Target (`brokers` table) |
|------------------------------------------|-------------------------|
| `brokerName` | `name` |
| `rating` | `rating` |
| `logoUrl` | `logo_url` |
| `reviewCount` | `review_count` |
| `pros`, `cons`, `sections` | `features` (JSONB) |
| `sections.fees` | `fees` (JSONB) |
| `sections.safety`, `sections.regulation` | `regulation` (JSONB) |

## Verification

After running the transformation:

1. Check broker count: `SELECT COUNT(*) FROM brokers;`
2. View sample data: `SELECT id, name, rating, review_count FROM brokers LIMIT 10;`
3. Verify data structure: `SELECT features, fees, regulation FROM brokers WHERE features IS NOT NULL LIMIT 5;`

## Future Considerations

1. **Automated Pipeline**: Consider integrating this transformation into the crawler workflow
2. **Incremental Updates**: Modify the script to handle incremental updates rather than full rebuilds
3. **Data Validation**: Add more robust validation for broker data quality
4. **Monitoring**: Set up monitoring to detect when new broker review pages are crawled

This solution resolves the data discrepancy by creating the missing link between crawled page data and structured broker records, enabling the platform to access over 100 broker details as expected.