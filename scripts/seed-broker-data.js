import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedBrokerData() {
  try {
    console.log('Starting broker data seeding...');
    
    // First, let's check if we have any brokers
    const { data: existingBrokers } = await supabase
      .from('brokers')
      .select('id, name, slug')
      .limit(5);
    
    console.log('Existing brokers:', existingBrokers?.length || 0);
    
    // If no brokers exist, create some sample ones
    if (!existingBrokers || existingBrokers.length === 0) {
      console.log('Creating sample brokers...');
      
      const sampleBrokers = [
        {
          id: 'ig-markets',
          name: 'IG Markets',
          logo_url: 'https://example.com/ig-logo.png',
          rating: 4.5,
          review_count: 150,
          features: {
            platforms: ['MetaTrader 4', 'IG Trading Platform'],
            instruments: ['Forex', 'CFDs', 'Stocks'],
            min_deposit: 250
          },
          fees: {
            spread_eur_usd: 0.6,
            commission: 'Variable'
          },
          regulation: {
            fca: 'Regulated',
            cysec: 'Regulated'
          },
          is_active: true
        },
        {
          id: 'xtb',
          name: 'XTB',
          logo_url: 'https://example.com/xtb-logo.png',
          rating: 4.3,
          review_count: 120,
          features: {
            platforms: ['xStation 5', 'MetaTrader 4'],
            instruments: ['Forex', 'CFDs', 'ETFs'],
            min_deposit: 0
          },
          fees: {
            spread_eur_usd: 0.8,
            commission: 'Zero on Forex'
          },
          regulation: {
            fca: 'Regulated',
            kNF: 'Regulated'
          },
          is_active: true
        },
        {
          id: 'plus500',
          name: 'Plus500',
          logo_url: 'https://example.com/plus500-logo.png',
          rating: 4.1,
          review_count: 200,
          features: {
            platforms: ['Plus500 WebTrader', 'Plus500 Mobile'],
            instruments: ['CFDs', 'Forex', 'Cryptocurrencies'],
            min_deposit: 100
          },
          fees: {
            spread_eur_usd: 1.2,
            commission: 'No commission'
          },
          regulation: {
            fca: 'Regulated',
            cysec: 'Regulated',
            asic: 'Regulated'
          },
          is_active: true
        }
      ];
      
      // Insert brokers one by one to handle duplicates
      const insertedBrokers = [];
      for (const broker of sampleBrokers) {
        const { data, error: brokerError } = await supabase
          .from('brokers')
          .upsert(broker, { onConflict: 'id' })
          .select();
        
        if (brokerError) {
          console.error(`Error inserting broker ${broker.id}:`, brokerError);
        } else {
          console.log(`✓ Upserted broker: ${broker.name}`);
          if (data && data.length > 0) {
            insertedBrokers.push(data[0]);
          }
        }
      }
      
      if (insertedBrokers.length === 0) {
        console.log('No brokers were inserted');
        return;
      }
      
      // Now add i18n data for each broker
      for (const broker of insertedBrokers) {
        const i18nData = [
          {
            broker_id: broker.id,
            language_code: 'en',
            name: broker.name,
            description: `${broker.name} is a leading online broker offering competitive trading conditions.`,
            tldr: `${broker.name} is a modern broker offering competitive trading conditions with advanced trading platforms.`,
            editorial_review: `${broker.name} has built a solid reputation in the industry. The broker offers a comprehensive range of trading instruments with competitive spreads and caters to both beginner and experienced traders with professional-grade tools and reliable execution.`
          }
        ];
        
        const { error: i18nError } = await supabase
          .from('broker_i18n')
          .insert(i18nData);
        
        if (i18nError) {
          console.error(`Error inserting i18n data for ${broker.name}:`, i18nError);
        }
        
        // Add regulation data
        const regulationData = [
          {
            broker_id: broker.id,
            country_code: broker.slug === 'ig-markets' ? 'GB' : broker.slug === 'xtb' ? 'PL' : 'CY',
            regulator_name: broker.slug === 'ig-markets' ? 'FCA' : broker.slug === 'xtb' ? 'KNF' : 'CySEC',
            license_id: broker.slug === 'ig-markets' ? '195355' : broker.slug === 'xtb' ? 'DDM-M-4021-57-1/2005' : '250/14'
          }
        ];
        
        const { error: regError } = await supabase
          .from('broker_regulation')
          .insert(regulationData);
        
        if (regError) {
          console.error(`Error inserting regulation data for ${broker.name}:`, regError);
        }
        
        // Add FAQ data
        const faqData = [
          {
            broker_id: broker.id,
            question: `What is the minimum deposit for ${broker.name}?`,
            answer: `The minimum deposit for ${broker.name} varies depending on account type and payment method. Please check their website for current requirements.`,
            language_code: 'en',
            sort_order: 1
          },
          {
            broker_id: broker.id,
            question: `What trading platforms does ${broker.name} offer?`,
            answer: `${broker.name} offers multiple trading platforms for desktop and mobile trading, including proprietary and third-party solutions.`,
            language_code: 'en',
            sort_order: 2
          },
          {
            broker_id: broker.id,
            question: `Is ${broker.name} regulated?`,
            answer: `Yes, ${broker.name} is regulated by ${regulationData[0].regulator_name} with license ${regulationData[0].license_id}.`,
            language_code: 'en',
            sort_order: 3
          },
          {
            broker_id: broker.id,
            question: `Does ${broker.name} offer a demo account?`,
            answer: `Yes, ${broker.name} offers demo accounts for practice trading with virtual funds.`,
            language_code: 'en',
            sort_order: 4
          },
          {
            broker_id: broker.id,
            question: `What is the maximum leverage offered by ${broker.name}?`,
            answer: `${broker.name} offers maximum leverage in compliance with regulatory requirements, typically up to 30:1 for retail clients.`,
            language_code: 'en',
            sort_order: 5
          }
        ];
        
        const { error: faqError } = await supabase
          .from('broker_faqs')
          .insert(faqData);
        
        if (faqError) {
          console.error(`Error inserting FAQ data for ${broker.name}:`, faqError);
        }
      }
      
      console.log('Sample data seeding completed successfully!');
    } else {
      console.log('Brokers already exist, skipping seeding.');
      
      // Check if we have i18n data for existing brokers
      const { data: i18nData } = await supabase
        .from('broker_i18n')
        .select('broker_id')
        .limit(1);
      
      if (!i18nData || i18nData.length === 0) {
        console.log('Adding i18n data for existing brokers...');
        
        for (const broker of existingBrokers) {
          const i18nData = [
            {
              broker_id: broker.id,
              language_code: 'en',
              name: broker.name,
              description: `${broker.name} is a leading online broker offering competitive trading conditions.`,
              tldr: `${broker.name} provides professional trading services with advanced platforms and competitive spreads.`,
              editorial_review: `${broker.name} has established itself as a reliable broker in the financial markets. The platform offers comprehensive trading solutions with user-friendly interfaces and competitive pricing structures. Traders can access a wide range of financial instruments with professional-grade tools and analysis.`
            }
          ];
          
          const { error: i18nError } = await supabase
            .from('broker_i18n')
            .insert(i18nData);
          
          if (i18nError) {
            console.error(`Error inserting i18n data for ${broker.name}:`, i18nError);
          }
        }
        
        console.log('Added i18n data for existing brokers.');
      }
    }
    
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedBrokerData();