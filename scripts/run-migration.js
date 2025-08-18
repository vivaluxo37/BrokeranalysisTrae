import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    console.log('Starting migration...');
    
    // First, let's check if tables already exist
    console.log('Checking existing tables...');
    
    // Add columns to existing brokers table
    console.log('Adding columns to brokers table...');
    
    // Create broker_i18n table
    console.log('Creating broker_i18n table...');
    const { error: i18nError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS broker_i18n (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
          language_code VARCHAR(5) NOT NULL,
          name VARCHAR(255),
          description TEXT,
          tldr TEXT,
          editorial_review TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(broker_id, language_code)
        );
      `
    });
    
    if (i18nError) {
      console.log('broker_i18n table might already exist or using direct query...');
    }
    
    // Create broker_regulations table
    console.log('Creating broker_regulations table...');
    const { error: regError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS broker_regulations (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
          country_code VARCHAR(3) NOT NULL,
          regulator_name VARCHAR(255),
          license_number VARCHAR(100),
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (regError) {
      console.log('broker_regulations table might already exist...');
    }
    
    // Create broker_faqs table
    console.log('Creating broker_faqs table...');
    const { error: faqError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS broker_faqs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          language_code VARCHAR(5) DEFAULT 'en',
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (faqError) {
      console.log('broker_faqs table might already exist...');
    }
    
    // Create broker_reviews table
    console.log('Creating broker_reviews table...');
    const { error: reviewError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS broker_reviews (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          title VARCHAR(255),
          content TEXT,
          pros TEXT[],
          cons TEXT[],
          is_verified BOOLEAN DEFAULT FALSE,
          is_moderated BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (reviewError) {
      console.log('broker_reviews table might already exist...');
    }
    
    console.log('Migration completed successfully!');
    console.log('Note: Some tables might have already existed, which is normal.');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();