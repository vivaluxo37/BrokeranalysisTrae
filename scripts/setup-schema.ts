import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file')
  process.exit(1)
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupSchema() {
  console.log('🚀 Setting up database schema...')
  
  try {
    // First, let's just create the locales table directly
    console.log('📝 Creating locales table...')
    
    const createLocalesTable = `
      CREATE TABLE IF NOT EXISTS locales (
        code VARCHAR(5) PRIMARY KEY,
        label TEXT NOT NULL,
        enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    
    const { error: createError } = await supabase.rpc('exec', {
      sql: createLocalesTable
    })
    
    if (createError) {
      console.error('❌ Error creating locales table:', createError.message)
      // Try alternative approach - direct SQL execution
      console.log('🔄 Trying alternative approach...')
      
      // Let's try using the REST API directly
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({ sql: createLocalesTable })
      })
      
      if (!response.ok) {
        console.error('❌ Failed to create table via REST API')
        console.log('ℹ️  The table might already exist or need to be created via Supabase dashboard')
      }
    } else {
      console.log('✅ Locales table created successfully')
    }
    
    // Insert the 20 languages
    console.log('📝 Inserting language data...')
    
    const languages = [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
      { code: 'pt', label: 'Português' },
      { code: 'fr', label: 'Français' },
      { code: 'de', label: 'Deutsch' },
      { code: 'it', label: 'Italiano' },
      { code: 'ru', label: 'Русский' },
      { code: 'zh-Hans', label: '简体中文' },
      { code: 'zh-Hant', label: '繁體中文' },
      { code: 'ja', label: '日本語' },
      { code: 'ko', label: '한국어' },
      { code: 'ar', label: 'العربية' },
      { code: 'hi', label: 'हिन्दी' },
      { code: 'bn', label: 'বাংলা' },
      { code: 'ur', label: 'اردو' },
      { code: 'tr', label: 'Türkçe' },
      { code: 'vi', label: 'Tiếng Việt' },
      { code: 'th', label: 'ไทย' },
      { code: 'id', label: 'Bahasa Indonesia' },
      { code: 'ms', label: 'Bahasa Melayu' }
    ]
    
    // Try to insert languages using upsert
    const { error: insertError } = await supabase
      .from('locales')
      .upsert(languages, { onConflict: 'code' })
    
    if (insertError) {
      console.error('❌ Error inserting languages:', insertError.message)
      console.log('ℹ️  This might be due to table not existing yet')
    } else {
      console.log('✅ Languages inserted successfully')
    }
    
    // Verify the setup
    console.log('🔍 Verifying setup...')
    const { data: locales, error: fetchError } = await supabase
      .from('locales')
      .select('code, label, enabled')
      .order('code')
    
    if (fetchError) {
      console.error('❌ Error fetching locales:', fetchError.message)
    } else {
      console.log('✅ Setup verification:')
      console.table(locales)
      console.log(`📊 Total languages: ${locales?.length || 0}`)
      console.log(`🟢 Enabled languages: ${locales?.filter(l => l.enabled).length || 0}`)
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
  
  console.log('🏁 Schema setup completed')
}

setupSchema()