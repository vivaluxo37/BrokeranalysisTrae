-- Migration: Add missing locales to match frontend configuration
-- This script adds the 10 missing languages from the frontend config
-- Run this in Supabase SQL Editor or via CLI

-- Add missing locales (only insert if they don't already exist)
INSERT INTO locales (code, label, enabled) VALUES 
    ('zh-Hans', '简体中文', true),
    ('zh-Hant', '繁體中文', true),
    ('ar', 'العربية', true),
    ('hi', 'हिन्दी', true),
    ('bn', 'বাংলা', true),
    ('ur', 'اردو', true),
    ('tr', 'Türkçe', true),
    ('vi', 'Tiếng Việt', true),
    ('th', 'ไทย', true),
    ('id', 'Bahasa Indonesia', true),
    ('ms', 'Bahasa Melayu', true)
ON CONFLICT (code) DO NOTHING;

-- Update existing Chinese locale if it exists with old code
UPDATE locales 
SET code = 'zh-Hans', label = '简体中文'
WHERE code = 'zh' AND label = '中文';

-- Verify all locales are present
SELECT code, label, enabled 
FROM locales 
ORDER BY 
    CASE code
        WHEN 'en' THEN 1
        WHEN 'es' THEN 2
        WHEN 'pt' THEN 3
        WHEN 'fr' THEN 4
        WHEN 'de' THEN 5
        WHEN 'it' THEN 6
        WHEN 'ru' THEN 7
        WHEN 'zh-Hans' THEN 8
        WHEN 'zh-Hant' THEN 9
        WHEN 'ja' THEN 10
        WHEN 'ko' THEN 11
        WHEN 'ar' THEN 12
        WHEN 'hi' THEN 13
        WHEN 'bn' THEN 14
        WHEN 'ur' THEN 15
        WHEN 'tr' THEN 16
        WHEN 'vi' THEN 17
        WHEN 'th' THEN 18
        WHEN 'id' THEN 19
        WHEN 'ms' THEN 20
        ELSE 99
    END;