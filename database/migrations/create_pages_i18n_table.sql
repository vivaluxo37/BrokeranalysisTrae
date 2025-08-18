-- Create pages_i18n table for storing page-specific translations
-- This table supports the usePageTranslations hook for dynamic translation loading

CREATE TABLE IF NOT EXISTS pages_i18n (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
('homepage', 'en', 'feature_tools_desc', 'Advanced tools to help you make better trading decisions'),

-- Spanish translations
('homepage', 'es', 'welcome_message', 'Bienvenido a BrokerAnalysis'),
('homepage', 'es', 'hero_title', 'Encuentra Tu Broker Perfecto'),
('homepage', 'es', 'hero_subtitle', 'Compara brokers y toma decisiones de trading informadas'),
('homepage', 'es', 'cta_button', 'Comenzar'),
('homepage', 'es', 'features_title', '¿Por Qué Elegir BrokerAnalysis?'),
('homepage', 'es', 'feature_compare_title', 'Comparar Brokers'),
('homepage', 'es', 'feature_compare_desc', 'Comparación lado a lado de características, tarifas y calificaciones de brokers'),
('homepage', 'es', 'feature_reviews_title', 'Reseñas Reales'),
('homepage', 'es', 'feature_reviews_desc', 'Reseñas auténticas de usuarios y análisis de expertos'),
('homepage', 'es', 'feature_tools_title', 'Herramientas de Trading'),
('homepage', 'es', 'feature_tools_desc', 'Herramientas avanzadas para ayudarte a tomar mejores decisiones de trading'),

-- French translations
('homepage', 'fr', 'welcome_message', 'Bienvenue sur BrokerAnalysis'),
('homepage', 'fr', 'hero_title', 'Trouvez Votre Courtier Parfait'),
('homepage', 'fr', 'hero_subtitle', 'Comparez les courtiers et prenez des décisions de trading éclairées'),
('homepage', 'fr', 'cta_button', 'Commencer'),
('homepage', 'fr', 'features_title', 'Pourquoi Choisir BrokerAnalysis?'),
('homepage', 'fr', 'feature_compare_title', 'Comparer les Courtiers'),
('homepage', 'fr', 'feature_compare_desc', 'Comparaison côte à côte des fonctionnalités, frais et évaluations des courtiers'),
('homepage', 'fr', 'feature_reviews_title', 'Vraies Critiques'),
('homepage', 'fr', 'feature_reviews_desc', 'Critiques authentiques d\'utilisateurs et analyses d\'experts'),
('homepage', 'fr', 'feature_tools_title', 'Outils de Trading'),
('homepage', 'fr', 'feature_tools_desc', 'Outils avancés pour vous aider à prendre de meilleures décisions de trading'),

-- German translations
('homepage', 'de', 'welcome_message', 'Willkommen bei BrokerAnalysis'),
('homepage', 'de', 'hero_title', 'Finden Sie Ihren Perfekten Broker'),
('homepage', 'de', 'hero_subtitle', 'Vergleichen Sie Broker und treffen Sie informierte Trading-Entscheidungen'),
('homepage', 'de', 'cta_button', 'Loslegen'),
('homepage', 'de', 'features_title', 'Warum BrokerAnalysis Wählen?'),
('homepage', 'de', 'feature_compare_title', 'Broker Vergleichen'),
('homepage', 'de', 'feature_compare_desc', 'Seite-an-Seite-Vergleich von Broker-Features, Gebühren und Bewertungen'),
('homepage', 'de', 'feature_reviews_title', 'Echte Bewertungen'),
('homepage', 'de', 'feature_reviews_desc', 'Authentische Nutzerbewertungen und Expertenanalysen'),
('homepage', 'de', 'feature_tools_title', 'Trading-Tools'),
('homepage', 'de', 'feature_tools_desc', 'Erweiterte Tools, um bessere Trading-Entscheidungen zu treffen'),

-- Italian translations
('homepage', 'it', 'welcome_message', 'Benvenuto su BrokerAnalysis'),
('homepage', 'it', 'hero_title', 'Trova il Tuo Broker Perfetto'),
('homepage', 'it', 'hero_subtitle', 'Confronta i broker e prendi decisioni di trading informate'),
('homepage', 'it', 'cta_button', 'Inizia'),
('homepage', 'it', 'features_title', 'Perché Scegliere BrokerAnalysis?'),
('homepage', 'it', 'feature_compare_title', 'Confronta Broker'),
('homepage', 'it', 'feature_compare_desc', 'Confronto fianco a fianco di caratteristiche, commissioni e valutazioni dei broker'),
('homepage', 'it', 'feature_reviews_title', 'Recensioni Reali'),
('homepage', 'it', 'feature_reviews_desc', 'Recensioni autentiche degli utenti e analisi degli esperti'),
('homepage', 'it', 'feature_tools_title', 'Strumenti di Trading'),
('homepage', 'it', 'feature_tools_desc', 'Strumenti avanzati per aiutarti a prendere migliori decisioni di trading')

ON CONFLICT (page_key, lang, translation_key) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE pages_i18n IS 'Stores page-specific translations for dynamic loading via usePageTranslations hook';
COMMENT ON COLUMN pages_i18n.page_key IS 'Identifier for the page (e.g., homepage, broker-detail, comparison)';
COMMENT ON COLUMN pages_i18n.lang IS 'Language code (e.g., en, es, fr, de, it)';
COMMENT ON COLUMN pages_i18n.translation_key IS 'Key for the translation (e.g., hero_title, cta_button)';
COMMENT ON COLUMN pages_i18n.translation_value IS 'The actual translated text';