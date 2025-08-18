import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

// SQL commands to create tables
const createLocalesTable = `
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
`;

const createPagesTable = `
CREATE TABLE IF NOT EXISTS public.pages_i18n (
  id SERIAL PRIMARY KEY,
  page_key VARCHAR(100) NOT NULL,
  locale_code VARCHAR(10) NOT NULL,
  title VARCHAR(200),
  description TEXT,
  content JSONB,
  meta_keywords VARCHAR(500),
  slug VARCHAR(200),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (locale_code) REFERENCES public.locales(code) ON DELETE CASCADE,
  UNIQUE(page_key, locale_code)
);
`;

const insertLocalesData = `
INSERT INTO public.locales (code, name, native_name, flag_emoji, is_active) VALUES
('en', 'English', 'English', '🇺🇸', true),
('es', 'Spanish', 'Español', '🇪🇸', true),
('fr', 'French', 'Français', '🇫🇷', true),
('de', 'German', 'Deutsch', '🇩🇪', true),
('it', 'Italian', 'Italiano', '🇮🇹', true),
('pt', 'Portuguese', 'Português', '🇵🇹', true),
('ru', 'Russian', 'Русский', '🇷🇺', true),
('zh', 'Chinese', '中文', '🇨🇳', true),
('ja', 'Japanese', '日本語', '🇯🇵', true),
('ko', 'Korean', '한국어', '🇰🇷', true),
('ar', 'Arabic', 'العربية', '🇸🇦', true),
('hi', 'Hindi', 'हिन्दी', '🇮🇳', true),
('th', 'Thai', 'ไทย', '🇹🇭', true),
('vi', 'Vietnamese', 'Tiếng Việt', '🇻🇳', true),
('tr', 'Turkish', 'Türkçe', '🇹🇷', true),
('pl', 'Polish', 'Polski', '🇵🇱', true),
('nl', 'Dutch', 'Nederlands', '🇳🇱', true),
('sv', 'Swedish', 'Svenska', '🇸🇪', true),
('da', 'Danish', 'Dansk', '🇩🇰', true),
('no', 'Norwegian', 'Norsk', '🇳🇴', true)
ON CONFLICT (code) DO NOTHING;
`;

const insertPagesData = `
INSERT INTO public.pages_i18n (page_key, locale_code, title, description, content, meta_keywords, slug, is_published) VALUES
('home', 'en', 'Best Forex Brokers 2024 - Compare Top Trading Platforms', 'Find the best forex brokers for 2024. Compare spreads, fees, regulations, and trading platforms. Expert reviews and ratings.', '{"hero_title": "Find Your Perfect Forex Broker", "hero_subtitle": "Compare top-rated brokers and start trading with confidence"}', 'forex brokers, trading platforms, forex comparison, best brokers 2024', 'best-forex-brokers-2024', true),
('brokers', 'en', 'Forex Brokers Directory - Complete List & Reviews', 'Browse our complete directory of forex brokers. Read detailed reviews, compare features, and find the perfect broker for your trading needs.', '{"page_title": "Forex Brokers Directory", "description": "Comprehensive list of forex brokers with detailed reviews"}', 'forex brokers directory, broker reviews, trading platforms', 'forex-brokers-directory', true),
('compare', 'en', 'Compare Forex Brokers - Side by Side Comparison Tool', 'Use our advanced comparison tool to compare forex brokers side by side. Compare spreads, fees, regulations, and more.', '{"tool_title": "Broker Comparison Tool", "description": "Compare multiple brokers at once"}', 'compare forex brokers, broker comparison tool, trading comparison', 'compare-forex-brokers', true)
ON CONFLICT (page_key, locale_code) DO NOTHING;
`;

const createIndexes = `
CREATE INDEX IF NOT EXISTS idx_pages_i18n_page_key ON public.pages_i18n(page_key);
CREATE INDEX IF NOT EXISTS idx_pages_i18n_locale_code ON public.pages_i18n(locale_code);
CREATE INDEX IF NOT EXISTS idx_pages_i18n_slug ON public.pages_i18n(slug);
CREATE INDEX IF NOT EXISTS idx_pages_i18n_published ON public.pages_i18n(is_published);
CREATE INDEX IF NOT EXISTS idx_locales_active ON public.locales(is_active);
`;

const enableRLS = `
ALTER TABLE public.locales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages_i18n ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public read access to locales" ON public.locales
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access to published pages" ON public.pages_i18n
  FOR SELECT USING (is_published = true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to manage pages" ON public.pages_i18n
  FOR ALL USING (auth.role() = 'authenticated');
`;

async function executeSQL(sql, description) {
  try {
    console.log(`🔄 ${description}...`);
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({ sql })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
    
    const result = await response.json();
    console.log(`✅ ${description} completed`);
    return result;
    
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

async function createTablesViaAPI() {
  try {
    console.log('🚀 Creating i18n tables via Supabase REST API...');
    
    // Create tables
    await executeSQL(createLocalesTable, 'Creating locales table');
    await executeSQL(createPagesTable, 'Creating pages_i18n table');
    
    // Insert data
    await executeSQL(insertLocalesData, 'Inserting locales data');
    await executeSQL(insertPagesData, 'Inserting pages data');
    
    // Create indexes
    await executeSQL(createIndexes, 'Creating indexes');
    
    // Enable RLS
    await executeSQL(enableRLS, 'Enabling Row Level Security');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Refresh your browser to test the 404 fix');
    console.log('2. Check the browser console for any remaining errors');
    console.log('3. Verify that i18n functionality is working');
    
  } catch (error) {
    console.error('\n❌ API approach failed:', error.message);
    console.log('\n📋 Manual execution required:');
    console.log('Please execute the SQL commands manually in your Supabase Dashboard:');
    console.log('1. Go to https://supabase.com/dashboard/project/diykotyhjwcwdscozltq/sql');
    console.log('2. Copy and paste the contents of MANUAL_SQL_SETUP.sql');
    console.log('3. Click "Run" to execute the commands');
  }
}

// Alternative approach using direct table creation via REST API
async function createTablesDirectAPI() {
  console.log('🔄 Trying direct table creation via REST API...');
  
  try {
    // First, try to create locales table by inserting a test record
    // This will fail if table doesn't exist, but we can catch and handle
    
    // Check if tables exist by trying to query them
    const localesCheck = await fetch(`${supabaseUrl}/rest/v1/locales?limit=1`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    });
    
    const pagesCheck = await fetch(`${supabaseUrl}/rest/v1/pages_i18n?limit=1`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    });
    
    if (localesCheck.ok && pagesCheck.ok) {
      console.log('✅ Tables already exist!');
      return true;
    }
    
    console.log('❌ Tables do not exist, manual creation required');
    return false;
    
  } catch (error) {
    console.log('❌ Direct API check failed:', error.message);
    return false;
  }
}

// Run the creation process
createTablesDirectAPI().then(exists => {
  if (!exists) {
    return createTablesViaAPI();
  }
}).catch(error => {
  console.error('❌ Unexpected error:', error);
  console.log('\n📋 Please execute SQL manually in Supabase Dashboard');
});