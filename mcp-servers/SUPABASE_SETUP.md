# Supabase MCP Server Setup

## Installation Complete

The Supabase MCP server has been installed and configured with your access token. However, you need to complete the setup by providing your Supabase project reference.

## Required Configuration

### Step 1: Find Your Project Reference

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **General**
4. Copy the **Project Reference ID** (it looks like: `abcdefghijklmnop`)

### Step 2: Update Configuration

Edit the file `mcp-servers/config.json` and replace `<YOUR_PROJECT_REF>` with your actual project reference:

```json
"--project-ref=your-actual-project-ref-here"
```

## Current Configuration

- **Access Token**: Already configured with your provided token
- **Mode**: Read-only (safe for data exploration)
- **Package**: @supabase/mcp-server-supabase (latest version)

## Testing the Connection

After updating the project reference, you can test the connection by:

1. Ensuring your Supabase project is active
2. Update the `<YOUR_PROJECT_REF>` placeholder in `config.json`
3. The MCP server will be available through your MCP client
4. Test basic operations like listing tables or querying data

## Installation Status

✅ **Supabase MCP server installed globally**  
✅ **Local dependencies installed**  
✅ **Configuration file updated**  
⚠️ **Project reference needs to be configured**

## Next Steps

1. **REQUIRED**: Replace `<YOUR_PROJECT_REF>` in `config.json` with your actual Supabase project reference
2. **OPTIONAL**: Test the connection through your MCP client
3. **OPTIONAL**: Configure additional Supabase settings if needed

## Security Notes

- The access token is stored in environment variables
- The server is configured in read-only mode for safety
- Make sure your Supabase project has appropriate access controls

## Capabilities

Once configured, the Supabase MCP server provides:

- Database operations (read-only)
- API access to your Supabase project
- Real-time subscriptions
- Integration with your existing MCP server ecosystem