class WidgetManager {
  private static instance: WidgetManager;
  private isScriptLoaded = false;
  private scriptPromise: Promise<void> | null = null;
  private maxRetries = 3;

  private constructor() {}

  public static getInstance(): WidgetManager {
    if (!WidgetManager.instance) {
      WidgetManager.instance = new WidgetManager();
    }
    return WidgetManager.instance;
  }

  public loadScript(src = 'https://s3.tradingview.com/tv.js', retries = this.maxRetries): Promise<void> {
    if (this.isScriptLoaded) {
      return Promise.resolve();
    }

    if (this.scriptPromise) {
      return this.scriptPromise;
    }

    this.scriptPromise = new Promise((resolve, reject) => {
      const startTime = performance.now(); // Start time tracking
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        this.isScriptLoaded = true;
        this.scriptPromise = null;
        const endTime = performance.now(); // End time tracking
        console.log(`TradingView script loaded in ${endTime - startTime} ms`); // Log performance
        resolve();
      };
      script.onerror = (error) => {
        if (retries > 0) {
          console.warn(`Failed to load TradingView script, retrying... (${retries} attempts left)`);
          this.scriptPromise = null;
          this.loadScript(src, retries - 1).then(resolve, reject);
        } else {
          this.scriptPromise = null;
          console.error(`Failed to load TradingView script after multiple retries:`, error);
          reject(error);
        }
      };
      document.body.appendChild(script);
    });

    return this.scriptPromise;
  }
}

export default WidgetManager.getInstance();