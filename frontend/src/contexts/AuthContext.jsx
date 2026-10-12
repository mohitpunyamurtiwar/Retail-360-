import React, { createContext, useContext, useState, useEffect } from 'react'
// jwt-decode not needed - using simple token storage


const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      try {
    // Simple token validation - backend handles JWT
    setUser({ id: 'user', name: localStorage.getItem('userName') || 'Shopkeeper' })
        setUser(decoded)
      } catch {
        localStorage.removeItem('token')
        setToken(null)
      }
    }
    setLoading(false)
  }, [token])

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

