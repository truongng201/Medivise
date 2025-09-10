"use client"

import LoginPage from "./login-page"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()

  const handleLogin = () => {
    const authDataStr = localStorage.getItem("authData")
    if (!authDataStr) {
      router.push("/login")
      return
    }
    const authData = JSON.parse(authDataStr) as { 
      account: { role: string, profile_picture_url: string, email: string, account_id: number },
      accessToken: string,
      refreshToken: string
    }
    // Redirect based on user type
    if (authData?.account.role === "doctor") {
      router.push("/doctor")
    } else {
      router.push("/patient")
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
