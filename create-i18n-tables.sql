-- Create missing i18n tables for BrokerAnalysis platform
-- This fixes the 404 errors for locales and pages_i18n tables

-- 1. Create locales table
CREATE TABLE IF NOT EXISTS locales (
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
    ('ms', 'Bahasa Melayu')
ON CONFLICT (code) DO NOTHING;

-- 2. Create pages_i18n table
CREATE TABLE IF NOT EXISTS pages_i18n (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key VARCHAR(100) NOT NULL,
    lang VARCHAR(10) NOT NULL,
    translation_key VARCHAR(200) NOT NULL,
    translation_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique combination of page_key, lang, and translation_key
    CONSTRAINT unique_page_lang_key UNIQUE (page_key, lang, translation_key)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pages_i18n_page_lang ON pages_i18n (page_key, lang);
CREATE INDEX IF NOT EXISTS idx_pages_i18n_page_key ON pages_i18n (page_key);
CREATE INDEX IF NOT EXISTS idx_pages_i18n_lang ON pages_i18n (lang);
CREATE INDEX IF NOT EXISTS idx_pages_i18n_translation_key ON pages_i18n (translation_key);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pages_i18n_updated_at
    BEFORE UPDATE ON pages_i18n
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE pages_i18n ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to pages_i18n" ON pages_i18n
    FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert pages_i18n" ON pages_i18n
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update pages_i18n" ON pages_i18n
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete pages_i18n" ON pages_i18n
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data for homepage
INSERT INTO pages_i18n (page_key, lang, translation_key, translation_value) VALUES
-- English translations
('homepage', 'en', 'welcome_message', 'Welcome to BrokerAnalysis'),
('homepage', 'en', 'hero_title', 'Find Your Perfect Broker'),
('homepage', 'en', 'hero_subtitle', 'Compare brokers and make informed trading decisions'),
('homepage', 'en', 'cta_button', 'Get Started'),
('homepage', 'en', 'features_title', 'Why Choose BrokerAnalysis?'),
('homepage', 'en', 'feature_compare_title', 'Compare Brokers'),
('homepage', 'en', 'feature_compare_desc', 'Side-by-side comparison of broker features, fees, and ratings'),
('homepage', 'en', 'feature_reviews_title', 'Real Reviews'),
('homepage', 'en', 'feature_reviews_desc', 'Authentic user reviews and expert analysis'),
('homepage', 'en', 'feature_tools_title', 'Trading Tools'),
('homepage', 'en', 'feature_tools_desc', 'Advanced tools to help you make better trading decisions')
ON CONFLICT (page_key, lang, translation_key) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE pages_i18n IS 'Stores page-specific translations for dynamic loading via usePageTranslations hook';
COMMENT ON COLUMN pages_i18n.page_key IS 'Identifier for the page (e.g., homepage, broker-detail, comparison)';
COMMENT ON COLUMN pages_i18n.lang IS 'Language code (e.g., en, es, fr, de, it)';
COMMENT ON COLUMN pages_i18n.translation_key IS 'Key for the translation (e.g., hero_title, cta_button)';
COMMENT ON COLUMN pages_i18n.translation_value IS 'The actual translated text';

SELECT 'I18n tables created successfully!' as result;