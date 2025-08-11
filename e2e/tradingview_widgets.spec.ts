import { test, expect } from '@playwright/test';

test.describe('TradingView Widgets Integration', () => {
  test('homepage should display Market Overview and Mini Charts', async ({ page }) => {
    await page.goto('/'); // Assuming '/' is the homepage

    // Check for Market Overview widget
    await expect(page.locator('div[aria-label="TradingView Widget"]')).toBeVisible();
    await expect(page.locator('iframe[title="Market Overview"]')).toBeVisible(); // Assuming iframe has a title

    // Check for Mini Charts (adjust selectors if needed)
    await expect(page.locator('iframe[title="Mini Chart"]')).toHaveCount(3); // Assuming 3 mini charts
  });

  test('tools landing page should display heatmaps and screeners', async ({ page }) => {
    await page.goto('/tools'); // Assuming '/tools' is the tools landing page

    // Check for Heatmaps tab and content
    await page.click('button:has-text("Heatmaps")');
    await expect(page.locator('iframe[title="Stock Heatmap"]')).toBeVisible();
    await expect(page.locator('iframe[title="Crypto Heatmap"]')).toBeVisible();
    await expect(page.locator('iframe[title="Forex Heatmap"]')).toBeVisible();

    // Check for Screeners tab and content
    await page.click('button:has-text("Screeners")');
    await expect(page.locator('iframe[title="Stock Screener"]')).toBeVisible();
    await expect(page.locator('iframe[title="Crypto Screener"]')).toBeVisible();
  });

  test('broker profile page should display Advanced Chart', async ({ page }) => {
    // Assuming a broker profile page exists, e.g., '/brokers/interactive-brokers'
    await page.goto('/brokers/interactive-brokers');

    // Check for Advanced Chart
    await expect(page.locator('iframe[title="Advanced Chart"]')).toBeVisible();
  });

  test('news hub should display Top Stories and Market Overview', async ({ page }) => {
    await page.goto('/news'); // Assuming '/news' is the news hub page

    // Check for Market Overview widget
    await expect(page.locator('iframe[title="Market Overview"]')).toBeVisible();

    // Check for Top Stories widget
    await expect(page.locator('iframe[title="Top Stories"]')).toBeVisible();
  });
});