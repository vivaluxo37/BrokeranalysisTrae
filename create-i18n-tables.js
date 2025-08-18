import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required variables:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createI18nTables() {
  try {
    console.log('🚀 Creating i18n tables...');
    
    // Step 1: Create locales table
    console.log('📝 Creating locales table...');
    
    // First, try to insert some test data to see if table exists
    const { data: existingLocales, error: checkError } = await supabase
      .from('locales')
      .select('code')
      .limit(1);
    
    let localesExists = false;
    let pagesExists = false;
    
    if (checkError && (checkError.message.includes('does not exist') || checkError.message.includes('schema cache'))) {
      console.log('⚠️  Locales table does not exist. Manual creation required.');
    } else if (existingLocales !== null) {
      console.log('✅ Locales table already exists!');
      localesExists = true;
    }
    
    // Step 2: Create pages_i18n table
    console.log('📝 Checking pages_i18n table...');
    
    const { data: existingPages, error: pagesCheckError } = await supabase
      .from('pages_i18n')
      .select('id')
      .limit(1);
    
    if (pagesCheckError && (pagesCheckError.message.includes('does not exist') || pagesCheckError.message.includes('schema cache'))) {
      console.log('⚠️  Pages_i18n table does not exist. Manual creation required.');
    } else if (existingPages !== null) {
      console.log('✅ Pages_i18n table already exists!');
      pagesExists = true;
    }
    
    // If tables don't exist, provide manual instructions
    if (!localesExists || !pagesExists) {
      
      console.log('\n🔧 MANUAL SETUP REQUIRED:');
      console.log('\nThe tables need to be created manually in Supabase Dashboard.');
      console.log('\n📋 Steps to follow:');
      console.log('1. Go to: https://supabase.com/dashboard/project/diykotyhjwcwdscozltq/sql');
      console.log('2. Copy and paste the following SQL:');
      console.log('\n' + '='.repeat(80));
      
      const manualSQL = `
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pages_i18n_page_lang ON pages_i18n (page_key, lang);

-- Enable RLS
ALTER TABLE pages_i18n ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to pages_i18n" ON pages_i18n
    FOR SELECT USING (true);

-- Insert sample homepage translations
INSERT INTO pages_i18n (page_key, lang, translation_key, translation_value) VALUES
('homepage', 'en', 'welcome_message', 'Welcome to BrokerAnalysis'),
('homepage', 'en', 'hero_title', 'Find Your Perfect Broker'),
('homepage', 'en', 'hero_subtitle', 'Compare brokers and make informed trading decisions'),
('homepage', 'en', 'cta_button', 'Get Started'),
('homepage', 'en', 'features_title', 'Why Choose BrokerAnalysis?')
ON CONFLICT (page_key, lang, translation_key) DO NOTHING;
`;
      
      console.log(manualSQL);
      console.log('='.repeat(80));
      console.log('\n3. Click "Run" to execute the SQL');
      console.log('4. Refresh your browser to test the fix');
      
      return;
    }
    
    // If tables exist, try to add sample data
    console.log('\n📝 Adding sample translations...');
    
    const sampleTranslations = [
      {
        page_key: 'homepage',
        lang: 'en',
        translation_key: 'welcome_message',
        translation_value: 'Welcome to BrokerAnalysis'
      },
      {
        page_key: 'homepage',
        lang: 'en',
        translation_key: 'hero_title',
        translation_value: 'Find Your Perfect Broker'
      },
      {
        page_key: 'homepage',
        lang: 'en',
        translation_key: 'hero_subtitle',
        translation_value: 'Compare brokers and make informed trading decisions'
      }
    ];
    
    for (const translation of sampleTranslations) {
      const { error: insertError } = await supabase
        .from('pages_i18n')
        .upsert(translation, { onConflict: 'page_key,lang,translation_key' });
      
      if (insertError) {
        console.log(`⚠️  Could not insert ${translation.translation_key}:`, insertError.message);
      } else {
        console.log(`✅ Added translation: ${translation.translation_key}`);
      }
    }
    
    console.log('\n🎉 Setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Refresh your browser');
    console.log('2. Check browser console for remaining errors');
    console.log('3. Test language switching functionality');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the script
createI18nTables().catch(console.error);