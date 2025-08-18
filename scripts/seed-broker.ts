import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import type { Database } from '../src/types/supabase';

// Load environment variables
dotenv.config();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client with service role key for admin operations
const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Type definitions for input data
interface BrokerFeature {
  key: string;
  value: string;
  category?: string;
}

interface BrokerRegulation {
  authority: string;
  license_number?: string;
  status: 'active' | 'pending' | 'suspended';
  country_code: string;
}

interface BrokerI18n {
  locale: string;
  title: string;
  description: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
}

interface BrokerSeedData {
  broker: {
    id: string;
    name: string;
    slug: string;
    website_url: string;
    logo_url?: string;
    rating?: number;
    review_count?: number;
    min_deposit?: number;
    max_leverage?: number;
    spread_eur_usd?: number;
    commission_type?: string;
    founded_year?: number;
    headquarters?: string;
    is_active?: boolean;
    status?: 'draft' | 'review' | 'active' | 'inactive';
  };
  features: BrokerFeature[];
  regulation: BrokerRegulation[];
  i18n: BrokerI18n[];
  logoFilePath?: string; // Path to logo file to upload
}

/**
 * Upload logo file to Supabase Storage
 */
async function uploadLogo(brokerSlug: string, logoFilePath: string): Promise<string | null> {
  try {
    if (!existsSync(logoFilePath)) {
      console.warn(`Logo file not found: ${logoFilePath}`);
      return null;
    }

    const fileBuffer = readFileSync(logoFilePath);
    const fileName = `${brokerSlug}/logo.png`;
    
    console.log(`Uploading logo for ${brokerSlug}...`);
    
    // Upload to broker-assets bucket
    const { data, error } = await supabase.storage
      .from('broker-assets')
      .upload(fileName, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Logo upload error:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('broker-assets')
      .getPublicUrl(fileName);

    console.log(`Logo uploaded successfully: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    return null;
  }
}

/**
 * Insert broker data into database
 */
async function insertBroker(brokerData: BrokerSeedData['broker']): Promise<string | null> {
  try {
    console.log(`Inserting broker: ${brokerData.name}`);
    
    const { data, error } = await supabase
      .from('brokers')
      .upsert({
        ...brokerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select('id')
      .single();

    if (error) {
      console.error('Broker insertion error:', error);
      return null;
    }

    console.log(`Broker inserted successfully: ${data.id}`);
    return data.id;
  } catch (error) {
    console.error('Error inserting broker:', error);
    return null;
  }
}

/**
 * Insert broker features
 */
async function insertFeatures(brokerId: string, features: BrokerFeature[]): Promise<boolean> {
  try {
    if (features.length === 0) return true;
    
    console.log(`Inserting ${features.length} features for broker ${brokerId}`);
    
    const featureRecords = features.map(feature => ({
      broker_id: brokerId,
      key: feature.key,
      value: feature.value,
      category: feature.category || 'general'
    }));

    const { error } = await supabase
      .from('broker_features')
      .upsert(featureRecords, { onConflict: 'broker_id,key' });

    if (error) {
      console.error('Features insertion error:', error);
      return false;
    }

    console.log('Features inserted successfully');
    return true;
  } catch (error) {
    console.error('Error inserting features:', error);
    return false;
  }
}

/**
 * Insert broker regulation data
 */
async function insertRegulation(brokerId: string, regulations: BrokerRegulation[]): Promise<boolean> {
  try {
    if (regulations.length === 0) return true;
    
    console.log(`Inserting ${regulations.length} regulations for broker ${brokerId}`);
    
    const regulationRecords = regulations.map(reg => ({
      broker_id: brokerId,
      authority: reg.authority,
      license_number: reg.license_number,
      status: reg.status,
      country_code: reg.country_code
    }));

    const { error } = await supabase
      .from('broker_regulation')
      .upsert(regulationRecords, { onConflict: 'broker_id,authority' });

    if (error) {
      console.error('Regulation insertion error:', error);
      return false;
    }

    console.log('Regulation data inserted successfully');
    return true;
  } catch (error) {
    console.error('Error inserting regulation:', error);
    return false;
  }
}

/**
 * Insert broker i18n content
 */
async function insertI18nContent(brokerId: string, i18nData: BrokerI18n[]): Promise<boolean> {
  try {
    if (i18nData.length === 0) return true;
    
    console.log(`Inserting ${i18nData.length} i18n records for broker ${brokerId}`);
    
    const i18nRecords = i18nData.map(content => ({
      broker_id: brokerId,
      locale: content.locale,
      title: content.title,
      description: content.description,
      content: content.content,
      meta_title: content.meta_title,
      meta_description: content.meta_description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('broker_i18n')
      .upsert(i18nRecords, { onConflict: 'broker_id,locale' });

    if (error) {
      console.error('I18n content insertion error:', error);
      return false;
    }

    console.log('I18n content inserted successfully');
    return true;
  } catch (error) {
    console.error('Error inserting i18n content:', error);
    return false;
  }
}

/**
 * Main seeding function
 */
async function seedBroker(jsonFilePath: string): Promise<void> {
  try {
    console.log('='.repeat(50));
    console.log('🚀 Starting broker seeding process...');
    console.log('='.repeat(50));
    
    // Check if JSON file exists
    if (!existsSync(jsonFilePath)) {
      throw new Error(`JSON file not found: ${jsonFilePath}`);
    }

    // Read and parse JSON data
    console.log(`📖 Reading data from: ${jsonFilePath}`);
    const jsonContent = readFileSync(jsonFilePath, 'utf-8');
    const seedData: BrokerSeedData = JSON.parse(jsonContent);

    // Validate required data
    if (!seedData.broker || !seedData.broker.id || !seedData.broker.slug) {
      throw new Error('Invalid broker data: missing required fields (id, slug)');
    }

    const { broker, features, regulation, i18n, logoFilePath } = seedData;
    
    console.log(`📊 Processing broker: ${broker.name} (${broker.slug})`);
    
    // Step 1: Upload logo if provided
    let logoUrl = broker.logo_url;
    if (logoFilePath) {
      const resolvedLogoPath = join(dirname(jsonFilePath), logoFilePath);
      const uploadedLogoUrl = await uploadLogo(broker.slug, resolvedLogoPath);
      if (uploadedLogoUrl) {
        logoUrl = uploadedLogoUrl;
      }
    }

    // Step 2: Insert broker with updated logo URL
    const brokerWithLogo = { ...broker, logo_url: logoUrl };
    const brokerId = await insertBroker(brokerWithLogo);
    if (!brokerId) {
      throw new Error('Failed to insert broker');
    }

    // Step 3: Insert features
    if (features && features.length > 0) {
      const featuresSuccess = await insertFeatures(brokerId, features);
      if (!featuresSuccess) {
        console.warn('⚠️  Failed to insert some features');
      }
    }

    // Step 4: Insert regulation data
    if (regulation && regulation.length > 0) {
      const regulationSuccess = await insertRegulation(brokerId, regulation);
      if (!regulationSuccess) {
        console.warn('⚠️  Failed to insert some regulation data');
      }
    }

    // Step 5: Insert i18n content
    if (i18n && i18n.length > 0) {
      const i18nSuccess = await insertI18nContent(brokerId, i18n);
      if (!i18nSuccess) {
        console.warn('⚠️  Failed to insert some i18n content');
      }
    }

    // Generate results
    const publicUrl = `${process.env.VITE_APP_URL || 'http://localhost:5173'}/broker/${broker.slug}`;
    const routePath = `/broker/${broker.slug}`;

    console.log('\n' + '='.repeat(50));
    console.log('✅ Broker seeding completed successfully!');
    console.log('='.repeat(50));
    console.log(`🆔 Broker ID: ${brokerId}`);
    console.log(`🌐 Public URL: ${publicUrl}`);
    console.log(`🛣️  Route Path: ${routePath}`);
    if (logoUrl) {
      console.log(`🖼️  Logo URL: ${logoUrl}`);
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Error during broker seeding:');
    console.error(error);
    process.exit(1);
  }
}

/**
 * CLI interface
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: tsx scripts/seed-broker.ts <json-file-path>');
    console.log('\nExample:');
    console.log('  tsx scripts/seed-broker.ts ./data/sample-broker.json');
    process.exit(1);
  }

  const jsonFilePath = args[0];
  seedBroker(jsonFilePath);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { seedBroker, type BrokerSeedData };