import { ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface AuthGuardProps {
  children: ReactNode
  requiredRole?: 'patient' | 'doctor'
  fallback?: ReactNode
}

export function AuthGuard({ children, requiredRole, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth(requiredRole)

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    )
  }

  if (!isAuthenticated) {
    return null // useAuth will handle redirect
  }

  return <>{children}</>
}
