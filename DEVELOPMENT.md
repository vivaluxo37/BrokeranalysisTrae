# Development Guide

## Project Setup

This project uses a modern development stack with enhanced tooling for code quality, testing, and development experience.

### Prerequisites

- Node.js 18.x or 20.x
- npm (comes with Node.js)
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd brokeranalysis

# Install dependencies
npm install

# Install Playwright browsers (for E2E testing)
npx playwright install --with-deps
```

## Development Stack

### Core Technologies
- **React 19** - UI framework
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### Development Tools
- **ESLint** - Code linting with TypeScript and React rules
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality enforcement
- **lint-staged** - Run linters on staged files

### Testing Framework
- **Vitest** - Unit testing framework
- **React Testing Library** - React component testing utilities
- **Playwright** - End-to-end testing
- **@testing-library/jest-dom** - Custom Jest matchers

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript type checking
npm run quality:check # Run all quality checks
npm run quality:fix  # Fix all auto-fixable issues
```

### Testing
```bash
npm run test              # Run unit tests in watch mode
npm run test:unit         # Run unit tests once
npm run test:unit:watch   # Run unit tests in watch mode
npm run test:unit:ui      # Run unit tests with UI
npm run test:unit:coverage # Run unit tests with coverage
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Run E2E tests with UI
npm run test:e2e:debug    # Debug E2E tests
npm run test:e2e:report   # Show E2E test report
npm run test:all          # Run all tests
```

### CI/CD
```bash
npm run ci:test      # Run tests suitable for CI
npm run ci:build     # Full CI build process
npm run clean        # Clean build artifacts
```

## TypeScript Configuration

The project uses strict TypeScript configuration with enhanced type checking:

- **Strict mode enabled** - Maximum type safety
- **Path mapping** - Clean imports with `@/` prefix
- **Enhanced compiler options** - Additional safety checks
- **Separate configs** - App and Node.js configurations

### Path Mapping
```typescript
// Instead of relative imports
import { Button } from '../../../components/ui/button'

// Use clean absolute imports
import { Button } from '@/components/ui/button'
```

## Testing Strategy

### Unit Testing
- **Framework**: Vitest with React Testing Library
- **Location**: `src/**/*.{test,spec}.{ts,tsx}`
- **Coverage**: Configured with v8 provider
- **Mocks**: Global mocks for browser APIs in `src/test/setup.ts`

### E2E Testing
- **Framework**: Playwright
- **Location**: `e2e/**/*.spec.ts`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Reports**: HTML reports with screenshots and videos on failure

### Test Utilities
- Custom render function with providers in `src/test/utils.tsx`
- Mock data factories for consistent test data
- Global test setup with browser API mocks

## Code Quality Standards

### ESLint Configuration
- TypeScript-specific rules
- React hooks rules
- Testing library rules
- Custom rules for code consistency
- Separate rules for test files

### Prettier Configuration
- Consistent code formatting
- Single quotes, no semicolons
- 80 character line width
- Trailing commas for ES5 compatibility

### Git Hooks
- **Pre-commit**: Runs lint-staged for staged files
- **Pre-push**: Runs unit tests
- **lint-staged**: Lints, formats, and tests only changed files

## CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow:

### Quality Checks
- TypeScript type checking
- ESLint linting
- Prettier formatting check

### Testing
- Unit tests with coverage on multiple Node.js versions
- E2E tests across multiple browsers
- Coverage reporting to Codecov

### Build & Security
- Production build verification
- Bundle size analysis
- Security audit with npm audit
- Vulnerability scanning

## Development Workflow

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Make changes** - The development server will hot-reload

3. **Run tests** - Tests run automatically or manually
   ```bash
   npm run test:unit:watch  # Unit tests in watch mode
   ```

4. **Check code quality** before committing
   ```bash
   npm run quality:check
   ```

5. **Commit changes** - Git hooks will run automatically
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push changes** - Pre-push hook runs unit tests
   ```bash
   git push
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── brokers/        # Broker-related components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components
│   └── ui/             # UI primitives
├── hooks/              # Custom React hooks
├── services/           # API services and business logic
├── stores/             # State management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── test/               # Test utilities and setup
└── pages/              # Page components
```

## Environment Variables

Create a `.env.local` file for local development:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## Troubleshooting

### Common Issues

1. **TypeScript errors after dependency updates**
   ```bash
   npm run type-check
   ```

2. **ESLint configuration conflicts**
   ```bash
   npm run lint:fix
   ```

3. **Test failures after changes**
   ```bash
   npm run test:unit:coverage
   ```

4. **Playwright browser issues**
   ```bash
   npx playwright install --with-deps
   ```

### Performance Tips

- Use `npm run dev` for development (faster than build)
- Run `npm run test:unit:watch` for continuous testing
- Use `npm run test:e2e:ui` for debugging E2E tests
- Check bundle size with build output

## Contributing

1. Follow the established code style (enforced by ESLint/Prettier)
2. Write tests for new features
3. Update documentation as needed
4. Ensure all CI checks pass
5. Use conventional commit messages

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)