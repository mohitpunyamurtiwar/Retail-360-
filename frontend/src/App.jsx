import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Pricing from './pages/Pricing'
import POS from './pages/POS'
import Competitors from './pages/Competitors'
import Distributors from './pages/Distributors'
import Navbar from './components/Navbar'
import AuthProvider, { useAuth } from './contexts/AuthContext'
import OfflineIndicator from './components/OfflineIndicator'
import './App.css'

function AppContent() {
  const { user, token } = useAuth()
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setOffline(false)
    const handleOffline = () => setOffline(true)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <OfflineIndicator offline={offline} />
      
      {user && <Navbar />}
      
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        
        {token && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/competitors" element={<Competitors />} />
            <Route path="/distributors" element={<Distributors />} />
          </>
        )}
        
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/"} />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

