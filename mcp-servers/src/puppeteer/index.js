#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import puppeteer from 'puppeteer';

class PuppeteerMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'puppeteer-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.browser = null;
    this.pages = new Map();
    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.cleanup();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'puppeteer_navigate',
            description: 'Navigate to a URL',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL to navigate to',
                },
                launchOptions: {
                  type: 'object',
                  description: 'PuppeteerJS LaunchOptions. Default null. If changed and not null, browser restarts. Example: { headless: true, args: ["--no-sandbox"] }',
                },
                allowDangerous: {
                  type: 'boolean',
                  description: 'Allow dangerous LaunchOptions that reduce security. When false, dangerous args like --no-sandbox will throw errors. Default false.',
                },
              },
              required: ['url'],
            },
          },
          {
            name: 'puppeteer_screenshot',
            description: 'Take a screenshot of the current page or a specific element',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name for the screenshot',
                },
                selector: {
                  type: 'string',
                  description: 'CSS selector for element to screenshot',
                },
                width: {
                  type: 'number',
                  description: 'Width in pixels (default: 800)',
                },
                height: {
                  type: 'number',
                  description: 'Height in pixels (default: 600)',
                },
                encoded: {
                  type: 'boolean',
                  description: 'If true, capture the screenshot as a base64-encoded data URI (as text) instead of binary image content. Default false.',
                },
              },
              required: ['name'],
            },
          },
          {
            name: 'puppeteer_click',
            description: 'Click an element on the page',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for element to click',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'puppeteer_fill',
            description: 'Fill out an input field',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for input field',
                },
                value: {
                  type: 'string',
                  description: 'Value to fill',
                },
              },
              required: ['selector', 'value'],
            },
          },
          {
            name: 'puppeteer_select',
            description: 'Select an element on the page with Select tag',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for element to select',
                },
                value: {
                  type: 'string',
                  description: 'Value to select',
                },
              },
              required: ['selector', 'value'],
            },
          },
          {
            name: 'puppeteer_hover',
            description: 'Hover an element on the page',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for element to hover',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'puppeteer_evaluate',
            description: 'Execute JavaScript in the browser console',
            inputSchema: {
              type: 'object',
              properties: {
                script: {
                  type: 'string',
                  description: 'JavaScript code to execute',
                },
              },
              required: ['script'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'puppeteer_navigate':
            return await this.navigate(args.url, args.launchOptions, args.allowDangerous);
          case 'puppeteer_screenshot':
            return await this.screenshot(args.name, args.selector, args.width, args.height, args.encoded);
          case 'puppeteer_click':
            return await this.click(args.selector);
          case 'puppeteer_fill':
            return await this.fill(args.selector, args.value);
          case 'puppeteer_select':
            return await this.select(args.selector, args.value);
          case 'puppeteer_hover':
            return await this.hover(args.selector);
          case 'puppeteer_evaluate':
            return await this.evaluate(args.script);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async ensureBrowser(launchOptions = null, allowDangerous = false) {
    if (!this.browser || launchOptions) {
      if (this.browser) {
        await this.browser.close();
      }

      const options = launchOptions || { headless: true };
      
      if (!allowDangerous && options.args) {
        const dangerousArgs = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];
        const hasDangerous = options.args.some(arg => dangerousArgs.includes(arg));
        if (hasDangerous) {
          throw new Error('Dangerous launch options detected. Set allowDangerous to true if you want to use them.');
        }
      }

      this.browser = await puppeteer.launch(options);
    }
  }

  async ensurePage() {
    await this.ensureBrowser();
    if (!this.currentPage || this.currentPage.isClosed()) {
      this.currentPage = await this.browser.newPage();
    }
    return this.currentPage;
  }

  async navigate(url, launchOptions, allowDangerous) {
    await this.ensureBrowser(launchOptions, allowDangerous);
    const page = await this.ensurePage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully navigated to ${url}`,
        },
      ],
    };
  }

  async screenshot(name, selector, width = 800, height = 600, encoded = false) {
    const page = await this.ensurePage();
    await page.setViewport({ width, height });
    
    let screenshotOptions = { type: 'png' };
    
    if (selector) {
      const element = await page.$(selector);
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
      screenshotOptions.clip = await element.boundingBox();
    }
    
    if (encoded) {
      screenshotOptions.encoding = 'base64';
      const screenshot = await page.screenshot(screenshotOptions);
      return {
        content: [
          {
            type: 'text',
            text: `data:image/png;base64,${screenshot}`,
          },
        ],
      };
    } else {
      const screenshot = await page.screenshot(screenshotOptions);
      return {
        content: [
          {
            type: 'image',
            data: screenshot.toString('base64'),
            mimeType: 'image/png',
          },
        ],
      };
    }
  }

  async click(selector) {
    const page = await this.ensurePage();
    await page.click(selector);
    
    return {
      content: [
        {
          type: 'text',
          text: `Clicked element: ${selector}`,
        },
      ],
    };
  }

  async fill(selector, value) {
    const page = await this.ensurePage();
    await page.type(selector, value);
    
    return {
      content: [
        {
          type: 'text',
          text: `Filled ${selector} with: ${value}`,
        },
      ],
    };
  }

  async select(selector, value) {
    const page = await this.ensurePage();
    await page.select(selector, value);
    
    return {
      content: [
        {
          type: 'text',
          text: `Selected ${value} in ${selector}`,
        },
      ],
    };
  }

  async hover(selector) {
    const page = await this.ensurePage();
    await page.hover(selector);
    
    return {
      content: [
        {
          type: 'text',
          text: `Hovered over element: ${selector}`,
        },
      ],
    };
  }

  async evaluate(script) {
    const page = await this.ensurePage();
    const result = await page.evaluate(script);
    
    return {
      content: [
        {
          type: 'text',
          text: `Script result: ${JSON.stringify(result)}`,
        },
      ],
    };
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Puppeteer MCP server running on stdio');
  }
}

const server = new PuppeteerMCPServer();
server.run().catch(console.error);