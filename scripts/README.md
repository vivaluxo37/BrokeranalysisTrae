# Broker Seeding Scripts

This directory contains scripts for seeding broker data into the BrokerAnalysis platform.

## Scripts Overview

### `seed-broker.ts`

A comprehensive TypeScript script that implements the complete broker seeding workflow:

- ✅ **Database Operations**: Insert broker, features, regulation, and i18n data
- ✅ **Logo Upload**: Upload logos to Supabase Storage with public URLs
- ✅ **Type Safety**: Full TypeScript support with proper type definitions
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **CLI Interface**: Command-line interface with file path arguments
- ✅ **Output Generation**: Public URL and route path generation

### `sample-broker.json`

Sample data file demonstrating the expected JSON structure for broker seeding.

### `sample-logo.png`

Sample SVG logo file for testing the logo upload functionality.

## Quick Start

### Prerequisites

1. **Environment Variables**: Set up your `.env` file with Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   VITE_APP_URL=http://localhost:5173
   ```

2. **Supabase Storage**: Ensure the `broker-assets` bucket exists and is public

3. **Database Schema**: Ensure all required tables exist (see `supabase-schema.sql`)

### Usage

```bash
# Run with sample data
npm run seed-broker:sample

# Run with custom JSON file
npm run seed-broker path/to/your-data.json

# Direct execution
npx tsx scripts/seed-broker.ts scripts/sample-broker.json
```

### Expected Output

```
==================================================
🚀 Starting broker seeding process...
==================================================
📖 Reading data from: scripts/sample-broker.json
📊 Processing broker: Sample Broker Ltd (sample-broker)
Uploading logo for sample-broker...
Logo uploaded successfully: https://supabase.co/.../logo.png
Inserting broker: Sample Broker Ltd
Broker inserted successfully: sample-broker-2024
Inserting 8 features for broker sample-broker-2024
Features inserted successfully
Inserting 3 regulations for broker sample-broker-2024
Regulation data inserted successfully
Inserting 3 i18n records for broker sample-broker-2024
I18n content inserted successfully

==================================================
✅ Broker seeding completed successfully!
==================================================
🆔 Broker ID: sample-broker-2024
🌐 Public URL: http://localhost:5173/broker/sample-broker
🛣️  Route Path: /broker/sample-broker
🖼️  Logo URL: https://supabase.co/.../sample-broker/logo.png
==================================================
```

## JSON Data Structure

### Complete Example

```json
{
  "broker": {
    "id": "unique-broker-id",
    "name": "Broker Name",
    "slug": "broker-slug",
    "website_url": "https://broker.com",
    "rating": 4.2,
    "review_count": 85,
    "min_deposit": 100,
    "max_leverage": 500,
    "spread_eur_usd": 0.8,
    "commission_type": "Variable",
    "founded_year": 2015,
    "headquarters": "London, UK",
    "is_active": true,
    "status": "active"
  },
  "features": [
    {
      "key": "platforms",
      "value": "MetaTrader 4, MetaTrader 5",
      "category": "trading"
    },
    {
      "key": "instruments",
      "value": "Forex, CFDs, Commodities",
      "category": "trading"
    }
  ],
  "regulation": [
    {
      "authority": "FCA",
      "license_number": "123456",
      "status": "active",
      "country_code": "GB"
    }
  ],
  "i18n": [
    {
      "locale": "en",
      "title": "Broker Review 2024",
      "description": "Comprehensive broker review...",
      "content": "## About Broker\n\nDetailed content...",
      "meta_title": "SEO Title",
      "meta_description": "SEO Description"
    }
  ],
  "logoFilePath": "logo.png"
}
```

### Field Descriptions

#### Broker Object (Required)

- **id**: Unique identifier for the broker
- **name**: Display name of the broker
- **slug**: URL-friendly identifier
- **website_url**: Official broker website
- **rating**: Average rating (0-5)
- **review_count**: Number of reviews
- **min_deposit**: Minimum deposit amount
- **max_leverage**: Maximum leverage offered
- **spread_eur_usd**: EUR/USD spread in pips
- **commission_type**: Commission structure
- **founded_year**: Year the broker was founded
- **headquarters**: Broker headquarters location
- **is_active**: Whether the broker is active
- **status**: Publication status (draft/review/active/inactive)

#### Features Array (Optional)

- **key**: Feature identifier
- **value**: Feature description
- **category**: Feature category (trading/payment/support/etc.)

#### Regulation Array (Optional)

- **authority**: Regulatory authority name
- **license_number**: License number
- **status**: License status (active/pending/suspended)
- **country_code**: ISO country code

#### I18n Array (Optional)

- **locale**: Language code (en/es/fr/de/etc.)
- **title**: Localized page title
- **description**: Brief description
- **content**: Full content in Markdown
- **meta_title**: SEO title
- **meta_description**: SEO description

#### Logo File Path (Optional)

- **logoFilePath**: Relative path to logo file from JSON location

## Feature Categories

### Trading
- platforms
- instruments
- execution
- spreads
- leverage

### Payment
- deposit_methods
- withdrawal_methods
- processing_times
- fees

### Support
- customer_support
- languages
- availability
- channels

### Technology
- mobile_app
- web_platform
- api_access
- tools

### Account
- account_types
- demo_account
- minimum_deposit
- verification

### Education
- education
- research
- analysis
- webinars

## Regulatory Authorities

### Major Authorities

- **FCA** (UK) - Financial Conduct Authority
- **CySEC** (Cyprus) - Cyprus Securities and Exchange Commission
- **ASIC** (Australia) - Australian Securities and Investments Commission
- **BaFin** (Germany) - Federal Financial Supervisory Authority
- **CONSOB** (Italy) - Commissione Nazionale per le Società e la Borsa
- **AMF** (France) - Autorité des Marchés Financiers
- **CNMV** (Spain) - Comisión Nacional del Mercado de Valores
- **FSA** (Japan) - Financial Services Agency
- **CFTC** (USA) - Commodity Futures Trading Commission
- **NFA** (USA) - National Futures Association

## Troubleshooting

### Common Issues

#### Environment Variables Missing
```bash
Error: Missing Supabase environment variables
```
**Solution**: Check your `.env` file and ensure all required variables are set.

#### Logo Upload Fails
```bash
Logo upload error: StorageApiError
```
**Solution**: 
- Verify the `broker-assets` bucket exists in Supabase Storage
- Check that the bucket is public
- Ensure the service role key has storage permissions

#### Database Connection Error
```bash
Broker insertion error: AuthApiError
```
**Solution**:
- Verify Supabase URL and service role key
- Check that all required tables exist
- Ensure the service role has appropriate permissions

#### File Not Found
```bash
JSON file not found: path/to/file.json
```
**Solution**: Check the file path and ensure the JSON file exists.

### Debug Mode

For verbose logging, you can modify the script to include more detailed output or add console.log statements as needed.

### Getting Help

1. Check the [main documentation](../docs/BROKER_SEEDING_GUIDE.md)
2. Review the [database schema](../supabase-schema.sql)
3. Examine the sample data files for examples
4. Contact the development team for assistance

## Best Practices

### Data Quality

- **Verify Information**: Cross-check all broker details
- **Consistent Formatting**: Follow established patterns
- **Complete Data**: Include all available information
- **Regular Updates**: Keep data current and accurate

### File Organization

- **Naming Convention**: Use descriptive, consistent file names
- **Directory Structure**: Organize files by broker or date
- **Version Control**: Track changes to data files
- **Backup**: Maintain backups of important data

### Security

- **Environment Variables**: Never commit credentials to version control
- **Service Role Key**: Use appropriate permissions
- **Data Validation**: Validate all input data
- **Error Handling**: Handle errors gracefully

---

*For more detailed information, see the [Broker Seeding Guide](../docs/BROKER_SEEDING_GUIDE.md).*