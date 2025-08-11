/**
 * Asset Test Component for verifying asset accessibility in browser
 * This component can be used to test asset loading in development and production
 */

import React, { useCallback, useEffect, useState } from 'react';
import { generateAssetTestReport, runAssetTests } from '@/utils/assetTesting';
import { validateAssetAccessibility } from '@/utils/assetOptimization';

interface AssetTestComponentProps {
  showDetails?: boolean;
  autoRun?: boolean;
}

export function AssetTestComponent({ showDetails = false, autoRun = false }: AssetTestComponentProps) {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<string>('');

  const runTests = useCallback(async () => {
    setIsRunning(true);
    try {
      const results = await runAssetTests();
      setTestResults(results);
      
      if (showDetails) {
        const reportText = generateAssetTestReport(results);
        setReport(reportText);
      }
    } catch (error) {
      console.error('Asset test failed:', error);
    } finally {
      setIsRunning(false);
    }
  }, [showDetails]);

  useEffect(() => {
    if (autoRun) {
      runTests();
    }
  }, [autoRun, runTests]);

  if (!showDetails && !testResults) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Asset Accessibility Test</h3>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? 'Running Tests...' : 'Test Assets'}
        </button>
      </div>
    );
  }

  if (!testResults) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="animate-pulse">Testing assets...</div>
      </div>
    );
  }

  const { success, overallPassed, overallTotal } = testResults;

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Asset Test Results</h3>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          {isRunning ? 'Running...' : 'Retest'}
        </button>
      </div>

      <div className={`p-3 rounded-lg mb-4 ${success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        <div className="flex items-center">
          <span className="text-xl mr-2">{success ? '✅' : '❌'}</span>
          <span className="font-semibold">
            {success ? 'All Assets Accessible' : 'Some Assets Failed'}
          </span>
        </div>
        <div className="text-sm mt-1">
          {overallPassed}/{overallTotal} tests passed
        </div>
      </div>

      {showDetails && testResults.suites && (
        <div className="space-y-4">
          {testResults.suites.map((suite: any, index: number) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{suite.name}</h4>
                <span className={`text-sm ${suite.failed === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {suite.passed}/{suite.total}
                </span>
              </div>
              
              {suite.failed > 0 && (
                <div className="text-sm text-red-600">
                  <div className="font-medium mb-1">Failed:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {suite.results
                      .filter((r: any) => !r.accessible)
                      .map((r: any, i: number) => (
                        <li key={i} className="font-mono text-xs">
                          {r.path}: {r.error || `HTTP ${r.status}`}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showDetails && report && (
        <details className="mt-4">
          <summary className="cursor-pointer font-medium">View Full Report</summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
            {report}
          </pre>
        </details>
      )}
    </div>
  );
}

/**
 * Simple asset preview component to test image loading
 */
export function AssetPreviewComponent() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const testImages = [
    '/assets/icons/broker-placeholder.svg',
    '/assets/icons/broker-placeholder.webp',
    '/favicon.svg',
    '/vite.svg'
  ];

  const handleImageError = useCallback((src: string) => {
    setImageErrors(prev => ({ ...prev, [src]: true }));
  }, []);

  const handleImageLoad = useCallback((src: string) => {
    setImageErrors(prev => ({ ...prev, [src]: false }));
  }, []);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Asset Preview Test</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {testImages.map((src) => (
          <div key={src} className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 border rounded flex items-center justify-center bg-gray-50">
              <img
                src={src}
                alt={`Test asset: ${src}`}
                className="max-w-full max-h-full"
                onError={() => handleImageError(src)}
                onLoad={() => handleImageLoad(src)}
              />
            </div>
            <div className="text-xs">
              <div className="font-mono truncate" title={src}>
                {src.split('/').pop()}
              </div>
              <div className={`mt-1 ${imageErrors[src] ? 'text-red-600' : 'text-green-600'}`}>
                {imageErrors[src] === undefined ? '⏳' : imageErrors[src] ? '❌' : '✅'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}