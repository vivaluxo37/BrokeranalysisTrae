#!/usr/bin/env node

/**
 * Simple test script for Puppeteer MCP Server
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Puppeteer MCP Server tests...');

class SimpleMCPTester {
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
      
      const puppeteerDir = join(__dirname, 'src', 'puppeteer');
      this.log(`Puppeteer directory: ${puppeteerDir}`);
      
      // Run from the puppeteer directory to avoid path issues
      this.serverProcess = spawn('npx', ['ts-node', 'index.ts'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: puppeteerDir,
        shell: true
      });

      let serverReady = false;
      let startupOutput = '';

      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        startupOutput += output;
        this.log(`Server stdout: ${output.trim()}`);
        
        if (output.includes('Puppeteer MCP server running')) {
          serverReady = true;
          this.log('Server started successfully', 'success');
          resolve();
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        const error = data.toString();
        startupOutput += error;
        this.log(`Server stderr: ${error.trim()}`);
        
        if (error.includes('Puppeteer MCP server running')) {
          serverReady = true;
          this.log('Server started successfully', 'success');
          resolve();
        }
      });

      this.serverProcess.on('error', (error) => {
        this.log(`Failed to start server: ${error.message}`, 'error');
        reject(error);
      });

      this.serverProcess.on('exit', (code, signal) => {
        if (!serverReady) {
          this.log(`Server exited early with code ${code}, signal ${signal}`, 'error');
          this.log(`Startup output: ${startupOutput}`);
          reject(new Error(`Server exited early with code ${code}`));
        }
      });

      // Timeout after 15 seconds
      setTimeout(() => {
        if (!serverReady) {
          this.log('Server startup timeout', 'error');
          this.log(`Startup output so far: ${startupOutput}`);
          reject(new Error('Server startup timeout'));
        }
      }, 15000);
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
      this.log(`Sending request: ${method}`);
      
      let responseData = '';
      
      const onData = (data) => {
        responseData += data.toString();
        this.log(`Received data: ${data.toString().trim()}`);
        
        try {
          const response = JSON.parse(responseData.trim());
          this.serverProcess.stdout.removeListener('data', onData);
          this.log(`Parsed response for ${method}`, 'success');
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
        this.log(`Request timeout for ${method}`, 'error');
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
        this.log(`Available tools: ${availableTools.join(', ')}`);
        
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
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await this.testListTools();
      
    } catch (error) {
      this.log(`Test execution failed: ${error.message}`, 'error');
    } finally {
      await this.stopServer();
      this.printResults();
    }
  }
}

// Run the tests
const tester = new SimpleMCPTester();
tester.runTests().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});