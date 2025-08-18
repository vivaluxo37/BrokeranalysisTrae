import React, { useEffect, useState } from 'react';
import { analyzeWebVitals, getWebVitalsThresholds, WebVitalsMetrics } from '../../utils/seo/performanceOptimizer';

// Web Vitals monitoring component
interface WebVitalsMonitorProps {
  onMetricsUpdate?: (metrics: Partial<WebVitalsMetrics>) => void;
  showDebugInfo?: boolean;
}

export const WebVitalsMonitor: React.FC<WebVitalsMonitorProps> = ({
  onMetricsUpdate,
  showDebugInfo = false
}) => {
  const [metrics, setMetrics] = useState<Partial<WebVitalsMetrics>>({});
  const [analysis, setAnalysis] = useState<{
    score: 'good' | 'needs-improvement' | 'poor';
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Import web-vitals library dynamically
    const loadWebVitals = async () => {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
        
        const updateMetrics = (metric: any) => {
          setMetrics(prev => {
            const updated = {
              ...prev,
              [metric.name.toLowerCase()]: metric.value
            };
            
            // Analyze metrics when we have enough data
            if (Object.keys(updated).length >= 3) {
              const analysisResult = analyzeWebVitals(updated);
              setAnalysis(analysisResult);
            }
            
            onMetricsUpdate?.(updated);
            return updated;
          });
        };

        // Collect all Core Web Vitals
        getCLS(updateMetrics);
        getFID(updateMetrics);
        getFCP(updateMetrics);
        getLCP(updateMetrics);
        getTTFB(updateMetrics);
        
      } catch (error) {
        console.warn('Web Vitals library not available:', error);
      }
    };

    loadWebVitals();
  }, [onMetricsUpdate]);

  // Send metrics to analytics (optional)
  useEffect(() => {
    if (Object.keys(metrics).length > 0) {
      // Send to Google Analytics 4 if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        Object.entries(metrics).forEach(([name, value]) => {
          if (value !== undefined) {
            (window as any).gtag('event', name, {
              value: Math.round(value),
              metric_id: name,
              metric_value: value,
              metric_delta: value // For first measurement
            });
          }
        });
      }
    }
  }, [metrics]);

  if (!showDebugInfo) {
    return null; // Hidden monitoring component
  }

  const thresholds = getWebVitalsThresholds();

  const getMetricStatus = (metricName: string, value: number) => {
    const threshold = thresholds[metricName as keyof typeof thresholds];
    if (!threshold) return 'unknown';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  };

  const formatMetricValue = (metricName: string, value: number) => {
    if (metricName === 'cls') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}ms`;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Core Web Vitals
        </h3>
        {analysis && (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            analysis.score === 'good' ? 'bg-green-100 text-green-800' :
            analysis.score === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {analysis.score.replace('-', ' ')}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        {Object.entries(metrics).map(([name, value]) => {
          if (value === undefined) return null;
          
          const status = getMetricStatus(name, value);
          const displayName = name.toUpperCase();
          
          return (
            <div key={name} className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {displayName}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-900 dark:text-white">
                  {formatMetricValue(name, value)}
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  status === 'good' ? 'bg-green-500' :
                  status === 'needs-improvement' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
              </div>
            </div>
          );
        })}
      </div>
      
      {analysis?.recommendations && analysis.recommendations.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Recommendations:
          </p>
          <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
            {analysis.recommendations.slice(0, 2).map((rec, index) => (
              <li key={index} className="truncate" title={rec}>
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Hook for using Web Vitals data
export const useWebVitals = () => {
  const [metrics, setMetrics] = useState<Partial<WebVitalsMetrics>>({});
  const [analysis, setAnalysis] = useState<{
    score: 'good' | 'needs-improvement' | 'poor';
    recommendations: string[];
  } | null>(null);

  const updateMetrics = (newMetrics: Partial<WebVitalsMetrics>) => {
    setMetrics(newMetrics);
    
    if (Object.keys(newMetrics).length >= 3) {
      const analysisResult = analyzeWebVitals(newMetrics);
      setAnalysis(analysisResult);
    }
  };

  return {
    metrics,
    analysis,
    updateMetrics
  };
};

// Performance budget checker component
interface PerformanceBudgetProps {
  assets?: Array<{ type: string; size: number; name: string }>;
  onBudgetViolation?: (violations: string[]) => void;
}

export const PerformanceBudgetChecker: React.FC<PerformanceBudgetProps> = ({
  assets = [],
  onBudgetViolation
}) => {
  const [budgetStatus, setBudgetStatus] = useState<{
    passed: boolean;
    violations: string[];
  } | null>(null);

  useEffect(() => {
    if (assets.length === 0) return;

    const checkBudget = async () => {
      const { checkPerformanceBudget } = await import('../../utils/seo/performanceOptimizer');
      const result = checkPerformanceBudget(assets);
      setBudgetStatus(result);
      
      if (!result.passed && onBudgetViolation) {
        onBudgetViolation(result.violations);
      }
    };

    checkBudget();
  }, [assets, onBudgetViolation]);

  if (!budgetStatus || budgetStatus.passed) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Performance Budget Exceeded
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc list-inside space-y-1">
              {budgetStatus.violations.map((violation, index) => (
                <li key={index}>{violation}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebVitalsMonitor;