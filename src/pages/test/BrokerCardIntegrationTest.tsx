import React, { useState, useEffect } from 'react';
import { BrokerCard } from '../../components/brokeranalysis/BrokerCard';
import { dataIntegrationService } from '../../services/dataIntegrationService';
import type { Broker } from '../../types/broker';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle, XCircle, AlertTriangle, BarChart3, Clock, Zap } from 'lucide-react';

interface TestResult {
  brokerId: string;
  brokerName: string;
  logoLoadSuccess: boolean;
  logoLoadTime: number;
  dataAccuracy: {
    hasRating: boolean;
    hasTrustScore: boolean;
    hasRegulators: boolean;
    hasMinDeposit: boolean;
    hasMaxLeverage: boolean;
    hasSpreads: boolean;
  };
  renderTime: number;
  errors: string[];
}

interface TestReport {
  totalBrokers: number;
  successfulLogoLoads: number;
  averageLogoLoadTime: number;
  averageRenderTime: number;
  dataAccuracyScore: number;
  errors: string[];
  brokerResults: TestResult[];
}

export const BrokerCardIntegrationTest: React.FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testReport, setTestReport] = useState<TestReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingComplete, setIsTestingComplete] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);

  useEffect(() => {
    loadBrokerData();
  }, []);

  const loadBrokerData = () => {
    try {
      setIsLoading(true);
      const allBrokers = dataIntegrationService.getIntegratedBrokerData().allBrokers;
      setBrokers(allBrokers.slice(0, 10)); // Test with first 10 brokers
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load broker data:', error);
      setIsLoading(false);
    }
  };

  const testBrokerCard = async (broker: Broker): Promise<TestResult> => {
    const startTime = performance.now();
    const errors: string[] = [];
    
    // Test logo loading
    let logoLoadSuccess = false;
    let logoLoadTime = 0;
    
    try {
      const logoStartTime = performance.now();
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = () => {
          logoLoadSuccess = true;
          logoLoadTime = performance.now() - logoStartTime;
          resolve(true);
        };
        img.onerror = () => {
          errors.push(`Logo failed to load: ${broker.logo}`);
          reject(new Error('Logo load failed'));
        };
        img.src = broker.logo;
        
        // Timeout after 5 seconds
        setTimeout(() => {
          if (!logoLoadSuccess) {
            errors.push(`Logo load timeout: ${broker.logo}`);
            reject(new Error('Logo load timeout'));
          }
        }, 5000);
      });
    } catch (error) {
      logoLoadSuccess = false;
      logoLoadTime = 0;
    }

    // Test data accuracy
    const dataAccuracy = {
      hasRating: broker.rating !== undefined && broker.rating > 0,
      hasTrustScore: broker.trustScore !== undefined && broker.trustScore > 0,
      hasRegulators: broker.regulators && broker.regulators.length > 0,
      hasMinDeposit: broker.minDeposit !== undefined && broker.minDeposit >= 0,
      hasMaxLeverage: broker.maxLeverage !== undefined && broker.maxLeverage > 0,
      hasSpreads: broker.spreadsFrom !== undefined && broker.spreadsFrom >= 0
    };

    // Validate data integrity
    if (!broker.name || broker.name.trim() === '') {
      errors.push('Broker name is missing or empty');
    }
    if (!broker.id || broker.id.trim() === '') {
      errors.push('Broker ID is missing or empty');
    }
    if (broker.rating && (broker.rating < 0 || broker.rating > 5)) {
      errors.push(`Invalid rating: ${broker.rating}`);
    }
    if (broker.trustScore && (broker.trustScore < 0 || broker.trustScore > 100)) {
      errors.push(`Invalid trust score: ${broker.trustScore}`);
    }

    const renderTime = performance.now() - startTime;

    return {
      brokerId: broker.id,
      brokerName: broker.name,
      logoLoadSuccess,
      logoLoadTime,
      dataAccuracy,
      renderTime,
      errors
    };
  };

  const runComprehensiveTest = async () => {
    setIsTestingComplete(false);
    setCurrentTestIndex(0);
    const results: TestResult[] = [];
    const allErrors: string[] = [];

    for (let i = 0; i < brokers.length; i++) {
      setCurrentTestIndex(i + 1);
      const result = await testBrokerCard(brokers[i]);
      results.push(result);
      allErrors.push(...result.errors);
      
      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setTestResults(results);

    // Generate test report
    const successfulLogoLoads = results.filter(r => r.logoLoadSuccess).length;
    const averageLogoLoadTime = results
      .filter(r => r.logoLoadSuccess)
      .reduce((sum, r) => sum + r.logoLoadTime, 0) / successfulLogoLoads || 0;
    
    const averageRenderTime = results.reduce((sum, r) => sum + r.renderTime, 0) / results.length;
    
    const dataAccuracyScore = results.reduce((sum, r) => {
      const accuracyCount = Object.values(r.dataAccuracy).filter(Boolean).length;
      return sum + (accuracyCount / Object.keys(r.dataAccuracy).length);
    }, 0) / results.length * 100;

    const report: TestReport = {
      totalBrokers: brokers.length,
      successfulLogoLoads,
      averageLogoLoadTime,
      averageRenderTime,
      dataAccuracyScore,
      errors: allErrors,
      brokerResults: results
    };

    setTestReport(report);
    setIsTestingComplete(true);
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading broker data for testing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            BrokerCard Integration Test
          </h1>
          <p className="text-gray-600">
            Comprehensive testing of BrokerCard component with real broker data integration
          </p>
        </div>

        {/* Test Controls */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Test Controls</h2>
            <Button 
              onClick={runComprehensiveTest}
              disabled={!isTestingComplete && currentTestIndex > 0}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {currentTestIndex > 0 && !isTestingComplete ? 'Testing...' : 'Run Comprehensive Test'}
            </Button>
          </div>
          
          {currentTestIndex > 0 && !isTestingComplete && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">
                  Testing broker {currentTestIndex} of {brokers.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTestIndex / brokers.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Total Brokers:</span>
              <span className="ml-2 text-gray-900">{brokers.length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Data Source:</span>
              <span className="ml-2 text-gray-900">compiledBrokers.json</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Test Status:</span>
              <span className="ml-2">
                {isTestingComplete ? (
                  <Badge variant="success">Complete</Badge>
                ) : currentTestIndex > 0 ? (
                  <Badge variant="warning">Running</Badge>
                ) : (
                  <Badge variant="secondary">Ready</Badge>
                )}
              </span>
            </div>
          </div>
        </Card>

        {/* Test Report */}
        {testReport && (
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Test Report
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {testReport.successfulLogoLoads}/{testReport.totalBrokers}
                </div>
                <div className="text-sm text-blue-700">Logo Load Success</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {testReport.averageLogoLoadTime.toFixed(0)}ms
                </div>
                <div className="text-sm text-green-700">Avg Logo Load Time</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {testReport.averageRenderTime.toFixed(0)}ms
                </div>
                <div className="text-sm text-purple-700">Avg Render Time</div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(testReport.dataAccuracyScore)}`}>
                  {testReport.dataAccuracyScore.toFixed(1)}%
                </div>
                <div className="text-sm text-yellow-700">Data Accuracy</div>
              </div>
            </div>

            {testReport.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Errors Found ({testReport.errors.length})
                </h3>
                <ul className="text-sm text-red-700 space-y-1">
                  {testReport.errors.slice(0, 10).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                  {testReport.errors.length > 10 && (
                    <li className="text-red-600 font-medium">
                      ... and {testReport.errors.length - 10} more errors
                    </li>
                  )}
                </ul>
              </div>
            )}
          </Card>
        )}

        {/* Broker Cards Display */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            BrokerCard Components ({brokers.length} brokers)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokers.map((broker, index) => {
              const result = testResults.find(r => r.brokerId === broker.id);
              return (
                <div key={broker.id} className="relative">
                  {result && (
                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                      {getStatusIcon(result.logoLoadSuccess)}
                      {result.errors.length === 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                  <BrokerCard broker={broker} />
                  {result && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <div className="grid grid-cols-2 gap-1">
                        <span>Logo: {result.logoLoadTime.toFixed(0)}ms</span>
                        <span>Render: {result.renderTime.toFixed(0)}ms</span>
                      </div>
                      {result.errors.length > 0 && (
                        <div className="text-red-600 mt-1">
                          {result.errors.length} error(s)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Results */}
        {testResults.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Detailed Test Results
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Broker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Logo Load
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testResults.map((result) => {
                    const accuracyCount = Object.values(result.dataAccuracy).filter(Boolean).length;
                    const accuracyPercentage = (accuracyCount / Object.keys(result.dataAccuracy).length) * 100;
                    
                    return (
                      <tr key={result.brokerId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.brokerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.logoLoadSuccess)}
                            {result.logoLoadSuccess ? `${result.logoLoadTime.toFixed(0)}ms` : 'Failed'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={getScoreColor(accuracyPercentage)}>
                            {accuracyPercentage.toFixed(0)}% ({accuracyCount}/6)
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.renderTime.toFixed(0)}ms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {result.errors.length === 0 ? (
                            <Badge variant="success">Pass</Badge>
                          ) : (
                            <Badge variant="destructive">{result.errors.length} errors</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BrokerCardIntegrationTest;