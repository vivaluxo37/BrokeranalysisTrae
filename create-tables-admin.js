import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Use service role key for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTables() {
  console.log('🚀 Starting table creation with admin privileges...');
  
  try {
    // Create locales table
    console.log('📝 Creating locales table...');
    const { error: localesError } = await supabase.rpc('exec', {
      sql: `
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
        
        -- Create updated_at trigger
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';
        
        DROP TRIGGER IF EXISTS update_locales_updated_at ON public.locales;
        CREATE TRIGGER update_locales_updated_at
          BEFORE UPDATE ON public.locales
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    });
    
    if (localesError) {
      console.error('❌ Error creating locales table:', localesError);
    } else {
      console.log('✅ Locales table created successfully');
    }
    
    // Create pages_i18n table
    console.log('📝 Creating pages_i18n table...');
    const { error: pagesError } = await supabase.rpc('exec', {
      sql: `
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
        
        -- Create updated_at trigger
        DROP TRIGGER IF EXISTS update_pages_i18n_updated_at ON public.pages_i18n;
        CREATE TRIGGER update_pages_i18n_updated_at
          BEFORE UPDATE ON public.pages_i18n
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
        
        -- Insert sample data
        INSERT INTO public.pages_i18n (page_key, locale_code, content) VALUES
        ('welcome_message', 'en', '{"title": "Welcome to BrokerAnalysis", "description": "Your trusted source for broker reviews and comparisons"}'),
        ('welcome_message', 'es', '{"title": "Bienvenido a BrokerAnalysis", "description": "Tu fuente confiable para reseñas y comparaciones de brokers"}'),
        ('hero_title', 'en', '{"text": "Find the Perfect Broker for Your Trading Needs"}'),
        ('hero_title', 'es', '{"text": "Encuentra el Broker Perfecto para tus Necesidades de Trading"}'),
        ('hero_subtitle', 'en', '{"text": "Compare top brokers, read reviews, and make informed decisions"}'),
        ('hero_subtitle', 'es', '{"text": "Compara los mejores brokers, lee reseñas y toma decisiones informadas"}')
        ON CONFLICT (page_key, locale_code) DO NOTHING;
      `
    });
    
    if (pagesError) {
      console.error('❌ Error creating pages_i18n table:', pagesError);
    } else {
      console.log('✅ Pages_i18n table created successfully');
    }
    
    // Enable RLS and create policies
    console.log('🔒 Setting up Row Level Security...');
    const { error: rlsError } = await supabase.rpc('exec', {
      sql: `
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
      `
    });
    
    if (rlsError) {
      console.error('❌ Error setting up RLS:', rlsError);
    } else {
      console.log('✅ Row Level Security configured successfully');
    }
    
    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    
    const { data: localesData, error: localesVerifyError } = await supabase
      .from('locales')
      .select('*')
      .limit(1);
    
    const { data: pagesData, error: pagesVerifyError } = await supabase
      .from('pages_i18n')
      .select('*')
      .limit(1);
    
    if (!localesVerifyError && localesData) {
      console.log('✅ Locales table verified - contains', localesData.length > 0 ? 'data' : 'no data');
    } else {
      console.error('❌ Locales table verification failed:', localesVerifyError);
    }
    
    if (!pagesVerifyError && pagesData) {
      console.log('✅ Pages_i18n table verified - contains', pagesData.length > 0 ? 'data' : 'no data');
    } else {
      console.error('❌ Pages_i18n table verification failed:', pagesVerifyError);
    }
    
    console.log('\n🎉 Table creation process completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Refresh your browser to test the 404 fix');
    console.log('2. Check the browser console for any remaining errors');
    console.log('3. Verify that i18n functionality is working');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Alternative method using direct SQL execution if rpc doesn't work
async function createTablesDirectSQL() {
  console.log('🔄 Trying alternative method with direct SQL execution...');
  
  try {
    // Try to create tables using individual queries
    const queries = [
      {
        name: 'Create locales table',
        sql: `CREATE TABLE IF NOT EXISTS public.locales (
          id SERIAL PRIMARY KEY,
          code VARCHAR(10) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          native_name VARCHAR(100) NOT NULL,
          flag_emoji VARCHAR(10),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`
      },
      {
        name: 'Insert default locales',
        sql: `INSERT INTO public.locales (code, name, native_name, flag_emoji) VALUES
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
        ON CONFLICT (code) DO NOTHING;`
      },
      {
        name: 'Create pages_i18n table',
        sql: `CREATE TABLE IF NOT EXISTS public.pages_i18n (
          id SERIAL PRIMARY KEY,
          page_key VARCHAR(100) NOT NULL,
          locale_code VARCHAR(10) NOT NULL,
          content JSONB NOT NULL DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(page_key, locale_code)
        );`
      }
    ];
    
    for (const query of queries) {
      console.log(`📝 ${query.name}...`);
      const { error } = await supabase.rpc('exec', { sql: query.sql });
      if (error) {
        console.error(`❌ Error in ${query.name}:`, error);
      } else {
        console.log(`✅ ${query.name} completed`);
      }
    }
    
  } catch (error) {
    console.error('❌ Direct SQL method failed:', error);
    console.log('\n📋 Manual execution required:');
    console.log('Please execute the SQL commands in MANUAL_SQL_SETUP.sql in your Supabase Dashboard');
  }
}

// Run the table creation
createTables().catch(error => {
  console.error('❌ Main method failed, trying alternative...', error);
  createTablesDirectSQL();
});