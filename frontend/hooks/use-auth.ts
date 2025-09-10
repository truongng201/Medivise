import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthManager, AuthData } from '@/lib/auth'

export function useAuth(requiredRole?: 'patient' | 'doctor') {
  const [authData, setAuthData] = useState<AuthData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const data = AuthManager.getAuthData()
        
        if (!data) {
          setIsAuthenticated(false)
          setAuthData(null)
          setIsLoading(false)
          router.push('/login')
          return
        }

        // Validate auth data structure
        if (!data.account || !data.access_token || !data.refresh_token) {
          console.error('Invalid auth data structure:', data)
          AuthManager.clearAuthData()
          setIsAuthenticated(false)
          setAuthData(null)
          setIsLoading(false)
          router.push('/login')
          return
        }

        // If a specific role is required, check if the user has that role
        if (requiredRole && data.account.role !== requiredRole) {
          console.warn(`Access denied. Required role: ${requiredRole}, User role: ${data.account.role}`)
          AuthManager.clearAuthData()
          setIsAuthenticated(false)
          setAuthData(null)
          setIsLoading(false)
          router.push('/login')
          return
        }

        setAuthData(data)
        setIsAuthenticated(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking authentication:', error)
        AuthManager.clearAuthData()
        setIsAuthenticated(false)
        setAuthData(null)
        setIsLoading(false)
        router.push('/login')
      }
    }

    // Add a small delay to ensure localStorage is ready
    const timeoutId = setTimeout(checkAuth, 100)
    
    return () => clearTimeout(timeoutId)
  }, [requiredRole, router])

  const logout = () => {
    AuthManager.logout()
    setAuthData(null)
    setIsAuthenticated(false)
  }

  const updateAuthData = (newAuthData: AuthData) => {
    AuthManager.setAuthData(newAuthData)
    setAuthData(newAuthData)
  }

  return {
    authData,
    isAuthenticated,
    isLoading,
    logout,
    updateAuthData
  }
}
