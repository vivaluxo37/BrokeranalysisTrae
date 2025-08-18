import React from 'react';
import { BrokerComparisonHomePage } from './pages/BrokerComparisonHomePage';
import { mockRootProps } from './CryptixMockData';

export default function App() {
  return (
    <BrokerComparisonHomePage 
      initialCryptoPrices={mockRootProps.initialCryptoPrices}
      testimonials={mockRootProps.testimonials}
      faqItems={mockRootProps.faqItems}
    />
  );
}