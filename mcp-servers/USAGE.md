# MCP Servers Usage Guide

This document provides instructions for using the Model Context Protocol (MCP) servers integrated into the BrokerAnalysis platform.

## Available Servers

### 1. Puppeteer MCP Server

The Puppeteer MCP server provides web automation capabilities for browser control, content extraction, and testing.

#### Installation and Setup

```bash
# Install dependencies for the Puppeteer MCP server
npm run mcp:install

# Build the TypeScript code
npm run mcp:build

# Start the server
npm run mcp:start

# Or run in development mode with hot reload
npm run mcp:dev
```

#### Configuration

The MCP servers are configured in `mcp-servers/config.json`. You can modify this file to adjust server settings:

```json
{
  "mcpServers": {
    "puppeteer": {
      "name": "Puppeteer Web Automation",
      "command": "node",
      "args": ["./src/puppeteer/index.js"],
      "cwd": "./mcp-servers"
    }
  }
}
```

## Use Cases for BrokerAnalysis Platform

### 1. Automated Broker Website Testing

```javascript
// Example: Test broker website responsiveness
const testBrokerWebsite = async (brokerUrl) => {
  // Launch browser
  await mcpClient.callTool('puppeteer_launch', {
    headless: false,
    viewport: { width: 1920, height: 1080 }
  });
  
  // Navigate to broker website
  await mcpClient.callTool('puppeteer_navigate', {
    url: brokerUrl,
    waitUntil: 'networkidle0'
  });
  
  // Take screenshot for review
  await mcpClient.callTool('puppeteer_screenshot', {
    fullPage: true,
    format: 'png'
  });
  
  // Check if trading platform link exists
  const result = await mcpClient.callTool('puppeteer_evaluate', {
    script: `
      const tradingLink = document.querySelector('a[href*="trading"], a[href*="platform"]');
      return tradingLink ? tradingLink.href : null;
    `
  });
  
  return result;
};
```

### 2. Broker Data Extraction

```javascript
// Example: Extract broker information from their website
const extractBrokerData = async (brokerUrl) => {
  await mcpClient.callTool('puppeteer_launch', { headless: true });
  await mcpClient.callTool('puppeteer_navigate', { url: brokerUrl });
  
  // Extract key information
  const brokerInfo = await mcpClient.callTool('puppeteer_evaluate', {
    script: `
      const extractInfo = () => {
        const title = document.title;
        const description = document.querySelector('meta[name="description"]')?.content;
        const spreads = Array.from(document.querySelectorAll('*'))
          .filter(el => el.textContent.toLowerCase().includes('spread'))
          .map(el => el.textContent.trim())
          .slice(0, 3);
        
        return {
          title,
          description,
          spreads,
          url: window.location.href
        };
      };
      
      return extractInfo();
    `
  });
  
  return brokerInfo;
};
```

### 3. Automated Form Testing

```javascript
// Example: Test broker registration forms
const testRegistrationForm = async (brokerUrl) => {
  await mcpClient.callTool('puppeteer_launch', { headless: false });
  await mcpClient.callTool('puppeteer_navigate', { url: brokerUrl });
  
  // Find and click registration button
  await mcpClient.callTool('puppeteer_click', {
    selector: 'a[href*="register"], button[class*="register"], .signup-btn'
  });
  
  // Fill out test form data
  await mcpClient.callTool('puppeteer_type', {
    selector: 'input[name="email"], input[type="email"]',
    text: 'test@example.com'
  });
  
  await mcpClient.callTool('puppeteer_type', {
    selector: 'input[name="firstName"], input[placeholder*="first"]',
    text: 'Test'
  });
  
  // Take screenshot of form
  await mcpClient.callTool('puppeteer_screenshot', {
    fullPage: false,
    format: 'png'
  });
  
  // Check form validation
  const validation = await mcpClient.callTool('puppeteer_evaluate', {
    script: `
      const form = document.querySelector('form');
      const requiredFields = form.querySelectorAll('[required]');
      return {
        totalFields: form.elements.length,
        requiredFields: requiredFields.length,
        hasValidation: form.checkValidity !== undefined
      };
    `
  });
  
  return validation;
};
```

### 4. Performance Monitoring

```javascript
// Example: Monitor broker website performance
const monitorPerformance = async (brokerUrl) => {
  await mcpClient.callTool('puppeteer_launch', { headless: true });
  
  const startTime = Date.now();
  await mcpClient.callTool('puppeteer_navigate', {
    url: brokerUrl,
    waitUntil: 'networkidle0'
  });
  const loadTime = Date.now() - startTime;
  
  // Get performance metrics
  const metrics = await mcpClient.callTool('puppeteer_evaluate', {
    script: `
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: ${loadTime},
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        resourceCount: performance.getEntriesByType('resource').length
      };
    `
  });
  
  return metrics;
};
```

## Integration with AI Content Generator

The Puppeteer MCP server can be integrated with the AI content generator to:

1. **Automated Content Verification**: Verify that generated broker content matches actual broker websites
2. **Screenshot Generation**: Capture broker platform screenshots for content enhancement
3. **Data Validation**: Cross-check generated broker data with live website information
4. **SEO Testing**: Test generated pages for SEO compliance and performance

## Security Considerations

1. **Sandbox Environment**: Run Puppeteer in a sandboxed environment for security
2. **Rate Limiting**: Implement rate limiting to avoid overwhelming broker websites
3. **User Agent**: Use appropriate user agents to identify automated requests
4. **Respect robots.txt**: Check and respect website crawling policies
5. **Data Privacy**: Ensure no sensitive user data is captured or stored

## Troubleshooting

### Common Issues

1. **Browser Launch Fails**:
   ```bash
   # Install required dependencies
   npm run mcp:install
   
   # Rebuild the server
   npm run mcp:build
   ```

2. **Permission Errors**:
   - Ensure proper file permissions for the mcp-servers directory
   - Run with appropriate user privileges

3. **Network Issues**:
   - Check firewall settings
   - Verify internet connectivity
   - Consider proxy configuration if needed

### Debug Mode

Run the server in development mode for detailed logging:

```bash
npm run mcp:dev
```

## Performance Tips

1. **Use Headless Mode**: For production, always use headless mode for better performance
2. **Optimize Viewport**: Set appropriate viewport sizes for your use case
3. **Resource Management**: Close browsers and pages when done to free memory
4. **Concurrent Limits**: Limit concurrent browser instances to avoid resource exhaustion

## Next Steps

1. Integrate with the main BrokerAnalysis application
2. Create automated testing workflows
3. Implement monitoring dashboards
4. Add more specialized tools for broker analysis
5. Set up CI/CD pipelines for automated testing