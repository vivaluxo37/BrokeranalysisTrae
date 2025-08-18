# Project Structure

## Root Directory Organization

### Configuration Files
- `package.json` - Dependencies and npm scripts
- `vite.config.ts` - Vite build configuration with React and path resolution
- `tsconfig.json` - TypeScript project references
- `tsconfig.app.json` - Main app TypeScript configuration with strict settings
- `tailwind.config.js` - Tailwind CSS configuration with shadcn/ui integration
- `eslint.config.js` - ESLint configuration with TypeScript and React rules

### Source Code Structure (`src/`)

#### Core Application
- `main.tsx` - Application entry point
- `App.tsx` - Main application component with routing
- `index.css` - Global styles and CSS variables

#### Components (`src/components/`)
- `ui/` - Reusable UI components (shadcn/ui based)
- `layout/` - Layout components (headers, navigation, page structure)
- `common/` - Shared components across features
- `broker-comparison/` - Broker comparison specific components
- `tools/` - Trading calculator and tool components
- `auth/` - Authentication related components
- `seo/` - SEO optimization components

#### Pages (`src/pages/`)
- `brokers/` - Broker profile and listing pages
- `tools/` - Trading tool pages (calculators, etc.)
- `education/` - Educational content pages
- `legal/` - Legal and compliance pages
- `news/` - News and market data pages
- `comparison/` - Broker comparison pages

#### State Management (`src/contexts/`)
- Context providers for global state management
- Navigation context for breadcrumbs and routing
- Tools context for calculator state

#### Data Layer
- `src/hooks/` - Custom React hooks for data fetching and state
- `src/services/` - API services and data access layer
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions and helpers

#### Internationalization (`src/i18n/`)
- `config.ts` - i18next configuration
- `locales/` - Translation files for different languages

#### Styling (`src/styles/`)
- Design system utilities and theme configuration

### Backend & API (`api/`)
- Express.js server for custom API endpoints
- OG image generation for social media
- Route handlers for dynamic content

### Data Management
- `database/` - Database schemas and migrations
- `scripts/` - Data processing and generation scripts
- `scraped_data/` - Raw scraped broker data
- `brokerdatacsv/` - Processed CSV data files

### Testing
- `e2e/` - Playwright end-to-end tests
- `src/test/` - Test utilities and setup
- Component tests co-located with components (`__tests__/` folders)

### Build & Deployment
- `dist/` - Production build output
- `vercel.json` - Vercel deployment configuration
- `.env.example` - Environment variable template

## Naming Conventions

### Files & Directories
- **Components**: PascalCase (e.g., `BrokerCard.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useBrokerData.ts`)
- **Services**: camelCase with "Service" suffix (e.g., `brokerService.ts`)
- **Types**: camelCase with descriptive names (e.g., `broker.ts`)
- **Utils**: camelCase (e.g., `formatCurrency.ts`)

### Component Structure
```
ComponentName/
├── index.ts          # Re-export component
├── ComponentName.tsx # Main component
├── ComponentName.test.tsx # Tests
└── types.ts          # Component-specific types
```

### Import Organization
1. React and external libraries
2. Internal components and hooks
3. Types and interfaces
4. Utilities and constants

## Architecture Patterns

### Component Patterns
- **Compound Components** for complex UI (e.g., data tables)
- **Render Props** for flexible component composition
- **Custom Hooks** for reusable logic
- **Context + Reducer** for complex state management

### Data Flow
- **React Query** for server state and caching
- **React Hook Form** for form state management
- **Context API** for global UI state
- **Supabase** for real-time data synchronization

### Code Organization
- Feature-based organization within `pages/`
- Shared components in `components/common/`
- Business logic in custom hooks
- API calls abstracted in services layer