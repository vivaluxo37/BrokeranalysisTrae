import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { 
  HomePage, 
  BrokerDirectoryPage, 
  BrokerProfilePage, 
  BrokerWizardPage, 
  ToolsLandingPage 
} from './pages'
import './index.css'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('4')) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-professional-black">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/brokers" element={<BrokerDirectoryPage />} />
            <Route path="/brokers/:brokerId" element={<BrokerProfilePage />} />
            <Route path="/find-broker" element={<BrokerWizardPage />} />
            <Route path="/compare" element={<BrokerDirectoryPage />} />
            <Route path="/compare/wizard" element={<BrokerWizardPage />} />
            <Route path="/tools" element={<ToolsLandingPage />} />
            <Route path="/education" element={<ToolsLandingPage />} />
            <Route path="/education/:level" element={<ToolsLandingPage />} />
            <Route path="/news" element={<ToolsLandingPage />} />
            <Route path="/community" element={<ToolsLandingPage />} />
            <Route path="/community/reviews" element={<ToolsLandingPage />} />
            <Route path="/reviews" element={<ToolsLandingPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App