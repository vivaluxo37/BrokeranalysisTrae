#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import puppeteer, { Browser, Page } from 'puppeteer';

class PuppeteerMCPServer {
  private server: Server;
  private browser: Browser | null = null;
  private pages: Map<string, Page> = new Map();

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

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.cleanup();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'puppeteer_launch',
            description: 'Launch a new browser instance',
            inputSchema: {
              type: 'object',
              properties: {
                headless: {
                  type: 'boolean',
                  description: 'Run browser in headless mode',
                  default: true,
                },
                viewport: {
                  type: 'object',
                  properties: {
                    width: { type: 'number', default: 1280 },
                    height: { type: 'number', default: 720 },
                  },
                },
              },
            },
          },
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
                pageId: {
                  type: 'string',
                  description: 'Page identifier (optional, uses default if not provided)',
                  default: 'default',
                },
                waitUntil: {
                  type: 'string',
                  enum: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
                  default: 'load',
                },
              },
              required: ['url'],
            },
          },
          {
            name: 'puppeteer_screenshot',
            description: 'Take a screenshot of the current page',
            inputSchema: {
              type: 'object',
              properties: {
                pageId: {
                  type: 'string',
                  description: 'Page identifier',
                  default: 'default',
                },
                fullPage: {
                  type: 'boolean',
                  description: 'Capture full page',
                  default: false,
                },
                format: {
                  type: 'string',
                  enum: ['png', 'jpeg'],
                  default: 'png',
                },
              },
            },
          },
          {
            name: 'puppeteer_get_content',
            description: 'Get page content (HTML)',
            inputSchema: {
              type: 'object',
              properties: {
                pageId: {
                  type: 'string',
                  description: 'Page identifier',
                  default: 'default',
                },
              },
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
                  description: 'CSS selector for the element to click',
                },
                pageId: {
                  type: 'string',
                  description: 'Page identifier',
                  default: 'default',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'puppeteer_type',
            description: 'Type text into an input field',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the input element',
                },
                text: {
                  type: 'string',
                  description: 'Text to type',
                },
                pageId: {
                  type: 'string',
                  description: 'Page identifier',
                  default: 'default',
                },
              },
              required: ['selector', 'text'],
            },
          },
          {
            name: 'puppeteer_evaluate',
            description: 'Execute JavaScript in the page context',
            inputSchema: {
              type: 'object',
              properties: {
                script: {
                  type: 'string',
                  description: 'JavaScript code to execute',
                },
                pageId: {
                  type: 'string',
                  description: 'Page identifier',
                  default: 'default',
                },
              },
              required: ['script'],
            },
          },
          {
            name: 'puppeteer_close',
            description: 'Close browser and cleanup',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'puppeteer_launch':
            return await this.launchBrowser(args);
          case 'puppeteer_navigate':
            return await this.navigate(args);
          case 'puppeteer_screenshot':
            return await this.screenshot(args);
          case 'puppeteer_get_content':
            return await this.getContent(args);
          case 'puppeteer_click':
            return await this.click(args);
          case 'puppeteer_type':
            return await this.type(args);
          case 'puppeteer_evaluate':
            return await this.evaluate(args);
          case 'puppeteer_close':
            return await this.close();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  private async launchBrowser(args: any) {
    if (this.browser) {
      await this.browser.close();
    }

    this.browser = await puppeteer.launch({
      headless: args.headless ?? true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await this.browser.newPage();
    
    if (args.viewport) {
      await page.setViewport({
        width: args.viewport.width || 1280,
        height: args.viewport.height || 720,
      });
    }

    this.pages.set('default', page);

    return {
      content: [
        {
          type: 'text',
          text: 'Browser launched successfully',
        },
      ],
    };
  }

  private async navigate(args: any) {
    const page = this.getPage(args.pageId || 'default');
    await page.goto(args.url, { waitUntil: args.waitUntil || 'load' });

    return {
      content: [
        {
          type: 'text',
          text: `Navigated to ${args.url}`,
        },
      ],
    };
  }

  private async screenshot(args: any) {
    const page = this.getPage(args.pageId || 'default');
    const screenshot = await page.screenshot({
      fullPage: args.fullPage || false,
      type: args.format || 'png',
      encoding: 'base64',
    });

    return {
      content: [
        {
          type: 'text',
          text: `Screenshot taken (${args.format || 'png'} format)`,
        },
        {
          type: 'image',
          data: screenshot as string,
          mimeType: `image/${args.format || 'png'}`,
        },
      ],
    };
  }

  private async getContent(args: any) {
    const page = this.getPage(args.pageId || 'default');
    const content = await page.content();

    return {
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  }

  private async click(args: any) {
    const page = this.getPage(args.pageId || 'default');
    await page.click(args.selector);

    return {
      content: [
        {
          type: 'text',
          text: `Clicked element: ${args.selector}`,
        },
      ],
    };
  }

  private async type(args: any) {
    const page = this.getPage(args.pageId || 'default');
    await page.type(args.selector, args.text);

    return {
      content: [
        {
          type: 'text',
          text: `Typed text into ${args.selector}`,
        },
      ],
    };
  }

  private async evaluate(args: any) {
    const page = this.getPage(args.pageId || 'default');
    const result = await page.evaluate(args.script);

    return {
      content: [
        {
          type: 'text',
          text: `Script result: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }

  private async close() {
    await this.cleanup();

    return {
      content: [
        {
          type: 'text',
          text: 'Browser closed successfully',
        },
      ],
    };
  }

  private getPage(pageId: string): Page {
    const page = this.pages.get(pageId);
    if (!page) {
      throw new Error(`Page not found: ${pageId}`);
    }
    return page;
  }

  private async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    this.pages.clear();
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Puppeteer MCP server running on stdio');
  }
}

const server = new PuppeteerMCPServer();
server.run().catch(console.error);