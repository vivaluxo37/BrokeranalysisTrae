# User Rules and Guidelines

This document consolidates all user guidelines and technical specifications from the steering files for the BrokerAnalysis platform.

---

# AI Integration Guidelines

## AI Provider Configuration

### Groq API Integration
- **Primary API Key**: `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`
- **SDK**: Use `groq-sdk` npm package for TypeScript integration
- **Preferred Models by Use Case**:
  - **Chatbot**: `deepseek-r1-distill-llama-70b` (reasoning capabilities)
  - **Summarization**: `gemma2-9b-it` (fast and efficient)
  - **Reasoning/Fraud Detection**: `qwen/qwen3-32b` (complex analysis)
  - **Bulk Analysis**: `openai/gpt-oss-120b` (large context window)
  - **General Purpose**: `meta-llama/llama-4-scout-17b-16e-instruct`

### OpenRouter API Integration
- **Multiple API Keys**: Each model has its own dedicated API key for optimal rate limiting
- **HTTP Client**: Use fetch API with proper headers including `HTTP-Referer` and `X-Title`
- **Preferred Models by Use Case**:
  - **Primary Fallback**: `deepseek/deepseek-r1:free`
  - **Fast Responses**: `moonshotai/kimi-k2:free`
  - **Multimodal**: `openrouter/horizon-beta` and `moonshotai/kimi-vl-a3b-thinking:free`
  - **Cost-Effective**: `z-ai/glm-4.5-air:free`
  - **Specialized**: `agentica-org/deepcoder-14b-preview:free` for code analysis

## Implementation Patterns

### Provider Fallback Strategy
1. **Primary Provider**: Always try Groq first for better performance
2. **Secondary Provider**: Fall back to OpenRouter if Groq fails
3. **Model Fallback**: Within each provider, have model-specific fallbacks
4. **Graceful Degradation**: Use cached responses or rule-based fallbacks when all AI fails

### Cost Optimization
- **Budget Monitoring**: Track costs in real-time across all providers
- **Model Selection**: Automatically switch to cheaper models when approaching budget limits
- **Free Model Preference**: Prioritize free OpenRouter models for non-critical operations
- **Usage Analytics**: Monitor which models provide best value for different use cases

### Security and Privacy
- **Data Sanitization**: Remove PII before sending to AI providers
- **API Key Management**: Store keys securely using environment variables
- **Request Logging**: Log requests for debugging but exclude sensitive data
- **Response Caching**: Cache responses securely with appropriate TTL

## Service Architecture

### AI Gateway Pattern
- **Single Entry Point**: All AI requests go through the AI Gateway service
- **Provider Abstraction**: Components don't need to know which provider is used
- **Request Routing**: Gateway decides which provider/model to use based on request type
- **Error Handling**: Gateway handles all provider-specific errors and retries

### Streaming Implementation
- **Real-time Responses**: Use streaming for chatbot and long-form content generation
- **Progressive Loading**: Show partial responses as they're generated
- **Error Recovery**: Handle stream interruptions gracefully
- **Performance**: Optimize for low latency and smooth user experience

### RAG Integration
- **Vector Database**: Use for storing and retrieving document embeddings
- **Document Processing**: Chunk documents appropriately for better retrieval
- **Context Management**: Maintain conversation context across multiple turns
- **Source Attribution**: Always cite sources for RAG-generated responses

## Quality Assurance

### Testing Strategy
- **Mock Providers**: Create mock implementations for testing without API calls
- **Response Validation**: Validate AI responses for quality and relevance
- **Performance Testing**: Test under load to ensure scalability
- **Cost Testing**: Monitor costs during testing to prevent budget overruns

### Monitoring and Alerts
- **Health Checks**: Regular health checks for all AI providers
- **Performance Metrics**: Track response times, success rates, and costs
- **Error Alerting**: Alert administrators when providers fail or costs spike
- **Usage Analytics**: Track which features are most used and optimize accordingly

## Integration Points

### Broker Platform Integration
- **Broker Data**: Use existing broker database for contextual AI responses
- **User Preferences**: Integrate with user profile system for personalized responses
- **Review System**: Enhance review analysis with AI-powered insights
- **Search Enhancement**: Use AI to improve search relevance and suggestions

### Frontend Integration
- **React Components**: Create reusable AI-powered components
- **State Management**: Use existing TanStack Query for AI response caching
- **Error Boundaries**: Implement proper error handling for AI failures
- **Loading States**: Provide good UX during AI processing

## Development Guidelines

### Code Organization
- **Service Layer**: Keep AI logic in dedicated service classes
- **Type Safety**: Use TypeScript interfaces for all AI requests/responses
- **Error Handling**: Implement comprehensive error handling with proper types
- **Configuration**: Use environment variables for all API keys and settings

### Performance Optimization
- **Response Caching**: Cache AI responses where appropriate
- **Request Batching**: Batch similar requests when possible
- **Lazy Loading**: Load AI features only when needed
- **Resource Management**: Properly manage API rate limits and costs

### Deployment Considerations
- **Environment Variables**: Securely manage API keys in production
- **Scaling**: Design for horizontal scaling of AI services
- **Monitoring**: Implement comprehensive monitoring in production
- **Backup Plans**: Have fallback strategies for when AI services are unavailable

---

# Product Overview

BrokerAnalysis is a comprehensive broker comparison and review platform designed to help traders and investors make informed decisions when choosing financial brokers.

## Core Features

- **Broker Comparison**: Side-by-side comparison of brokers with filtering and ranking capabilities
- **User Reviews**: Community-driven reviews and ratings for brokers
- **Trading Tools**: Interactive calculators and analysis tools for traders
- **Educational Content**: Resources and guides for trading and broker selection
- **User Profiles**: Personalized user accounts with trading experience tracking
- **Authentication System**: Secure user registration, login, and profile management
- **AI-Powered Chatbot**: Intelligent assistant for broker recommendations and trading guidance
- **Content Summarization**: AI-generated summaries of reviews, news, and regulatory documents
- **Fraud Detection**: AI-powered analysis to identify suspicious brokers and fake reviews
- **Bulk Analysis**: AI-driven insights from large datasets of broker and market data

## Target Audience

- Individual traders and investors
- Financial advisors
- Trading beginners seeking guidance
- Experienced traders comparing broker features

## Key Value Propositions

- Transparent broker comparisons with real user feedback
- Comprehensive broker analysis including fees, features, and regulations
- Interactive tools to help users make data-driven decisions
- Personalized recommendations based on user profiles and trading experience
- AI-powered insights and assistance for better decision-making
- Automated fraud detection to protect users from suspicious brokers
- Intelligent content summarization for quick information consumption
- Real-time AI support through conversational chatbot interface

---

# MCP (Model Context Protocol) Guidelines

## Configuration Management

### MCP Server Configuration
- Use `.kiro/settings/mcp.json` for workspace-specific MCP server configurations
- Always validate MCP server configurations before use
- Prefer `uvx` command for Python-based MCP servers when available
- Set appropriate environment variables (e.g., `FASTMCP_LOG_LEVEL: "ERROR"`) to reduce noise
- Use `autoApprove` sparingly and only for trusted, non-destructive tools

### Server Management
- Test MCP server connectivity before relying on tools
- Handle server disconnections gracefully with appropriate fallbacks
- Document any custom MCP server configurations in project documentation

## Tool Usage Patterns

### Context7 MCP Integration
- **Context7 MCP should always be used when available** for documentation and library context
- **Trigger phrase**: Use "use context7" to explicitly invoke Context7 MCP tools
- Leverage Context7 for up-to-date library documentation and API references
- **AI Integration**: Use Context7 for Groq SDK, OpenRouter API, vector database documentation
- Validate Context7 responses against current project dependencies

### Fetch MCP for AI Provider Testing
- **Use fetch MCP** to test AI provider APIs (Groq, OpenRouter) during development
- **Auto-approved**: Enabled for quick API endpoint validation
- **Security**: Never expose API keys in MCP calls - reference environment variables
- **Testing**: Validate API response formats before implementing in code

### Sequential Thinking for AI Architecture
- **Use sequential thinking MCP** for complex AI integration decisions
- **Auto-approved**: Enabled for multi-step AI reasoning and planning
- **Use cases**: AI provider fallback strategies, cost optimization, error handling
- **Documentation**: Record AI architecture decisions in steering files

### Tool Selection
- **Check installed MCP servers** before starting any task and use them as necessary
- Choose MCP tools that align with the broker analysis domain (financial data, web scraping, document processing)
- Prefer tools with strong TypeScript support and clear error handling
- Validate tool capabilities before integration into critical workflows

### Integration with React/TypeScript Architecture
- Wrap MCP tool calls in proper TypeScript interfaces
- Use React Query patterns for caching MCP tool responses when appropriate
- Implement proper loading states and error boundaries for MCP-dependent components

## Testing and Validation

### MCP Tool Testing
- Create mock implementations for MCP tools in test environments
- Test both successful responses and error conditions
- Validate tool outputs against expected schemas using Zod
- Include MCP tool integration tests in the E2E test suite when tools affect user-facing features

### Data Validation
- Always validate MCP tool responses before using in application logic
- Use TypeScript types and Zod schemas to ensure data integrity
- Implement proper sanitization for any user-facing data from MCP tools

## Security Considerations

### Financial Platform Security
- Never expose sensitive broker data or user information through MCP tools
- Validate and sanitize all external data retrieved via MCP tools
- Use environment variables for any API keys or sensitive configuration
- Audit MCP tool permissions regularly

### Data Handling
- Implement proper data retention policies for MCP tool responses
- Ensure compliance with financial data regulations
- Log MCP tool usage for audit purposes without exposing sensitive data

## Error Handling and Resilience

### Graceful Degradation
- Always provide fallback functionality when MCP tools are unavailable
- Implement circuit breaker patterns for unreliable MCP services
- Use proper error boundaries to prevent MCP failures from crashing the application

### Error Reporting
- Log MCP tool errors with sufficient context for debugging
- Provide user-friendly error messages that don't expose internal details
- Implement retry logic with exponential backoff for transient failures

## Best Practices

### Performance
- Cache MCP tool responses when appropriate to reduce latency
- Use background processing for non-critical MCP tool operations
- Monitor MCP tool performance and set reasonable timeouts

### Maintainability
- Document MCP tool integrations and their purposes
- Keep MCP tool logic separate from core business logic
- Use dependency injection patterns to make MCP tools easily testable and replaceable

## Task Execution Guidelines

### Pre-Task Checklist
1. **Check installed MCP servers** at the start of every task
2. **Use Context7 MCP** for any documentation or library-related queries
3. **Select appropriate MCP tools** based on task requirements
4. **Validate tool availability** before proceeding with implementation

### Context7 Usage
- Always use Context7 MCP when working with external libraries or APIs
- Include "use context7" in queries when you need up-to-date documentation
- Cross-reference Context7 responses with project dependencies in `package.json`
- Use Context7 for troubleshooting integration issues with third-party libraries

---

# Technology Stack

## Core Technologies

- **React 19** - Modern UI framework with latest features
- **TypeScript** - Strict type safety with enhanced compiler options
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **React Router DOM v6** - Client-side routing

## Key Libraries

### UI & Styling
- **Radix UI** - Headless UI primitives (@radix-ui/react-*)
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variant management
- **Tailwind Merge** - Utility class merging
- **Tailwindcss Animate** - Animation utilities

### State Management & Data Fetching
- **TanStack React Query** - Server state management and caching
- **React Hook Form** - Form state management with validation
- **Zod** - Schema validation

### Backend Integration
- **Axios** - HTTP client for API requests
- **Express** - Backend server framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Internationalization
- **i18next** - Internationalization framework
- **react-i18next** - React integration for i18n

## Development Tools

### Code Quality
- **ESLint** - Linting with TypeScript and React rules
- **Prettier** - Code formatting with strict configuration
- **Husky** - Git hooks for quality enforcement
- **lint-staged** - Pre-commit linting

### Testing
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing
- **@testing-library/jest-dom** - Custom Jest matchers

## Build System

### Path Aliases
```typescript
'@/' -> './src/'
'@/components' -> './src/components'
'@/hooks' -> './src/hooks'
'@/services' -> './src/services'
'@/types' -> './src/types'
'@/utils' -> './src/utils'
```

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking
npm run quality:check # All quality checks
npm run quality:fix  # Fix all auto-fixable issues
```

### Testing
```bash
npm run test              # Unit tests in watch mode
npm run test:unit         # Run unit tests once
npm run test:unit:coverage # Unit tests with coverage
npm run test:e2e          # End-to-end tests
npm run test:e2e:ui       # E2E tests with UI
npm run test:all          # Run all tests
```

### CI/CD
```bash
npm run ci:test      # CI-suitable tests
npm run ci:build     # Full CI build process
npm run clean        # Clean build artifacts
```

## Environment Setup

- **Node.js**: 18.x or 20.x required
- **Package Manager**: npm (comes with Node.js)
- **Browser Testing**: Playwright browsers auto-installed