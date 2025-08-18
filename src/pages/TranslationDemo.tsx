import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n/config';

/**
 * Simple demo component
 */
const DemoComponent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-2">{t('common:nav.home', 'Find Your Perfect Broker')}</h2>
      <p className="text-blue-100 mb-4">{t('common:hero_subtitle', 'Compare brokers and make informed decisions')}</p>
      <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
        {t('common:cta_button', 'Get Started')}
      </button>
    </div>
  );
};

/**
 * Main Translation Demo Page
 */
export const TranslationDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'languages'>('basic');
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Translation System Demo
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Basic i18n implementation with react-i18next
          </p>
          
          {/* Language Selector */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="text-sm font-medium text-gray-700">Current Language:</span>
            <select 
              value={i18n.language} 
              onChange={(e) => changeLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            {[
              { key: 'basic', label: 'Basic Demo' },
              { key: 'languages', label: 'Language Info' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'basic' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold mb-4">Basic Translation Demo</h2>
              
              <div className="space-y-6">
                <DemoComponent />
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Translation Examples</h3>
                  <div className="space-y-2">
                    <p><strong>Navigation Home:</strong> {t('common:nav.home', 'Home')}</p>
                    <p><strong>Current Language:</strong> {i18n.language}</p>
                    <p><strong>Available Languages:</strong> {supportedLanguages.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'languages' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold mb-4">Language Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Supported Languages</h3>
                <div className="space-y-2">
                  {supportedLanguages.map(lang => (
                    <div key={lang.code} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{lang.name}</span>
                      <span className="text-sm text-gray-500">{lang.code}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Current Settings</h3>
                <div className="space-y-2">
                  <p><strong>Active Language:</strong> {i18n.language}</p>
                  <p><strong>Total Languages:</strong> {supportedLanguages.length}</p>
                  <p><strong>Translation System:</strong> react-i18next</p>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default TranslationDemo;