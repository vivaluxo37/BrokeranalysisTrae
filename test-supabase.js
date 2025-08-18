// Supabase Connection Test
// This script tests the Supabase database connection using environment variables

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...');
  console.log('📍 Project URL:', process.env.SUPABASE_URL);
  console.log('🔑 Using Anon Key for connection test');
  
  try {
    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    console.log('✅ Supabase client created successfully');
    
    // Test basic connection by getting auth user (should return null for anonymous)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError && authError.message !== 'Invalid JWT') {
      console.log('⚠️  Auth test warning:', authError.message);
    } else {
      console.log('✅ Auth service accessible');
    }
    
    // Test database connection with a simple query
    // This will fail if no tables exist, but confirms connection
    const { data, error } = await supabase
      .from('_realtime_schema_migrations')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('✅ Database connection successful (no tables found - this is normal for new projects)');
      } else {
        console.log('⚠️  Database query error:', error.message);
        console.log('   This might be normal if no tables are set up yet');
      }
    } else {
      console.log('✅ Database connection and query successful');
      console.log('📊 Sample data:', data);
    }
    
    // Test realtime connection
    console.log('🔄 Testing realtime connection...');
    const channel = supabase.channel('test-channel');
    
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Realtime connection successful');
        channel.unsubscribe();
      } else if (status === 'CHANNEL_ERROR') {
        console.log('❌ Realtime connection failed');
      }
    });
    
    // Wait a moment for realtime connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n🎉 Supabase connection test completed!');
    console.log('\n📋 Configuration Summary:');
    console.log('   Project URL:', process.env.SUPABASE_URL);
    console.log('   Project Ref:', process.env.SUPABASE_PROJECT_REF);
    console.log('   Anon Key configured:', !!process.env.SUPABASE_ANON_KEY);
    console.log('   Service Role Key configured:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check if SUPABASE_URL is correct');
    console.error('   2. Verify SUPABASE_ANON_KEY is valid');
    console.error('   3. Ensure project is not paused');
    console.error('   4. Check network connectivity');
  }
}

// Run the test
testSupabaseConnection().catch(console.error);