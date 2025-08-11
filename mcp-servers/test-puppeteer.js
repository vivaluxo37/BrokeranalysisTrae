#!/usr/bin/env node

/**
 * Test script for Puppeteer MCP Server
 * This script tests basic functionality of the Puppeteer MCP server
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MCPTester {
  constructor() {
    this.serverProcess = null;
    this.testResults = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      this.log('Starting Puppeteer MCP Server...');
      
      const serverPath = join(__dirname, 'src', 'puppeteer', 'index.ts');
      this.serverProcess = spawn('npx', ['ts-node', serverPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: __dirname
      });

      let serverReady = false;

      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Puppeteer MCP server running')) {
          serverReady = true;
          this.log('Server started successfully', 'success');
          resolve();
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        const error = data.toString();
        if (error.includes('Puppeteer MCP server running')) {
          serverReady = true;
          this.log('Server started successfully', 'success');
          resolve();
        } else if (!serverReady) {
          this.log(`Server error: ${error}`, 'error');
        }
      });

      this.serverProcess.on('error', (error) => {
        this.log(`Failed to start server: ${error.message}`, 'error');
        reject(error);
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!serverReady) {
          this.log('Server startup timeout', 'error');
          reject(new Error('Server startup timeout'));
        }
      }, 10000);
    });
  }

  async sendMCPRequest(method, params = {}) {
    return new Promise((resolve, reject) => {
      const request = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: method,
        params: params
      };

      const requestStr = JSON.stringify(request) + '\n';
      
      let responseData = '';
      
      const onData = (data) => {
        responseData += data.toString();
        try {
          const response = JSON.parse(responseData.trim());
          this.serverProcess.stdout.removeListener('data', onData);
          resolve(response);
        } catch (e) {
          // Continue collecting data
        }
      };

      this.serverProcess.stdout.on('data', onData);
      
      this.serverProcess.stdin.write(requestStr);
      
      // Timeout after 30 seconds
      setTimeout(() => {
        this.serverProcess.stdout.removeListener('data', onData);
        reject(new Error('Request timeout'));
      }, 30000);
    });
  }

  async testListTools() {
    try {
      this.log('Testing list tools...');
      const response = await this.sendMCPRequest('tools/list');
      
      if (response.result && response.result.tools) {
        const toolCount = response.result.tools.length;
        this.log(`Found ${toolCount} tools`, 'success');
        
        const expectedTools = [
          'puppeteer_launch',
          'puppeteer_navigate',
          'puppeteer_screenshot',
          'puppeteer_get_content',
          'puppeteer_click',
          'puppeteer_type',
          'puppeteer_evaluate',
          'puppeteer_close'
        ];
        
        const availableTools = response.result.tools.map(tool => tool.name);
        const missingTools = expectedTools.filter(tool => !availableTools.includes(tool));
        
        if (missingTools.length === 0) {
          this.log('All expected tools are available', 'success');
          this.testResults.push({ test: 'list_tools', status: 'passed' });
        } else {
          this.log(`Missing tools: ${missingTools.join(', ')}`, 'error');
          this.testResults.push({ test: 'list_tools', status: 'failed', error: `Missing tools: ${missingTools.join(', ')}` });
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      this.log(`List tools test failed: ${error.message}`, 'error');
      this.testResults.push({ test: 'list_tools', status: 'failed', error: error.message });
    }
  }

  async testBrowserLaunch() {
    try {
      this.log('Testing browser launch...');
      const response = await this.sendMCPRequest('tools/call', {
        name: 'puppeteer_launch',
        arguments: {
          headless: true,
          viewport: { width: 1280, height: 720 }
        }
      });
      
      if (response.result && response.result.content) {
        const content = response.result.content[0];
        if (content.text && content.text.includes('Browser launched successfully')) {
          this.log('Browser launch test passed', 'success');
          this.testResults.push({ test: 'browser_launch', status: 'passed' });
        } else {
          throw new Error('Unexpected response content');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      this.log(`Browser launch test failed: ${error.message}`, 'error');
      this.testResults.push({ test: 'browser_launch', status: 'failed', error: error.message });
    }
  }

  async testNavigation() {
    try {
      this.log('Testing navigation...');
      const response = await this.sendMCPRequest('tools/call', {
        name: 'puppeteer_navigate',
        arguments: {
          url: 'https://example.com',
          waitUntil: 'load'
        }
      });
      
      if (response.result && response.result.content) {
        const content = response.result.content[0];
        if (content.text && content.text.includes('Navigated to')) {
          this.log('Navigation test passed', 'success');
          this.testResults.push({ test: 'navigation', status: 'passed' });
        } else {
          throw new Error('Unexpected response content');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      this.log(`Navigation test failed: ${error.message}`, 'error');
      this.testResults.push({ test: 'navigation', status: 'failed', error: error.message });
    }
  }

  async testCleanup() {
    try {
      this.log('Testing cleanup...');
      const response = await this.sendMCPRequest('tools/call', {
        name: 'puppeteer_close',
        arguments: {}
      });
      
      if (response.result && response.result.content) {
        const content = response.result.content[0];
        if (content.text && content.text.includes('Browser closed successfully')) {
          this.log('Cleanup test passed', 'success');
          this.testResults.push({ test: 'cleanup', status: 'passed' });
        } else {
          throw new Error('Unexpected response content');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      this.log(`Cleanup test failed: ${error.message}`, 'error');
      this.testResults.push({ test: 'cleanup', status: 'failed', error: error.message });
    }
  }

  async stopServer() {
    if (this.serverProcess) {
      this.log('Stopping server...');
      this.serverProcess.kill('SIGTERM');
      
      return new Promise((resolve) => {
        this.serverProcess.on('exit', () => {
          this.log('Server stopped', 'success');
          resolve();
        });
        
        // Force kill after 5 seconds
        setTimeout(() => {
          if (this.serverProcess && !this.serverProcess.killed) {
            this.serverProcess.kill('SIGKILL');
          }
          resolve();
        }, 5000);
      });
    }
  }

  printResults() {
    this.log('\n=== Test Results ===');
    
    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const failed = this.testResults.filter(r => r.status === 'failed').length;
    
    this.testResults.forEach(result => {
      const status = result.status === 'passed' ? '✅ PASSED' : '❌ FAILED';
      this.log(`${result.test}: ${status}`);
      if (result.error) {
        this.log(`  Error: ${result.error}`);
      }
    });
    
    this.log(`\nSummary: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
      this.log('All tests passed! 🎉', 'success');
    } else {
      this.log('Some tests failed. Please check the errors above.', 'error');
    }
  }

  async runTests() {
    try {
      await this.startServer();
      
      // Wait a bit for server to be fully ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await this.testListTools();
      await this.testBrowserLaunch();
      await this.testNavigation();
      await this.testCleanup();
      
    } catch (error) {
      this.log(`Test execution failed: ${error.message}`, 'error');
    } finally {
      await this.stopServer();
      this.printResults();
    }
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting Puppeteer MCP Server tests...');
  const tester = new MCPTester();
  tester.runTests().catch((error) => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}