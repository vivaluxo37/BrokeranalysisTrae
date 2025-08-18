-- =====================================================
-- MANUAL SQL SETUP FOR SUPABASE I18N TABLES
-- =====================================================
-- Copy and paste this entire content into Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/diykotyhjwcwdscozltq/sql
-- =====================================================

-- Create locales table
CREATE TABLE IF NOT EXISTS locales (
    code VARCHAR(5) PRIMARY KEY,
    label TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default locales
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

-- Create pages_i18n table
CREATE TABLE IF NOT EXISTS pages_i18n (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key VARCHAR(100) NOT NULL,
    lang VARCHAR(10) NOT NULL,
    translation_key VARCHAR(200) NOT NULL,
    translation_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_page_lang_key UNIQUE (page_key, lang, translation_key)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_i18n_page_lang ON pages_i18n (page_key, lang);
CREATE INDEX IF NOT EXISTS idx_pages_i18n_translation_key ON pages_i18n (translation_key);

-- Enable Row Level Security
ALTER TABLE pages_i18n ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to pages_i18n" ON pages_i18n
    FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update
CREATE POLICY "Allow authenticated users to manage pages_i18n" ON pages_i18n
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample homepage translations
INSERT INTO pages_i18n (page_key, lang, translation_key, translation_value) VALUES
('homepage', 'en', 'welcome_message', 'Welcome to BrokerAnalysis'),
('homepage', 'en', 'hero_title', 'Find Your Perfect Broker'),
('homepage', 'en', 'hero_subtitle', 'Compare brokers and make informed trading decisions'),
('homepage', 'en', 'cta_button', 'Get Started'),
('homepage', 'en', 'features_title', 'Why Choose BrokerAnalysis?'),
('homepage', 'en', 'features_subtitle', 'Comprehensive broker analysis and comparison tools'),
('homepage', 'en', 'search_placeholder', 'Search brokers...'),
('homepage', 'en', 'footer_copyright', '© 2024 BrokerAnalysis. All rights reserved.')
ON CONFLICT (page_key, lang, translation_key) DO NOTHING;

-- Insert Spanish translations
INSERT INTO pages_i18n (page_key, lang, translation_key, translation_value) VALUES
('homepage', 'es', 'welcome_message', 'Bienvenido a BrokerAnalysis'),
('homepage', 'es', 'hero_title', 'Encuentra tu Broker Perfecto'),
('homepage', 'es', 'hero_subtitle', 'Compara brokers y toma decisiones de trading informadas'),
('homepage', 'es', 'cta_button', 'Comenzar'),
('homepage', 'es', 'features_title', '¿Por qué elegir BrokerAnalysis?'),
('homepage', 'es', 'features_subtitle', 'Herramientas completas de análisis y comparación de brokers'),
('homepage', 'es', 'search_placeholder', 'Buscar brokers...'),
('homepage', 'es', 'footer_copyright', '© 2024 BrokerAnalysis. Todos los derechos reservados.')
ON CONFLICT (page_key, lang, translation_key) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES (Optional - run after setup)
-- =====================================================

-- Check if locales table was created successfully
-- SELECT * FROM locales LIMIT 10;

-- Check if pages_i18n table was created successfully
-- SELECT * FROM pages_i18n WHERE page_key = 'homepage' LIMIT 10;

-- Check table structure
-- \d locales
-- \d pages_i18n

-- =====================================================
-- SETUP COMPLETE!
-- After running this SQL, refresh your browser to test
-- =====================================================