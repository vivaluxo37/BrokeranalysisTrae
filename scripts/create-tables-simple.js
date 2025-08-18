import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🚀 Creating missing tables...');

  // Create broker_features table
  console.log('Creating broker_features table...');
  const { error: featuresError } = await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS broker_features (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
        feature_key TEXT NOT NULL,
        feature_value TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_broker_features_broker_id ON broker_features(broker_id);
      CREATE INDEX IF NOT EXISTS idx_broker_features_key ON broker_features(feature_key);
    `
  });

  if (featuresError) {
    console.log('⚠️ broker_features creation failed:', featuresError.message);
  } else {
    console.log('✅ broker_features table created successfully');
  }

  // Create broker_regulation table
  console.log('Creating broker_regulation table...');
  const { error: regulationError } = await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS broker_regulation (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
        country_code CHAR(2) NOT NULL,
        regulator_name TEXT NOT NULL,
        license_id TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_broker_regulation_broker_id ON broker_regulation(broker_id);
      CREATE INDEX IF NOT EXISTS idx_broker_regulation_country ON broker_regulation(country_code);
    `
  });

  if (regulationError) {
    console.log('⚠️ broker_regulation creation failed:', regulationError.message);
  } else {
    console.log('✅ broker_regulation table created successfully');
  }

  // Create reviews table
  console.log('Creating reviews table...');
  const { error: reviewsError } = await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
        kind TEXT CHECK (kind IN ('editorial', 'user')) NOT NULL,
        author TEXT,
        author_id UUID,
        rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
        body TEXT NOT NULL,
        lang CHAR(2) DEFAULT 'en',
        flagged BOOLEAN DEFAULT FALSE,
        admin_notes TEXT,
        published_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_reviews_broker_id ON reviews(broker_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_kind ON reviews(kind);
      CREATE INDEX IF NOT EXISTS idx_reviews_author_id ON reviews(author_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(published_at DESC);
    `
  });

  if (reviewsError) {
    console.log('⚠️ reviews creation failed:', reviewsError.message);
  } else {
    console.log('✅ reviews table created successfully');
  }

  // Create locales table
  console.log('Creating locales table...');
  const { error: localesError } = await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS locales (
        code VARCHAR(5) PRIMARY KEY,
        label TEXT NOT NULL,
        enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });

  if (localesError) {
    console.log('⚠️ locales creation failed:', localesError.message);
  } else {
    console.log('✅ locales table created successfully');
  }

  // Insert default locales
  console.log('Inserting default locales...');
  const { error: localesInsertError } = await supabase.rpc('exec', {
    sql: `
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
        ('ur', 'اردو')
      ON CONFLICT (code) DO NOTHING;
    `
  });

  if (localesInsertError) {
    console.log('⚠️ locales insertion failed:', localesInsertError.message);
  } else {
    console.log('✅ Default locales inserted successfully');
  }

  // Verify tables exist
  console.log('\n🔍 Verifying table creation...');
  const tables = ['broker_features', 'broker_regulation', 'reviews', 'locales'];
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`❌ ${table}: ${error.message}`);
    } else {
      console.log(`✅ ${table}: accessible`);
    }
  }

  console.log('\n🎉 Table creation process completed!');
}

// Run the function
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('create-tables-simple.js')) {
  createTables().catch(console.error);
}

export { createTables };