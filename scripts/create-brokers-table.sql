-- Create brokers table according to the schema in Complete_Site_Technical_Architecture.md
-- Execute this SQL in your Supabase SQL editor at:
-- https://supabase.com/dashboard/project/[your-project-id]/sql

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_brokers_rating ON brokers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_brokers_active ON brokers(is_active);
CREATE INDEX IF NOT EXISTS idx_brokers_name ON brokers(name);

-- Verify table creation
SELECT 'Brokers table created successfully' as status;

-- Show table structure
\d brokers;