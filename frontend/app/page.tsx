"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      if (user.userType === 'doctor') {
        router.push('/doctor')
      } else {
        router.push('/patient')
      }
    } else {
      // Redirect to login if no user data
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" className="text-slate-600" />
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  )
}
