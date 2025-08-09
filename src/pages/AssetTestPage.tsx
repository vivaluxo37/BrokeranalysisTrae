/**
 * Asset Test Page for verifying asset accessibility in browser environment
 * This page can be accessed during development and production to test assets
 */

import React from 'react';
import { AssetTestComponent, AssetPreviewComponent } from '@/components/common/AssetTestComponent';

export function AssetTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Asset Accessibility Test
          </h1>
          <p className="text-gray-600">
            This page tests that all static assets are properly served and accessible.
            Use this to verify Vercel deployment configuration.
          </p>
        </div>

        <div className="space-y-8">
          {/* Asset Preview */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Asset Preview</h2>
            <AssetPreviewComponent />
          </section>

          {/* Quick Test */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Quick Asset Test</h2>
            <AssetTestComponent />
          </section>

          {/* Detailed Test */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Detailed Asset Test</h2>
            <AssetTestComponent showDetails={true} />
          </section>

          {/* Environment Info */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
            <div className="p-4 border rounded-lg bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Base URL:</strong> {window.location.origin}
                </div>
                <div>
                  <strong>Protocol:</strong> {window.location.protocol}
                </div>
                <div>
                  <strong>Host:</strong> {window.location.host}
                </div>
                <div>
                  <strong>User Agent:</strong> {navigator.userAgent.split(' ')[0]}
                </div>
              </div>
            </div>
          </section>

          {/* Manual Asset Links */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Manual Asset Links</h2>
            <div className="p-4 border rounded-lg bg-white">
              <div className="text-sm space-y-2">
                <div>
                  <strong>Test these links manually:</strong>
                </div>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <a 
                      href="/assets/icons/broker-placeholder.svg" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Broker Placeholder SVG
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/assets/icons/broker-placeholder.webp" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Broker Placeholder WebP
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/assets/README.md" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Assets README
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/assets/brokers/logos/asset-mapping.json" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Asset Mapping JSON
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/favicon.svg" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Favicon SVG
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}