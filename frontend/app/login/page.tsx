"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/auth-context"
import LoginPage from "./login-page"

export default function Login() {
  const router = useRouter()
  const { authData, isAuthenticated, isLoading } = useAuthContext()

  useEffect(() => {
    // If user is already authenticated, redirect to appropriate dashboard
    if (!isLoading && isAuthenticated && authData) {
      if (authData.account.role === "doctor") {
        router.push("/doctor")
      } else if (authData.account.role === "patient") {
        router.push("/patient")
      }
    }
  }, [isAuthenticated, isLoading, authData, router])

  const handleLogin = () => {
    // The login context will handle the redirection
    // Just refresh the page or let the context handle it
    const authData = useAuthContext().authData
    if (authData) {
      if (authData.account.role === "doctor") {
        router.push("/doctor")
      } else if (authData.account.role === "patient") {
        router.push("/patient")
      }
    }
  }

  const handleSwitchToSignup = () => {
    router.push("/signup/patient")
  }

  const handleSwitchToDoctorSignup = () => {
    router.push("/signup/doctor")
  }

  return (
    <LoginPage
      onLogin={handleLogin}
      onSwitchToSignup={handleSwitchToSignup}
      onSwitchToDoctorSignup={handleSwitchToDoctorSignup}
    />
  )
}
