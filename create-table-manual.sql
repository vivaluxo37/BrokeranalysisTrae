-- ================================================================
-- Supabase Table Creation Script for crawled_pages
-- ================================================================
-- Run this script in the Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Step 1: Drop existing table if it exists
DROP TABLE IF EXISTS crawled_pages CASCADE;

-- Step 2: Create the main table
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

-- Step 3: Create indexes for performance
CREATE INDEX idx_crawled_pages_url ON crawled_pages(url);
CREATE INDEX idx_crawled_pages_status ON crawled_pages(status);
CREATE INDEX idx_crawled_pages_fetched_at ON crawled_pages(fetched_at DESC);
CREATE INDEX idx_crawled_pages_sha256 ON crawled_pages(sha256);
CREATE INDEX idx_crawled_pages_created_at ON crawled_pages(created_at DESC);
CREATE INDEX idx_crawled_pages_updated_at ON crawled_pages(updated_at DESC);

-- Step 4: Create GIN indexes for JSONB columns for fast JSON queries
CREATE INDEX idx_crawled_pages_meta_gin ON crawled_pages USING GIN(meta);
CREATE INDEX idx_crawled_pages_data_gin ON crawled_pages USING GIN(data);

-- Step 5: Create partial indexes for common queries
CREATE INDEX idx_crawled_pages_success ON crawled_pages(fetched_at DESC) 
    WHERE status >= 200 AND status < 300;

CREATE INDEX idx_crawled_pages_errors ON crawled_pages(fetched_at DESC) 
    WHERE status >= 400;

-- Step 6: Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger to automatically update updated_at
CREATE TRIGGER update_crawled_pages_updated_at 
    BEFORE UPDATE ON crawled_pages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Enable Row Level Security (RLS) for better security
ALTER TABLE crawled_pages ENABLE ROW LEVEL SECURITY;

-- Step 9: Create a policy to allow service role access
CREATE POLICY "Allow service role access" ON crawled_pages
    FOR ALL USING (auth.role() = 'service_role');

-- Step 10: Grant necessary permissions
GRANT ALL ON crawled_pages TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;

-- ================================================================
-- Verification Queries (Optional - run these to verify setup)
-- ================================================================

-- Check if table exists
-- SELECT table_name, table_type 
-- FROM information_schema.tables 
-- WHERE table_name = 'crawled_pages';

-- Check indexes
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'crawled_pages';

-- Check triggers
-- SELECT trigger_name, event_manipulation, action_statement 
-- FROM information_schema.triggers 
-- WHERE event_object_table = 'crawled_pages';

-- Test insert (optional)
-- INSERT INTO crawled_pages (url, sha256, html, text_content) 
-- VALUES ('https://example.com', 'test-hash', '<html>test</html>', 'test content');

-- Check the inserted data
-- SELECT * FROM crawled_pages LIMIT 1;

-- ================================================================
-- SUCCESS! Your crawled_pages table is now ready for use.
-- ================================================================