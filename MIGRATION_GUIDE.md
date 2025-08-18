# Migration Guide: Integrating Existing Data with Supabase

## Overview

This guide helps you migrate existing broker data, reviews, and content from your current system to the new Supabase database schema.

## 🎯 Migration Strategy

### Phase 1: Data Assessment
1. **Inventory Current Data**: Catalog existing brokers, reviews, features
2. **Map Data Structure**: Align current schema with Supabase schema
3. **Identify Gaps**: Determine missing data fields
4. **Plan Transformation**: Define data conversion rules

### Phase 2: Schema Preparation
1. **Deploy Supabase Schema**: Run `supabase-schema.sql`
2. **Configure RLS Policies**: Enable security policies
3. **Set Up Storage**: Create broker-assets bucket
4. **Test Connections**: Verify database connectivity

### Phase 3: Data Migration
1. **Extract Data**: Export from current system
2. **Transform Data**: Convert to Supabase format
3. **Load Data**: Import into Supabase tables
4. **Validate Data**: Verify data integrity

### Phase 4: Application Integration
1. **Update Components**: Integrate Supabase hooks
2. **Test Features**: Verify all functionality
3. **Performance Tuning**: Optimize queries
4. **Go Live**: Switch to production

## 📊 Data Mapping

### Broker Data Mapping

| Current Field | Supabase Field | Transformation |
|---------------|----------------|----------------|
| `id` | `id` | Convert to UUID |
| `name` | `name` | Direct mapping |
| `url_slug` | `slug` | Ensure uniqueness |
| `founded` | `founded_year` | Extract year only |
| `headquarters` | `headquarters` | Direct mapping |
| `currency` | `base_currency` | Standardize codes |
| `rating` | `avg_rating` | Convert to numeric(2,1) |
| `logo` | `logo_url` | Upload to storage |
| `active` | `status` | Map to 'active'/'inactive' |

### Feature Data Mapping

| Current Structure | Supabase Structure |
|-------------------|--------------------|
| JSON object | Key-value pairs in `broker_features` |
| `{"spread": "0.1", "leverage": "1:500"}` | Multiple rows with `feature_key`/`feature_value` |

### Review Data Mapping

| Current Field | Supabase Field | Transformation |
|---------------|----------------|----------------|
| `review_id` | `id` | Convert to UUID |
| `broker_id` | `broker_id` | Convert to UUID |
| `type` | `kind` | Map to 'editorial'/'user' |
| `reviewer` | `author` | Direct mapping |
| `score` | `rating` | Convert to numeric(2,1) |
| `content` | `body` | Direct mapping |
| `language` | `lang` | Standardize to 2-char codes |
| `date` | `published_at` | Convert to timestamptz |

## 🔧 Migration Scripts

### 1. Broker Migration Script

```sql
-- Example broker migration
INSERT INTO brokers (
  id,
  slug,
  name,
  founded_year,
  headquarters,
  base_currency,
  avg_rating,
  logo_url,
  status,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g')),
  name,
  EXTRACT(YEAR FROM founded_date),
  headquarters,
  UPPER(base_currency),
  ROUND(average_rating::numeric, 1),
  CASE 
    WHEN logo_path IS NOT NULL 
    THEN 'https://your-project.supabase.co/storage/v1/object/public/broker-assets/' || slug || '/logo.png'
    ELSE NULL
  END,
  CASE WHEN is_active THEN 'active' ELSE 'inactive' END,
  created_at,
  updated_at
FROM legacy_brokers;
```

### 2. Feature Migration Script

```sql
-- Migrate broker features from JSON to key-value pairs
INSERT INTO broker_features (id, broker_id, feature_key, feature_value)
SELECT 
  gen_random_uuid(),
  b.id,
  feature.key,
  feature.value
FROM brokers b
JOIN legacy_brokers lb ON b.slug = LOWER(REGEXP_REPLACE(lb.name, '[^a-zA-Z0-9]+', '-', 'g'))
CROSS JOIN LATERAL jsonb_each_text(lb.features) AS feature(key, value)
WHERE lb.features IS NOT NULL;
```

### 3. Review Migration Script

```sql
-- Migrate reviews
INSERT INTO reviews (
  id,
  broker_id,
  kind,
  author,
  rating,
  body,
  lang,
  published_at
)
SELECT 
  gen_random_uuid(),
  b.id,
  CASE 
    WHEN lr.reviewer_type = 'staff' THEN 'editorial'
    ELSE 'user'
  END,
  lr.reviewer_name,
  ROUND(lr.rating::numeric, 1),
  lr.review_text,
  COALESCE(lr.language_code, 'en'),
  lr.created_at
FROM legacy_reviews lr
JOIN brokers b ON b.slug = LOWER(REGEXP_REPLACE(lr.broker_name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE lr.rating BETWEEN 1 AND 5;
```

## 🖼️ Asset Migration

### Logo Upload Process

1. **Prepare Assets**:
   ```bash
   # Create directory structure
   mkdir -p assets/logos
   
   # Organize logos by broker slug
   # assets/logos/broker-slug/logo.png
   ```

2. **Upload Script** (Node.js):
   ```javascript
   const { createClient } = require('@supabase/supabase-js');
   const fs = require('fs');
   const path = require('path');
   
   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
   
   async function uploadBrokerLogos() {
     const logosDir = './assets/logos';
     const brokers = fs.readdirSync(logosDir);
     
     for (const brokerSlug of brokers) {
       const logoPath = path.join(logosDir, brokerSlug, 'logo.png');
       
       if (fs.existsSync(logoPath)) {
         const fileBuffer = fs.readFileSync(logoPath);
         
         const { data, error } = await supabase.storage
           .from('broker-assets')
           .upload(`${brokerSlug}/logo.png`, fileBuffer, {
             contentType: 'image/png',
             upsert: true
           });
         
         if (error) {
           console.error(`Failed to upload ${brokerSlug}:`, error);
         } else {
           console.log(`Uploaded ${brokerSlug} logo successfully`);
           
           // Update broker record with logo URL
           const { data: publicUrl } = supabase.storage
             .from('broker-assets')
             .getPublicUrl(`${brokerSlug}/logo.png`);
           
           await supabase
             .from('brokers')
             .update({ logo_url: publicUrl.publicUrl })
             .eq('slug', brokerSlug);
         }
       }
     }
   }
   
   uploadBrokerLogos();
   ```

## 🌐 Internationalization Migration

### 1. Locale Setup

```sql
-- Insert supported locales
INSERT INTO locales (code, label) VALUES
('en', 'English'),
('es', 'Español'),
('fr', 'Français'),
('de', 'Deutsch'),
('it', 'Italiano'),
('pt', 'Português'),
('ja', '日本語'),
('zh', '中文');
```

### 2. Broker Internationalization

```sql
-- Migrate localized broker content
INSERT INTO broker_i18n (
  id,
  broker_id,
  lang,
  title,
  summary,
  pros,
  cons,
  faqs
)
SELECT 
  gen_random_uuid(),
  b.id,
  lbc.language_code,
  lbc.localized_title,
  lbc.localized_summary,
  string_to_array(lbc.pros_text, '\n'),
  string_to_array(lbc.cons_text, '\n'),
  lbc.faqs_json
FROM legacy_broker_content lbc
JOIN brokers b ON b.slug = lbc.broker_slug
WHERE lbc.language_code IN ('en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh');
```

### 3. UI Translations

```sql
-- Migrate UI translations
INSERT INTO pages_i18n (id, page_key, lang, t)
SELECT 
  gen_random_uuid(),
  page_name,
  language_code,
  translations_json
FROM legacy_ui_translations
WHERE language_code IN ('en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh');
```

## ✅ Data Validation

### 1. Validation Queries

```sql
-- Check broker count
SELECT 'brokers' as table_name, COUNT(*) as count FROM brokers
UNION ALL
SELECT 'broker_features', COUNT(*) FROM broker_features
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'broker_i18n', COUNT(*) FROM broker_i18n;

-- Check data integrity
SELECT 
  b.slug,
  b.name,
  COUNT(bf.id) as features_count,
  COUNT(r.id) as reviews_count,
  COUNT(bi.id) as i18n_count
FROM brokers b
LEFT JOIN broker_features bf ON b.id = bf.broker_id
LEFT JOIN reviews r ON b.id = r.broker_id
LEFT JOIN broker_i18n bi ON b.id = bi.broker_id
GROUP BY b.id, b.slug, b.name
ORDER BY b.name;

-- Check for missing data
SELECT 
  'Brokers without features' as issue,
  COUNT(*) as count
FROM brokers b
LEFT JOIN broker_features bf ON b.id = bf.broker_id
WHERE bf.id IS NULL
UNION ALL
SELECT 
  'Brokers without reviews',
  COUNT(*)
FROM brokers b
LEFT JOIN reviews r ON b.id = r.broker_id
WHERE r.id IS NULL;
```

### 2. Data Quality Checks

```sql
-- Check rating consistency
SELECT 
  b.slug,
  b.avg_rating as stored_rating,
  ROUND(AVG(r.rating), 1) as calculated_rating,
  COUNT(r.id) as review_count
FROM brokers b
JOIN reviews r ON b.id = r.broker_id
GROUP BY b.id, b.slug, b.avg_rating
HAVING ABS(b.avg_rating - ROUND(AVG(r.rating), 1)) > 0.1;

-- Check slug uniqueness
SELECT slug, COUNT(*) as count
FROM brokers
GROUP BY slug
HAVING COUNT(*) > 1;

-- Check required fields
SELECT 
  'Missing names' as issue,
  COUNT(*) as count
FROM brokers
WHERE name IS NULL OR name = ''
UNION ALL
SELECT 
  'Missing slugs',
  COUNT(*)
FROM brokers
WHERE slug IS NULL OR slug = '';
```

## 🔄 Rollback Plan

### 1. Backup Strategy

```sql
-- Create backup tables before migration
CREATE TABLE brokers_backup AS SELECT * FROM brokers;
CREATE TABLE broker_features_backup AS SELECT * FROM broker_features;
CREATE TABLE reviews_backup AS SELECT * FROM reviews;
CREATE TABLE broker_i18n_backup AS SELECT * FROM broker_i18n;
```

### 2. Rollback Procedure

```sql
-- Rollback if needed
TRUNCATE brokers CASCADE;
TRUNCATE broker_features CASCADE;
TRUNCATE reviews CASCADE;
TRUNCATE broker_i18n CASCADE;

INSERT INTO brokers SELECT * FROM brokers_backup;
INSERT INTO broker_features SELECT * FROM broker_features_backup;
INSERT INTO reviews SELECT * FROM reviews_backup;
INSERT INTO broker_i18n SELECT * FROM broker_i18n_backup;
```

## 📋 Migration Checklist

### Pre-Migration
- [ ] Backup existing data
- [ ] Set up Supabase project
- [ ] Deploy database schema
- [ ] Configure RLS policies
- [ ] Set up storage bucket
- [ ] Test database connections

### Migration Execution
- [ ] Extract broker data
- [ ] Transform and load brokers
- [ ] Migrate broker features
- [ ] Migrate reviews
- [ ] Upload broker assets
- [ ] Migrate internationalization data
- [ ] Validate data integrity

### Post-Migration
- [ ] Update application configuration
- [ ] Test all features
- [ ] Verify real-time functionality
- [ ] Check authentication flows
- [ ] Validate search and filtering
- [ ] Test internationalization
- [ ] Performance testing
- [ ] User acceptance testing

### Go-Live
- [ ] Update environment variables
- [ ] Deploy application
- [ ] Monitor error logs
- [ ] Verify all functionality
- [ ] Update documentation
- [ ] Train team members

## 🆘 Troubleshooting

### Common Issues

1. **UUID Conversion Errors**:
   - Ensure all foreign keys are properly converted
   - Use `gen_random_uuid()` for new UUIDs
   - Map existing IDs consistently

2. **RLS Policy Conflicts**:
   - Temporarily disable RLS during migration
   - Use service role key for admin operations
   - Re-enable RLS after migration

3. **Data Type Mismatches**:
   - Convert ratings to `numeric(2,1)`
   - Ensure timestamps are `timestamptz`
   - Validate JSON structure for JSONB fields

4. **Storage Upload Failures**:
   - Check file permissions
   - Verify bucket configuration
   - Ensure proper CORS settings

### Support Resources

- [Supabase Migration Guide](https://supabase.com/docs/guides/migrations)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)

## 📞 Getting Help

If you encounter issues during migration:

1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check application logs for specific errors
4. Consult the development team
5. Create detailed issue reports with:
   - Error messages
   - Data samples
   - Migration step where issue occurred
   - Environment details