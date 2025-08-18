# Supabase Integration Guide

## Overview

This guide covers the complete Supabase integration for the BrokerAnalysis platform, including database schema, authentication, real-time features, and storage configuration.

## 🚀 Quick Start

### 1. Prerequisites

- Supabase account ([supabase.com](https://supabase.com))
- Node.js 18+ installed
- Project dependencies installed (`npm install`)

### 2. Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Update your `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Database Setup

1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the schema from `supabase-schema.sql`
4. Follow the setup guide in `SUPABASE_SETUP.md`

## 📁 File Structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── types/
│   └── supabase.ts          # TypeScript type definitions
├── hooks/
│   └── useSupabase.ts       # React hooks for Supabase operations
├── providers/
│   └── SupabaseProvider.tsx # Context providers and error boundaries
└── App.tsx                  # Main app with Supabase integration
```

## 🔧 Core Components

### Supabase Client (`src/lib/supabase.ts`)

Configures the Supabase client with:
- Environment variable handling
- Authentication settings
- Real-time subscriptions
- Helper functions for common operations

### TypeScript Types (`src/types/supabase.ts`)

Provides comprehensive type definitions for:
- Database tables and views
- Relationship types
- Search and filter interfaces
- Authentication types
- Error handling types

### React Hooks (`src/hooks/useSupabase.ts`)

Includes hooks for:
- **Authentication**: `useAuth`, sign-in/sign-up flows
- **Brokers**: `useBrokers`, `useBroker`, `useBrokerLocalized`
- **Search**: `useSearchBrokers`, `useBrokersByCountry`
- **Reviews**: `useBrokerReviews`, `useSubmitReview`, `useRealtimeReviews`
- **Localization**: `useLocales`, `usePageTranslations`
- **Analytics**: `useBrokerStats`
- **Admin**: `useUploadBrokerLogo`

### Provider Components (`src/providers/SupabaseProvider.tsx`)

Provides:
- `SupabaseProvider`: Main context provider
- `AuthProvider`: Authentication state management
- `SupabaseErrorBoundary`: Error handling
- Query client configuration with TanStack Query

## 🗄️ Database Schema

### Core Tables

- **`brokers`**: Main broker entities with SEO-friendly slugs
- **`broker_features`**: Key-value feature data (fees, platforms)
- **`broker_regulation`**: Per-country regulatory information
- **`reviews`**: Editorial and user reviews with ratings
- **`locales`**: Supported language codes
- **`broker_i18n`**: Localized broker content
- **`pages_i18n`**: UI translations
- **`ingest_jobs`**: Background processing tracking

### Key Features

- **UUID Primary Keys**: All tables use UUID for better security
- **Row Level Security (RLS)**: Comprehensive security policies
- **Internationalization**: Full i18n support with JSONB fields
- **Real-time Updates**: Live data synchronization
- **Rate Limiting**: Built-in review submission limits
- **SEO Optimization**: Slug-based routing and structured data

## 🔐 Security & Authentication

### Row Level Security (RLS)

- **Public Read Access**: Anonymous users can read active brokers
- **Authenticated Reviews**: Only signed-in users can submit reviews
- **Rate Limiting**: Max 3 reviews per broker per 24 hours
- **Admin Access**: Full CRUD operations for authenticated admins

### Authentication Flow

1. **Sign Up**: Email/password with email confirmation
2. **Sign In**: Secure authentication with session management
3. **Profile Management**: User preferences and saved searches
4. **Review Permissions**: Authenticated users can submit reviews

## 📊 Real-time Features

### Live Data Updates

- **Broker Information**: Real-time broker data changes
- **Reviews**: Live review submissions and updates
- **Ratings**: Automatic rating recalculation
- **Search Results**: Dynamic search result updates

### Subscription Management

```typescript
// Example: Real-time broker reviews
const { data: reviews, isLoading } = useRealtimeReviews(brokerId);
```

## 🌐 Internationalization

### Supported Features

- **Multi-language Content**: Broker descriptions, features, pros/cons
- **Localized UI**: Menu items, buttons, form labels
- **Dynamic Language Switching**: Runtime locale changes
- **SEO-friendly URLs**: Language-specific routing

### Usage Example

```typescript
// Get localized broker content
const { data: broker } = useBrokerLocalized(brokerSlug, locale);

// Get UI translations
const { data: translations } = usePageTranslations('homepage', locale);
```

## 📈 Performance Optimization

### Caching Strategy

- **TanStack Query**: Intelligent caching with stale-while-revalidate
- **Supabase Cache**: Built-in query result caching
- **Image Optimization**: CDN-delivered broker logos and assets

### Query Optimization

- **Selective Fields**: Only fetch required data
- **Pagination**: Efficient large dataset handling
- **Indexes**: Optimized database queries
- **Debounced Search**: Reduced API calls for search

## 🔧 Development Workflow

### Local Development

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Database Changes**:
   - Update `supabase-schema.sql`
   - Run migrations in Supabase dashboard
   - Update TypeScript types if needed

3. **Testing**:
   ```bash
   npm run test
   npm run test:e2e
   ```

### Production Deployment

1. **Environment Variables**: Set production Supabase credentials
2. **Database Migration**: Apply schema changes
3. **Storage Setup**: Configure broker-assets bucket
4. **RLS Policies**: Verify security policies are active

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Errors**:
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Check network connectivity
   - Validate Supabase project status

2. **Authentication Issues**:
   - Confirm email confirmation settings
   - Check RLS policies
   - Verify user roles and permissions

3. **Real-time Not Working**:
   - Enable real-time in Supabase dashboard
   - Check subscription filters
   - Verify RLS policies allow subscriptions

4. **Type Errors**:
   - Regenerate types: `npm run generate-types`
   - Update `src/types/supabase.ts`
   - Check database schema changes

### Debug Mode

Enable debug logging:
```env
VITE_LOG_LEVEL=debug
VITE_ENABLE_DEVTOOLS=true
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query Guide](https://tanstack.com/query/latest)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🤝 Contributing

When contributing to Supabase-related features:

1. **Schema Changes**: Update both SQL files and TypeScript types
2. **New Hooks**: Add comprehensive error handling and loading states
3. **Security**: Always consider RLS implications
4. **Testing**: Include both unit and integration tests
5. **Documentation**: Update this README and inline comments

## 📄 License

This Supabase integration is part of the BrokerAnalysis platform and follows the same license terms.