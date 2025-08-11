import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to http://localhost:5173/...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for React app to mount
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if the React root element exists and has content
    const hasReactRoot = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    });
    
    console.log('React root element found and has content:', hasReactRoot);
    
    // Check for the main heading
    const headingText = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      return heading ? heading.textContent : null;
    });
    
    console.log('Main heading text:', headingText);
    
    // Check if there are any React-specific elements (like the navigation)
    const hasNavigation = await page.evaluate(() => {
      return document.querySelector('nav') !== null;
    });
    
    console.log('Navigation element found:', hasNavigation);
    
    // Check for any error messages
    const bodyText = await page.evaluate(() => document.body.textContent);
    const hasPlainHTMLError = bodyText.includes('cannot GET /') || 
                              bodyText.includes('404') || 
                              bodyText.includes('Not Found');
    
    console.log('Plain HTML error detected:', hasPlainHTMLError);
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'homepage-check.png', fullPage: true });
    console.log('Screenshot saved as homepage-check.png');
    
    // Get the page title
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    // Summary
    if (hasReactRoot && !hasPlainHTMLError) {
      console.log('\n✅ SUCCESS: React app is rendering correctly!');
    } else {
      console.log('\n❌ ISSUE: React app is not rendering properly.');
    }
    
  } catch (error) {
    console.error('Error checking homepage:', error.message);
  } finally {
    await browser.close();
  }
})();
