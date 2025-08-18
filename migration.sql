-- BrokerChooser Crawler Database Migration
-- Creates the crawled_pages table with proper indexes and constraints

-- Drop table if exists (for clean migration)
DROP TABLE IF EXISTS crawled_pages;

-- Create crawled_pages table
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

-- Create indexes for performance
CREATE INDEX idx_crawled_pages_url ON crawled_pages(url);
CREATE INDEX idx_crawled_pages_status ON crawled_pages(status);
CREATE INDEX idx_crawled_pages_fetched_at ON crawled_pages(fetched_at DESC);
CREATE INDEX idx_crawled_pages_sha256 ON crawled_pages(sha256);
CREATE INDEX idx_crawled_pages_created_at ON crawled_pages(created_at DESC);
CREATE INDEX idx_crawled_pages_updated_at ON crawled_pages(updated_at DESC);

-- Create GIN indexes for JSONB columns for fast JSON queries
CREATE INDEX idx_crawled_pages_meta_gin ON crawled_pages USING GIN(meta);
CREATE INDEX idx_crawled_pages_data_gin ON crawled_pages USING GIN(data);

-- Create partial indexes for common queries
CREATE INDEX idx_crawled_pages_broker_reviews ON crawled_pages(url) 
    WHERE url LIKE '%/broker-reviews/%';

CREATE INDEX idx_crawled_pages_successful ON crawled_pages(fetched_at DESC) 
    WHERE status >= 200 AND status < 300;

CREATE INDEX idx_crawled_pages_errors ON crawled_pages(fetched_at DESC) 
    WHERE status >= 400;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_crawled_pages_updated_at 
    BEFORE UPDATE ON crawled_pages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE crawled_pages IS 'Stores crawled page data from BrokerChooser.com';
COMMENT ON COLUMN crawled_pages.id IS 'Primary key UUID';
COMMENT ON COLUMN crawled_pages.url IS 'Full URL of the crawled page';
COMMENT ON COLUMN crawled_pages.status IS 'HTTP status code from the crawl';
COMMENT ON COLUMN crawled_pages.fetched_at IS 'Timestamp when the page was last fetched';
COMMENT ON COLUMN crawled_pages.sha256 IS 'SHA256 hash of the page content for deduplication';
COMMENT ON COLUMN crawled_pages.html IS 'Raw HTML content of the page';
COMMENT ON COLUMN crawled_pages.text_content IS 'Extracted text content from the page';
COMMENT ON COLUMN crawled_pages.meta IS 'Metadata extracted from the page (title, description, etc.)';
COMMENT ON COLUMN crawled_pages.data IS 'Structured data extracted from the page (review data, etc.)';
COMMENT ON COLUMN crawled_pages.created_at IS 'Timestamp when the record was first created';
COMMENT ON COLUMN crawled_pages.updated_at IS 'Timestamp when the record was last updated';

-- Create view for broker reviews only
CREATE VIEW broker_reviews AS
SELECT 
    id,
    url,
    status,
    fetched_at,
    meta->>'title' as title,
    data->'reviewData'->>'brokerName' as broker_name,
    data->'reviewData'->>'brokerSlug' as broker_slug,
    (data->'reviewData'->>'rating')::NUMERIC as rating,
    data->'reviewData'->'pros' as pros,
    data->'reviewData'->'cons' as cons,
    data->'reviewData'->'sections' as sections,
    data->'reviewData'->>'lastUpdated' as last_updated,
    created_at,
    updated_at
FROM crawled_pages
WHERE url LIKE '%/broker-reviews/%'
  AND data->'reviewData' IS NOT NULL;

COMMENT ON VIEW broker_reviews IS 'View showing only broker review pages with extracted review data';

-- Create view for crawling statistics
CREATE VIEW crawling_stats AS
SELECT 
    COUNT(*) as total_pages,
    COUNT(*) FILTER (WHERE url LIKE '%/broker-reviews/%') as review_pages,
    COUNT(*) FILTER (WHERE status >= 200 AND status < 300) as successful_pages,
    COUNT(*) FILTER (WHERE status >= 400) as error_pages,
    COUNT(*) FILTER (WHERE fetched_at >= NOW() - INTERVAL '24 hours') as pages_last_24h,
    COUNT(*) FILTER (WHERE fetched_at >= NOW() - INTERVAL '7 days') as pages_last_7d,
    MIN(fetched_at) as first_crawl,
    MAX(fetched_at) as last_crawl,
    COUNT(DISTINCT DATE(fetched_at)) as crawl_days
FROM crawled_pages;

COMMENT ON VIEW crawling_stats IS 'View providing crawling statistics and metrics';

-- Create function to get broker review summary
CREATE OR REPLACE FUNCTION get_broker_review_summary(broker_name_param TEXT)
RETURNS TABLE (
    broker_name TEXT,
    total_reviews BIGINT,
    avg_rating NUMERIC,
    latest_review_date TIMESTAMPTZ,
    total_pros BIGINT,
    total_cons BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        broker_name_param,
        COUNT(*) as total_reviews,
        AVG((data->'reviewData'->>'rating')::NUMERIC) as avg_rating,
        MAX(fetched_at) as latest_review_date,
        SUM(jsonb_array_length(data->'reviewData'->'pros')) as total_pros,
        SUM(jsonb_array_length(data->'reviewData'->'cons')) as total_cons
    FROM crawled_pages
    WHERE url LIKE '%/broker-reviews/%'
      AND data->'reviewData'->>'brokerName' ILIKE '%' || broker_name_param || '%'
      AND data->'reviewData' IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_broker_review_summary IS 'Function to get summary statistics for a specific broker';

-- Create function to search pages by content
CREATE OR REPLACE FUNCTION search_pages(
    search_query TEXT,
    page_limit INTEGER DEFAULT 50,
    page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    url TEXT,
    title TEXT,
    status INTEGER,
    fetched_at TIMESTAMPTZ,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.url,
        p.meta->>'title' as title,
        p.status,
        p.fetched_at,
        ts_rank(to_tsvector('english', COALESCE(p.text_content, '')), plainto_tsquery('english', search_query)) as relevance
    FROM crawled_pages p
    WHERE to_tsvector('english', COALESCE(p.text_content, '')) @@ plainto_tsquery('english', search_query)
       OR p.url ILIKE '%' || search_query || '%'
       OR p.meta->>'title' ILIKE '%' || search_query || '%'
    ORDER BY relevance DESC, p.fetched_at DESC
    LIMIT page_limit
    OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION search_pages IS 'Function to search pages by content with full-text search';

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON TABLE crawled_pages TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;

-- Insert sample data for testing (optional)
-- INSERT INTO crawled_pages (url, status, sha256, html, text_content, meta, data) VALUES
-- ('https://brokerchooser.com/broker-reviews/etoro/', 200, 'sample_hash_1', '<html>Sample eToro review</html>', 'Sample eToro review content', '{"title": "eToro Review", "pageType": "broker_review"}', '{"reviewData": {"brokerName": "eToro", "rating": 8.5, "pros": ["Social trading"], "cons": ["High fees"]}}'),
-- ('https://brokerchooser.com/broker-reviews/interactive-brokers/', 200, 'sample_hash_2', '<html>Sample IB review</html>', 'Sample Interactive Brokers review content', '{"title": "Interactive Brokers Review", "pageType": "broker_review"}', '{"reviewData": {"brokerName": "Interactive Brokers", "rating": 9.2, "pros": ["Low fees", "Advanced platform"], "cons": ["Complex interface"]}}');

-- Verify the migration
SELECT 'Migration completed successfully. Table created with ' || COUNT(*) || ' indexes.' as result
FROM pg_indexes 
WHERE tablename = 'crawled_pages';

-- Show table structure
\d+ crawled_pages;

-- Show views
\dv;

-- Show functions
\df get_broker_review_summary;
\df search_pages;

PRINT 'Migration completed! You can now run the crawler.';