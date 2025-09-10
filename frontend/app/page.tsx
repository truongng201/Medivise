"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/auth-context"

export default function Home() {
  const router = useRouter()
  const { authData, isAuthenticated, isLoading } = useAuthContext()

  useEffect(() => {
    if (!isLoading) {
      
      if (isAuthenticated && authData) {
        if (authData.account?.role === 'doctor') {
          router.push('/doctor')
        } else if (authData.account?.role === 'patient') {
          router.push('/patient')
        } else {
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }
  }, [isLoading, isAuthenticated, authData, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
