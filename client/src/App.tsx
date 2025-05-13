import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiConfig } from 'wagmi';
import { config } from './config/wagmi';
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Proposals from './pages/Proposals'
import Wallet from './pages/Wallet'
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/wallet" element={<Wallet />} />
            </Routes>
          </MainLayout>
        </Router>
      </QueryClientProvider>
    </WagmiConfig>
  )
}

export default App
