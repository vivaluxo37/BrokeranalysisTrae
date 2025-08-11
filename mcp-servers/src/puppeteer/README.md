# Puppeteer MCP Server

A Model Context Protocol (MCP) server that provides web automation capabilities using Puppeteer.

## Features

- **Browser Management**: Launch and manage browser instances
- **Navigation**: Navigate to URLs with various wait conditions
- **Screenshots**: Capture full page or viewport screenshots
- **Content Extraction**: Get page HTML content
- **User Interactions**: Click elements and type text
- **JavaScript Execution**: Run custom JavaScript in page context
- **Multi-page Support**: Manage multiple browser pages

## Installation

```bash
npm install
npm run build
```

## Usage

### As MCP Server

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "node",
      "args": ["path/to/puppeteer-mcp-server/index.js"]
    }
  }
}
```

### Available Tools

#### `puppeteer_launch`
Launch a new browser instance.

**Parameters:**
- `headless` (boolean, optional): Run in headless mode (default: true)
- `viewport` (object, optional): Set viewport dimensions
  - `width` (number): Viewport width (default: 1280)
  - `height` (number): Viewport height (default: 720)

#### `puppeteer_navigate`
Navigate to a URL.

**Parameters:**
- `url` (string, required): URL to navigate to
- `pageId` (string, optional): Page identifier (default: 'default')
- `waitUntil` (string, optional): Wait condition ('load', 'domcontentloaded', 'networkidle0', 'networkidle2')

#### `puppeteer_screenshot`
Take a screenshot of the current page.

**Parameters:**
- `pageId` (string, optional): Page identifier (default: 'default')
- `fullPage` (boolean, optional): Capture full page (default: false)
- `format` (string, optional): Image format ('png', 'jpeg')

#### `puppeteer_get_content`
Get the HTML content of the page.

**Parameters:**
- `pageId` (string, optional): Page identifier (default: 'default')

#### `puppeteer_click`
Click an element on the page.

**Parameters:**
- `selector` (string, required): CSS selector for the element
- `pageId` (string, optional): Page identifier (default: 'default')

#### `puppeteer_type`
Type text into an input field.

**Parameters:**
- `selector` (string, required): CSS selector for the input element
- `text` (string, required): Text to type
- `pageId` (string, optional): Page identifier (default: 'default')

#### `puppeteer_evaluate`
Execute JavaScript in the page context.

**Parameters:**
- `script` (string, required): JavaScript code to execute
- `pageId` (string, optional): Page identifier (default: 'default')

#### `puppeteer_close`
Close the browser and cleanup resources.

## Example Usage

1. **Launch Browser**:
   ```json
   {
     "tool": "puppeteer_launch",
     "arguments": {
       "headless": false,
       "viewport": {
         "width": 1920,
         "height": 1080
       }
     }
   }
   ```

2. **Navigate to Website**:
   ```json
   {
     "tool": "puppeteer_navigate",
     "arguments": {
       "url": "https://example.com",
       "waitUntil": "networkidle0"
     }
   }
   ```

3. **Take Screenshot**:
   ```json
   {
     "tool": "puppeteer_screenshot",
     "arguments": {
       "fullPage": true,
       "format": "png"
     }
   }
   ```

4. **Interact with Elements**:
   ```json
   {
     "tool": "puppeteer_click",
     "arguments": {
       "selector": "#submit-button"
     }
   }
   ```

5. **Extract Data**:
   ```json
   {
     "tool": "puppeteer_evaluate",
     "arguments": {
       "script": "document.title"
     }
   }
   ```

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode
npm run dev

# Start the server
npm start
```

## Security Considerations

- The server runs Puppeteer with `--no-sandbox` and `--disable-setuid-sandbox` flags for compatibility
- Be cautious when executing arbitrary JavaScript code
- Consider running in a containerized environment for production use
- Validate and sanitize all input parameters

## Error Handling

The server includes comprehensive error handling:
- Invalid selectors will throw descriptive errors
- Page not found errors are handled gracefully
- Browser crashes are detected and reported
- Cleanup is performed on process termination

## License

MIT License