import fs from 'fs';
import path from 'path';

// Get all broker names from the brokers directory
function getAllBrokerNames(): string[] {
  const brokersDir = path.join(process.cwd(), 'src', 'pages', 'brokers');
  
  if (!fs.existsSync(brokersDir)) {
    console.log('Brokers directory not found:', brokersDir);
    return [];
  }

  const files = fs.readdirSync(brokersDir);
  const brokerNames = files
    .filter(file => file.endsWith('.tsx'))
    .map(file => file.replace('.tsx', ''));

  console.log(`Found ${brokerNames.length} broker files`);
  return brokerNames;
}

// Generate imports for all brokers
function generateBrokerImports(brokerNames: string[]): string {
  return brokerNames.map(name => {
    const componentName = `${name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')  }Page`;
    return `import ${componentName} from './pages/brokers/${name}';`;
  }).join('\n');
}

// Generate routes for all brokers
function generateBrokerRoutes(brokerNames: string[]): string {
  return brokerNames.map(name => {
    const componentName = `${name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')  }Page`;
    return `        <Route path="/brokers/${name}" element={<${componentName} />} />`;
  }).join('\n');
}

// Generate the complete App.tsx content
function generateAppTsx(): string {
  const brokerNames = getAllBrokerNames();
  const brokerImports = generateBrokerImports(brokerNames);
  const brokerRoutes = generateBrokerRoutes(brokerNames);

  return `import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { 
  AboutPage, 
  BrokerDirectoryPage, 
  BrokerProfilePage, 
  BrokerWizardPage, 
  HomePage, 
  ToolsLandingPage,
  BrokerReviews,
  InteractiveBrokersReview
} from './pages'
import BrokerCardIntegrationTest from './pages/test/BrokerCardIntegrationTest'
import BrokerComparisonIntegrationTest from './pages/test/BrokerComparisonIntegrationTest'

// Import all broker pages
${brokerImports}

// Import comparison pages
import BestOnlineBrokersPage from './pages/comparison/best-online-brokers'
import BestForexBrokersPage from './pages/comparison/best-forex-brokers'
import BestStockBrokersPage from './pages/comparison/best-stock-brokers'
import BestCfdBrokersPage from './pages/comparison/best-cfd-brokers'
import BestBeginnerBrokersPage from './pages/comparison/best-beginner-brokers'
import BestDayTradingBrokersPage from './pages/comparison/best-day-trading-brokers'
import BestOptionsTradingBrokersPage from './pages/comparison/best-options-trading-brokers'
import BestCryptoBrokersPage from './pages/comparison/best-crypto-brokers'
import BestFuturesBrokersPage from './pages/comparison/best-futures-brokers'
import BestLowCostBrokersPage from './pages/comparison/best-low-cost-brokers'

import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/compare" element={<BrokerDirectoryPage />} />
        <Route path="/compare/wizard" element={<BrokerWizardPage />} />
        <Route path="/education" element={<ToolsLandingPage />} />
        <Route path="/news" element={<ToolsLandingPage />} />
        <Route path="/community" element={<ToolsLandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Generic Broker Routes */}
        <Route path="/broker/:id" element={<BrokerProfilePage />} />
        <Route path="/brokers/:id" element={<BrokerProfilePage />} />
        <Route path="/broker-reviews" element={<BrokerReviews />} />
        <Route path="/broker-reviews/interactive-brokers" element={<InteractiveBrokersReview />} />
        
        {/* Specific Broker Pages */}
${brokerRoutes}
        
        {/* Comparison Pages */}
        <Route path="/comparison/best-online-brokers" element={<BestOnlineBrokersPage />} />
        <Route path="/comparison/best-forex-brokers" element={<BestForexBrokersPage />} />
        <Route path="/comparison/best-stock-brokers" element={<BestStockBrokersPage />} />
        <Route path="/comparison/best-cfd-brokers" element={<BestCfdBrokersPage />} />
        <Route path="/comparison/best-beginner-brokers" element={<BestBeginnerBrokersPage />} />
        <Route path="/comparison/best-day-trading-brokers" element={<BestDayTradingBrokersPage />} />
        <Route path="/comparison/best-options-trading-brokers" element={<BestOptionsTradingBrokersPage />} />
        <Route path="/comparison/best-crypto-brokers" element={<BestCryptoBrokersPage />} />
        <Route path="/comparison/best-futures-brokers" element={<BestFuturesBrokersPage />} />
        <Route path="/comparison/best-low-cost-brokers" element={<BestLowCostBrokersPage />} />
        
        {/* Test Pages */}
        <Route path="/test/broker-card-integration" element={<BrokerCardIntegrationTest />} />
        <Route path="/test/broker-comparison-integration" element={<BrokerComparisonIntegrationTest />} />
        
        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
`;
}

// Main function to update App.tsx
function updateAppTsx(): void {
  try {
    const appContent = generateAppTsx();
    const appPath = path.join(process.cwd(), 'src', 'App.tsx');
    
    fs.writeFileSync(appPath, appContent, 'utf8');
    console.log('✓ App.tsx updated successfully with all broker routes');
    
    const brokerNames = getAllBrokerNames();
    console.log(`✓ Added routes for ${brokerNames.length} brokers`);
    console.log('✓ Added routes for 10 comparison pages');
  } catch (error) {
    console.error('Error updating App.tsx:', error);
  }
}

// Run the script if called directly
if (import.meta.url.includes(process.argv[1]) || process.argv[1]?.includes('generateAppRoutes')) {
  console.log('Running generateAppRoutes script...');
  updateAppTsx();
} else {
  console.log('Script not running directly, import.meta.url:', import.meta.url);
  console.log('process.argv[1]:', process.argv[1]);
}

export { updateAppTsx };