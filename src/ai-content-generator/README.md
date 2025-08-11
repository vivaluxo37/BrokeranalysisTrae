# AI Content Generator System

A comprehensive AI-powered content generation system for the BrokerAnalysis platform that creates broker reviews, comparison pages, toplists, educational content, country-specific pages, and FAQs based on the complete site map.

## Overview

This system integrates with the existing BrokerAnalysis React/TypeScript/Vite application and uses broker logos from the specified directory to generate high-quality, SEO-optimized content automatically.

## Features

- **Multi-Provider AI Integration**: Supports Groq and OpenRouter with automatic fallback
- **Content Generation**: Creates various content types including broker reviews, comparisons, toplists, educational content, country pages, and FAQs
- **Quality Assurance**: Comprehensive QA pipeline with automated checks
- **Publishing Workflow**: Automated content publishing with SEO optimization
- **Admin Interface**: React-based admin panel for managing content generation
- **Broker Data Integration**: Seamless integration with broker logos and data
- **Template System**: Flexible content templates for consistent output
- **Analytics & Monitoring**: System metrics and performance tracking

## Directory Structure

```
src/ai-content-generator/
├── components/           # React components
│   ├── AIContentGeneratorAdmin.tsx
│   └── index.ts
├── services/            # Core services
│   ├── AIProviderGateway.ts
│   ├── ContentGenerationService.ts
│   ├── ContentTemplateService.ts
│   ├── BrokerDataService.ts
│   ├── QAPipelineService.ts
│   ├── PublishingService.ts
│   ├── AIContentGeneratorService.ts
│   └── index.ts
├── types/               # TypeScript types
│   └── index.ts
├── utils/               # Utility functions
│   └── index.ts
├── config.ts            # Configuration
├── index.ts             # Main entry point
└── README.md            # This file
```

## Quick Start

### 1. Environment Setup

Ensure you have the required environment variables:

```bash
# AI Provider API Keys
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Optional: Custom configuration
AI_CONTENT_OUTPUT_DIR=./generated-content
AI_CONTENT_BROKER_LOGOS_PATH=c:/Users/LENOVO/Desktop/New folder (2)/Broker reviews │ BrokerChooser/
```

### 2. Basic Usage

```typescript
import { generateSiteMapContent, checkSystemHealth } from './ai-content-generator';

// Generate all site map content
const result = await generateSiteMapContent(
  'c:/Users/LENOVO/Desktop/New folder (2)/Broker reviews │ BrokerChooser/',
  false // Set to true to auto-publish
);

// Check system health
const health = await checkSystemHealth();
console.log('System status:', health.status);
```

### 3. Advanced Usage

```typescript
import { 
  createAIContentGenerator,
  ContentGenerationRequest,
  AIContentGeneratorService 
} from './ai-content-generator';

// Create generator instance
const generator = createAIContentGenerator(
  'c:/Users/LENOVO/Desktop/New folder (2)/Broker reviews │ BrokerChooser/',
  './custom-output-directory'
);

// Generate single content
const request: ContentGenerationRequest = {
  type: 'broker-review',
  parameters: {
    wordCount: 1500,
    includeImages: true,
    seoOptimized: true,
    targetCountry: 'US',
    brokerName: 'Interactive Brokers'
  }
};

const content = await generator.generateContent(request);

// Generate batch content with custom configuration
const batchConfig = {
  brokerReviews: {
    limit: 20,
    targetCountry: 'US'
  },
  comparisons: {
    targetCountry: 'US'
  },
  toplists: {
    targetCountry: 'US'
  },
  educational: {
    topics: [
      'How to Choose a Broker',
      'Understanding Trading Fees',
      'Forex Trading for Beginners'
    ]
  },
  countryPages: {
    countries: ['US', 'UK', 'AU', 'CA']
  },
  faqs: {
    topics: [
      'How to start trading?',
      'What is the minimum deposit?',
      'How to choose a trading platform?'
    ]
  }
};

const batchResult = await generator.generateSiteMapContent(batchConfig, true);
```

## Admin Interface

The system includes a React-based admin interface for managing content generation:

```typescript
import { AIContentGeneratorAdmin } from './ai-content-generator/components';

function AdminPage() {
  return (
    <AIContentGeneratorAdmin 
      brokerLogosPath="c:/Users/LENOVO/Desktop/New folder (2)/Broker reviews │ BrokerChooser/"
      outputDirectory="./generated-content"
    />
  );
}
```

### Admin Features

- **Dashboard**: System metrics and health monitoring
- **Content Generation**: Single content generation with customizable parameters
- **Batch Generation**: Bulk content generation for the complete site map
- **Job Management**: Monitor and manage generation jobs
- **Settings**: Configure system parameters

## Content Types

The system supports generating the following content types:

### 1. Broker Reviews
- Comprehensive broker analysis
- Pros and cons evaluation
- Feature comparisons
- User experience insights
- Regulatory information

### 2. Broker Comparisons
- Side-by-side broker comparisons
- Feature matrix tables
- Cost analysis
- Performance metrics
- Recommendation logic

### 3. Top Brokers Lists (Toplists)
- Ranked broker lists by category
- Best brokers for specific needs
- Country-specific recommendations
- Detailed scoring methodology

### 4. Educational Content
- Trading guides and tutorials
- Market analysis techniques
- Risk management strategies
- Platform usage instructions
- Beginner-friendly explanations

### 5. Country-Specific Pages
- Local broker regulations
- Country-specific broker recommendations
- Regional trading considerations
- Local payment methods
- Regulatory compliance information

### 6. FAQ Pages
- Common trading questions
- Platform-specific FAQs
- Broker selection guidance
- Technical support topics
- Regulatory compliance questions

## Quality Assurance

The system includes a comprehensive QA pipeline:

### QA Checks
- **Word Count Validation**: Ensures content meets length requirements
- **SEO Optimization**: Validates meta descriptions, titles, and keyword usage
- **Content Quality**: Checks for readability, structure, and completeness
- **Broker-Specific Validation**: Verifies broker information accuracy
- **Fact Checking**: Cross-references information with reliable sources
- **AI-Powered Review**: Uses AI to assess content quality and coherence

### QA Scoring
- Overall QA score calculation
- Individual check results
- Issue identification and reporting
- Automatic content improvement suggestions

## Publishing Workflow

The publishing system handles:

### Content Processing
- HTML generation with proper formatting
- SEO metadata optimization
- Structured data generation
- Image integration and optimization
- Sitemap updates

### Publishing Options
- Manual review and approval
- Automatic publishing for high-quality content
- Batch publishing for site map content
- Content versioning and rollback

## Configuration

The system is highly configurable through the `config.ts` file:

```typescript
export const config = {
  aiProviders: {
    groq: {
      apiKey: process.env.GROQ_API_KEY,
      baseUrl: 'https://api.groq.com/openai/v1',
      models: {
        'llama-3.1-70b-versatile': {
          maxTokens: 8000,
          costPer1kTokens: 0.0008
        }
      }
    },
    openrouter: {
      apiKey: process.env.OPENROUTER_API_KEY,
      baseUrl: 'https://openrouter.ai/api/v1',
      models: {
        'anthropic/claude-3.5-sonnet': {
          maxTokens: 8000,
          costPer1kTokens: 0.003
        }
      }
    }
  },
  contentGeneration: {
    wordCounts: {
      'broker-review': { min: 1000, max: 2500, target: 1500 },
      'broker-comparison': { min: 800, max: 2000, target: 1200 },
      'toplist': { min: 1200, max: 3000, target: 2000 },
      'educational': { min: 800, max: 2500, target: 1500 },
      'country-page': { min: 600, max: 1500, target: 1000 },
      'faq': { min: 200, max: 800, target: 400 }
    }
  },
  qaPipeline: {
    minimumScore: 0.8,
    autoPublishThreshold: 0.9
  },
  publishing: {
    outputDirectory: process.env.AI_CONTENT_OUTPUT_DIR || './generated-content',
    autoPublish: false,
    generateSitemap: true
  }
};
```

## Monitoring and Analytics

The system provides comprehensive monitoring:

### System Metrics
- Total content generated
- Success/failure rates
- Average generation time
- Cost tracking per provider
- QA score distributions

### Health Monitoring
- AI provider availability
- Service health checks
- Performance monitoring
- Error tracking and logging

### Analytics
- Content performance metrics
- User engagement tracking
- SEO performance analysis
- Cost optimization insights

## Error Handling

Robust error handling includes:

- **Provider Fallback**: Automatic switching between AI providers
- **Retry Logic**: Exponential backoff for failed requests
- **Graceful Degradation**: Partial functionality during outages
- **Error Logging**: Comprehensive error tracking and reporting
- **User Notifications**: Clear error messages and recovery suggestions

## Integration with BrokerAnalysis Platform

The system integrates seamlessly with the existing platform:

### Broker Data Integration
- Uses existing broker database
- Integrates with broker logos from specified directory
- Leverages existing broker types and utilities

### UI Component Integration
- Uses existing UI components (Card, Button, Badge, etc.)
- Follows platform design patterns
- Integrates with existing routing and navigation

### Service Integration
- Compatible with existing service architecture
- Uses platform's HTTP client and error handling
- Integrates with existing authentication system

## Development and Testing

### Development Setup
1. Ensure all dependencies are installed
2. Set up environment variables
3. Configure broker logos path
4. Run the admin interface for testing

### Testing
- Unit tests for individual services
- Integration tests for complete workflows
- End-to-end tests for admin interface
- Performance testing for batch generation

## Deployment

### Production Considerations
- Secure API key management
- Rate limiting and cost controls
- Monitoring and alerting setup
- Backup and recovery procedures
- Performance optimization

### Scaling
- Horizontal scaling for batch processing
- Load balancing for concurrent requests
- Caching for frequently generated content
- Database optimization for large datasets

## Support and Maintenance

### Regular Maintenance
- Monitor AI provider performance
- Update content templates
- Review and improve QA rules
- Optimize generation parameters
- Update broker data and logos

### Troubleshooting
- Check system health dashboard
- Review error logs and metrics
- Verify AI provider connectivity
- Validate configuration settings
- Test individual components

## Future Enhancements

### Planned Features
- Multi-language content generation
- Advanced SEO optimization
- Content personalization
- A/B testing for content variants
- Integration with content management systems

### Extensibility
- Plugin system for custom content types
- Custom AI provider integration
- Advanced analytics and reporting
- Workflow automation
- API endpoints for external integration

---

For more information or support, please refer to the individual service documentation or contact the development team.