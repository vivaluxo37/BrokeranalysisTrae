import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { BrokerComparisonHomePage } from './pages/BrokerComparisonHomePage'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <BrokerComparisonHomePage />
      </div>
    </BrowserRouter>
  )
}

export default App