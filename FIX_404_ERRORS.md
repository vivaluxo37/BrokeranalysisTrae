# 🔧 Fix for 404 Errors - Missing i18n Tables

## Problem Description

Your application is showing 404 errors because the internationalization (i18n) tables are missing from your Supabase database:

```
Failed to load resource: the server responded with a status of 404 ()
LanguageService.ts:79 Supabase not available, using fallback languages: Could not find the table 'public.locales' in the schema cache
diykotyhjwcwdscozltq.supabase.co/rest/v1/pages_i18n?select=translation_key%2Ctranslation_value&page_key=eq.homepage&lang=eq.en:1 Failed to load resource: the server responded with a status of 404 ()
```

## Root Cause

The `locales` and `pages_i18n` tables don't exist in your Supabase database, but your application code is trying to fetch data from them.

## 🚀 Quick Fix (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: **https://supabase.com/dashboard/project/diykotyhjwcwdscozltq/sql**
2. Make sure you're logged into your Supabase account

### Step 2: Execute the SQL Setup

1. Open the file `MANUAL_SQL_SETUP.sql` in this project
2. **Copy the entire contents** of that file
3. **Paste it into the Supabase SQL Editor**
4. Click the **"Run"** button

### Step 3: Verify Success

After running the SQL, you should see:
- ✅ Tables created successfully
- ✅ Sample data inserted
- ✅ Indexes and policies created

### Step 4: Test the Fix

1. **Refresh your browser** (hard refresh: Ctrl+F5)
2. Check the browser console - the 404 errors should be gone
3. Test language switching if available

## 🔍 What the SQL Does

### Creates `locales` table:
- Stores available languages (English, Spanish, French, etc.)
- 20 pre-configured languages
- Primary key: language code (en, es, fr, etc.)

### Creates `pages_i18n` table:
- Stores translations for different pages
- Structure: page_key + language + translation_key = translation_value
- Example: homepage + en + hero_title = "Find Your Perfect Broker"

### Sets up security:
- Row Level Security (RLS) enabled
- Public read access for translations
- Authenticated user access for management

## 🧪 Verification Commands

After setup, you can run these in Supabase SQL Editor to verify:

```sql
-- Check locales
SELECT * FROM locales LIMIT 10;

-- Check translations
SELECT * FROM pages_i18n WHERE page_key = 'homepage';

-- Test the exact query your app uses
SELECT translation_key, translation_value 
FROM pages_i18n 
WHERE page_key = 'homepage' AND lang = 'en';
```

## 🔄 Alternative: Automated Script

If you prefer to check the status programmatically:

```bash
node create-i18n-tables.js
```

This script will:
- ✅ Check if tables exist
- ⚠️ Show manual instructions if they don't
- ✅ Add sample data if tables exist

## 🐛 Troubleshooting

### If you still see 404 errors after setup:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** the page (Ctrl+F5)
3. **Check Supabase URL** in your `.env` file
4. **Verify table creation** with the verification commands above

### If SQL execution fails:

1. Make sure you're using the **correct Supabase project**
2. Check that you have **admin permissions**
3. Try running the SQL **in smaller chunks**

### If tables exist but queries still fail:

1. Check **Row Level Security policies**
2. Verify **API keys** in `.env` file
3. Test with **Supabase service role key**

## 📁 Files Created

- `MANUAL_SQL_SETUP.sql` - Complete SQL setup script
- `create-i18n-tables.js` - Automated detection and setup script
- `FIX_404_ERRORS.md` - This troubleshooting guide

## 🎯 Expected Result

After successful setup:
- ❌ No more 404 errors in browser console
- ✅ Language service loads properly
- ✅ Translations display correctly
- ✅ Multi-language support works

---

**Need help?** Check the browser console for any remaining errors and verify the tables exist in your Supabase dashboard.