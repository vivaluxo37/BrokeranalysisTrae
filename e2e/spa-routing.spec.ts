import { expect, test } from '@playwright/test';

test.describe('SPA Routing Configuration', () => {
  const routes = [
    { path: '/', title: 'BrokerAnalysis' },
    { path: '/compare', title: 'BrokerAnalysis' },
    { path: '/compare/wizard', title: 'BrokerAnalysis' },
    { path: '/education', title: 'BrokerAnalysis' },
    { path: '/news', title: 'BrokerAnalysis' },
    { path: '/community', title: 'BrokerAnalysis' },
    { path: '/about', title: 'BrokerAnalysis' },
    { path: '/broker/test-broker', title: 'BrokerAnalysis' },
  ];

  test.beforeEach(async ({ page }) => {
    // Set up any necessary test conditions
    await page.goto('/');
  });

  test('should serve React app for all valid routes', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route.path);
      
      // Verify the page loads the React app (not a 404 page)
      await expect(page).toHaveTitle(route.title);
      
      // Verify React app is loaded by checking for the root element
      await expect(page.locator('#root')).toBeVisible();
      
      // Verify no 404 error from Vercel
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
    }
  });

  test('should handle browser navigation correctly', async ({ page }) => {
    // Navigate through multiple routes
    await page.goto('/');
    await page.goto('/compare');
    await page.goto('/about');
    
    // Test back navigation
    await page.goBack();
    expect(page.url()).toContain('/compare');
    
    // Test forward navigation
    await page.goForward();
    expect(page.url()).toContain('/about');
    
    // Verify React app is still loaded
    await expect(page.locator('#root')).toBeVisible();
  });

  test('should handle page refresh on any route', async ({ page }) => {
    // Navigate to a specific route
    await page.goto('/compare/wizard');
    await expect(page.locator('#root')).toBeVisible();
    
    // Refresh the page
    await page.reload();
    
    // Verify the page still loads correctly
    await expect(page.locator('#root')).toBeVisible();
    expect(page.url()).toContain('/compare/wizard');
  });

  test('should handle direct URL access', async ({ page }) => {
    // Test direct access to a deep route
    await page.goto('/broker/test-broker-123');
    
    // Verify the React app loads
    await expect(page.locator('#root')).toBeVisible();
    
    // Verify the URL is preserved
    expect(page.url()).toContain('/broker/test-broker-123');
  });

  test('should serve React app for non-existent routes', async ({ page }) => {
    // Test a route that doesn't exist in React Router
    await page.goto('/non-existent-route');
    
    // Should still serve the React app (which will handle the 404 internally)
    await expect(page.locator('#root')).toBeVisible();
    
    // Should not be a Vercel 404 page
    const response = await page.goto('/non-existent-route');
    expect(response?.status()).toBe(200);
  });

  test('should preserve API routes', async ({ page }) => {
    // Test that API routes are not rewritten to index.html
    const response = await page.request.get('/api/test');
    
    // Should either return API response or proper 404 (not index.html)
    const contentType = response.headers()['content-type'];
    expect(contentType).not.toContain('text/html');
  });
});