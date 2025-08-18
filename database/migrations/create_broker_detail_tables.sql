-- Migration: Create broker detail tables for BrokerDetail component
-- This creates the necessary tables for the comprehensive broker review system

-- Create broker_i18n table for internationalized broker content
CREATE TABLE IF NOT EXISTS broker_i18n (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    language VARCHAR(5) NOT NULL,
    name VARCHAR(255),
    tldr_summary TEXT,
    editorial_review TEXT,
    pros TEXT[], -- Array of strings for pros
    cons TEXT[], -- Array of strings for cons
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(broker_id, language)
);

-- Create broker_regulations table for regulatory information
CREATE TABLE IF NOT EXISTS broker_regulations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    country VARCHAR(100) NOT NULL,
    regulator VARCHAR(255) NOT NULL,
    license_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'revoked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create broker_faqs table for frequently asked questions
CREATE TABLE IF NOT EXISTS broker_faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create broker_reviews table for user reviews
CREATE TABLE IF NOT EXISTS broker_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to brokers table if they don't exist
ALTER TABLE brokers 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS min_deposit DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS spread_eur_usd DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS commission_stock DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS platforms TEXT[],
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS headquarters VARCHAR(255),
ADD COLUMN IF NOT EXISTS regulation_status VARCHAR(100),
ADD COLUMN IF NOT EXISTS overall_rating DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pros TEXT[],
ADD COLUMN IF NOT EXISTS cons TEXT[],
ADD COLUMN IF NOT EXISTS editorial_review TEXT,
ADD COLUMN IF NOT EXISTS tldr_summary TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_broker_i18n_broker_language ON broker_i18n(broker_id, language);
CREATE INDEX IF NOT EXISTS idx_broker_regulations_broker ON broker_regulations(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_faqs_broker_order ON broker_faqs(broker_id, order_index);
CREATE INDEX IF NOT EXISTS idx_broker_reviews_broker_status ON broker_reviews(broker_id, status);
CREATE INDEX IF NOT EXISTS idx_broker_reviews_user ON broker_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_brokers_slug ON brokers(slug);

-- Create RLS (Row Level Security) policies
ALTER TABLE broker_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to broker_i18n
CREATE POLICY "Allow public read access to broker_i18n" ON broker_i18n
    FOR SELECT USING (true);

-- Allow public read access to broker_regulations
CREATE POLICY "Allow public read access to broker_regulations" ON broker_regulations
    FOR SELECT USING (true);

-- Allow public read access to broker_faqs
CREATE POLICY "Allow public read access to broker_faqs" ON broker_faqs
    FOR SELECT USING (true);

-- Allow public read access to approved broker_reviews
CREATE POLICY "Allow public read access to approved broker_reviews" ON broker_reviews
    FOR SELECT USING (status = 'approved');

-- Allow authenticated users to insert their own reviews
CREATE POLICY "Allow authenticated users to insert reviews" ON broker_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reviews
CREATE POLICY "Allow users to update own reviews" ON broker_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update broker rating when reviews change
CREATE OR REPLACE FUNCTION update_broker_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the broker's overall rating and total reviews count
    UPDATE brokers 
    SET 
        overall_rating = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM broker_reviews 
            WHERE broker_id = COALESCE(NEW.broker_id, OLD.broker_id) 
            AND status = 'approved'
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM broker_reviews 
            WHERE broker_id = COALESCE(NEW.broker_id, OLD.broker_id) 
            AND status = 'approved'
        )
    WHERE id = COALESCE(NEW.broker_id, OLD.broker_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update broker ratings
DROP TRIGGER IF EXISTS trigger_update_broker_rating_insert ON broker_reviews;
CREATE TRIGGER trigger_update_broker_rating_insert
    AFTER INSERT ON broker_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_broker_rating();

DROP TRIGGER IF EXISTS trigger_update_broker_rating_update ON broker_reviews;
CREATE TRIGGER trigger_update_broker_rating_update
    AFTER UPDATE ON broker_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_broker_rating();

DROP TRIGGER IF EXISTS trigger_update_broker_rating_delete ON broker_reviews;
CREATE TRIGGER trigger_update_broker_rating_delete
    AFTER DELETE ON broker_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_broker_rating();

-- Insert sample data for testing
INSERT INTO brokers (name, slug, logo_url, website_url, min_deposit, spread_eur_usd, commission_stock, platforms, founded_year, headquarters, regulation_status, tldr_summary, editorial_review, pros, cons)
VALUES 
(
    'Interactive Brokers',
    'interactive-brokers',
    'https://example.com/logos/interactive-brokers.png',
    'https://www.interactivebrokers.com',
    0,
    0.2,
    1.00,
    ARRAY['TWS', 'IBKR Mobile', 'WebTrader'],
    1978,
    'Greenwich, Connecticut, USA',
    'Highly Regulated',
    'Interactive Brokers is a leading global broker offering low-cost trading across multiple asset classes with professional-grade tools and extensive market access.',
    'Interactive Brokers stands out as one of the most comprehensive and cost-effective brokers in the industry. With access to over 150 markets worldwide and incredibly low fees, it''s particularly attractive to active traders and institutional investors.\n\nThe platform offers sophisticated trading tools through its Trader Workstation (TWS), which provides advanced charting, risk management, and order management capabilities. However, the complexity of the platform may be overwhelming for beginners.\n\nRegulation is top-notch with oversight from multiple authorities including the SEC, FINRA, and various international regulators. The broker is publicly traded and maintains strong financial stability.',
    ARRAY['Extremely low fees', 'Access to 150+ markets', 'Professional trading tools', 'Strong regulation', 'No minimum deposit'],
    ARRAY['Complex platform for beginners', 'Inactivity fees for small accounts', 'Limited educational resources']
)
ON CONFLICT (slug) DO NOTHING;

-- Get the broker ID for sample data
DO $$
DECLARE
    broker_uuid UUID;
BEGIN
    SELECT id INTO broker_uuid FROM brokers WHERE slug = 'interactive-brokers';
    
    IF broker_uuid IS NOT NULL THEN
        -- Insert sample regulation data
        INSERT INTO broker_regulations (broker_id, country, regulator, license_number, status)
        VALUES 
        (broker_uuid, 'United States', 'SEC & FINRA', 'CRD: 36418', 'active'),
        (broker_uuid, 'United Kingdom', 'FCA', '208159', 'active'),
        (broker_uuid, 'European Union', 'Various National Regulators', 'Multiple', 'active')
        ON CONFLICT DO NOTHING;
        
        -- Insert sample FAQ data
        INSERT INTO broker_faqs (broker_id, question, answer, order_index)
        VALUES 
        (broker_uuid, 'What is the minimum deposit at Interactive Brokers?', 'Interactive Brokers has no minimum deposit requirement, making it accessible to traders of all sizes.', 1),
        (broker_uuid, 'What trading platforms does Interactive Brokers offer?', 'Interactive Brokers offers Trader Workstation (TWS), IBKR Mobile app, and WebTrader for different trading needs.', 2),
        (broker_uuid, 'Are there any inactivity fees?', 'Yes, accounts with less than $100,000 may be subject to a $20 monthly activity fee if trading commissions are below $20.', 3),
        (broker_uuid, 'What markets can I trade with Interactive Brokers?', 'You can trade on over 150 markets worldwide including stocks, options, futures, forex, bonds, and ETFs.', 4),
        (broker_uuid, 'Is Interactive Brokers suitable for beginners?', 'While Interactive Brokers offers powerful tools, the platform complexity makes it more suitable for experienced traders.', 5)
        ON CONFLICT DO NOTHING;
        
        -- Insert sample i18n data
        INSERT INTO broker_i18n (broker_id, language, name, tldr_summary)
        VALUES 
        (broker_uuid, 'es', 'Interactive Brokers', 'Interactive Brokers es un broker global líder que ofrece trading de bajo costo en múltiples clases de activos con herramientas de nivel profesional.'),
        (broker_uuid, 'fr', 'Interactive Brokers', 'Interactive Brokers est un courtier mondial de premier plan offrant des transactions à faible coût sur plusieurs classes d''actifs avec des outils de niveau professionnel.'),
        (broker_uuid, 'de', 'Interactive Brokers', 'Interactive Brokers ist ein führender globaler Broker, der kostengünstiges Trading über mehrere Anlageklassen mit professionellen Tools bietet.')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(trim(input_text), '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Update existing brokers to have slugs if they don't already
UPDATE brokers 
SET slug = generate_slug(name) 
WHERE slug IS NULL OR slug = '';

COMMIT;