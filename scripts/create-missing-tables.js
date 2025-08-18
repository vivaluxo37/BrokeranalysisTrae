import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTableAccess() {
  console.log('🔍 Testing table access...');
  
  const tablesToTest = [
    'brokers',
    'broker_details', 
    'locales',
    'broker_features',
    'broker_i18n',
    'pages_i18n'
  ];
  
  const results = {};
  
  for (const table of tablesToTest) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        results[table] = { exists: false, error: error.message };
      } else {
        console.log(`✅ ${table}: accessible (${data?.length || 0} records found)`);
        results[table] = { exists: true, count: data?.length || 0 };
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
      results[table] = { exists: false, error: err.message };
    }
  }
  
  console.log('\n📊 Summary:');
  const existingTables = Object.entries(results).filter(([_, result]) => result.exists);
  const missingTables = Object.entries(results).filter(([_, result]) => !result.exists);
  
  console.log(`✅ Existing tables: ${existingTables.length}`);
  existingTables.forEach(([table]) => console.log(`   - ${table}`));
  
  console.log(`❌ Missing tables: ${missingTables.length}`);
  missingTables.forEach(([table]) => console.log(`   - ${table}`));
  
  if (missingTables.length > 0) {
    console.log('\n🛠️  Manual Setup Required:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase-schema.sql');
    console.log('4. Execute the script to create missing tables');
    console.log('\nAlternatively, create the missing tables individually:');
    
    if (missingTables.some(([table]) => table === 'locales')) {
      console.log('\n-- Create locales table:');
      console.log(`CREATE TABLE locales (
  code VARCHAR(5) PRIMARY KEY,
  label TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO locales (code, label) VALUES 
  ('en', 'English'),
  ('es', 'Español'),
  ('pt', 'Português'),
  ('fr', 'Français'),
  ('de', 'Deutsch');`);
    }
    
    if (missingTables.some(([table]) => table === 'broker_details')) {
      console.log('\n-- Create broker_details table:');
      console.log(`CREATE TABLE broker_details (
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

CREATE INDEX idx_broker_details_slug ON broker_details(slug);`);
    }
  }
  
  return results;
}

// Run the test
testTableAccess().then((results) => {
  const missingCount = Object.values(results).filter(r => !r.exists).length;
  if (missingCount === 0) {
    console.log('\n🎉 All required tables exist!');
  } else {
    console.log(`\n⚠️  ${missingCount} tables need to be created manually.`);
  }
}).catch(console.error);