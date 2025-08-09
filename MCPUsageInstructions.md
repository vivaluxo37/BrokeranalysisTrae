# Warp Agent MCP Usage Instructions

The following MCP servers are available and should be used for specific tasks. The Warp agent should utilize these MCP servers for enhanced functionality:

## Core MCP Servers
- **Everything**: Handles all comprehensive protocol tasks
- **Fetch**: Used for HTTP requests and API interactions
- **Filesystem**: Manages file-related operations
- **Git**: Used for version control tasks
- **Memory**: Manages in-memory operations and temporary data
- **SequentialThinking**: Helps in tasks requiring ordered and logical progression
- **Time**: Manages operations related to date-time manipulations

## Browser Automation MCP Servers
- **@playwright/mcp**: Official Playwright MCP server for browser automation, web scraping, and testing
- **@ejazullah/playwright-mcp-server**: Advanced Playwright MCP server with dynamic CDP endpoint support
- **playwright-mcp-advanced**: Advanced Playwright tools with additional features for complex automation tasks

## Context Management MCP Servers
- **@upstash/context7-mcp**: Context7 MCP server for advanced context management and AI interactions

## Usage Guidelines for Warp Agent

**IMPORTANT**: The Warp agent should automatically utilize these MCP servers for the following tasks:

1. **Web Automation & Testing**: Use Playwright MCP servers for:
   - Browser automation
   - Web scraping
   - UI testing
   - Screenshot capture
   - Form filling
   - Navigation tasks

2. **Context Management**: Use Context7 MCP for:
   - Managing conversation context
   - Maintaining state across interactions
   - Advanced AI context handling

3. **File Operations**: Use Filesystem MCP for:
   - Reading/writing files
   - Directory operations
   - File system navigation

4. **HTTP Requests**: Use Fetch MCP for:
   - API calls
   - Web requests
   - Data retrieval

5. **Version Control**: Use Git MCP for:
   - Repository operations
   - Commit management
   - Branch operations

6. **Sequential Tasks**: Use SequentialThinking MCP for:
   - Complex multi-step operations
   - Logical task progression
   - Structured problem solving

**Note**: Ensure all MCP servers are installed and running before executing tasks. The agent should automatically detect and utilize appropriate MCP servers based on the task requirements.
