-- Create locales table
CREATE TABLE IF NOT EXISTS public.locales (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  native_name VARCHAR(100) NOT NULL,
  flag_emoji VARCHAR(10),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default locales
INSERT INTO public.locales (code, name, native_name, flag_emoji) VALUES
('en', 'English', 'English', '🇺🇸'),
('es', 'Spanish', 'Español', '🇪🇸'),
('fr', 'French', 'Français', '🇫🇷'),
('de', 'German', 'Deutsch', '🇩🇪'),
('it', 'Italian', 'Italiano', '🇮🇹'),
('pt', 'Portuguese', 'Português', '🇵🇹'),
('ru', 'Russian', 'Русский', '🇷🇺'),
('zh', 'Chinese', '中文', '🇨🇳'),
('ja', 'Japanese', '日本語', '🇯🇵'),
('ko', 'Korean', '한국어', '🇰🇷')
ON CONFLICT (code) DO NOTHING;

-- Create pages_i18n table
CREATE TABLE IF NOT EXISTS public.pages_i18n (
  id SERIAL PRIMARY KEY,
  page_key VARCHAR(100) NOT NULL,
  locale_code VARCHAR(10) NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_key, locale_code)
);

-- Add foreign key constraint
ALTER TABLE public.pages_i18n 
DROP CONSTRAINT IF EXISTS pages_i18n_locale_code_fkey;

ALTER TABLE public.pages_i18n 
ADD CONSTRAINT pages_i18n_locale_code_fkey 
FOREIGN KEY (locale_code) REFERENCES public.locales(code) ON DELETE CASCADE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pages_i18n_page_key ON public.pages_i18n(page_key);
CREATE INDEX IF NOT EXISTS idx_pages_i18n_locale_code ON public.pages_i18n(locale_code);
CREATE INDEX IF NOT EXISTS idx_pages_i18n_content ON public.pages_i18n USING GIN(content);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_locales_updated_at ON public.locales;
CREATE TRIGGER update_locales_updated_at
  BEFORE UPDATE ON public.locales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_i18n_updated_at ON public.pages_i18n;
CREATE TRIGGER update_pages_i18n_updated_at
  BEFORE UPDATE ON public.pages_i18n
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.locales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages_i18n ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "locales_select_policy" ON public.locales;
DROP POLICY IF EXISTS "pages_i18n_select_policy" ON public.pages_i18n;
DROP POLICY IF EXISTS "pages_i18n_insert_policy" ON public.pages_i18n;
DROP POLICY IF EXISTS "pages_i18n_update_policy" ON public.pages_i18n;
DROP POLICY IF EXISTS "pages_i18n_delete_policy" ON public.pages_i18n;

-- Create policies for locales (read-only for public)
CREATE POLICY "locales_select_policy" ON public.locales
  FOR SELECT USING (true);

-- Create policies for pages_i18n
CREATE POLICY "pages_i18n_select_policy" ON public.pages_i18n
  FOR SELECT USING (true);

CREATE POLICY "pages_i18n_insert_policy" ON public.pages_i18n
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "pages_i18n_update_policy" ON public.pages_i18n
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "pages_i18n_delete_policy" ON public.pages_i18n
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO public.pages_i18n (page_key, locale_code, content) VALUES
('welcome_message', 'en', '{"title": "Welcome to BrokerAnalysis", "description": "Your trusted source for broker reviews and comparisons"}'),
('welcome_message', 'es', '{"title": "Bienvenido a BrokerAnalysis", "description": "Tu fuente confiable para reseñas y comparaciones de brokers"}'),
('hero_title', 'en', '{"text": "Find the Perfect Broker for Your Trading Needs"}'),
('hero_title', 'es', '{"text": "Encuentra el Broker Perfecto para tus Necesidades de Trading"}'),
('hero_subtitle', 'en', '{"text": "Compare top brokers, read reviews, and make informed decisions"}'),
('hero_subtitle', 'es', '{"text": "Compara los mejores brokers, lee reseñas y toma decisiones informadas"}')
ON CONFLICT (page_key, locale_code) DO NOTHING;