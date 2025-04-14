import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiConfig } from 'wagmi';
import { config } from './config/wagmi';
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Register from './pages/Register'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const App: FC = () => {
  // Create a client
  const queryClient = new QueryClient()

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </MainLayout>
        </Router>
      </QueryClientProvider>
    </WagmiConfig>
  )
}

export default App
