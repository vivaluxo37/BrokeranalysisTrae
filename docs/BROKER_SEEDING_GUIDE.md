# Broker Seeding Guide

This guide covers the end-to-end workflow for adding brokers, logos, and reviews to the BrokerAnalysis platform using both manual and AI-assisted methods.

## Overview

The broker seeding process includes:
1. Creating broker records with basic information
2. Uploading logos to Supabase Storage
3. Adding features and regulation data
4. Inserting AI-generated multilingual content
5. Managing reviews (editorial and user)
6. Publishing and deployment

## Quick Start

### Using the Seed Script

```bash
# Run with sample data
npm run seed-broker:sample

# Run with custom JSON file
npm run seed-broker path/to/your-broker-data.json
```

### Manual Process

1. **Create broker row** (CSV import or Supabase UI)
2. **Upload logo** to `broker-assets/{slug}/logo.png`
3. **Add features & regulation** (CSV import or UI)
4. **Generate AI content** for `broker_i18n`
5. **Translate content** to top-20 languages
6. **Editorial review** → `reviews` table
7. **Enable user reviews** with spam protection
8. **Publish** by setting `status='active'`
9. **Regenerate sitemap & deploy**

## Seed Script (`scripts/seed-broker.ts`)

### Features

- ✅ **TypeScript implementation** with full type safety
- ✅ **Supabase Storage integration** for logo uploads
- ✅ **Database operations** for all broker-related tables
- ✅ **AI-generated content support** with multilingual i18n
- ✅ **Comprehensive error handling** and logging
- ✅ **CLI interface** with file path arguments
- ✅ **Public URL generation** and route path output

### Usage

```bash
# Basic usage
tsx scripts/seed-broker.ts <json-file-path>

# Example with sample data
tsx scripts/seed-broker.ts scripts/sample-broker.json

# Using npm scripts
npm run seed-broker scripts/sample-broker.json
npm run seed-broker:sample  # Uses sample data
```

### JSON Data Structure

The script expects a JSON file with the following structure:

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

### Output

The script provides comprehensive output including:

```
==================================================
✅ Broker seeding completed successfully!
==================================================
🆔 Broker ID: sample-broker-2024
🌐 Public URL: http://localhost:5173/broker/sample-broker
🛣️  Route Path: /broker/sample-broker
🖼️  Logo URL: https://supabase.co/storage/v1/object/public/broker-assets/sample-broker/logo.png
==================================================
```

## Database Schema

### Core Tables

#### `brokers`
- Primary broker information
- Basic metadata (name, slug, website, ratings)
- Financial data (spreads, leverage, deposits)
- Status and activity flags

#### `broker_features`
- Key-value pairs for broker features
- Categorized by type (trading, payment, support, etc.)
- Supports multiple features per broker

#### `broker_regulation`
- Regulatory authority information
- License numbers and status
- Country-specific compliance data

#### `broker_i18n`
- Multilingual content for SEO and user experience
- Localized titles, descriptions, and content
- Meta tags for search optimization

#### `reviews`
- Editorial and user reviews
- Rating system and review content
- Moderation and approval workflow

## AI Content Generation

### Supported Languages

The platform supports content generation in 20+ languages:

- **English (en)** - Primary language
- **Spanish (es)** - Major market
- **French (fr)** - European market
- **German (de)** - DACH region
- **Italian (it)** - Southern Europe
- **Portuguese (pt)** - Brazil/Portugal
- **Russian (ru)** - Eastern Europe
- **Chinese (zh)** - Asian market
- **Japanese (ja)** - Asian market
- **Korean (ko)** - Asian market
- **Arabic (ar)** - Middle East
- **Dutch (nl)** - Netherlands
- **Polish (pl)** - Eastern Europe
- **Turkish (tr)** - Turkey
- **Swedish (sv)** - Scandinavia
- **Norwegian (no)** - Scandinavia
- **Danish (da)** - Scandinavia
- **Finnish (fi)** - Nordic
- **Greek (el)** - Greece
- **Czech (cs)** - Central Europe

### Content Structure

AI-generated content includes:

1. **Title** - SEO-optimized page title
2. **Description** - Brief broker summary
3. **Content** - Comprehensive review in Markdown
4. **Meta Title** - Search engine title
5. **Meta Description** - Search engine description

### Content Sections

Generated content typically covers:

- **About the Broker** - Company background
- **Key Features** - Trading platforms and tools
- **Available Instruments** - Tradeable assets
- **Account Types** - Different account options
- **Regulation and Safety** - Compliance information
- **Fees and Spreads** - Cost structure
- **Customer Support** - Support channels
- **Pros and Cons** - Balanced evaluation
- **Conclusion** - Summary and recommendation

## Logo Management

### Storage Structure

```
broker-assets/
├── broker-slug-1/
│   └── logo.png
├── broker-slug-2/
│   └── logo.png
└── ...
```

### Logo Requirements

- **Format**: PNG (recommended) or SVG
- **Size**: Minimum 200x80px, Maximum 400x160px
- **Aspect Ratio**: Approximately 2.5:1 (width:height)
- **Background**: Transparent or white
- **Quality**: High resolution for retina displays

### Upload Process

1. **Automatic Upload**: Script uploads logo to Supabase Storage
2. **Public URL**: Generated automatically for public access
3. **Database Update**: Logo URL stored in broker record
4. **CDN Distribution**: Supabase provides global CDN access

## Review System

### Editorial Reviews

- **Purpose**: Professional broker analysis
- **Type**: `kind='editorial'`
- **Process**: Internal review and approval
- **Content**: Comprehensive evaluation

### User Reviews

- **Authentication**: Requires user login
- **Spam Protection**: hCaptcha/Turnstile integration
- **Moderation**: Automated and manual review
- **Rating System**: 1-5 star ratings

### Review Workflow

1. **Submission** → Review created with `status='pending'`
2. **Moderation** → Automated spam detection
3. **Approval** → Manual review if needed
4. **Publication** → `status='published'`
5. **Display** → Visible on broker pages

## Publishing Workflow

### Status Management

- **draft** - Initial creation, not visible
- **review** - Under editorial review
- **active** - Published and visible
- **inactive** - Temporarily hidden

### Publication Steps

1. **Content Review** - Verify all data accuracy
2. **SEO Check** - Ensure meta tags and content quality
3. **Legal Review** - Compliance and regulatory accuracy
4. **Status Update** - Set `status='active'`
5. **Sitemap Regeneration** - Update XML sitemap
6. **Cache Invalidation** - Clear CDN caches
7. **Deployment** - Deploy to production

## Environment Setup

### Required Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application URL
VITE_APP_URL=http://localhost:5173

# AI Integration (Optional)
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key
```

### Storage Bucket Setup

1. **Create Bucket**: `broker-assets` in Supabase Storage
2. **Set Public**: Enable public access for logo files
3. **Configure Policies**: Allow authenticated uploads
4. **Set CORS**: Enable cross-origin requests

## Troubleshooting

### Common Issues

#### Logo Upload Fails
- Check file path and permissions
- Verify Supabase Storage bucket exists
- Ensure service role key has storage permissions

#### Database Insertion Errors
- Verify all required fields are provided
- Check for duplicate IDs or slugs
- Ensure foreign key constraints are met

#### Missing Environment Variables
- Copy `.env.example` to `.env`
- Set all required Supabase credentials
- Restart development server after changes

### Debug Mode

Enable verbose logging by setting:

```bash
DEBUG=broker-seed
```

### Support

For additional support:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the [Database Schema](../supabase-schema.sql)
3. Examine existing broker data for examples
4. Contact the development team for assistance

## Best Practices

### Data Quality

- **Verify Information**: Cross-check broker details
- **Update Regularly**: Keep regulation and features current
- **Consistent Formatting**: Follow established patterns
- **SEO Optimization**: Use relevant keywords naturally

### Content Guidelines

- **Factual Accuracy**: Only include verified information
- **Balanced Reviews**: Present both pros and cons
- **Compliance**: Follow financial advertising regulations
- **User Focus**: Write for trader needs and interests

### Technical Considerations

- **Performance**: Optimize images and content size
- **SEO**: Include proper meta tags and structured data
- **Accessibility**: Ensure content is accessible to all users
- **Mobile**: Test on mobile devices and responsive design

---

*This guide is part of the BrokerAnalysis platform documentation. For technical details, see the [API Documentation](./API.md) and [Database Schema](../supabase-schema.sql).*