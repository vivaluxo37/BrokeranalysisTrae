# Supabase Setup Guide for BrokerAnalysis Platform

This guide walks you through setting up the complete Supabase database schema for the BrokerAnalysis platform with programmatic SEO capabilities.

## Prerequisites

- Supabase account and project created
- Access to Supabase SQL Editor
- Admin access to your Supabase project

## Step 1: Database Schema Setup

### 1.1 Run the Main Schema

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the script

### 1.2 Verify Tables Created

After running the schema, verify these tables exist:

- `brokers` - Core broker entities
- `broker_features` - Key-value feature data
- `broker_regulation` - Regulatory information per country
- `reviews` - Editorial and user reviews
- `locales` - Supported language codes
- `broker_i18n` - Localized broker content
- `pages_i18n` - UI translations
- `ingest_jobs` - Background job tracking

## Step 2: Storage Bucket Setup

### 2.1 Create Broker Assets Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **Create Bucket**
3. Name: `broker-assets`
4. Set as **Public bucket**
5. Click **Create bucket**

### 2.2 Configure Storage Policies

Run these SQL commands in the SQL Editor:

```sql
-- Public read access for broker assets
CREATE POLICY "Public read broker assets" ON storage.objects
    FOR SELECT USING (bucket_id = 'broker-assets');

-- Admin upload access
CREATE POLICY "Admin upload broker assets" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'broker-assets' 
        AND auth.jwt() ->> 'role' = 'admin'
    );

-- Admin update access
CREATE POLICY "Admin update broker assets" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'broker-assets' 
        AND auth.jwt() ->> 'role' = 'admin'
    );

-- Admin delete access
CREATE POLICY "Admin delete broker assets" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'broker-assets' 
        AND auth.jwt() ->> 'role' = 'admin'
    );
```

## Step 3: Authentication Setup

### 3.1 Configure Auth Settings

1. Go to **Authentication** > **Settings**
2. Enable **Email confirmations** if desired
3. Configure **Site URL** to your domain
4. Set up **Redirect URLs** for your application

### 3.2 Set Up User Roles

Create custom claims for admin users:

```sql
-- Function to set user role
CREATE OR REPLACE FUNCTION set_user_role(user_id UUID, role_name TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE auth.users 
    SET raw_app_meta_data = 
        COALESCE(raw_app_meta_data, '{}'::jsonb) || 
        json_build_object('role', role_name)::jsonb
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant admin role to specific user (replace with actual user ID)
-- SELECT set_user_role('your-admin-user-id', 'admin');
```

## Step 4: Environment Configuration

### 4.1 Update Your .env File

Add these Supabase configuration variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration
DATABASE_URL=your-supabase-postgres-connection-string
```

### 4.2 Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## Step 5: Upload Broker Assets

### 5.1 Organize Logo Files

Create this folder structure in your `broker-assets` bucket:

```
broker-assets/
├── etoro/
│   └── logo.png
├── plus500/
│   └── logo.png
├── ig-group/
│   └── logo.png
└── ...
```

### 5.2 Update Logo URLs

After uploading logos, update the `brokers` table:

```sql
-- Update logo URLs with public Supabase storage URLs
UPDATE brokers 
SET logo_url = 'https://your-project.supabase.co/storage/v1/object/public/broker-assets/' || slug || '/logo.png'
WHERE status = 'active';
```

## Step 6: Data Migration (Optional)

### 6.1 Import Existing Broker Data

If you have existing broker data, create a migration script:

```sql
-- Example: Import from existing JSON data
INSERT INTO brokers (slug, name, founded_year, headquarters, base_currency, status)
SELECT 
    data->>'slug',
    data->>'name',
    (data->>'founded_year')::integer,
    data->>'headquarters',
    data->>'base_currency',
    'active'
FROM (
    SELECT jsonb_array_elements(your_json_data) as data
) imported_data;
```

### 6.2 Import Features and Regulation Data

Use similar patterns to import broker features and regulation data from your existing sources.

## Step 7: Testing and Validation

### 7.1 Test RLS Policies

```sql
-- Test public read access
SELECT * FROM brokers WHERE status = 'active';

-- Test authenticated user review insertion
-- (This should be tested from your application)
```

### 7.2 Test Localization

```sql
-- Test localized content retrieval
SELECT b.name, bi.title, bi.summary 
FROM brokers b
JOIN broker_i18n bi ON b.id = bi.broker_id
WHERE bi.lang = 'en' AND b.status = 'active';
```

### 7.3 Test Views

```sql
-- Test broker details view
SELECT * FROM broker_details LIMIT 5;

-- Test localized broker view
SELECT * FROM broker_localized WHERE lang = 'en' LIMIT 5;
```

## Step 8: Performance Optimization

### 8.1 Monitor Query Performance

1. Use Supabase **Logs** to monitor slow queries
2. Add additional indexes if needed:

```sql
-- Example: Add index for frequently filtered columns
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_broker_features_composite ON broker_features(broker_id, feature_key);
```

### 8.2 Set Up Connection Pooling

For production, configure connection pooling in your Supabase project settings.

## Step 9: Backup and Monitoring

### 9.1 Enable Point-in-Time Recovery

Enable PITR in your Supabase project settings for data protection.

### 9.2 Set Up Monitoring

1. Configure **Database Health** monitoring
2. Set up **Alert Policies** for:
   - High CPU usage
   - Connection limits
   - Storage usage

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Ensure you're testing with the correct user roles
2. **Storage Upload Issues**: Check bucket policies and CORS settings
3. **Foreign Key Violations**: Ensure parent records exist before inserting child records
4. **Rate Limiting**: The review rate limiting policy may need adjustment based on your needs

### Getting Help

- Check Supabase documentation: https://supabase.com/docs
- Review logs in the Supabase dashboard
- Test policies using the SQL Editor with different user contexts

## Next Steps

1. **Integrate with Frontend**: Update your React application to use Supabase client
2. **Set Up CI/CD**: Create migration scripts for schema updates
3. **Content Management**: Build admin interfaces for managing broker data
4. **SEO Optimization**: Implement programmatic page generation using the localized content
5. **Analytics**: Set up tracking for user interactions and content performance

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Public policies only allow reading active content
- [ ] User review rate limiting is working
- [ ] Admin-only access to sensitive operations
- [ ] Storage bucket policies are properly configured
- [ ] Environment variables are secure
- [ ] Service role key is protected

---

**Note**: This schema provides a solid foundation for programmatic SEO with multi-language support. The structure allows for efficient content generation, localization, and user-generated content while maintaining security and performance.