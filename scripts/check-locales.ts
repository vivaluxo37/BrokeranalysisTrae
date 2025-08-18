import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Script to check and fix the locales table
 * This will ensure all 20 languages are enabled in the database
 */
async function checkAndFixLocales() {
  console.log('🔍 Checking current locales in database...')
  
  try {
    // First, get all locales (enabled and disabled)
    const { data: allLocales, error: allError } = await supabase
      .from('locales')
      .select('code, label, enabled')
      .order('code')
    
    if (allError) {
      console.error('❌ Error fetching locales:', allError.message)
      return
    }
    
    console.log('📊 Current locales in database:')
    console.table(allLocales)
    
    // Get only enabled locales
    const { data: enabledLocales, error: enabledError } = await supabase
      .from('locales')
      .select('code, label')
      .eq('enabled', true)
      .order('code')
    
    if (enabledError) {
      console.error('❌ Error fetching enabled locales:', enabledError.message)
      return
    }
    
    console.log(`\n✅ Currently enabled locales: ${enabledLocales?.length || 0}`)
    console.log('Enabled languages:', enabledLocales?.map(l => l.code).join(', '))
    
    // Expected languages (from schema)
    const expectedLanguages = [
      'en', 'es', 'pt', 'fr', 'de', 'it', 'ru', 'zh-Hans', 'zh-Hant', 
      'ja', 'ko', 'ar', 'hi', 'bn', 'ur', 'tr', 'vi', 'th', 'id', 'ms'
    ]
    
    console.log(`\n🎯 Expected languages: ${expectedLanguages.length}`)
    console.log('Expected:', expectedLanguages.join(', '))
    
    // Find missing languages
    const currentCodes = allLocales?.map(l => l.code) || []
    const missingLanguages = expectedLanguages.filter(code => !currentCodes.includes(code))
    
    // Find disabled languages
    const disabledLanguages = allLocales?.filter(l => !l.enabled && expectedLanguages.includes(l.code)) || []
    
    if (missingLanguages.length > 0) {
      console.log(`\n⚠️  Missing languages: ${missingLanguages.join(', ')}`)
      
      // Insert missing languages
      const languageLabels: Record<string, string> = {
        'en': 'English',
        'es': 'Español',
        'pt': 'Português',
        'fr': 'Français',
        'de': 'Deutsch',
        'it': 'Italiano',
        'ru': 'Русский',
        'zh-Hans': '简体中文',
        'zh-Hant': '繁體中文',
        'ja': '日本語',
        'ko': '한국어',
        'ar': 'العربية',
        'hi': 'हिन्दी',
        'bn': 'বাংলা',
        'ur': 'اردو',
        'tr': 'Türkçe',
        'vi': 'Tiếng Việt',
        'th': 'ไทย',
        'id': 'Bahasa Indonesia',
        'ms': 'Bahasa Melayu'
      }
      
      const missingData = missingLanguages.map(code => ({
        code,
        label: languageLabels[code] || code,
        enabled: true
      }))
      
      console.log('🔧 Inserting missing languages...')
      const { error: insertError } = await supabase
        .from('locales')
        .insert(missingData)
      
      if (insertError) {
        console.error('❌ Error inserting languages:', insertError.message)
      } else {
        console.log('✅ Successfully inserted missing languages')
      }
    }
    
    if (disabledLanguages.length > 0) {
      console.log(`\n⚠️  Disabled languages: ${disabledLanguages.map(l => l.code).join(', ')}`)
      
      // Enable disabled languages
      console.log('🔧 Enabling disabled languages...')
      const { error: updateError } = await supabase
        .from('locales')
        .update({ enabled: true })
        .in('code', disabledLanguages.map(l => l.code))
      
      if (updateError) {
        console.error('❌ Error enabling languages:', updateError.message)
      } else {
        console.log('✅ Successfully enabled disabled languages')
      }
    }
    
    // Final check
    console.log('\n🔄 Checking final state...')
    const { data: finalLocales, error: finalError } = await supabase
      .from('locales')
      .select('code, label, enabled')
      .eq('enabled', true)
      .order('code')
    
    if (finalError) {
      console.error('❌ Error in final check:', finalError.message)
      return
    }
    
    console.log(`\n🎉 Final result: ${finalLocales?.length || 0} enabled languages`)
    console.log('Enabled languages:', finalLocales?.map(l => l.code).join(', '))
    
    if (finalLocales?.length === expectedLanguages.length) {
      console.log('\n✅ SUCCESS: All 20 languages are now enabled!')
    } else {
      console.log(`\n⚠️  WARNING: Expected ${expectedLanguages.length} languages, but got ${finalLocales?.length}`)
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Run the script
checkAndFixLocales().then(() => {
  console.log('\n🏁 Script completed')
  process.exit(0)
}).catch(error => {
  console.error('💥 Script failed:', error)
  process.exit(1)
})