# MCP Server Utilization Strategy

## Always-Active MCP Integration

For every user query, task, or prompt, you MUST actively consider and utilize the available MCP servers to provide the most comprehensive and effective assistance possible.

## Available MCP Servers

### 1. Context7 (`context7`)
- **Purpose**: Access up-to-date documentation and code examples
- **When to use**: For any technical questions, library research, or implementation guidance
- **Always consider**: Resolving library IDs and fetching current documentation

### 2. Playwright (`playwright`)
- **Purpose**: Browser automation and web testing
- **When to use**: Web scraping, testing, UI automation, taking screenshots
- **Always consider**: Any task involving web interaction or browser-based testing

### 3. Think MCP (`think-mcp`)
- **Purpose**: Structured thinking and reasoning
- **When to use**: Complex problem-solving, analysis, decision-making
- **Always consider**: Breaking down complex tasks into logical steps

### 4. Puppeteer MCP Claude (`puppeteer-mcp-claude`)
- **Purpose**: Advanced browser automation and web interaction
- **When to use**: Web scraping, form filling, dynamic content interaction
- **Always consider**: Alternative to Playwright for browser automation tasks

### 5. Sequential Thinking Tools (`mcp-sequentialthinking-tools`)
- **Purpose**: Guided problem-solving with tool recommendations
- **When to use**: Multi-step problems, tool selection guidance, complex workflows
- **Always consider**: For any task that could benefit from structured approach

## Mandatory Integration Rules

### For Every User Request:

1. **Initial Assessment**: Use Sequential Thinking Tools to break down the request and recommend appropriate MCP tools
2. **Research Phase**: Use Context7 to gather current, accurate information about relevant technologies
3. **Implementation Phase**: Use appropriate automation tools (Playwright/Puppeteer) for any web-related tasks
4. **Reasoning Phase**: Use Think MCP for complex decision-making or analysis
5. **Validation Phase**: Use browser automation to test or verify implementations when applicable

### Specific Scenarios:

#### Code/Technical Questions
- **ALWAYS** use Context7 to get latest documentation
- Use Sequential Thinking Tools to structure the solution approach
- Use Think MCP for complex architectural decisions

#### Web-Related Tasks
- **ALWAYS** consider Playwright or Puppeteer for automation
- Use Context7 for web technology documentation
- Use Sequential Thinking Tools to plan automation workflows

#### Problem-Solving Tasks
- **ALWAYS** start with Sequential Thinking Tools for structured approach
- Use Think MCP for complex reasoning
- Use Context7 for researching solution patterns

#### Data Analysis or Research
- Use Context7 for current information and best practices
- Use Sequential Thinking Tools to structure the analysis
- Use browser automation for data collection when needed

## Implementation Guidelines

### Before Starting Any Task:
1. Identify which MCP servers could contribute to the solution
2. Use Sequential Thinking Tools to create a structured approach
3. Plan how each MCP server will be utilized throughout the process

### During Task Execution:
- Actively use multiple MCP servers in combination
- Don't just mention tools - actually invoke them
- Cross-reference information from different sources

### Quality Assurance:
- Use browser automation to verify web-based implementations
- Use Context7 to validate against current best practices
- Use thinking tools to ensure comprehensive coverage

## Prohibited Behaviors

- **NEVER** provide answers without consulting relevant MCP servers
- **NEVER** rely solely on training data when current information is available via Context7
- **NEVER** skip browser automation when web interaction could improve the solution
- **NEVER** provide unstructured solutions when Sequential Thinking Tools could add value

## Success Metrics

A successful response should demonstrate:
- Active use of 2+ MCP servers when relevant
- Current, accurate information from Context7
- Structured problem-solving approach
- Practical, tested solutions using automation tools
- Comprehensive coverage of the user's needs

## Examples of Proper Integration

### User asks: "How do I implement authentication in Next.js?"
1. Use Sequential Thinking Tools to structure the approach
2. Use Context7 to get current Next.js authentication documentation
3. Use Context7 to research popular auth libraries
4. Use browser automation to test implementation if creating examples
5. Use Think MCP to evaluate different approaches

### User asks: "Help me scrape data from a website"
1. Use Sequential Thinking Tools to plan the scraping strategy
2. Use Context7 to research current web scraping best practices
3. Use Puppeteer/Playwright to implement and test the scraping
4. Use Think MCP to handle edge cases and error scenarios

This approach ensures maximum value delivery by leveraging all available capabilities for every user interaction.