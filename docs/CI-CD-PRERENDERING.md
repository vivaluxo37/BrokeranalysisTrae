# CI/CD Prerendering Integration

This document describes the automated prerendering system integrated into the CI/CD pipeline for the BrokerAnalysis platform.

## Overview

The prerendering system automatically generates static HTML files for all routes to improve SEO, performance, and bot accessibility. It's integrated into the CI/CD pipeline to ensure all deployments include prerendered content.

## Architecture

### Components

1. **Prerender Script** (`brokeranalysis/scripts/prerender.js`)
   - Headless Chrome-based prerendering
   - Route discovery and dynamic content capture
   - Meta tag and structured data generation
   - Sitemap and manifest creation

2. **CI/CD Workflows**
   - `deploy.yml`: Main deployment with prerendering
   - `prerender.yml`: Scheduled and triggered prerendering
   - `seo-monitoring.yml`: SEO quality monitoring

3. **Build Integration**
   - Automatic prerendering during build process
   - Environment-specific configurations
   - Artifact generation and deployment

## Workflows

### 1. Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`

**Process:**
1. Checkout code and setup Node.js
2. Install dependencies
3. Run tests and linting
4. Build project with prerendering
5. Install Puppeteer dependencies
6. Run prerendering process
7. Deploy to Vercel

**Key Features:**
- Automatic prerendering on every deployment
- Environment-specific builds (production/preview)
- Chromium browser installation for CI
- Vercel integration with prebuilt artifacts

### 2. Automated Prerendering Workflow (`.github/workflows/prerender.yml`)

**Triggers:**
- Daily schedule (2 AM UTC)
- Manual dispatch
- Content updates (data files, locales)

**Process:**
1. Build project without linting (faster)
2. Run comprehensive prerendering
3. Generate prerender reports
4. Deploy updated content
5. Upload artifacts for review

**Key Features:**
- Scheduled content updates
- Force rebuild option
- Detailed reporting
- Artifact preservation

### 3. SEO Monitoring Workflow (`.github/workflows/seo-monitoring.yml`)

**Triggers:**
- After successful prerendering
- Weekly schedule (Monday 6 AM UTC)
- Manual dispatch

**Process:**
1. Run Lighthouse SEO audit
2. Check prerendered meta tags
3. Generate comprehensive SEO report
4. Create issues for problems
5. Upload audit results

**Key Features:**
- Automated SEO quality assurance
- Meta tag validation
- Performance monitoring
- Issue creation for problems

## Configuration

### Environment Variables

Required secrets in GitHub repository:

```bash
# Vercel Integration
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
VERCEL_TOKEN=your_deployment_token

# Application Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_GROQ_API_KEY=your_groq_key
VITE_OPENROUTER_API_KEY=your_openrouter_key
```

### Prerender Configuration

The prerender script uses configuration from `brokeranalysis/scripts/prerender.config.js`:

```javascript
module.exports = {
  baseUrl: 'http://localhost:4173',
  outputDir: './dist',
  routes: [
    '/',
    '/brokers',
    '/tools/spread-comparison',
    // ... dynamic routes discovered automatically
  ],
  waitForMetaTags: true,
  timeout: 30000,
  puppeteerOptions: {
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  }
};
```

## Scripts

### Root Package.json Scripts

```json
{
  "scripts": {
    "prerender": "cd brokeranalysis && npm run prerender",
    "build:prerender": "cd brokeranalysis && npm run build",
    "ci:build": "cd brokeranalysis && npm ci && npm run build",
    "ci:prerender": "cd brokeranalysis && npm ci && npm run prerender"
  }
}
```

### BrokerAnalysis Package.json Scripts

```json
{
  "scripts": {
    "build": "vite build && node scripts/prerender.js",
    "prerender": "node scripts/prerender.js",
    "build:prerender": "npm run build",
    "build:seo": "npm run build"
  }
}
```

## Monitoring and Maintenance

### Automated Monitoring

1. **SEO Scores**: Lighthouse audits track SEO performance
2. **Meta Tag Coverage**: Automated checks ensure all pages have proper meta tags
3. **Prerender Success Rate**: Reports show which pages render successfully
4. **Performance Metrics**: Response times and resource usage tracking

### Manual Monitoring

1. **GitHub Actions**: Check workflow runs for failures
2. **Vercel Deployments**: Monitor deployment success and performance
3. **SEO Tools**: Use external tools to validate prerendered content
4. **Browser Testing**: Manually test critical pages

### Troubleshooting

#### Common Issues

1. **Puppeteer Timeouts**
   - Increase timeout values in prerender config
   - Check for JavaScript errors in browser console
   - Verify all dependencies are loaded

2. **Missing Meta Tags**
   - Check SeoHead component implementation
   - Verify useEffect hooks are running
   - Increase wait time for dynamic content

3. **Build Failures**
   - Check environment variables
   - Verify all dependencies are installed
   - Review build logs for specific errors

4. **Deployment Issues**
   - Verify Vercel configuration
   - Check token permissions
   - Review deployment logs

#### Debug Commands

```bash
# Local prerendering test
cd brokeranalysis
npm run build
npm run prerender

# Check prerendered output
ls -la dist/
grep -r "og:title" dist/

# Test specific route
node scripts/prerender.js --route=/brokers/pepperstone

# Verbose logging
DEBUG=true npm run prerender
```

## Performance Optimization

### Build Performance

1. **Parallel Processing**: Multiple routes processed simultaneously
2. **Incremental Builds**: Only rebuild changed content
3. **Caching**: Leverage CI cache for dependencies
4. **Skip Linting**: Use `build:skip-lint` for faster CI builds

### Runtime Performance

1. **Resource Limits**: Configure memory and CPU limits
2. **Timeout Management**: Optimize wait times for different content types
3. **Browser Optimization**: Use minimal Chrome flags
4. **Content Prioritization**: Prerender critical pages first

## Security Considerations

### Secrets Management

1. **GitHub Secrets**: Store all sensitive data in repository secrets
2. **Environment Isolation**: Separate production and preview environments
3. **Token Rotation**: Regularly rotate API tokens and keys
4. **Access Control**: Limit workflow permissions to minimum required

### Content Security

1. **Input Validation**: Sanitize dynamic content before prerendering
2. **XSS Prevention**: Ensure prerendered content is safe
3. **Data Privacy**: Avoid including sensitive data in prerendered pages
4. **Rate Limiting**: Respect API rate limits during prerendering

## Future Enhancements

### Planned Features

1. **Smart Caching**: Cache prerendered content based on content changes
2. **A/B Testing**: Support for multiple prerendered versions
3. **Analytics Integration**: Track prerender performance impact
4. **Multi-language Support**: Enhanced i18n prerendering

### Optimization Opportunities

1. **Edge Prerendering**: Move prerendering closer to users
2. **Incremental Static Regeneration**: Update content without full rebuilds
3. **AI-Powered Optimization**: Use AI to optimize prerender strategies
4. **Real-time Updates**: Trigger prerendering on content changes

## Support and Maintenance

### Team Responsibilities

1. **DevOps Team**: CI/CD pipeline maintenance and monitoring
2. **Frontend Team**: Prerender script updates and optimization
3. **SEO Team**: Content strategy and meta tag requirements
4. **QA Team**: Testing prerendered content quality

### Documentation Updates

This document should be updated when:
- New workflows are added or modified
- Configuration changes are made
- New monitoring tools are integrated
- Performance optimizations are implemented

### Contact Information

For issues or questions about the prerendering system:
- Create GitHub issues with `prerendering` label
- Contact the DevOps team for CI/CD issues
- Review workflow logs for troubleshooting
- Check Vercel dashboard for deployment status