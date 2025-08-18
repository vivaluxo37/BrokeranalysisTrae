#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import FirecrawlApp from '@mendable/firecrawl-js';

class FirecrawlMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'firecrawl-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.firecrawl = null;
    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      process.exit(0);
    });
  }

  initializeFirecrawl(apiKey) {
    if (!this.firecrawl || this.currentApiKey !== apiKey) {
      this.firecrawl = new FirecrawlApp({ apiKey });
      this.currentApiKey = apiKey;
    }
    return this.firecrawl;
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'firecrawl_scrape',
            description: 'Scrape a single URL and extract its content',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL to scrape',
                },
                apiKey: {
                  type: 'string',
                  description: 'Firecrawl API key',
                },
                formats: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['markdown', 'html', 'rawHtml', 'content', 'links', 'screenshot']
                  },
                  description: 'Output formats to include (default: ["markdown", "content"])',
                  default: ['markdown', 'content']
                },
                includeTags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'HTML tags to include in extraction'
                },
                excludeTags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'HTML tags to exclude from extraction'
                },
                onlyMainContent: {
                  type: 'boolean',
                  description: 'Extract only main content, removing headers, navs, footers, etc.',
                  default: true
                },
                waitFor: {
                  type: 'integer',
                  description: 'Time to wait before scraping (in milliseconds)',
                  minimum: 0,
                  maximum: 30000
                }
              },
              required: ['url', 'apiKey']
            }
          },
          {
            name: 'firecrawl_crawl',
            description: 'Crawl a website starting from a URL and extract content from multiple pages',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'Starting URL to crawl'
                },
                apiKey: {
                  type: 'string',
                  description: 'Firecrawl API key'
                },
                includes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'URL patterns to include (glob patterns)'
                },
                excludes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'URL patterns to exclude (glob patterns)'
                },
                maxDepth: {
                  type: 'integer',
                  description: 'Maximum crawl depth',
                  minimum: 1,
                  maximum: 10,
                  default: 2
                },
                limit: {
                  type: 'integer',
                  description: 'Maximum number of pages to crawl',
                  minimum: 1,
                  maximum: 1000,
                  default: 100
                },
                formats: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['markdown', 'html', 'rawHtml', 'content', 'links']
                  },
                  description: 'Output formats to include',
                  default: ['markdown', 'content']
                },
                onlyMainContent: {
                  type: 'boolean',
                  description: 'Extract only main content',
                  default: true
                }
              },
              required: ['url', 'apiKey']
            }
          },
          {
            name: 'firecrawl_search',
            description: 'Search the web and scrape results',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query'
                },
                apiKey: {
                  type: 'string',
                  description: 'Firecrawl API key'
                },
                limit: {
                  type: 'integer',
                  description: 'Maximum number of search results to return',
                  minimum: 1,
                  maximum: 20,
                  default: 10
                },
                formats: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['markdown', 'html', 'rawHtml', 'content', 'links']
                  },
                  description: 'Output formats to include',
                  default: ['markdown', 'content']
                },
                onlyMainContent: {
                  type: 'boolean',
                  description: 'Extract only main content',
                  default: true
                }
              },
              required: ['query', 'apiKey']
            }
          },
          {
            name: 'firecrawl_map',
            description: 'Map a website to get all accessible URLs',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'Website URL to map'
                },
                apiKey: {
                  type: 'string',
                  description: 'Firecrawl API key'
                },
                search: {
                  type: 'string',
                  description: 'Search term to filter URLs'
                },
                ignoreSitemap: {
                  type: 'boolean',
                  description: 'Ignore the website sitemap',
                  default: false
                },
                includeSubdomains: {
                  type: 'boolean',
                  description: 'Include subdomains in mapping',
                  default: false
                },
                limit: {
                  type: 'integer',
                  description: 'Maximum number of URLs to return',
                  minimum: 1,
                  maximum: 5000,
                  default: 5000
                }
              },
              required: ['url', 'apiKey']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'firecrawl_scrape':
            return await this.scrape(args);
          case 'firecrawl_crawl':
            return await this.crawl(args);
          case 'firecrawl_search':
            return await this.search(args);
          case 'firecrawl_map':
            return await this.map(args);
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

  async scrape(args) {
    const { url, apiKey, formats = ['markdown', 'content'], ...options } = args;
    const firecrawl = this.initializeFirecrawl(apiKey);

    const scrapeOptions = {
      formats,
      ...options
    };

    const result = await firecrawl.scrapeUrl(url, scrapeOptions);
    
    if (!result.success) {
      throw new Error(`Scraping failed: ${result.error || 'Unknown error'}`);
    }

    const content = [];
    
    if (result.data.markdown) {
      content.push({
        type: 'text',
        text: `# Scraped Content from ${url}\n\n## Markdown Content\n\n${result.data.markdown}`
      });
    }
    
    if (result.data.content) {
      content.push({
        type: 'text',
        text: `\n\n## Text Content\n\n${result.data.content}`
      });
    }
    
    if (result.data.html) {
      content.push({
        type: 'text',
        text: `\n\n## HTML Content\n\n\`\`\`html\n${result.data.html}\n\`\`\``
      });
    }
    
    if (result.data.links && result.data.links.length > 0) {
      const linksText = result.data.links.map(link => `- [${link.text || link.href}](${link.href})`).join('\n');
      content.push({
        type: 'text',
        text: `\n\n## Links Found\n\n${linksText}`
      });
    }
    
    if (result.data.screenshot) {
      content.push({
        type: 'image',
        data: result.data.screenshot,
        mimeType: 'image/png'
      });
    }

    return { content };
  }

  async crawl(args) {
    const { url, apiKey, formats = ['markdown', 'content'], ...options } = args;
    const firecrawl = this.initializeFirecrawl(apiKey);

    const crawlOptions = {
      formats,
      ...options
    };

    const result = await firecrawl.crawlUrl(url, crawlOptions);
    
    if (!result.success) {
      throw new Error(`Crawling failed: ${result.error || 'Unknown error'}`);
    }

    const content = [
      {
        type: 'text',
        text: `# Crawl Results from ${url}\n\nCrawled ${result.data.length} pages:\n\n`
      }
    ];

    result.data.forEach((page, index) => {
      content.push({
        type: 'text',
        text: `## Page ${index + 1}: ${page.metadata?.title || page.metadata?.url || 'Unknown'}\n\n**URL:** ${page.metadata?.url}\n\n`
      });
      
      if (page.markdown) {
        content.push({
          type: 'text',
          text: `**Content:**\n${page.markdown}\n\n---\n\n`
        });
      } else if (page.content) {
        content.push({
          type: 'text',
          text: `**Content:**\n${page.content}\n\n---\n\n`
        });
      }
    });

    return { content };
  }

  async search(args) {
    const { query, apiKey, formats = ['markdown', 'content'], ...options } = args;
    const firecrawl = this.initializeFirecrawl(apiKey);

    const searchOptions = {
      formats,
      ...options
    };

    const result = await firecrawl.search(query, searchOptions);
    
    if (!result.success) {
      throw new Error(`Search failed: ${result.error || 'Unknown error'}`);
    }

    const content = [
      {
        type: 'text',
        text: `# Search Results for "${query}"\n\nFound ${result.data.length} results:\n\n`
      }
    ];

    result.data.forEach((item, index) => {
      content.push({
        type: 'text',
        text: `## Result ${index + 1}: ${item.metadata?.title || 'Unknown'}\n\n**URL:** ${item.metadata?.url}\n\n`
      });
      
      if (item.markdown) {
        content.push({
          type: 'text',
          text: `**Content:**\n${item.markdown}\n\n---\n\n`
        });
      } else if (item.content) {
        content.push({
          type: 'text',
          text: `**Content:**\n${item.content}\n\n---\n\n`
        });
      }
    });

    return { content };
  }

  async map(args) {
    const { url, apiKey, ...options } = args;
    const firecrawl = this.initializeFirecrawl(apiKey);

    const result = await firecrawl.mapUrl(url, options);
    
    if (!result.success) {
      throw new Error(`Mapping failed: ${result.error || 'Unknown error'}`);
    }

    const urlList = result.data.map((item, index) => 
      `${index + 1}. [${item.title || item.url}](${item.url})`
    ).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `# Website Map for ${url}\n\nFound ${result.data.length} URLs:\n\n${urlList}`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Firecrawl MCP server running on stdio');
  }
}

const server = new FirecrawlMCPServer();
server.run().catch(console.error);