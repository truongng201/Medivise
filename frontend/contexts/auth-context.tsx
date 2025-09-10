"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AuthManager, AuthData } from '@/lib/auth'

interface AuthContextType {
  authData: AuthData | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (authData: AuthData) => void
  logout: () => void
  refreshAuthData: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authData, setAuthData] = useState<AuthData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshAuthData = () => {
    const data = AuthManager.getAuthData()
    setAuthData(data)
  }

  const login = (newAuthData: AuthData) => {
    AuthManager.setAuthData(newAuthData)
    setAuthData(newAuthData)
  }

  const logout = () => {
    AuthManager.clearAuthData()
    setAuthData(null)
    router.push('/login')
  }

  useEffect(() => {
    // Check initial auth state
    const data = AuthManager.getAuthData()
    setAuthData(data)
    setIsLoading(false)
  }, [])

  const isAuthenticated = !!authData

  const contextValue: AuthContextType = {
    authData,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAuthData
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

// Role-specific hook
export function useRequireAuth(requiredRole?: 'patient' | 'doctor') {
  const { authData, isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      if (requiredRole && authData?.account.role !== requiredRole) {
        router.push('/login')
        return
      }
    }
  }, [isAuthenticated, isLoading, authData, requiredRole, router])

  return {
    authData,
    isAuthenticated: isAuthenticated && (!requiredRole || authData?.account.role === requiredRole),
    isLoading
  }
}
