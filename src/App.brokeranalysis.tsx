import { BrowserRouter } from 'react-router-dom'
import { BrokerAnalysisHomePage } from './pages/BrokerAnalysisHomePage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <BrokerAnalysisHomePage />
    </BrowserRouter>
  )
}

export default App