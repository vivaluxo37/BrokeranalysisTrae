# Environment Configuration Guide

## Overview

This document outlines the environment configuration for the BrokerAnalysis platform, including API keys, database connections, and service integrations.

## Environment Variables

### AI Provider Configuration

The platform supports multiple AI providers with automatic fallback:

- **Groq API**: Primary AI provider for fast inference
- **OpenRouter API**: Multiple API keys for different models and load balancing

### Bright Data Web Unlocker

**Purpose**: Web scraping and data extraction with proxy rotation

```env
BRIGHTDATA_API_KEY=7bc07d477e781f1d9a843693c5be63437e1e5a416ecd5960459486b8f30f00c5
BRIGHTDATA_ZONE=brokeranalysis
BRIGHTDATA_API_ENDPOINT=https://api.brightdata.com/request
```

**Test Status**: ✅ **VERIFIED** - API connection successful

**Usage Example**:
```bash
# PowerShell
$headers = @{"Content-Type" = "application/json"; "Authorization" = "Bearer YOUR_API_KEY"}
$body = @{zone = "brokeranalysis"; url = "TARGET_URL"; format = "raw"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.brightdata.com/request" -Method Post -Headers $headers -Body $body
```

### Supabase Database Configuration

**Purpose**: Backend database and real-time features

```env
SUPABASE_URL=https://diykotyhjwcwdscozltq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpeWtvdHloandjd2RzY296bHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMzk1OTAsImV4cCI6MjA3MDcxNTU5MH0.sOCPY7I3ymucoYy7KlGc96OFP2W_alRLbRNu2e2RD4I
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpeWtvdHloandjd2RzY296bHRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTEzOTU5MCwiZXhwIjoyMDcwNzE1NTkwfQ.3t8iGKaMwe9F2_xelpm262I7XAZTmKBSVLSHeW8UglM
SUPABASE_PROJECT_REF=diykotyhjwcwdscozltq
```

**Configuration Status**: ✅ **CONFIGURED** - MCP server updated with project reference

## MCP Server Integration

### Supabase MCP Server

- **Status**: ✅ Installed and configured
- **Mode**: Read-only (safe for exploration)
- **Project Reference**: `diykotyhjwcwdscozltq`
- **Configuration File**: `mcp-servers/config.json`

### Available MCP Servers

1. **Puppeteer**: Web automation and browser control
2. **Filesystem**: File system operations
3. **Supabase**: Database operations and API access

## Security Considerations

### API Key Management

- All API keys are stored in environment variables
- Never commit `.env` files to version control
- Use different keys for development and production
- Regularly rotate API keys for security

### Access Levels

- **Supabase Anon Key**: Public access for client-side operations
- **Supabase Service Role**: Full access for server-side operations
- **Bright Data**: Web scraping with zone-specific access

## Testing and Validation

### Bright Data API Test

```bash
# Test command (PowerShell)
$headers = @{"Content-Type" = "application/json"; "Authorization" = "Bearer 7bc07d477e781f1d9a843693c5be63437e1e5a416ecd5960459486b8f30f00c5"}
$body = @{zone = "brokeranalysis"; url = "https://geo.brdtest.com/welcome.txt?product=unlocker&method=api"; format = "raw"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.brightdata.com/request" -Method Post -Headers $headers -Body $body
```

**Expected Response**: Proxy details and location information

### Supabase Connection Test

```javascript
// Test Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Test query
const { data, error } = await supabase.from('your_table').select('*').limit(1)
```

## Next Steps

1. **Test Supabase Connection**: Verify database access and table operations
2. **Configure AI Services**: Test Groq and OpenRouter API connections
3. **Set Up Data Pipelines**: Configure Bright Data for broker data scraping
4. **Implement Security**: Add rate limiting and API key rotation
5. **Monitor Usage**: Set up analytics for API usage and costs

## Troubleshooting

### Common Issues

1. **API Key Errors**: Verify keys are correctly copied without extra spaces
2. **CORS Issues**: Ensure Supabase project allows your domain
3. **Rate Limits**: Monitor API usage and implement proper throttling
4. **Network Issues**: Check firewall settings for API endpoints

### Support Resources

- [Bright Data Documentation](https://docs.brightdata.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [MCP Server Documentation](./mcp-servers/USAGE.md)