-- Supabase Database Schema for BrokerAnalysis Platform
-- Programmatic SEO Foundation with Multi-language Support
-- Run this script in Supabase SQL Editor

-- =====================================================
-- CORE TABLES
-- =====================================================

-- 1. Brokers - Core entity table
CREATE TABLE brokers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    founded_year INTEGER,
    headquarters TEXT,
    base_currency TEXT,
    avg_rating NUMERIC(2,1) CHECK (avg_rating >= 0 AND avg_rating <= 5),
    logo_url TEXT,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for SEO-friendly URLs
CREATE INDEX idx_brokers_slug ON brokers(slug);
CREATE INDEX idx_brokers_status ON brokers(status);
CREATE INDEX idx_brokers_rating ON brokers(avg_rating DESC);

-- 2. Broker Features - Key/Value feature bullets (fees, platforms, etc.)
CREATE TABLE broker_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL,
    feature_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broker_features_broker_id ON broker_features(broker_id);
CREATE INDEX idx_broker_features_key ON broker_features(feature_key);

-- 3. Broker Regulation - Per-country regulators (for GEO content)
CREATE TABLE broker_regulation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    country_code CHAR(2) NOT NULL,
    regulator_name TEXT NOT NULL,
    license_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broker_regulation_broker_id ON broker_regulation(broker_id);
CREATE INDEX idx_broker_regulation_country ON broker_regulation(country_code);

-- 4. Reviews - Editorial and user reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    kind TEXT CHECK (kind IN ('editorial', 'user')) NOT NULL,
    author TEXT,
    author_id UUID, -- For authenticated users
    rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
    body TEXT NOT NULL,
    lang CHAR(2) DEFAULT 'en',
    flagged BOOLEAN DEFAULT FALSE, -- For admin moderation workflow
    admin_notes TEXT, -- Admin notes for flagged reviews
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_broker_id ON reviews(broker_id);
CREATE INDEX idx_reviews_kind ON reviews(kind);
CREATE INDEX idx_reviews_author_id ON reviews(author_id);
CREATE INDEX idx_reviews_published ON reviews(published_at DESC);
CREATE INDEX idx_reviews_flagged ON reviews(flagged) WHERE flagged = TRUE;

-- 5. Locales - Supported language codes
CREATE TABLE locales (
    code VARCHAR(5) PRIMARY KEY,
    label TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default locales (Top 20 languages to match frontend)
INSERT INTO locales (code, label) VALUES 
    ('en', 'English'),
    ('es', 'Español'),
    ('pt', 'Português'),
    ('fr', 'Français'),
    ('de', 'Deutsch'),
    ('it', 'Italiano'),
    ('ru', 'Русский'),
    ('zh-Hans', '简体中文'),
    ('zh-Hant', '繁體中文'),
    ('ja', '日本語'),
    ('ko', '한국어'),
    ('ar', 'العربية'),
    ('hi', 'हिन्दी'),
    ('bn', 'বাংলা'),
    ('ur', 'اردو'),
    ('tr', 'Türkçe'),
    ('vi', 'Tiếng Việt'),
    ('th', 'ไทย'),
    ('id', 'Bahasa Indonesia'),
    ('ms', 'Bahasa Melayu');

-- 6. Broker i18n - Localized strings per broker
CREATE TABLE broker_i18n (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    lang VARCHAR(5) NOT NULL REFERENCES locales(code),
    title TEXT,
    summary TEXT,
    pros TEXT[],
    cons TEXT[],
    faqs JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(broker_id, lang)
);

CREATE INDEX idx_broker_i18n_broker_lang ON broker_i18n(broker_id, lang);

-- 7. Pages i18n - Global UI strings (menus, footer, about)
CREATE TABLE pages_i18n (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key TEXT NOT NULL,
    lang VARCHAR(5) NOT NULL REFERENCES locales(code),
    t JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(page_key, lang)
);

CREATE INDEX idx_pages_i18n_page_lang ON pages_i18n(page_key, lang);

-- 8. Ingest Jobs - Background translation/content generation tracking
CREATE TABLE ingest_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    status TEXT CHECK (status IN ('queued', 'processing', 'done', 'error')) DEFAULT 'queued',
    payload JSONB,
    error TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ingest_jobs_status ON ingest_jobs(status);
CREATE INDEX idx_ingest_jobs_created ON ingest_jobs(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_regulation ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE locales ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingest_jobs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC READ POLICIES
-- =====================================================

-- Brokers: Public read for active brokers
CREATE POLICY "Public read active brokers" ON brokers
    FOR SELECT USING (status = 'active');

-- Broker Features: Public read for active brokers
CREATE POLICY "Public read broker features" ON broker_features
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM brokers 
            WHERE brokers.id = broker_features.broker_id 
            AND brokers.status = 'active'
        )
    );

-- Broker Regulation: Public read for active brokers
CREATE POLICY "Public read broker regulation" ON broker_regulation
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM brokers 
            WHERE brokers.id = broker_regulation.broker_id 
            AND brokers.status = 'active'
        )
    );

-- Reviews: Public read for reviews of active brokers
CREATE POLICY "Public read reviews" ON reviews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM brokers 
            WHERE brokers.id = reviews.broker_id 
            AND brokers.status = 'active'
        )
    );

-- Locales: Public read for enabled locales
CREATE POLICY "Public read locales" ON locales
    FOR SELECT USING (enabled = true);

-- Broker i18n: Public read for active brokers
CREATE POLICY "Public read broker i18n" ON broker_i18n
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM brokers 
            WHERE brokers.id = broker_i18n.broker_id 
            AND brokers.status = 'active'
        )
    );

-- Pages i18n: Public read for all pages
CREATE POLICY "Public read pages i18n" ON pages_i18n
    FOR SELECT USING (true);

-- Ingest Jobs: No public read (admin only)
CREATE POLICY "Admin read ingest jobs" ON ingest_jobs
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- USER WRITE POLICIES
-- =====================================================

-- Reviews: Authenticated users can insert user reviews with rate limiting
CREATE POLICY "Authenticated users can insert user reviews" ON reviews
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND kind = 'user'
        AND author_id = auth.uid()
        AND (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE broker_id = NEW.broker_id 
            AND author_id = auth.uid() 
            AND created_at > NOW() - INTERVAL '24 hours'
        ) < 3
    );

-- Reviews: Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (
        auth.role() = 'authenticated' 
        AND author_id = auth.uid()
        AND kind = 'user'
    );

-- Reviews: Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
    FOR DELETE USING (
        auth.role() = 'authenticated' 
        AND author_id = auth.uid()
        AND kind = 'user'
    );

-- =====================================================
-- ADMIN POLICIES
-- =====================================================

-- Admin full access to all tables
CREATE POLICY "Admin full access brokers" ON brokers
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access broker_features" ON broker_features
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access broker_regulation" ON broker_regulation
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access reviews" ON reviews
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access locales" ON locales
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access broker_i18n" ON broker_i18n
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access pages_i18n" ON pages_i18n
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access ingest_jobs" ON ingest_jobs
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_brokers_updated_at BEFORE UPDATE ON brokers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_broker_i18n_updated_at BEFORE UPDATE ON broker_i18n
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_i18n_updated_at BEFORE UPDATE ON pages_i18n
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update broker average rating
CREATE OR REPLACE FUNCTION update_broker_avg_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE brokers 
    SET avg_rating = (
        SELECT AVG(rating) 
        FROM reviews 
        WHERE broker_id = COALESCE(NEW.broker_id, OLD.broker_id)
        AND rating IS NOT NULL
    )
    WHERE id = COALESCE(NEW.broker_id, OLD.broker_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers for rating updates
CREATE TRIGGER update_broker_rating_on_review_insert 
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_broker_avg_rating();

CREATE TRIGGER update_broker_rating_on_review_update 
    AFTER UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_broker_avg_rating();

CREATE TRIGGER update_broker_rating_on_review_delete 
    AFTER DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_broker_avg_rating();

-- =====================================================
-- STORAGE BUCKET SETUP
-- =====================================================

-- Create storage bucket for broker assets (logos, OG images)
-- Note: This needs to be run in Supabase Dashboard or via API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('broker-assets', 'broker-assets', true);

-- Storage policies for broker-assets bucket
-- CREATE POLICY "Public read broker assets" ON storage.objects
--     FOR SELECT USING (bucket_id = 'broker-assets');

-- CREATE POLICY "Admin upload broker assets" ON storage.objects
--     FOR INSERT WITH CHECK (
--         bucket_id = 'broker-assets' 
--         AND auth.jwt() ->> 'role' = 'admin'
--     );

-- CREATE POLICY "Admin update broker assets" ON storage.objects
--     FOR UPDATE USING (
--         bucket_id = 'broker-assets' 
--         AND auth.jwt() ->> 'role' = 'admin'
--     );

-- CREATE POLICY "Admin delete broker assets" ON storage.objects
--     FOR DELETE USING (
--         bucket_id = 'broker-assets' 
--         AND auth.jwt() ->> 'role' = 'admin'
--     );

-- =====================================================
-- SAMPLE DATA (Optional)
-- =====================================================

-- Insert sample broker data
INSERT INTO brokers (slug, name, founded_year, headquarters, base_currency, status) VALUES
    ('etoro', 'eToro', 2007, 'Tel Aviv, Israel', 'USD', 'active'),
    ('plus500', 'Plus500', 2008, 'Haifa, Israel', 'USD', 'active'),
    ('ig-group', 'IG Group', 1974, 'London, UK', 'GBP', 'active'),
    ('pepperstone', 'Pepperstone', 2010, 'Melbourne, Australia', 'AUD', 'active'),
    ('oanda', 'OANDA', 1996, 'New York, USA', 'USD', 'active');

-- Insert sample features
INSERT INTO broker_features (broker_id, feature_key, feature_value)
SELECT 
    b.id,
    'min_deposit',
    CASE b.slug
        WHEN 'etoro' THEN '$200'
        WHEN 'plus500' THEN '$100'
        WHEN 'ig-group' THEN '$250'
        WHEN 'pepperstone' THEN '$200'
        WHEN 'oanda' THEN '$0'
    END
FROM brokers b WHERE b.status = 'active';

-- Insert sample regulation data
INSERT INTO broker_regulation (broker_id, country_code, regulator_name, license_id)
SELECT 
    b.id,
    'CY',
    'CySEC',
    CASE b.slug
        WHEN 'etoro' THEN '109/10'
        WHEN 'plus500' THEN '250/14'
        ELSE 'N/A'
    END
FROM brokers b WHERE b.slug IN ('etoro', 'plus500');

-- Insert sample English content
INSERT INTO broker_i18n (broker_id, lang, title, summary, pros, cons)
SELECT 
    b.id,
    'en',
    b.name || ' Review',
    'Comprehensive review of ' || b.name || ' broker services and features.',
    ARRAY['User-friendly platform', 'Good customer support', 'Competitive spreads'],
    ARRAY['Limited research tools', 'Higher fees for some services']
FROM brokers b WHERE b.status = 'active';

-- Insert sample page translations
INSERT INTO pages_i18n (page_key, lang, t) VALUES
    ('navigation', 'en', '{
        "home": "Home",
        "brokers": "Brokers",
        "compare": "Compare",
        "education": "Education",
        "news": "News",
        "about": "About"
    }'),
    ('footer', 'en', '{
        "copyright": "© 2024 BrokerAnalysis. All rights reserved.",
        "privacy": "Privacy Policy",
        "terms": "Terms of Service",
        "contact": "Contact Us"
    }');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for broker details with features and regulation
CREATE VIEW broker_details AS
SELECT 
    b.*,
    COALESCE(
        json_agg(
            json_build_object(
                'key', bf.feature_key,
                'value', bf.feature_value
            )
        ) FILTER (WHERE bf.id IS NOT NULL),
        '[]'::json
    ) as features,
    COALESCE(
        json_agg(
            json_build_object(
                'country_code', br.country_code,
                'regulator_name', br.regulator_name,
                'license_id', br.license_id
            )
        ) FILTER (WHERE br.id IS NOT NULL),
        '[]'::json
    ) as regulation
FROM brokers b
LEFT JOIN broker_features bf ON b.id = bf.broker_id
LEFT JOIN broker_regulation br ON b.id = br.broker_id
WHERE b.status = 'active'
GROUP BY b.id, b.slug, b.name, b.founded_year, b.headquarters, 
         b.base_currency, b.avg_rating, b.logo_url, b.status, 
         b.created_at, b.updated_at;

-- View for localized broker content
CREATE VIEW broker_localized AS
SELECT 
    b.*,
    bi.lang,
    bi.title,
    bi.summary,
    bi.pros,
    bi.cons,
    bi.faqs
FROM brokers b
JOIN broker_i18n bi ON b.id = bi.broker_id
WHERE b.status = 'active';

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Schema creation completed successfully!
-- Next steps:
-- 1. Create storage bucket 'broker-assets' in Supabase Dashboard
-- 2. Upload broker logos to broker-assets/{broker-slug}/logo.png
-- 3. Update brokers.logo_url with public URLs
-- 4. Configure authentication and user roles
-- 5. Set up automated translation jobs for content localization

SELECT 'Supabase schema created successfully! Ready for programmatic SEO.' as status;