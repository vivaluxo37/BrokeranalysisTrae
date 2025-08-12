# Project Rules and Specifications

This document consolidates all project specifications and requirements for the BrokerAnalysis platform, including AI integration systems and homepage integration plans.

---

# SOLO Builder Instructions

## Error Resolution Protocol

### MCP Usage Requirements

**MANDATORY:** When SOLO Builder encounters any errors during development, debugging, or troubleshooting, it MUST always use the following MCPs (Model Context Protocols) in combination:

#### 1. Context7 MCP
- **Purpose:** Provides comprehensive context gathering and analysis capabilities
- **Usage:** MUST be used to gather complete context about the error, including:
  - Related code files and dependencies
  - Error stack traces and logs
  - Configuration files and environment settings
  - Recent changes that might have caused the issue

#### 2. Sequential Thinking MCP
- **Purpose:** Enables systematic, step-by-step problem-solving approach
- **Usage:** MUST be used to:
  - Break down complex errors into manageable components
  - Create logical sequences for troubleshooting steps
  - Maintain systematic approach to error resolution
  - Document the reasoning process for future reference

### Error Resolution Workflow

1. **Context Gathering Phase (Context7 MCP)**
   - Analyze the error message and stack trace
   - Identify all related files and dependencies
   - Review recent changes and configurations
   - Gather environmental context

2. **Systematic Analysis Phase (Sequential Thinking MCP)**
   - Break down the error into root causes
   - Create step-by-step troubleshooting plan
   - Prioritize potential solutions
   - Plan implementation sequence

3. **Implementation Phase (Both MCPs)**
   - Execute solutions systematically
   - Verify each step before proceeding
   - Document changes and their effects
   - Test thoroughly after each modification

### Compliance Requirements

- **NEVER** attempt error resolution without using both MCPs
- **ALWAYS** document the context gathering and thinking process
- **ENSURE** systematic approach is maintained throughout
- **VERIFY** that all related components are considered

---

# AI Integration System

## Requirements Document

### Introduction

The BrokerAnalysis platform requires intelligent AI capabilities to enhance user experience through chatbot interactions, automated content summarization, document ingestion for RAG (Retrieval-Augmented Generation), fraud detection logic, and bulk analysis features. This specification outlines the integration of multiple AI providers (Groq and OpenRouter) with fallback mechanisms to ensure reliable AI-powered features across the platform.

### Requirements

#### Requirement 1: Multi-Provider AI Service Architecture

**User Story:** As a platform administrator, I want a robust AI service architecture with multiple providers and automatic fallback so that AI features remain available even when individual providers experience issues.

##### Acceptance Criteria

1. WHEN the AI service initializes THEN it SHALL configure connections to both Groq and OpenRouter APIs with proper authentication
2. WHEN an AI request is made THEN the system SHALL attempt to use the primary provider first and automatically fallback to secondary providers if the primary fails
3. WHEN a provider reaches rate limits THEN the system SHALL automatically switch to the next available provider without user interruption
4. IF all providers are unavailable THEN the system SHALL gracefully degrade functionality and notify users of temporary limitations
5. WHEN provider performance is monitored THEN the system SHALL track response times, success rates, and costs to optimize provider selection
6. WHEN configuration changes are made THEN the system SHALL support hot-swapping of provider priorities without service restart

#### Requirement 2: Intelligent Chatbot Interface

**User Story:** As a user, I want to interact with an intelligent chatbot that can answer questions about brokers, trading, and platform features so that I can get instant help and guidance.

##### Acceptance Criteria

1. WHEN a user opens the chatbot THEN it SHALL provide a welcoming interface with suggested conversation starters related to broker comparison
2. WHEN a user asks about specific brokers THEN the chatbot SHALL provide accurate, up-to-date information from the platform's broker database
3. WHEN a user requests broker recommendations THEN the chatbot SHALL use their profile and preferences to suggest suitable brokers with explanations
4. IF a user asks complex trading questions THEN the chatbot SHALL provide educational responses while disclaiming that it's not financial advice
5. WHEN the chatbot cannot answer a question THEN it SHALL gracefully redirect users to appropriate resources or human support
6. WHEN conversations occur THEN the system SHALL maintain context throughout the session and learn from user interactions

#### Requirement 3: Content Summarization System

**User Story:** As a content manager, I want AI-powered summarization of broker reviews, news articles, and regulatory documents so that users can quickly understand key information without reading lengthy content.

##### Acceptance Criteria

1. WHEN new broker reviews are submitted THEN the system SHALL automatically generate concise summaries highlighting key pros, cons, and insights
2. WHEN regulatory documents are updated THEN the system SHALL create plain-language summaries of important changes affecting traders
3. WHEN news articles are ingested THEN the system SHALL generate brief summaries with relevance scores for different broker categories
4. IF content is too complex for summarization THEN the system SHALL flag it for human review while providing partial summaries where possible
5. WHEN summaries are generated THEN they SHALL maintain factual accuracy and include confidence scores for the summarization quality
6. WHEN users view summaries THEN they SHALL have options to view full content and provide feedback on summary quality

#### Requirement 4: Document Ingestion and RAG System

**User Story:** As a platform user, I want the AI system to have access to comprehensive broker documentation and regulatory information so that it can provide accurate, contextual answers to my questions.

##### Acceptance Criteria

1. WHEN broker documentation is uploaded THEN the system SHALL automatically process, chunk, and index the content for RAG retrieval
2. WHEN regulatory documents are ingested THEN the system SHALL extract key information and create searchable embeddings for quick retrieval
3. WHEN users ask questions THEN the RAG system SHALL retrieve relevant document sections and provide contextual answers with source citations
4. IF document content conflicts with existing information THEN the system SHALL flag discrepancies and prioritize more recent or authoritative sources
5. WHEN new documents are added THEN the system SHALL update the knowledge base and improve answer quality for related queries
6. WHEN document retrieval occurs THEN the system SHALL track which sources are most useful and optimize retrieval algorithms accordingly

#### Requirement 5: Fraud Detection and Risk Analysis

**User Story:** As a platform administrator, I want AI-powered fraud detection to identify suspicious broker activities, fake reviews, and potential scams so that users can trust the platform's recommendations.

##### Acceptance Criteria

1. WHEN new brokers are added THEN the AI system SHALL analyze their information against known fraud patterns and regulatory databases
2. WHEN user reviews are submitted THEN the system SHALL detect potential fake reviews using sentiment analysis, writing patterns, and user behavior
3. WHEN broker data changes significantly THEN the system SHALL flag unusual patterns that might indicate fraudulent activity or data manipulation
4. IF suspicious activity is detected THEN the system SHALL automatically flag content for human review and temporarily restrict visibility
5. WHEN analyzing broker legitimacy THEN the system SHALL cross-reference regulatory licenses, business registrations, and historical data
6. WHEN fraud patterns are identified THEN the system SHALL learn from confirmed cases to improve future detection accuracy

#### Requirement 6: Bulk Analysis and Data Processing

**User Story:** As a data analyst, I want AI-powered bulk analysis capabilities to process large datasets of broker information, market data, and user interactions so that I can generate insights and improve platform recommendations.

##### Acceptance Criteria

1. WHEN large datasets are uploaded THEN the system SHALL efficiently process and analyze the data using appropriate AI models for the content type
2. WHEN market data is analyzed THEN the system SHALL identify trends, correlations, and anomalies that affect broker performance and user preferences
3. WHEN user interaction data is processed THEN the system SHALL generate insights about user behavior patterns and platform optimization opportunities
4. IF analysis reveals significant findings THEN the system SHALL generate automated reports with visualizations and actionable recommendations
5. WHEN bulk processing occurs THEN the system SHALL manage computational resources efficiently and provide progress updates for long-running tasks
6. WHEN analysis results are generated THEN they SHALL be stored in accessible formats for further analysis and integration with platform features

#### Requirement 7: AI Model Selection and Optimization

**User Story:** As a platform administrator, I want intelligent model selection that automatically chooses the best AI model for each task type so that we optimize for both performance and cost efficiency.

##### Acceptance Criteria

1. WHEN different AI tasks are requested THEN the system SHALL automatically select the most appropriate model based on task type, complexity, and performance requirements
2. WHEN model performance is evaluated THEN the system SHALL track accuracy, response time, and cost metrics for each model and task combination
3. WHEN new models become available THEN the system SHALL automatically test them against existing benchmarks and integrate them if they perform better
4. IF a model consistently underperforms THEN the system SHALL automatically demote it in the selection hierarchy and alert administrators
5. WHEN cost optimization is needed THEN the system SHALL balance model performance with usage costs to stay within budget constraints
6. WHEN model selection occurs THEN the system SHALL log decisions and performance metrics for continuous improvement and auditing

#### Requirement 8: Real-time AI Response Streaming

**User Story:** As a user, I want AI responses to stream in real-time so that I can see answers being generated and don't have to wait for complete responses before seeing any content.

##### Acceptance Criteria

1. WHEN users interact with the chatbot THEN responses SHALL stream in real-time with smooth, readable text flow
2. WHEN long responses are generated THEN users SHALL see progressive content updates without waiting for complete generation
3. WHEN streaming is interrupted THEN the system SHALL gracefully handle partial responses and allow users to retry or continue
4. IF network issues affect streaming THEN the system SHALL fall back to complete response delivery with appropriate user notifications
5. WHEN multiple users are active THEN the system SHALL manage concurrent streaming sessions without performance degradation
6. WHEN streaming responses THEN the system SHALL maintain proper formatting, markdown rendering, and interactive elements

#### Requirement 9: AI Usage Analytics and Monitoring

**User Story:** As a platform administrator, I want comprehensive analytics on AI usage patterns, costs, and performance so that I can optimize the AI integration and manage resources effectively.

##### Acceptance Criteria

1. WHEN AI services are used THEN the system SHALL track detailed metrics including request types, response times, token usage, and costs per provider
2. WHEN usage patterns are analyzed THEN the system SHALL identify peak usage times, popular features, and resource optimization opportunities
3. WHEN cost thresholds are approached THEN the system SHALL send alerts and automatically implement cost-saving measures like model switching
4. IF performance issues are detected THEN the system SHALL automatically adjust load balancing and provider selection to maintain service quality
5. WHEN generating reports THEN the system SHALL provide comprehensive dashboards showing AI performance, user satisfaction, and ROI metrics
6. WHEN anomalies are detected THEN the system SHALL alert administrators and provide detailed context for investigation

#### Requirement 10: Privacy and Security for AI Operations

**User Story:** As a user, I want assurance that my data is handled securely when processed by AI systems so that my privacy is protected and sensitive information remains confidential.

##### Acceptance Criteria

1. WHEN user data is sent to AI providers THEN it SHALL be encrypted in transit and processed according to privacy regulations (GDPR, CCPA)
2. WHEN personal information is included in AI requests THEN the system SHALL automatically sanitize or anonymize sensitive data before transmission
3. WHEN AI responses are cached THEN they SHALL be stored securely with appropriate access controls and automatic expiration
4. IF data breaches are detected THEN the system SHALL immediately isolate affected systems and notify users according to legal requirements
5. WHEN users request data deletion THEN the system SHALL remove all AI-processed data including cached responses and training data
6. WHEN audit trails are maintained THEN they SHALL track all AI operations while protecting user privacy and complying with data retention policies

---

# Homepage Integration Plan

## Requirements Document

### Introduction

The BrokerAnalysis platform has an SEO-optimized HomePage with comprehensive structured data and marketing sections, plus extensive implemented features across authentication, search, AI integration, profile management, and broker analysis. However, some features may not be fully integrated with the current SEO-optimized homepage. This specification outlines the integration of all existing features with the SEO-optimized HomePage to create a cohesive, fully-functional platform that leverages all previously developed capabilities while maintaining SEO benefits.

### Requirements

#### Requirement 1: Homepage Integration and Feature Restoration

**User Story:** As a platform user, I want access to all implemented features through a cohesive homepage experience so that I can utilize the full capabilities of the platform without missing functionality.

##### Acceptance Criteria

1. WHEN users visit the homepage THEN they SHALL see integration points for all major features including search, AI chatbot, user authentication, and broker comparison tools
2. WHEN the homepage loads THEN it SHALL dynamically display content based on user authentication status (logged in vs anonymous)
3. WHEN users interact with homepage elements THEN they SHALL be seamlessly directed to appropriate feature areas without broken links or missing components
4. IF features were previously accessible but are now missing THEN they SHALL be restored and properly integrated into the new homepage design
5. WHEN users navigate between homepage sections THEN all interactive elements SHALL function correctly with proper state management
6. WHEN the homepage renders THEN it SHALL include all necessary imports and component references to prevent runtime errors

#### Requirement 2: Authentication System Integration

**User Story:** As a user, I want seamless authentication integration on the homepage so that I can easily sign up, log in, and access personalized features without navigation friction.

##### Acceptance Criteria

1. WHEN users visit the homepage THEN they SHALL see clear authentication options (login/register) in the navigation or prominent locations
2. WHEN users are authenticated THEN the homepage SHALL display personalized content including saved searches, broker preferences, and account-specific recommendations
3. WHEN users log out THEN the homepage SHALL revert to anonymous user experience while maintaining all public functionality
4. IF authentication components are missing from the homepage THEN they SHALL be integrated using existing AuthContainer, LoginForm, and RegisterForm components
5. WHEN users complete authentication actions THEN they SHALL remain on or return to the homepage with updated user state
6. WHEN authentication errors occur THEN they SHALL be handled gracefully with user-friendly messaging on the homepage

#### Requirement 3: Advanced Search Integration

**User Story:** As a trader, I want powerful search functionality prominently featured on the homepage so that I can quickly find brokers matching my specific criteria without navigating to separate pages.

##### Acceptance Criteria

1. WHEN users access the homepage THEN they SHALL see a prominent search interface using the implemented SearchContainer component
2. WHEN users perform searches THEN they SHALL see real-time results with advanced filtering options using AdvancedFilterPanel
3. WHEN search results are displayed THEN they SHALL include saved search functionality and search history using SavedSearches component
4. IF the search system is not integrated THEN it SHALL be connected using existing SearchService, ElasticsearchService, and useSearch hook
5. WHEN users save searches THEN they SHALL be able to access them from the homepage for quick re-execution
6. WHEN search functionality is used THEN it SHALL leverage all implemented search types and broker data utilities

#### Requirement 4: AI-Powered Features Integration

**User Story:** As a user, I want AI-powered assistance and insights prominently available on the homepage so that I can get intelligent broker recommendations and instant help.

##### Acceptance Criteria

1. WHEN users visit the homepage THEN they SHALL see an accessible AI chatbot interface for instant broker guidance and platform assistance
2. WHEN AI features are activated THEN they SHALL use the implemented AIGateway with proper fallback between Groq and OpenRouter providers
3. WHEN users interact with AI features THEN they SHALL receive real-time streaming responses with proper error handling
4. IF AI components are missing from homepage THEN they SHALL be integrated using existing AI services and provider architecture
5. WHEN AI generates broker recommendations THEN they SHALL be displayed with proper context and source attribution
6. WHEN AI features are used THEN they SHALL track usage analytics and maintain cost optimization as implemented

#### Requirement 5: Broker Comparison and Analysis Integration

**User Story:** As a trader researching brokers, I want comprehensive comparison tools and analytics easily accessible from the homepage so that I can make informed decisions efficiently.

##### Acceptance Criteria

1. WHEN users access the homepage THEN they SHALL see featured broker comparisons using TopBrokerComparison and BrokerTable components
2. WHEN users want detailed analysis THEN they SHALL access broker analytics and insights through integrated comparison tools
3. WHEN broker data is displayed THEN it SHALL use real-time data from implemented external API services and data sync systems
4. IF comparison features are disconnected THEN they SHALL be restored using existing broker types, utilities, and service integrations
5. WHEN users compare brokers THEN they SHALL see comprehensive data including fees, spreads, regulations, and user reviews
6. WHEN comparison tools are used THEN they SHALL leverage all implemented broker data processing and caching systems

#### Requirement 6: User Profile and Personalization Integration

**User Story:** As a registered user, I want my profile preferences and trading experience to influence homepage content so that I receive personalized broker recommendations and relevant information.

##### Acceptance Criteria

1. WHEN authenticated users visit the homepage THEN it SHALL display personalized content based on their profile using UserProfile and related components
2. WHEN users have trading preferences set THEN the homepage SHALL show relevant broker recommendations and tailored content
3. WHEN users update their profiles THEN homepage personalization SHALL reflect changes immediately using the profileService
4. IF profile integration is missing THEN it SHALL be implemented using existing profile components and useProfile hook
5. WHEN users have trading experience data THEN the homepage SHALL provide appropriate broker suggestions and educational content
6. WHEN profile-based features are used THEN they SHALL maintain privacy settings and user preferences as implemented

#### Requirement 7: Real-time Data and External API Integration

**User Story:** As a user, I want current and accurate broker information on the homepage so that I can trust the data for making trading decisions.

##### Acceptance Criteria

1. WHEN the homepage loads THEN it SHALL display real-time broker data using implemented external API services
2. WHEN broker information is shown THEN it SHALL include current spreads, fees, and regulatory status from BrokerDataClient and related services
3. WHEN external APIs are unavailable THEN the homepage SHALL gracefully fall back to cached data using CacheService
4. IF real-time data integration is broken THEN it SHALL be restored using existing ExternalAPIService, DataSyncService, and JobQueue
5. WHEN data updates occur THEN the homepage SHALL reflect changes without requiring page refresh
6. WHEN data sync processes run THEN they SHALL update homepage content seamlessly in the background

#### Requirement 8: Mobile Responsiveness and Progressive Web App Features

**User Story:** As a mobile user, I want the integrated homepage to work seamlessly on my device so that I can access all features with optimal mobile experience.

##### Acceptance Criteria

1. WHEN users access the homepage on mobile devices THEN all integrated features SHALL be fully responsive and touch-optimized
2. WHEN mobile users interact with search, AI, and comparison features THEN they SHALL have the same functionality as desktop users
3. WHEN the homepage is accessed offline THEN cached content SHALL be available with appropriate offline indicators
4. IF mobile optimization is missing from integrated features THEN it SHALL be implemented following responsive design patterns
5. WHEN users install the PWA THEN the homepage SHALL serve as an effective app entry point with all features accessible
6. WHEN mobile-specific interactions are used THEN they SHALL integrate properly with all implemented services and components

#### Requirement 9: Performance Optimization and Caching

**User Story:** As a user, I want the integrated homepage to load quickly and perform smoothly so that I can efficiently access all platform features without delays.

##### Acceptance Criteria

1. WHEN the homepage loads THEN it SHALL optimize loading of all integrated components using lazy loading and code splitting where appropriate
2. WHEN multiple features are active THEN the homepage SHALL manage resources efficiently to maintain smooth performance
3. WHEN cached data is available THEN the homepage SHALL use it to improve load times while ensuring data freshness
4. IF performance issues exist with integrated features THEN they SHALL be optimized using existing caching and sync services
5. WHEN users navigate between homepage sections THEN transitions SHALL be smooth with minimal loading delays
6. WHEN resource-intensive features are used THEN they SHALL be optimized to prevent homepage performance degradation

#### Requirement 10: Testing and Quality Assurance Integration

**User Story:** As a developer, I want comprehensive testing coverage for all integrated homepage features so that the platform maintains reliability and quality.

##### Acceptance Criteria

1. WHEN homepage integration is complete THEN all features SHALL have corresponding test coverage using existing test suites
2. WHEN integrated components are tested THEN they SHALL use existing test utilities and mock implementations
3. WHEN end-to-end testing is performed THEN it SHALL cover complete user journeys through integrated homepage features
4. IF test coverage is missing for integrated features THEN it SHALL be implemented using existing testing patterns and frameworks
5. WHEN tests are run THEN they SHALL validate proper integration between homepage and all connected services
6. WHEN quality checks are performed THEN they SHALL ensure all integrated features meet existing code quality standards

---

## Implementation Guidelines

### AI Integration System Tasks

1. **Set up AI service foundation and provider infrastructure**
   - Create core AI service interfaces and abstract classes for provider management
   - Implement configuration system for multiple AI providers with API keys and model mappings
   - Set up error handling framework with retry logic and fallback mechanisms

2. **Implement Groq provider integration**
   - Create Groq provider class with SDK integration
   - Implement Groq streaming capabilities
   - Add Groq rate limiting and cost tracking

3. **Implement OpenRouter provider integration**
   - Create OpenRouter provider with multiple API key support
   - Implement OpenRouter model selection and routing
   - Add OpenRouter streaming and multimodal support

4. **Create AI Gateway service with provider management**
   - Implement central AI Gateway class
   - Add intelligent fallback and retry mechanisms
   - Implement cost optimization and budget management

5. **Build chatbot service and UI components**
   - Create chatbot backend service
   - Build React chatbot UI components
   - Integrate chatbot with broker data and user context

6. **Implement content summarization system**
   - Create summarization service with multiple content types
   - Build summarization UI components
   - Integrate summarization with existing content systems

7. **Build RAG (Retrieval-Augmented Generation) system**
   - Set up vector database and document processing
   - Implement RAG query and retrieval system
   - Integrate RAG with chatbot and knowledge base

8. **Create fraud detection and risk analysis system**
   - Implement broker fraud detection service
   - Build review authenticity detection
   - Create fraud detection dashboard and alerts

9. **Implement bulk analysis and data processing system**
   - Create bulk data processing service
   - Build market data analysis capabilities
   - Create bulk analysis reporting and visualization

10. **Add comprehensive monitoring and analytics**
    - Implement AI usage tracking and metrics
    - Build cost management and optimization system
    - Add health monitoring and alerting

11. **Implement security and privacy measures**
    - Add data privacy and security controls
    - Build audit logging and compliance system
    - Add user data protection and anonymization

12. **Create comprehensive testing suite**
    - Build unit tests for AI services
    - Implement integration tests for AI workflows
    - Add AI quality and accuracy testing

13. **Deploy and configure production environment**
    - Set up production AI service infrastructure
    - Configure AI provider credentials and limits
    - Perform production testing and optimization

### Homepage Integration Tasks

1. **Homepage Integration Foundation**
   - Create homepage integration context and providers
   - Implement homepage state management architecture
   - Set up error boundaries and fallback components

2. **Authentication System Integration**
   - Integrate authentication components with homepage
   - Implement personalized content rendering
   - Add authentication modals and flows

3. **Search System Integration**
   - Create homepage search container component
   - Integrate advanced search functionality
   - Implement saved searches and search history

4. **AI Integration Implementation**
   - Create homepage AI assistant component
   - Implement AI-powered broker recommendations
   - Add AI cost tracking and provider fallback

5. **Broker Comparison Enhancement**
   - Enhance TopBrokerComparison with real-time data
   - Add interactive comparison features
   - Integrate broker analytics and insights

6. **User Profile and Personalization**
   - Integrate user profile components
   - Implement preference-based customization
   - Add privacy and notification settings integration

7. **Real-time Data Integration**
   - Connect external API services to homepage
   - Implement data synchronization and caching
   - Add real-time updates and notifications

8. **Mobile Optimization and PWA Features**
   - Optimize all integrated features for mobile
   - Implement PWA functionality
   - Add mobile-specific features

9. **Performance Optimization**
   - Implement lazy loading and code splitting
   - Optimize caching and resource management
   - Add performance monitoring and optimization

10. **Testing and Quality Assurance**
    - Create comprehensive unit tests
    - Implement integration testing
    - Add end-to-end testing coverage

11. **Deployment and Monitoring**
    - Set up feature flags and gradual rollout
    - Implement monitoring and analytics
    - Complete integration testing and validation

---

## Technical Standards

### Code Quality Requirements
- TypeScript strict mode enabled
- ESLint and Prettier configuration enforced
- Minimum 90% test coverage for new features
- Component documentation with JSDoc
- Error boundaries for all major feature areas

### Performance Standards
- Lighthouse scores >90 for all metrics
- First Contentful Paint <1.5s
- Largest Contentful Paint <2.5s
- Cumulative Layout Shift <0.1
- First Input Delay <100ms

### Security Requirements
- All user inputs sanitized and validated
- Secure API key storage and rotation
- GDPR/CCPA compliance for data handling
- Encryption for sensitive data in transit and at rest
- Regular security audits and vulnerability assessments

### Accessibility Standards
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios >4.5:1
- Focus management and ARIA labels

This document serves as the comprehensive guide for all development work on the BrokerAnalysis platform, ensuring consistency, quality, and adherence to project requirements across all features and integrations.