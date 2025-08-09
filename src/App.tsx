import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { 
  HomePage, 
  BrokerDirectoryPage, 
  BrokerWizardPage, 
  ToolsLandingPage, 
  AboutPage, 
  BrokerProfilePage 
} from './pages'
import BrokerCardIntegrationTest from './pages/test/BrokerCardIntegrationTest'
import BrokerComparisonIntegrationTest from './pages/test/BrokerComparisonIntegrationTest'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/compare" element={<BrokerDirectoryPage />} />
        <Route path="/compare/wizard" element={<BrokerWizardPage />} />
        <Route path="/education" element={<ToolsLandingPage />} />
        <Route path="/news" element={<ToolsLandingPage />} />
        <Route path="/community" element={<ToolsLandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/broker/:id" element={<BrokerProfilePage />} />
        <Route path="/test/broker-card-integration" element={<BrokerCardIntegrationTest />} />
        <Route path="/test/broker-comparison-integration" element={<BrokerComparisonIntegrationTest />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App