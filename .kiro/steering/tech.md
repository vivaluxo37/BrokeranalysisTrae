# Technology Stack

## Frontend Framework
- **React 19.1.0** with TypeScript for type-safe component development
- **Vite 7.1.1** as the build tool and development server
- **React Router DOM 6.26.2** for client-side routing

## UI & Styling
- **Tailwind CSS 4.1.11** for utility-first styling
- **Radix UI** components for accessible, unstyled primitives
- **Lucide React** for consistent iconography
- **Recharts** for data visualization and charts
- **shadcn/ui** design system components

## State Management & Data Fetching
- **TanStack Query (React Query) 5.85.3** for server state management
- **React Hook Form 7.62.0** with Zod validation for form handling
- **React Context** for global application state

## Backend & Database
- **Supabase** for database, authentication, and real-time features
- **Express.js** API server for custom endpoints
- **Node.js** runtime environment

## Development Tools
- **TypeScript 5.8.3** with strict configuration
- **ESLint 9.30.1** with TypeScript and React plugins
- **Prettier 3.6.2** for code formatting
- **Vitest 3.2.4** for unit testing
- **Playwright 1.54.2** for end-to-end testing

## Build & Deployment
- **Vercel** for hosting and deployment
- **Concurrently** for running multiple development processes
- **TSX** for TypeScript execution

## Internationalization
- **i18next** with browser language detection and HTTP backend
- **react-i18next** for React integration

## Common Commands

### Development
```bash
npm run dev              # Start development server (client + API)
npm run client:dev       # Start only frontend development server
npm run server:dev       # Start only API server
```

### Building
```bash
npm run build           # Production build
npm run build:prod      # Production build with production mode
npm run preview         # Preview production build locally
```

### Code Quality
```bash
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues automatically
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # Run TypeScript type checking
```

### Testing
```bash
npm test               # Run unit tests with Vitest
npm run test:e2e       # Run Playwright end-to-end tests
```

### Data Management
```bash
npm run compile-brokers    # Compile broker data
npm run extract-brokers    # Extract broker information
npm run validate-data      # Validate broker data integrity
npm run crawl             # Run web crawler for data collection
```

### AI Content Generation
```bash
npm run ai:generate-brokers  # Generate broker content with AI
npm run ai:check-env        # Check AI environment setup
npm run ai:list-brokers     # List available brokers
```

## Path Aliases
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/services/*` → `./src/services/*`
- `@/types/*` → `./src/types/*`
- `@/utils/*` → `./src/utils/*`